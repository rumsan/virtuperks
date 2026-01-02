// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

interface ITaskManagement {
    enum AssignmentStatus {
        NONE,
        PENDING,
        ACCEPTED,
        COMPLETED,
        APPROVED,
        REJECTED,
        DISBURSED
    }

    struct Task {
        string name;
        string detailsUrl;
        address owner;
        uint256 expiryDate;
        address rewardToken;
        uint256 totalRewardAmount;
        //----
        bool isOpen;
        bool requireApproval;
        bool isWhitelisted;
        bool isTokenDisbursed;
        //----
        uint256 maxParticipants;
        uint256 acceptedParticipantCount;
    }

    struct TaskAssignment {
        AssignmentStatus status;
        string completionUrl;
    }

    event TaskCreated(bytes32 indexed id, address indexed createdBy);
    event TaskClosed(bytes32 indexed id, address indexed closedBy);
    event TaskDetailsUpdated(bytes32 indexed id, address indexed updatedBy);

    function createTask(
        bytes32 taskId,
        Task memory task,
        address[] memory _whitelistParticipants
    ) external;
    function closeTask(bytes32 taskId) external;
    function isTaskExpired(bytes32 taskId) external view returns (bool);
    function isTaskOpen(bytes32 taskId) external view returns (bool);
    function isMaxParticipantsReached(bytes32 taskId) external view returns (bool);
    function updateTaskDetails(
        bytes32 taskId,
        string memory newDetailsUrl,
        uint256 newExpiryDate
    ) external;
    function getTask(bytes32 taskId) external view returns (Task memory);
    function getAllTasks() external view returns (bytes32[] memory);
}
