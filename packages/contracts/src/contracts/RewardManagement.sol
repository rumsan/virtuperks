// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./interfaces/IAppRegistry.sol";
import "./interfaces/IRewardManagement.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//TODO: Don not allow token to withdraw from this contract if it is already allocated as rewards

contract RewardManagement is IRewardManagement {
    // struct Task {
    //     string name;
    //     string detailsUrl;
    //     address owner;
    //     address token;
    //     uint256 totalRewardAmount;
    //     uint256 expiryDate;
    //     TaskStatus status;
    //     bool needApproval;
    //     uint256 maxParticipants;
    //     bool whitelistParticipants;
    // }

    IAppRegistry public appRegistry;
    bytes32 public appId;
    string public name;
    mapping(address => uint256) public totalAllocatedTokens;

    bytes32 public constant OWNER = keccak256(address(this) + "OWNER");
    bytes32 public constant PARTICIPANT = keccak256("PARTICIPANT");

    mapping(bytes32 => Task) public tasks;
    mapping(bytes32 => address) public whitelistParticipants;
    mapping(bytes32 => mapping(address => AssignmentStatus)) public taskAssignments;

    constructor(address _registry, bytes32 _appId, string memory _name, address _owner) {
        appId = _appId;
        name = _name;
        appRegistry = IAppRegistry(_registry);
        appRegistry.grantRole(_appId, OWNER, _owner);
    }

    modifier onlyRole(bytes32 role) {
        require(appRegistry.hasRole(appId, role, msg.sender), "Access Denied");
        _;
    }

    modifier isWhitelisted(bytes32 taskId) {
        //restrict at app level
        if (appRegistry.isPrivate(appId)) {
            require(
                appRegistry.hasRole(appId, PARTICIPANT, msg.sender),
                "User is not registered participant in the app."
            );
        }

        // restrict at task level
        if (tasks[taskId].whitelistParticipants) {
            require(
                whitelistParticipants[taskId] == msg.sender,
                "User is not whitelisted for this task."
            );
        }
        _;
    }

    /// @notice This function creates a new Task
    /// @param task The task object

    function createTask(
        bytes32 taskId,
        Task memory task,
        address[] memory _whitelistParticipants
    ) public onlyRole(OWNER) {
        require(task.expiryDate > block.timestamp, "Expiry date must be in the future");
        require(task.rewardAmount > 0, "Reward amount must be greater than 0");
        require(task.rewardToken != address(0), "Reward token address cannot be zero");
        require(tasks[taskId].owner == address(0), "Task ID already exists");
        require(task.maxParticipants > 0, "Max participants must be greater than 0");

        IERC20 token = IERC20(task.token);

        require(
            token.balanceOf(address(this)) >=
                task.totalRewardAmount + totalAllocatedTokens[task.token],
            "Insufficient token balance for maximum possible rewards"
        );

        totalAllocatedTokens[task.token] += task.totalRewardAmount;
        if (task.owner == address(0)) {
            task.owner = msg.sender;
        }
        task.status = TaskStatus.OPEN;
        tasks[taskId] = task;

        if (task.whitelistParticipants) {
            for (uint256 i = 0; i < _whitelistParticipants.length; i++) {
                this.x(taskId, _whitelistParticipants[i], false);
            }
        }

        emit TaskCreated(taskId, msg.sender);
    }

    function addToWhitelist(
        bytes32 taskId,
        address participant,
        bool throwError
    ) public onlyRole(OWNER) {
        Task storage task = tasks[taskId];
        if (!task.whitelistParticipants) {
            require(!throwError, "Task does not require whitelist");
        }

        if (appRegistry.isPrivate(appId)) {
            if (appRegistry.hasRole(appId, PARTICIPANT, participant)) {
                whitelistParticipants[taskId][participant] = true;
            } else {
                require(!throwError, "User is not registered participant in the app.");
            }
        } else {
            whitelistParticipants[taskId][participant] = true;
        }
    }

    function removeFromWhitelist(bytes32 taskId, address participant) public onlyRole(OWNER) {
        delete whitelistParticipants[taskId][participant];
    }

    /// @notice This function will provide access for participant to apply for the task
    /// @param taskId The id of the task

    function participate(bytes32 taskId) public isWhitelisted(taskId) {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.OPEN, "Task is not open");
        require(task.expiryDate > block.timestamp, "Task is expired");
        require(
            taskAssignments[taskId][msg.sender] == AssignmentStatus.NONE,
            "User is already participating in this task"
        );
        _checkMaximumParticipants(task);

        // Set participant status
        taskAssignments[taskId][msg.sender] = AssignmentStatus.PENDING;
        emit ParticipantApplied(taskId, msg.sender);
    }

    function acceptParticipant(bytes32 taskId, address participant) public onlyRole(OWNER) {
        Task storage task = tasks[taskId];
        require(task.owner != address(0), "Task does not exist");
        require(task.isActive, "Task is not active");

        // Increment participant count
        task.participantCount++;
        taskAssignments[taskId][participant] = AssignmentStatus.ACCEPTED;
        emit TaskAccepted(taskId, participant);
    }

    /// @notice This function will change the status of the task
    /// @param taskId The id of the task
    function completeTask(bytes32 taskId) public isWhitelisted(taskId) {
        Task storage task = tasks[taskId];
        TaskAssignment storage taskAssignment = taskAssignments[taskId][msg.sender];

        if (task.requireApproval) {
            require(
                taskAssignment == AssignmentStatus.ACCEPTED,
                "Task is not accepted or already completed"
            );
        }

        require(task.expiryDate > block.timestamp, "Task is expired");
        require(task.isActive, "Task is not active");

        taskAssignment = AssignmentStatus.COMPLETED;
        emit TaskCompleted(taskId, msg.sender);
    }

    /// @notice This function will change the status of the task
    /// @param taskId The id of the task
    function verifyCompletion(bytes32 taskId) external {
        require(tasks[taskId].owner == msg.sender, "not a owner of this task");
        require(tasks[taskId].isActive, "Task is not active");

        uint256 verifiedCount = 0;
        address[] memory verifiedTaskParticipant = new address[](tasks[taskId].maxParticipants);

        // Get list of all participants for open tasks
        address[] memory participantsToCheck = tasks[taskId].allowedWallets;

        if (tasks[taskId].allowedWallets.length == 0) {
            // For open tasks, we need to iterate through all participants who joined
            // We can get this from taskAssignments mapping using taskParticipantCount
            participantsToCheck = new address[](taskParticipantCount[taskId]);
            for (uint i = 0; i < taskParticipantCount[taskId]; i++) {
                if (taskAssignments[taskId][participantsToCheck[i]] == STATUS.COMPLETED) {
                    verifiedTaskParticipant[verifiedCount] = participantsToCheck[i];
                    taskAssignments[taskId][participantsToCheck[i]] = STATUS.VERIFIED;
                    verifiedCount++;
                }
            }
        } else {
            // For closed tasks, use existing logic with allowedWallets
            for (uint i = 0; i < tasks[taskId].allowedWallets.length; i++) {
                if (taskAssignments[taskId][tasks[taskId].allowedWallets[i]] == STATUS.COMPLETED) {
                    verifiedTaskParticipant[verifiedCount] = tasks[taskId].allowedWallets[i];
                    taskAssignments[taskId][tasks[taskId].allowedWallets[i]] = STATUS.VERIFIED;
                    verifiedCount++;
                }
            }
        }

        require(verifiedCount > 0, "No completed tasks to verify");

        // Calculate and distribute rewards
        uint256 rewardsPerParticipant = tasks[taskId].rewardAmount / verifiedCount;
        for (uint i = 0; i < verifiedCount; i++) {
            IERC20(tasks[taskId].rewardToken).transfer(
                verifiedTaskParticipant[i],
                rewardsPerParticipant
            );
        }

        // Update allocated rewards
        uint256 actualRewardsUsed = rewardsPerParticipant * verifiedCount;
        totalAllocatedRewards -= (tasks[taskId].rewardAmount * tasks[taskId].maxParticipants);
        totalAllocatedRewards += actualRewardsUsed;

        tasks[taskId].isActive = false;
        emit TaskApproved(taskId, msg.sender);
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

    function _checkMaximumParticipants(Task storage task) internal view returns (bool) {
        if (task.maxParticipants > 0) {
            require(
                task.participantCount < task.maxParticipants,
                "Maximum participants limit reached"
            );
        }
    }
}
