// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IRewardRedemption {
    enum RedemptionStatus {
        PENDING,
        REDEEMED,
        FAILED
    }

    struct Redemption {
        RedemptionStatus status;
        address from;
        uint256 amount;
        uint256 timestamp;
    }

    event RewardRedeem(
        address indexed user,
        uint256 amount,
        RedemptionStatus status,
        uint256 redemptionId
    );

    event RewardReleased(
        address indexed user,
        uint256 amount,
        RedemptionStatus status,
        uint256 redemptionId
    );
}
