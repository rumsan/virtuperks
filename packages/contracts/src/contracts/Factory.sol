// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./RewardManagement.sol";

contract RewardManagementFactory {
    address[] public deployedContracts;

    //Event to be emitted when a new RewardManagement is created
    event RewardManagementCreated(
        address rewardManagement,
        address aclAddress,
        bytes32 appId,
        string name
    );

    function createRewardManagement(bytes32 appId, string memory name, address registry) public {
        // Deploy a new instance of RewardManagement
        RewardManagement newRewardManagement = new RewardManagement(appId, name, registry);

        // Track the deployed contract
        deployedContracts.push(address(newRewardManagement));

        //Emit an event when a new contract is deployed
        emit RewardManagementCreated(address(newRewardManagement), registry, appId, name);
    }
    function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }
}
