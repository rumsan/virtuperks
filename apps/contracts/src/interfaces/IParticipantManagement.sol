// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "./ITaskManagement.sol";

interface IParticipantManagement {
    event TaskAssignmentAccepted(bytes32 indexed id, address indexed participant);
    event TaskAssignmentApplied(bytes32 indexed id, address indexed participant);
    event TaskAssignmentCompleted(bytes32 indexed id, address indexed participant);
    event TaskAssignmentApproved(bytes32 indexed id, address indexed approver);
    event TaskAssignmentRejected(
        bytes32 indexed id,
        address indexed participant,
        address indexed rejectedBy,
        string reason
    );
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

    function addToWhitelist(bytes32 taskId, address participant, bool throwError) external;
    function removeFromWhitelist(bytes32 taskId, address participant) external;
    function participate(bytes32 taskId) external;
    function acceptParticipant(bytes32 taskId, address participant) external;
    function completeTask(bytes32 taskId, string memory completionUrl) external;
    function rejectTaskSubmission(
        bytes32 taskId,
        address participant,
        string memory reason
    ) external;
    function approveTaskSubmission(bytes32 taskId, address participant) external;
}
