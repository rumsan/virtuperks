// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EntityTaskManager.sol";


contract EntityTaskManagerFactory {
    address[] public deployedContracts;
  

   

    function createEntityTaskManager(address aclAddress, bytes32 _appId) public {
  // Deploy a new instance of EntityTaskManager
        EntityTaskManager newEntityTaskManager = new EntityTaskManager(aclAddress, _appId);
        // Initialize the EntityTaskManager via the proxy
        // Track the deployed contract
        deployedContracts.push(address(newEntityTaskManager));
      

       
    }
     function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }
}