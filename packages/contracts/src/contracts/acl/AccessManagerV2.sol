// SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/Multicall.sol';
import '../interfaces/IAccessManagerV2.sol';

contract AccessManagerV2 is IAccessManagerV2, Multicall {
  mapping(bytes32 => address) private _appAdmin;

  // Mapping appId => role => user address => status
  mapping(bytes32 => mapping(bytes32 => mapping(address => bool)))
    private _roles;

  constructor() {}

  function transferOwnership(bytes32 appId, address newOwner) public {
    require(_appAdmin[appId] == msg.sender, 'AccessManager: Not an admin');
    _appAdmin[appId] = newOwner;
    emit OwnershipTransferred(appId, msg.sender, newOwner);
  }

  function createApp(bytes32 appId, address account) public {
    require(
      _appAdmin[appId] == address(0),
      'AccessManager: App already exists'
    );
    _appAdmin[appId] = account;
    emit AppCreated(appId, account);
  }

  function grantRole(bytes32 appId, bytes32 role, address account) public {
    require(_appAdmin[appId] == msg.sender, 'AccessManager: Not an admin');
    _roles[appId][role][account] = true;
    emit RoleGranted(appId, role, account);
  }

  function revokeRole(bytes32 appId, bytes32 role, address account) public {
    require(_appAdmin[appId] == msg.sender, 'AccessManager: Not an admin');
    _roles[appId][role][account] = false;
    emit RoleRevoked(appId, role, account);
  }

  function hasRole(
    bytes32 appId,
    bytes32 role,
    address account
  ) public view returns (bool) {
    return _roles[appId][role][account];
  }
}
