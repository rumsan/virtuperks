// SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.0;

interface IAccessManagerV2 {
  event RoleGranted(
    bytes32 appId,
    bytes32 indexed role,
    address indexed account
  );

  event RoleRevoked(
    bytes32 appId,
    bytes32 indexed role,
    address indexed account
  );
  event AppCreated(bytes32 indexed appId, address indexed account);
  event OwnershipTransferred(
    bytes32 indexed appId,
    address indexed previousOwner,
    address indexed newOwner
  );

  function grantRole(bytes32 appId, bytes32 role, address account) external;

  function revokeRole(bytes32 appId, bytes32 role, address account) external;

  function hasRole(
    bytes32 appId,
    bytes32 role,
    address account
  ) external view returns (bool);
}
