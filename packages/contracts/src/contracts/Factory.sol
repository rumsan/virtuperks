// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './EntityTaskManager.sol';

contract EntityTaskManagerFactory {
    address[] public deployedContracts;

    //Event to be emitted when a new EntityTaskManager is created
    event EntityTaskManagerCreated(
        address entityTaskManager,
        address aclAddress,
        bytes32 _appId,
        string _name
    );

    function createEntityTaskManager(
        address aclAddress,
        bytes32 _appId,
        string memory _name
    ) public {
        // Deploy a new instance of EntityTaskManager
        EntityTaskManager newEntityTaskManager = new EntityTaskManager(
            aclAddress,
            _appId,
            _name
        );

        // Track the deployed contract
        deployedContracts.push(address(newEntityTaskManager));

        //Emit an event when a new contract is deployed
        emit EntityTaskManagerCreated(
            address(newEntityTaskManager),
            aclAddress,
            _appId,
            _name
        );
    }
    function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }
}
