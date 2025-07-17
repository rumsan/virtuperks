// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IRewardRedemptionFactory {
   

 event RewardRedemptionCreated( address rewardRedemption, 
        bytes32 indexed appId,
        string name,
        uint8 tokensRequired
    ) ;
}
