// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IEntityTaskManager {
    enum TaskStatus {
        OPEN,
        CLOSED
    }

    enum STATUS {
        UNACCEPTED,
        ACCEPTED,
        COMPLETED,
        VERIFIED
    }

    struct Task {
        string detailsUrl;
        string taskName;
        address rewardToken;
        uint256 rewardAmount;
        address[] allowedWallets; // Empty array means task is open for all
        uint256 maxParticipants;
        uint256 expiryDate;
        address owner;
        bool isActive;
    }

    struct TaskAssignment {
        address participant;
        STATUS status;
    }

    event TaskCreated(bytes32 indexed id, address indexed createdBy);
    event TaskAccepted(bytes32 indexed id, address indexed participant);
    event ParticiantApplied(bytes32 indexed id, address indexed participant);
    event TaskCompleted(bytes32 indexed id, address indexed participant);
    event TaskApproved(bytes32 indexed id, address indexed approver);

    function createTask(Task memory task) external;

    function participate(bytes32 taskId) external;

    function acceptParticipant(bytes32 taskId, address participant) external;

    function completeTask(bytes32 taskId) external;

    //verify completely new task
    //transfer tokens to the participant
    function verifyCompletion(bytes32 taskId) external;

    function taskAssignments(
        bytes32 taskId,
        address participant
    ) external view returns (STATUS status);

    function name() external view returns (string memory);
}
