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

        require(
            getTotalUnallocatedTokens(task.rewardToken) >= task.totalRewardAmount,
            "Total reward amount exceeds available tokens"
        );

        totalAllocatedTokens[task.rewardToken] += task.totalRewardAmount;

        // Set the isOpen flag before storing to avoid separate storage write
        task.isOpen = true;

        // Store task only once
        tasks[taskId] = task;
        openTasks.push(taskId);

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
        emit ParticipantApplied(taskId, msg.sender);
    }

    function acceptParticipant(bytes32 taskId, address participant) public onlyRole(OWNER) {
        Task storage task = tasks[taskId];
        _isTaskOpen(taskId);
        _checkMaximumParticipants(taskId);

        // Increment accepted participant count
        task.acceptedParticipantCount++;
        taskAssignments[taskId][participant].status = AssignmentStatus.ACCEPTED;
        emit TaskAccepted(taskId, participant);
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
        emit TaskCompleted(taskId, msg.sender);
    }

    /// @notice This function will change the status of the task
    /// @param taskId The id of the task
    function verifyTask(bytes32 taskId, address participant) public onlyTaskOwner(taskId) {
        _isTaskOpen(taskId);
        TaskAssignment storage taskAssignment = taskAssignments[taskId][participant];

        require(
            taskAssignment.status == AssignmentStatus.COMPLETED,
            "Task must be completed before verification"
        );

        Task storage task = tasks[taskId];
        if (task.maxParticipants > 0) {
            require(
                task.verifiedParticipants.length < task.maxParticipants,
                "Maximum verified participants limit reached"
            );
        }

        taskAssignment.status = AssignmentStatus.VERIFIED;
        tasks[taskId].verifiedParticipants.push(participant);

        emit TaskVerified(taskId, participant, msg.sender);

        if (task.maxParticipants > 0) {
            if (task.verifiedParticipants.length == task.maxParticipants) {
                _closeTask(taskId);
            }
        }
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

    function disburseTokensToTask(
        bytes32 taskId,
        uint256 amount
    ) public onlyOwner nonReentrant whenNotPaused {
        Task storage task = tasks[taskId];
        IERC20 token = IERC20(task.rewardToken);
        require(amount > 0, "Amount must be greater than 0");
        require(task.totalRewardAmount >= amount, "Amount exceeds total reward amount");
        require(
            token.balanceOf(address(this)) >= amount,
            "Insufficient token balance for disbursement"
        );
        require(task.isTokenDisbursed == false, "Tokens already disbursed");
        if (task.verifiedParticipants.length == 0) {
            revert("No verified participants to disburse tokens");
        }

        // If the task is still open, close it
        if (task.isOpen) {
            _closeTask(taskId);
        }

        uint256 participantCount = task.verifiedParticipants.length;
        uint256 rewardPerParticipant = amount / participantCount;
        uint256 remainingAmount = amount - (rewardPerParticipant * participantCount);

        for (uint256 i = 0; i < participantCount; i++) {
            address participant = task.verifiedParticipants[i];
            // Add the remainder to the last participant
            uint256 participantAmount = rewardPerParticipant;
            if (i == participantCount - 1) {
                participantAmount += remainingAmount;
            }
            token.safeTransfer(participant, participantAmount);
        }

        totalAllocatedTokens[task.rewardToken] -= task.totalRewardAmount;
        task.isTokenDisbursed = true;
        emit DisbursementToTask(taskId, amount, msg.sender);
    }

    function disburseAdditionalTokenToTask(
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

        uint256 participantCount = task.verifiedParticipants.length;
        uint256 amountPerParticipant = amount / participantCount;
        uint256 remainingAmount = amount - (amountPerParticipant * participantCount);

        for (uint256 i = 0; i < participantCount; i++) {
            address participant = task.verifiedParticipants[i];
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
    function getTaskVerifiedParticipants(bytes32 taskId) public view returns (address[] memory) {
        return tasks[taskId].verifiedParticipants;
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
}
