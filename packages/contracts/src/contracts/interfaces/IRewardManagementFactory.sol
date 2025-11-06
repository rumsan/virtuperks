// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IRewardManagementFactory {
    struct Entity {
        string name;
        address[] entityOwners;
    }

    event RewardManagementCreated(
        address rewardManagement,
        address registry,
        bytes32 appId,
        string name,
        bytes32 entityId
    );

    event OwnerAdded (
        bytes32 indexed entityId,
        string name,
        address indexed entityOwner
    );
}
 