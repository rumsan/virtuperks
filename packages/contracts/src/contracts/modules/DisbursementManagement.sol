// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../interfaces/IDisbursementManagement.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ParticipantManagement.sol";

abstract contract DisbursementManagement is
    ParticipantManagement,
    IDisbursementManagement,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;

    function _disburseToParticipant(bytes32 taskId, address participant, uint256 amount) internal {
        Task storage task = tasks[taskId];
        TaskAssignment storage taskAssignment = taskAssignments[taskId][participant];
        IERC20 token = IERC20(task.rewardToken);
        require(
            token.balanceOf(address(this)) >= amount,
            "Insufficient token balance for disbursement"
        );

        if (taskAssignment.status != AssignmentStatus.DISBURSED) {
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
        address parcipant,
        uint256 amount
    ) public onlyOtiwner nonReentrant whenNotPaused {
        Task storage task = tasks[taskId];
        if (amount == 0) {
            amount = task.totalRewardAmount / task.maxParticipants;
        }
        _isTaskOpen(taskId);
        TaskAssignment storage taskAssignment = _getOpenTaskAssignment(taskId, participant);
        require(amount > 0, "Amount must be greater than 0");
        require(task.totalRewardAmount >= amount, "Amount exceeds total reward amount");
        require(
            taskAssignment.status != AssignmentStatus.DISBURSED,
            "Participant has already been disbursed."
        );
        require(task.isTokenDisbursed == false, "Tokens already disbursed");

        _disburseToParticipant(taskId, participant, amount);
    }

    function disburseTokensToTaskParticipants(
        bytes32 taskId,
        uint256 amount
    ) public onlyOwner nonReentrant whenNotPaused {
        Task storage task = tasks[taskId];
        require(amount > 0, "Amount must be greater than 0");
        require(task.totalRewardAmount >= amount, "Amount exceeds total reward amount");

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
            _disburseToParticipant(taskId, participant, participantAmount);
        }

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
            _getTotalUnallocatedTokens(task.rewardToken) >= amount,
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

    // Internal helper to get total unallocated tokens
    function _getTotalUnallocatedTokens(
        address tokenAddress
    ) internal view virtual returns (uint256);
}
