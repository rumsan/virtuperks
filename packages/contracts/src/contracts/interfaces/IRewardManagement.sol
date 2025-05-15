// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IRewardManagement {
    enum TaskStatus {
        OPEN,
        CLOSED
    }

    enum AssignmentStatus {
        NONE,
        PENDING,
        ACCEPTED,
        COMPLETED,
        VERIFIED
    }

    struct Task {
        string name;
        string detailsUrl;
        address owner;
        address token;
        uint256 totalRewardAmount;
        uint256 expiryDate;
        TaskStatus status;
        bool requireApproval;
        uint256 maxParticipants;
        uint256 participantCount;
        bool whitelistParticipants;
    }
    struct TaskAssignment {
        address participant;
        AssignmentStatus status;
    }

    event TaskCreated(bytes32 indexed id, address indexed createdBy);
    event TaskAccepted(bytes32 indexed id, address indexed participant);
    event ParticipantApplied(bytes32 indexed id, address indexed participant);
    event TaskCompleted(bytes32 indexed id, address indexed participant);
    event TaskApproved(bytes32 indexed id, address indexed approver);

    function createTask(Task memory task) external;
    function participate(bytes32 taskId) external;
    function acceptParticipant(bytes32 taskId, address participant) external;
    function completeTask(bytes32 taskId) external;
    function verifyCompletion(bytes32 taskId) external;

    function taskAssignments(
        bytes32 taskId,
        address participant
    ) external view returns (AssignmentStatus status);

    function name() external view returns (string memory);
}
