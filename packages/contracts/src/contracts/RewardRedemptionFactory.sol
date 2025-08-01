// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./RewardRedemption.sol";
import "./interfaces/IRewardRedemptionFactory.sol";
import "./interfaces/IAppRegistry.sol";

contract RewardRedemptionFactory is IRewardRedemptionFactory {
     mapping(bytes32 => Reward) public rewards;

    function createRewardRedemption(
        bytes32 rewardId,
        bytes32 _appId,
        address _registry,
        address _token,
        string memory _name,
        uint256 _tokensRequired,
        string memory _category,
        address _owner
    ) public {
          
        RewardRedemption reward = new RewardRedemption(
            _appId,
            _registry,
            _token,
            _name,
            _tokensRequired,
            _category
        );
    bytes32 ownerRole = reward.OWNER();
     IAppRegistry appRegistry = IAppRegistry(_registry);
     appRegistry.grantRole(_appId, ownerRole, _owner);
  rewards[rewardId] = Reward({
            name: _name,
            tokensRequired: _tokensRequired,
            category: _category,
            owner: _owner
        });
      emit RewardRedemptionCreated(address(reward), _name, _tokensRequired, _category, rewardId);
        
    }
     // Public function to get entityOwners for a RewardManagement contract
    function getRewardOwners(bytes32 rewardId) public view returns (address) {
        return rewards[rewardId].owner;
    }
}
