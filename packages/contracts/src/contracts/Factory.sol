// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./RewardManagement.sol";
import "./interfaces/IRewardManagementFactory.sol";
import "./interfaces/IAppRegistry.sol";

contract RewardManagementFactory is IRewardManagementFactory {
 
    mapping(bytes32 => Entity) public entities;

 

    function createRewardManagement(
        bytes32 entityId,
        bytes32 appId,
        address registry,
        Entity memory entity
    ) public {
        // Ensure we don't exceed the maximum number of owners
        require(entity.entityOwners.length <= 5, "Maximum 5 entity owners allowed");
        // Deploy a new instance of RewardManagement
        RewardManagement newRewardManagement = new RewardManagement(appId, entity.name, registry);

        // Get the OWNER role from the new contract
        bytes32 ownerRole = newRewardManagement.OWNER();

        // Grant the OWNER role to each specified entity owner
        IAppRegistry appRegistry = IAppRegistry(registry);
        for (uint i = 0; i < entity.entityOwners.length; i++) {
            appRegistry.grantRole(appId, ownerRole, entity.entityOwners[i]);
        }
       
        //store entity with entity owners
        entities[entityId] = entity;

        //Emit an event when a new contract is deployed
        emit RewardManagementCreated(address(newRewardManagement), registry, appId, entity.name,entityId);
    }

    // Public function to get entityOwners for a RewardManagement contract
    function getEntityOwners(bytes32 entityId) public view returns (address[] memory) {
        return entities[entityId].entityOwners;
    }
}
