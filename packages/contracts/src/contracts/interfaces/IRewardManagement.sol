// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IRewardManagement {
    enum AssignmentStatus {
        NONE,
        PENDING,
        ACCEPTED,
        COMPLETED,
        VERIFIED,
        REJECTED
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
        address[] verifiedParticipants;
        address[] rejectedParticipants;
    }
    struct TaskAssignment {
        address participant;
        AssignmentStatus status;
        string completionUrl;
    }

    event TaskCreated(bytes32 indexed id, address indexed createdBy);
    event TaskClosed(bytes32 indexed id, address indexed closedBy);

    event TaskAccepted(bytes32 indexed id, address indexed participant);
    event ParticipantApplied(bytes32 indexed id, address indexed participant);
    event TaskCompleted(bytes32 indexed id, address indexed participant);
    event TaskApproved(bytes32 indexed id, address indexed approver);
    event TaskRejected(
    bytes32 indexed id,
    address indexed participant,
    address indexed rejectedBy,
    string reason 
);
    event TaskVerified(bytes32 indexed id, address indexed participant, address indexed verifier);
    event TaskDetailsUpdated(bytes32 indexed id, address indexed updatedBy);

    event DisbursementToTask(bytes32 indexed taskId, uint256 amount, address indexed disbursedBy);
    event AdditionalDisbursementToTask(
        bytes32 indexed taskId,
        uint256 amount,
        string remarks,
        address indexed disbursedBy
    );
    event TokenTransferred(
        address indexed token,
        address indexed to,
        uint256 amount,
        string remarks,
        address indexed transferredBy
    );
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);

    event ParticipantWhitelisted(
        bytes32 indexed taskId,
        address indexed participant,
        address indexed by
    );
    event ParticipantRemovedFromWhitelist(
        bytes32 indexed taskId,
        address indexed participant,
        address indexed by
    );
    event EtherWithdrawn(address indexed to, uint256 amount, address indexed by);

    function createTask(
        bytes32 taskId,
        Task memory task,
        address[] memory _whitelistParticipants
    ) external;
    function addToWhitelist(bytes32 taskId, address participant, bool throwError) external;
    function removeFromWhitelist(bytes32 taskId, address participant) external;
    function getTask(bytes32 taskId) external view returns (Task memory);

    function participate(bytes32 taskId) external;
    function acceptParticipant(bytes32 taskId, address participant) external;
    function completeTask(bytes32 taskId, string memory completionUrl) external;
     function rejectParticipant(bytes32 taskId, address participant, string memory reason) external;
    function verifyTask(bytes32 taskId, address participant) external;
    function closeTask(bytes32 taskId) external;
    function closeExpiredTasks() external;

    function disburseTokensToTask(bytes32 taskId, uint256 amount) external;
    function disburseAdditionalTokenToTask(
        bytes32 taskId,
        uint256 amount,
        string memory remarks
    ) external;
    function getTotalUnallocatedTokens(address tokenAddress) external view returns (uint256);
    function getParticipantStatus(
        bytes32 taskId,
        address participant
    ) external view returns (AssignmentStatus);
    function getOpenTasks() external view returns (bytes32[] memory);
    function getTasksByOwner(address owner) external view returns (bytes32[] memory);
    function transferToken(
        address tokenAddress,
        address to,
        uint256 amount,
        string memory remarks
    ) external;
    function withdrawEther(address payable to) external;
    function _findHash(string memory text) external pure returns (bytes32);
    function pause() external;
    function unpause() external;
    function paused() external view returns (bool);

    function name() external view returns (string memory);

    function getParticipantTaskAssignment(
        bytes32 taskId,
        address participant
    ) external view returns (TaskAssignment memory);
    function isTaskExpired(bytes32 taskId) external view returns (bool);
    function getTaskVerifiedParticipants(bytes32 taskId) external view returns (address[] memory);
    function isMaxParticipantsReached(bytes32 taskId) external view returns (bool);
    function updateTaskDetails(
        bytes32 taskId,
        string memory newDetailsUrl,
        uint256 newExpiryDate
    ) external;
}
