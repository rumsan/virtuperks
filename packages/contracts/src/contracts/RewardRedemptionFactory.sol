// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./RewardRedemption.sol";
import "./interfaces/IRewardRedemptionFactory.sol";

contract RewardRedemptionFactory is IRewardRedemptionFactory {
   

    function createRewardRedemption(
        bytes32 _appId,
        address _registry,
        address _token,
        string memory _name,
        uint256 _tokensRequired
    ) public {
        RewardRedemption reward = new RewardRedemption(
            _appId,
            _registry,
            _token,
            _name,
            _tokensRequired
        );

        emit RewardRedemptionCreated(address(reward), _appId, _name, _tokensRequired); 
        
    }
}
