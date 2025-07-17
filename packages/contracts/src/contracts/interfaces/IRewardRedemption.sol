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





event RewardRedeemed(
        address indexed from,
        uint256 amount,
        RedemptionStatus status
    );
   
}
