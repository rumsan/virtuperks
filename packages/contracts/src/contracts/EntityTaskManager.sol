// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import './interfaces/IAccessManagerV2.sol';
import './interfaces/IEntityTaskManager.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

//TODO: Don not allow token to withdraw from this contract if it is already allocated as rewards
contract EntityTaskManager is IEntityTaskManager {
    event PINGED(address indexed sender, uint256 timestamp);
    IAccessManagerV2 public acl;
    string public name;

    bytes32 public constant ENTITY_OWNER = keccak256('ENTITY_OWNER');
    bytes32 public constant PARTICIPANT = keccak256('PARTICIPANT');

    mapping(bytes32 => Task) public tasks;
    mapping(bytes32 => mapping(address => STATUS)) public taskAssignments;
    // mapping(address => uint256) public allocatedRewards;
    // New mapping to store participants when whitelist is false

    bytes32 public appId;

    // Add a mapping to track participant count per task
    mapping(bytes32 => uint256) public taskParticipantCount;

    // Add new state variable to track total allocated rewards
    uint256 public totalAllocatedRewards;

    constructor(address aclAddress, bytes32 _appId, string memory _name) {
        acl = IAccessManagerV2(aclAddress);
        appId = _appId;
        name = _name;
    }

    modifier onlyRole(bytes32 role) {
        require(acl.hasRole(appId, role, msg.sender), 'Access Denied');
        _;
    }

    //Just for testin
    // function ping() public {
    //     emit PINGED(msg.sender, block.timestamp);
    // }

    /// @notice This function creates a new Task
    /// @param task The task object

    function createTask(Task memory task) public onlyRole(ENTITY_OWNER) {
        require(
            task.maxParticipants > 0,
            'Max participants should be greater than 0'
        );

        IERC20 token = IERC20(task.rewardToken);
        uint256 totalRewardNeeded = task.rewardAmount * task.maxParticipants;

        // Check contract's token balance against total possible rewards
        require(
            token.balanceOf(address(this)) >=
                totalRewardNeeded + totalAllocatedRewards,
            'Insufficient token balance for maximum possible rewards'
        );

        // Update allocated rewards
        totalAllocatedRewards += totalRewardNeeded;

        if (task.owner == address(0)) {
            task.owner = msg.sender;
        }

        bytes32 taskId = findHash(task.detailsUrl);
        tasks[taskId] = task;

        emit TaskCreated(taskId, msg.sender);
    }

    /// @notice This function will provide access for participant to apply for the task
    /// @param taskId The id of the task

    function participate(bytes32 taskId) public {
        require(tasks[taskId].isActive, 'Task is not active');
        require(tasks[taskId].expiryDate > block.timestamp, 'Task is expired');
        require(
            taskAssignments[taskId][msg.sender] == STATUS.NONE,
            'User has already applied'
        );

        // Check if max participants limit is reached
        require(
            taskParticipantCount[taskId] < tasks[taskId].maxParticipants,
            'Maximum participants limit reached'
        );

        // If allowedWallets is empty, it's an open task - anyone can participate
        if (tasks[taskId].allowedWallets.length > 0) {
            // Closed task - check if participant is in allowed list
            bool isAllowed = false;
            for (uint i = 0; i < tasks[taskId].allowedWallets.length; i++) {
                if (tasks[taskId].allowedWallets[i] == msg.sender) {
                    isAllowed = true;
                    break;
                }
            }
            require(
                isAllowed,
                'User is not allowed to participate in this closed task'
            );
        }

        // Increment participant count
        taskParticipantCount[taskId]++;

        // Set participant status
        taskAssignments[taskId][msg.sender] = STATUS.UNACCEPTED;
        emit ParticiantApplied(taskId, msg.sender);
    }

    function acceptParticipant(
        bytes32 taskId,
        address participant
    ) public onlyRole(ENTITY_OWNER) {
        require(tasks[taskId].owner != address(0), 'Task does not exist');
        require(tasks[taskId].isActive, 'Task is not active');
        taskAssignments[taskId][participant] = STATUS.ACCEPTED;
        emit TaskAccepted(taskId, participant);
    }

    /// @notice This function will change the status of the task
    /// @param taskId The id of the task
    function completeTask(bytes32 taskId) public {
        require(
            taskAssignments[taskId][msg.sender] == STATUS.ACCEPTED,
            'Task is not accepted or already completed'
        );
        require(tasks[taskId].expiryDate > block.timestamp, 'Task is expired');
        require(tasks[taskId].isActive, 'Task is not active');

        taskAssignments[taskId][msg.sender] = STATUS.COMPLETED;
        emit TaskCompleted(taskId, msg.sender);
    }

    /// @notice This function will change the status of the task
    /// @param taskId The id of the task
    function verifyCompletion(bytes32 taskId) external {
        require(tasks[taskId].owner == msg.sender, 'not a owner of this task');
        require(tasks[taskId].isActive, 'Task is not active');

        uint256 verifiedCount = 0;
        address[] memory verifiedTaskParticipant = new address[](
            tasks[taskId].maxParticipants
        );
        if (tasks[taskId].allowedWallets.length == 0) return;
        for (uint i = 0; i < tasks[taskId].allowedWallets.length; i++) {
            if (
                taskAssignments[taskId][tasks[taskId].allowedWallets[i]] ==
                STATUS.COMPLETED
            ) {
                taskAssignments[taskId][
                    tasks[taskId].allowedWallets[i]
                ] = STATUS.VERIFIED;
                verifiedTaskParticipant[verifiedCount] = tasks[taskId]
                    .allowedWallets[i];
                verifiedCount++;
            }
        }
        if (verifiedCount == 0) return;

        uint256 rewardsPerParticiapant = tasks[taskId].rewardAmount /
            verifiedCount;
        for (uint i = 0; i < verifiedCount; i++) {
            // allocatedRewards[verifiedTaskParticipant[i]] += rewardsPerParticiapant;
            IERC20(tasks[taskId].rewardToken).transfer(
                verifiedTaskParticipant[i],
                rewardsPerParticiapant
            );
        }

        uint256 actualRewardsUsed = rewardsPerParticiapant * verifiedCount;
        totalAllocatedRewards -= (tasks[taskId].rewardAmount *
            tasks[taskId].maxParticipants);
        totalAllocatedRewards += actualRewardsUsed;

        tasks[taskId].isActive = false;

        emit TaskApproved(taskId, msg.sender);
    }

    /// @notice This function returns the list of allowed wallets for a specific task
    /// @param taskId The id of the task
    /// @return allowedWallets Array of allowed wallet addresses
    function getAllowedWallets(
        bytes32 taskId
    ) public view returns (address[] memory allowedWallets) {
        require(tasks[taskId].owner != address(0), 'Task does not exist');
        return tasks[taskId].allowedWallets;
    }

    function findHash(string memory detailsUrl) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(detailsUrl));
    }

    // Add function to release allocated funds when task is completed or cancelled
    function _releaseAllocatedFunds(bytes32 taskId) internal {
        Task storage task = tasks[taskId];
        uint256 releasableAmount = task.rewardAmount * task.maxParticipants;
        totalAllocatedRewards -= releasableAmount;
    }
}
