// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../interfaces/ITaskManagement.sol";
import "../interfaces/IAppRegistry.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

abstract contract RewardManagementBase {
    using SafeERC20 for IERC20;

    IAppRegistry public app;
    bytes32 public appId;
    bytes32 public immutable OWNER;
    bool public paused;

    mapping(address => uint256) public totalAllocatedTokens;

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier onlyRole(bytes32 role) {
        require(app.hasRole(appId, role, msg.sender), "Access Denied");
        _;
    }

    modifier onlyOwner() {
        require(app.hasRole(appId, OWNER, msg.sender), "Only owner can call this function");
        _;
    }

    constructor(bytes32 _appId, address _registry) {
        appId = _appId;
        app = IAppRegistry(_registry);
        OWNER = keccak256(abi.encodePacked(address(this)));
    }
}
