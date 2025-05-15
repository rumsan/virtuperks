// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/Multicall.sol";
import "./interfaces/IAppRegistry.sol";

contract RumsanApp is IAppRegistry, Multicall {
    mapping(bytes32 => App) private _apps;

    // Mapping appId => role => user address => status
    mapping(bytes32 => mapping(bytes32 => mapping(address => bool))) private _roles;

    modifier onlyOwner(bytes32 appId) {
        require(_apps[appId].owner == msg.sender, "RumsanApp: Not an owner");
        _;
    }

    constructor() {}

    function transferOwnership(bytes32 appId, address newOwner) public onlyOwner(appId) {
        _apps[appId].owner = newOwner;
        emit OwnershipTransferred(appId, msg.sender, newOwner);
    }

    function grantRole(bytes32 appId, bytes32 role, address account) public onlyOwner(appId) {
        _roles[appId][role][account] = true;
        emit RoleGranted(appId, role, account);
    }

    function revokeRole(bytes32 appId, bytes32 role, address account) public onlyOwner(appId) {
        _roles[appId][role][account] = false;
        emit RoleRevoked(appId, role, account);
    }

    function hasRole(bytes32 appId, bytes32 role, address account) public view returns (bool) {
        return _roles[appId][role][account];
    }

    function createApp(bytes32 appId, address account) public {
        require(_apps[appId].owner == address(0), "RumsanApp: App already exists");
        _apps[appId].owner = account;
        emit AppCreated(appId, account);
    }

    function getAppDetails(bytes32 appId) public view returns (App memory) {
        return _apps[appId];
    }

    // Set private as false to allow external participants to participate in the app
    function setPrivate(bytes32 appId, bool isPrivate) public onlyOwner(appId) {
        _apps[appId].isPrivate = isPrivate;
    }
}
