// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IAppRegistry {
    struct App {
        bytes32 appId;
        address owner;
        bool isPrivate;
    }
    event RoleGranted(bytes32 appId, bytes32 indexed role, address indexed account);
    event RoleRevoked(bytes32 appId, bytes32 indexed role, address indexed account);
    event AppCreated(bytes32 indexed appId, address indexed account);
    event OwnershipTransferred(
        bytes32 indexed appId,
        address indexed previousOwner,
        address indexed newOwner
    );

    function grantRole(bytes32 appId, bytes32 role, address account) external;
    function revokeRole(bytes32 appId, bytes32 role, address account) external;
    function hasRole(bytes32 appId, bytes32 role, address account) external view returns (bool);
    function createApp(bytes32 appId, address account) external;

    function getAppDetails(bytes32 appId) external view returns (App memory);
    function setPrivate(bytes32 appId, bool isPrivate) external;
    function transferOwnership(bytes32 appId, address newOwner) external;
}
