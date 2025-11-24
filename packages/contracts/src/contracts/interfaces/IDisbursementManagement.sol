// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IDisbursementManagement {
    event DisbursementToParticipant(
        bytes32 indexed taskId,
        uint256 amount,
        address indexed participant,
        address indexed disbursedBy
    );
    event DisbursementToTask(bytes32 indexed taskId, uint256 amount, address indexed disbursedBy);
    event AdditionalDisbursementToTask(
        bytes32 indexed taskId,
        uint256 amount,
        string remarks,
        address indexed disbursedBy
    );

    function disburseToSingleParticipant(
        bytes32 taskId,
        address participant,
        uint256 amount,
        string memory completionUrl
    ) external;

    function disburseTokensToTaskParticipants(bytes32 taskId, uint256 amount) external;

    function disburseAdditionalTokenToTaskParticipants(
        bytes32 taskId,
        uint256 amount,
        string memory remarks
    ) external;
}
