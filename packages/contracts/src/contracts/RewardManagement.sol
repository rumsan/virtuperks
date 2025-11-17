// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./interfaces/IAppRegistry.sol";
import "./interfaces/IRewardManagement.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RewardManagement is IRewardManagement, Multicall, ReentrancyGuard {
    using SafeERC20 for IERC20;
    IAppRegistry public app;
    bytes32 public appId;
    string public name;

    bytes32 public immutable OWNER;
    bytes32 public constant PARTICIPANT = keccak256("PARTICIPANT");

    // Circuit breaker state
    bool public paused;

    bytes32[] internal openTasks;
    mapping(bytes32 => Task) public tasks;
    mapping(bytes32 => mapping(address => bool)) public isWhitelisted;
    mapping(bytes32 => mapping(address => TaskAssignment)) public taskAssignments;

    mapping(address => uint256) public totalAllocatedTokens;

    constructor(bytes32 _appId, string memory _name, address _registry) {
        appId = _appId;
        name = _name;
        app = IAppRegistry(_registry);
        OWNER = keccak256(abi.encodePacked(address(this)));
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier onlyRole(bytes32 role) {
        require(app.hasRole(appId, role, msg.sender), "Access Denied");
        _;
    }

    modifier onlyOwner() {
        require(app.hasRole(appId, OWNER, msg.sender), "Only owner can call this function");
        _;
    }

    modifier onlyTaskOwner(bytes32 taskId) {
        require(msg.sender == tasks[taskId].owner, "Only task owner can call this function");
        _;
    }

    modifier onlyOwnerOrTaskOwner(bytes32 taskId) {
        require(
            app.hasRole(appId, OWNER, msg.sender) || msg.sender == tasks[taskId].owner,
            "Only owner or task owner can call this function"
        );
        _;
    }

    modifier isEligibleToParticipate(bytes32 taskId) {
        //restrict at app level
        if (app.isPrivate(appId)) {
            require(
                app.hasRole(appId, PARTICIPANT, msg.sender),
                "User is not registered participant in the app."
            );
        }

        // restrict at task level
        if (tasks[taskId].isWhitelisted) {
            require(isWhitelisted[taskId][msg.sender], "User is not whitelisted for this task.");
        }
        _;
    }

    /// @notice This function creates a new Task
    /// @param task The task object

    function createTask(
        bytes32 taskId,
        Task memory task,
        address treasuryAddress,
        address[] memory _whitelistParticipants
    ) public onlyRole(OWNER) whenNotPaused {
        require(tasks[taskId].owner == address(0), "Task ID already exists");

        require(taskId != bytes32(0), "Task ID cannot be zero");
        require(bytes(task.name).length > 0, "Task name cannot be empty");
        require(bytes(task.detailsUrl).length > 0, "Task details URL cannot be empty");
        require(task.owner != address(0), "Task must have an owner");
        require(task.expiryDate > block.timestamp, "Task expiry date must be in the future");
        require(task.rewardToken != address(0), "Reward token address cannot be zero");
        require(task.totalRewardAmount > 0, "Reward amount must be greater than 0");
        require(task.maxParticipants > 0, "Max participants must be greater than 0");

        // require(
        //     getTotalUnallocatedTokens(task.rewardToken) >= task.totalRewardAmount,
        //     "Total reward amount exceeds available tokens"
        // );
        // totalAllocatedTokens[task.rewardToken] += task.totalRewardAmount;

        // Set the isOpen flag before storing to avoid separate storage write
        task.isOpen = true;
        // Store task only once
        tasks[taskId] = task;
        openTasks.push(taskId);

        allocateTokensToTask(taskId, task.rewardToken, treasuryAddress, task.totalRewardAmount);

        if (task.isWhitelisted) {
            for (uint256 i = 0; i < _whitelistParticipants.length; i++) {
                _addToWhitelist(taskId, _whitelistParticipants[i], false);
            }
        }

        emit TaskCreated(taskId, msg.sender);
    }

    function addToWhitelist(
        bytes32 taskId,
        address participant,
        bool throwError
    ) public onlyRole(OWNER) {
        _addToWhitelist(taskId, participant, throwError);
    }

    function _addToWhitelist(bytes32 taskId, address participant, bool throwError) internal {
        Task storage task = tasks[taskId];
        if (!task.isWhitelisted) {
            require(!throwError, "Task does not require whitelist");
        }

        if (app.isPrivate(appId)) {
            if (app.hasRole(appId, PARTICIPANT, participant)) {
                isWhitelisted[taskId][participant] = true;
                emit ParticipantWhitelisted(taskId, participant, msg.sender);
            } else {
                require(!throwError, "User is not registered participant in the app.");
            }
        } else {
            isWhitelisted[taskId][participant] = true;
            emit ParticipantWhitelisted(taskId, participant, msg.sender);
        }
    }

    function removeFromWhitelist(bytes32 taskId, address participant) public onlyRole(OWNER) {
        delete isWhitelisted[taskId][participant];
        emit ParticipantRemovedFromWhitelist(taskId, participant, msg.sender);
    }

    /// @notice This function will provide access for participant to apply for the task
    /// @param taskId The id of the task

    function participate(bytes32 taskId) public isEligibleToParticipate(taskId) whenNotPaused {
        _isTaskOpen(taskId);
        require(
            taskAssignments[taskId][msg.sender].status == AssignmentStatus.NONE,
            "User is already participating in this task"
        );
        _checkMaximumParticipants(taskId);

        // Set participant status
        taskAssignments[taskId][msg.sender].status = AssignmentStatus.PENDING;
        emit TaskAssignmentApplied(taskId, msg.sender);
    }

    function acceptParticipant(bytes32 taskId, address participant) public onlyRole(OWNER) {
        Task storage task = tasks[taskId];
        _isTaskOpen(taskId);
        _checkMaximumParticipants(taskId);

        // Increment accepted participant count
        task.acceptedParticipantCount++;
        taskAssignments[taskId][participant].status = AssignmentStatus.ACCEPTED;
        emit TaskAssignmentAccepted(taskId, participant);
    }

    /// @notice This function will change the status of the task
    /// @param taskId The id of the task
    function completeTask(
        bytes32 taskId,
        string memory completionUrl
    ) public isEligibleToParticipate(taskId) {
        _isTaskOpen(taskId);
        TaskAssignment storage taskAssignment = taskAssignments[taskId][msg.sender];

        if (tasks[taskId].requireApproval) {
            require(
                taskAssignment.status == AssignmentStatus.ACCEPTED,
                "This task requires user to be accepted to complete task"
            );
        }

        taskAssignment.status = AssignmentStatus.COMPLETED;
        taskAssignment.completionUrl = completionUrl;
        emit TaskAssignmentCompleted(taskId, msg.sender);
    }



function _getOpenTaskAssignment(bytes32 taskId, address participant) internal returns(TaskAssignment storage) {
    _isTaskOpen(taskId);
    return taskAssignments[taskId][participant];
}

function _changeTaskAssignmentStatus(TaskAssignment storage taskAssignment, AssignmentStatus status) internal {
    require(taskAssignment.status != AssignmentStatus.DISBURSED, "Participant has already been disbursed.");
    taskAssignment.status = status;
}

    /// @notice This function will change the status of the task
    /// @param taskId The id of the task
    function approveTaskAssignment(bytes32 taskId, address participant) public onlyTaskOwner(taskId) {
         TaskAssignment storage taskAssignment = _getOpenTaskAssignment(taskId, participant);

        require(
            taskAssignment.status == AssignmentStatus.COMPLETED,
            "Task must be completed before verification"
        );

        Task storage task = tasks[taskId];
        if (task.maxParticipants > 0) {
            require(
                task.approvedParticipants.length < task.maxParticipants,
                "Maximum verified participants limit reached"
            );
        }

        _changeTaskAssignmentStatus(taskAssignment, AssignmentStatus.APPROVED);
        tasks[taskId].approvedParticipants.push(participant);

        emit TaskAssignmentVerified(taskId, participant, msg.sender);

        if (task.maxParticipants > 0) {
            if (task.approvedParticipants.length == task.maxParticipants) {
                _closeTask(taskId);
            }
        }
    }

    /// @notice This function allows the task owner to reject a participant with a reason
    /// @param taskId The unique identifier of the task
    /// @param participant The address of the participant to reject
    /// @param reason The reason for rejecting the participant
    function rejectTaskAssignment(bytes32 taskId, address participant, string memory reason) public onlyTaskOwner(taskId) {
         TaskAssignment storage taskAssignment = _getOpenTaskAssignment(taskId, participant);

        // Ensure the participant is in a valid state to be rejected
        require(
            taskAssignment.status == AssignmentStatus.COMPLETED,
            "Participant cannot be rejected in the current state"
        );

        // Update the participant's status to REJECTED
        _changeTaskAssignmentStatus(taskAssignment, AssignmentStatus.REJECTED);

        // Emit the TaskRejected event with the reason
        emit TaskAssignmentRejected(taskId, participant, msg.sender, reason);
    }

    /// @notice Retrieves all details of a specific task
    /// @param taskId The unique identifier of the task
    /// @return task The task details including its status and participants
    function getTask(bytes32 taskId) public view returns (Task memory task) {
        task = tasks[taskId];
    }

    /// @notice Retrieves all currently open tasks
    /// @return taskIds Array of open task IDs
    function getOpenTasks() public view returns (bytes32[] memory) {
        return openTasks;
    }

    /// @notice Get tasks owned by a specific address
    /// @param owner The address of the task owner 
    /// @return taskIds Array of task IDs owned by the specified address
    function getTasksByOwner(address owner) public view returns (bytes32[] memory) {
        // First count the number of matching tasks
        uint256 count = 0;
        for (uint256 i = 0; i < openTasks.length; i++) {
            if (tasks[openTasks[i]].owner == owner) {
                count++;
            }
        }

        // Create an array of the right size and fill it
        bytes32[] memory result = new bytes32[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < openTasks.length && index < count; i++) {
            if (tasks[openTasks[i]].owner == owner) {
                result[index] = openTasks[i];
                index++;
            }
        }

        return result;
    }

    /// @notice Closes a task, makes it unavailable for further participation
    /// @param taskId The unique identifier of the task to close
    function closeTask(bytes32 taskId) public onlyOwnerOrTaskOwner(taskId) whenNotPaused {
        _closeTask(taskId);
    }

    /// @notice Internal implementation for closing a task
    /// @param taskId The unique identifier of the task to close
    function _closeTask(bytes32 taskId) internal {
        // Remove from openTasks arrayhh
        uint256 openTasksLength = openTasks.length;
        for (uint256 i = 0; i < openTasksLength; i++) {
            if (openTasks[i] == taskId) {
                openTasks[i] = openTasks[openTasksLength - 1];
                openTasks.pop();
                break;
            }
        }

        tasks[taskId].isOpen = false;
        emit TaskClosed(taskId, msg.sender);
    }

    /// @notice Closes all tasks that have passed their expiry date
    /// @dev Iterates through all open tasks and closes those that have expired
    function closeExpiredTasks() public whenNotPaused {
        uint256 i = 0;
        while (i < openTasks.length) {
            if (tasks[openTasks[i]].expiryDate < block.timestamp) {
                // When a task is closed, the last element of openTasks is moved to position i
                // So we need to check the same index again without incrementing
                _closeTask(openTasks[i]);
            } else {
                // Only increment if we didn't close a task
                i++;
            }
        }
    }

    function _disburseToParticipant(
        bytes32 taskId,
        address participant,
        uint256 amount
    ) internal {
        Task storage task = tasks[taskId];
        TaskAssignment storage taskAssignment = taskAssignments[taskId][participant];
        IERC20 token = IERC20(task.rewardToken);
        require(token.balanceOf(address(this)) >= amount,"Insufficient token balance for disbursement");
        
        if(taskAssignment.status != AssignmentStatus.DISBURSED){
            // Transfer tokens to the participant
            token.safeTransfer(participant, amount);

            // Update total allocated tokens
            totalAllocatedTokens[task.rewardToken] -= amount;

            // Update participant status to DISBURSED
            taskAssignment.status = AssignmentStatus.DISBURSED;

            emit DisbursementToParticipant(taskId, amount, participant, msg.sender);
        }
    }

    function disburseToSingleParticipant(
        bytes32 taskId,
        address participant,
        uint256 amount,
        string memory completionUrl
    ) public onlyOwner nonReentrant whenNotPaused {
        Task storage task = tasks[taskId];
        if(amount == 0){
            amount = task.totalRewardAmount/task.maxParticipants;
        }
        _isTaskOpen(taskId);
        TaskAssignment storage taskAssignment = _getOpenTaskAssignment(taskId, participant);
        require(amount > 0, "Amount must be greater than 0");
        require(task.totalRewardAmount >= amount, "Amount exceeds total reward amount");
        require(taskAssignment.status!=AssignmentStatus.DISBURSED, "Participant has already been disbursed.");
        require(task.isTokenDisbursed == false, "Tokens already disbursed");
        taskAssignment.completionUrl = completionUrl;

        _disburseToParticipant(taskId, participant, amount);
    }

    function disburseTokensToTaskParticipants(
        bytes32 taskId,
        uint256 amount
    ) public onlyOwner nonReentrant whenNotPaused {
        Task storage task = tasks[taskId];
        require(amount > 0, "Amount must be greater than 0");
        require(task.totalRewardAmount >= amount, "Amount exceeds total reward amount");

        //TODO: is this still necessary?
        require(task.isTokenDisbursed == false, "Tokens already disbursed");
        if (task.approvedParticipants.length == 0) {
            revert("No verified participants to disburse tokens");
        }


        // ----- Token Disbursement ---

        uint256 participantCount = task.approvedParticipants.length;
        uint256 rewardPerParticipant = amount / participantCount;
        uint256 remainingAmount = amount - (rewardPerParticipant * participantCount);

        for (uint256 i = 0; i < participantCount; i++) {
            address participant = task.approvedParticipants[i];
            // Add the remainder to the last participant
            uint256 participantAmount = rewardPerParticipant;
            if (i == participantCount - 1) {
                participantAmount += remainingAmount;
            }
            _disburseToParticipant(taskId, participant, amount);
        }

        //totalAllocatedTokens[task.rewardToken] -= task.totalRewardAmount;
        task.isTokenDisbursed = true;
        
        // If the task is still open, close it
        if (task.isOpen) {
            _closeTask(taskId);
        }
        emit DisbursementToTask(taskId, amount, msg.sender);
    }

    function disburseAdditionalTokenToTaskParticipants(
        bytes32 taskId,
        uint256 amount,
        string memory remarks
    ) public onlyOwner nonReentrant whenNotPaused {
        Task storage task = tasks[taskId];
        require(task.isTokenDisbursed == true, "Tokens have not been disbursed yet");
        require(amount > 0, "Additional amount must be greater than 0");

        IERC20 token = IERC20(task.rewardToken);
        require(
            getTotalUnallocatedTokens(task.rewardToken) >= amount,
            "Insufficient available token for additional disbursement"
        );

        uint256 participantCount = task.approvedParticipants.length;
        uint256 amountPerParticipant = amount / participantCount;
        uint256 remainingAmount = amount - (amountPerParticipant * participantCount);

        for (uint256 i = 0; i < participantCount; i++) {
            address participant = task.approvedParticipants[i];
            // Add the remainder to the last participant
            uint256 participantAmount = amountPerParticipant;
            if (i == participantCount - 1) {
                participantAmount += remainingAmount;
            }
            token.safeTransfer(participant, participantAmount);
        }

        emit AdditionalDisbursementToTask(taskId, amount, remarks, msg.sender);
    }

    function transferToken(
        address tokenAddress,
        address to,
        uint256 amount,
        string memory remarks
    ) public onlyOwner nonReentrant whenNotPaused {
        require(to != address(0), "Cannot transfer to zero address");
        require(tokenAddress != address(0), "Token address cannot be zero");
        require(amount > 0, "Amount must be greater than 0");

        IERC20 token = IERC20(tokenAddress);
        //TODO: doble check if this is correct
        require(
            getTotalUnallocatedTokens(tokenAddress) >= amount,
            "Insufficient available token for transfer"
        );
        token.safeTransfer(to, amount);

        emit TokenTransferred(tokenAddress, to, amount, remarks, msg.sender);
    }

    function getTotalUnallocatedTokens(address tokenAddress) public view returns (uint256) {
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(address(this)) - totalAllocatedTokens[tokenAddress];
    }

    function _findHash(string memory text) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(text));
    }

    /// @notice Get the status of a participant for a particular task
    /// @param taskId The unique identifier of the task
    /// @param participant The address of the participant
    /// @return status The current status of the participant for the task
    function getParticipantStatus(
        bytes32 taskId,
        address participant
    ) public view returns (AssignmentStatus) {
        return taskAssignments[taskId][participant].status;
    }

    /// @notice Get the task assignment details for a specific participant
    /// @param taskId The unique identifier of the task
    /// @param participant The address of the participant
    /// @return assignment The task assignment details
    function getParticipantTaskAssignment(
        bytes32 taskId,
        address participant
    ) public view returns (TaskAssignment memory) {
        return taskAssignments[taskId][participant];
    }

    function _checkMaximumParticipants(bytes32 taskId) internal view {
        Task storage task = tasks[taskId];
        if (task.maxParticipants > 0) {
            require(
                task.acceptedParticipantCount < task.maxParticipants,
                "Maximum participants limit reached"
            );
        }
    }

    /// @notice Internal function to check if a task is open
    /// @dev Uses require statements to revert with appropriate messages
    /// @param taskId The unique identifier of the task to check
    function _isTaskOpen(bytes32 taskId) internal view {
        Task storage task = tasks[taskId];
        if (task.owner == address(0)) {
            revert("Task does not exist");
        }
        if (task.expiryDate <= block.timestamp) {
            revert("Task is expired");
        }
        if (!task.isOpen) {
            revert("Task is not open");
        }
    }

    //allow owner to withdraw ethereum to specified address
    function withdrawEther(address payable to) public onlyOwner nonReentrant {
        require(to != address(0), "Cannot withdraw to zero address");
        uint256 balance = address(this).balance;
        (bool sent, ) = to.call{ value: balance }("");
        require(sent, "Failed to send Ether");
        emit EtherWithdrawn(to, balance, msg.sender);
    }

    //prevent contract from receiving ether
    receive() external payable {
        revert("Contract does not accept ether");
    }
    fallback() external payable {
        revert("Contract does not accept ether");
    }

    /// @notice Pauses the contract in case of an emergency
    /// @dev Only callable by the owner
    function pause() external onlyOwner {
        paused = true;
        emit ContractPaused(msg.sender);
    }

    /// @notice Unpauses the contract
    /// @dev Only callable by the owner
    function unpause() external onlyOwner {
        paused = false;
        emit ContractUnpaused(msg.sender);
    }

    /// @notice Check if a task is expired
    /// @param taskId The unique identifier of the task
    /// @return True if the task is expired, false otherwise
    function isTaskExpired(bytes32 taskId) public view returns (bool) {
        Task storage task = tasks[taskId];
        return task.owner != address(0) && task.expiryDate <= block.timestamp;
    }

    /// @notice Get all verified participants for a task
    /// @param taskId The unique identifier of the task
    /// @return participants Array of verified participant addresses
    function getTaskApprovedParticipants(bytes32 taskId) public view returns (address[] memory) {
        return tasks[taskId].approvedParticipants;
    }

    /// @notice Check if a task has reached its maximum participant limit
    /// @param taskId The unique identifier of the task
    /// @return True if the maximum limit is reached, false otherwise
    function isMaxParticipantsReached(bytes32 taskId) public view returns (bool) {
        Task storage task = tasks[taskId];
        if (task.maxParticipants == 0) {
            return false;
        }
        return task.acceptedParticipantCount >= task.maxParticipants;
    }

    /// @notice Update certain task details
    /// @param taskId The unique identifier of the task
    /// @param newDetailsUrl New URL for task details
    /// @param newExpiryDate New expiry date (0 to keep existing)
    function updateTaskDetails(
        bytes32 taskId,
        string memory newDetailsUrl,
        uint256 newExpiryDate
    ) public onlyOwnerOrTaskOwner(taskId) whenNotPaused {
        Task storage task = tasks[taskId];
        require(task.owner != address(0), "Task does not exist");
        require(task.isOpen, "Task is not open");

        // Update details URL if not empty
        if (bytes(newDetailsUrl).length > 0) {
            task.detailsUrl = newDetailsUrl;
        }

        // Update expiry date if provided and in the future
        if (newExpiryDate > 0) {
            require(newExpiryDate > block.timestamp, "New expiry date must be in the future");
            task.expiryDate = newExpiryDate;
        }

        emit TaskDetailsUpdated(taskId, msg.sender);
    }

    /// @notice Transfer ERC20 tokens to this contract and allocate them to a specific task
    /// @dev Users must first approve this contract to spend their tokens before calling this function
    /// @param taskId The unique identifier of the task to allocate tokens to
    /// @param tokenAddress The address of the ERC20 token to transfer
    /// @param amount The amount of tokens to transfer and allocate
    function allocateTokensToTask(
        bytes32 taskId,
        address tokenAddress,
        address treasuryAddress,
        uint256 amount
    ) public nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(tokenAddress != address(0), "Token address cannot be zero");
        
        Task storage task = tasks[taskId];
        require(task.owner != address(0), "Task does not exist");
        require(task.isOpen, "Task is not open");
        require(task.rewardToken == tokenAddress, "Token address does not match task reward token");

        // Transfer tokens from user to this contract
        IERC20 token = IERC20(tokenAddress);
        token.safeTransferFrom(treasuryAddress, address(this), amount);

        // Update task's total reward amount and allocated tokens
        task.totalRewardAmount += amount;
        totalAllocatedTokens[tokenAddress] += amount;

        emit TokensAllocatedToTask(taskId, tokenAddress, amount, msg.sender);
    }
}
