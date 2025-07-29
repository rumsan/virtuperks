// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IRewardRedemptionFactory {
    event RewardRedemptionCreated(
        address rewardRedemption,
        string name,
        uint256 tokensRequired,
        string category,
        bytes32 rewardId
    );



    struct Reward {
        string name;
        uint256 tokensRequired;
        string category;
        address owner;
       
    }
    
}
