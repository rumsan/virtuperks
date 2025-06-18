// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./RewardManagement.sol";
import "./interfaces/IAppRegistry.sol";

contract RewardManagementFactory {
   

    //Event to be emitted when a new RewardManagement is created
    event RewardManagementCreated(
        address rewardManagement,
        address aclAddress,
        bytes32 appId,
        string name,
        address[] entityOwners
    );

    function createRewardManagement(bytes32 appId, string memory name, address registry, address[] memory entityOwners) public {

        // Ensure we don't exceed the maximum number of owners
        require(entityOwners.length <= 5, "Maximum 5 entity owners allowed");
        // Deploy a new instance of RewardManagement
        RewardManagement newRewardManagement = new RewardManagement(appId, name, registry);

         // Get the OWNER role from the new contract
        bytes32 ownerRole = newRewardManagement.OWNER();

         // Grant the OWNER role to each specified entity owner
        IAppRegistry appRegistry = IAppRegistry(registry);
        for (uint i = 0; i < entityOwners.length; i++) {
          appRegistry.grantRole(appId, ownerRole, entityOwners[i]);
        }

     
        //Emit an event when a new contract is deployed
        emit RewardManagementCreated(address(newRewardManagement), registry, appId, name, entityOwners);
    }
  
}
