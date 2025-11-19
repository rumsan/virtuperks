// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./interfaces/IRewardManagement.sol";
import "./modules/TokenManagement.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";

contract RewardManagement is IRewardManagement, TokenManagement, Multicall {
    string public name;

    constructor(
        bytes32 _appId,
        string memory _name,
        address _registry
    ) RewardManagementBase(_appId, _registry) {
        name = _name;
    }

    //prevent contract from receiving ether
    receive() external payable {
        revert("Contract does not accept ether");
    }

    fallback() external payable {
        revert("Contract does not accept ether");
    }

    /// @notice Pauses the contract in case of an emergency
    /// @dev Only callable by the owner
    function pause() external onlyOwner {
        paused = true;
        emit ContractPaused(msg.sender);
    }

    /// @notice Unpauses the contract
    /// @dev Only callable by the owner
    function unpause() external onlyOwner {
        paused = false;
        emit ContractUnpaused(msg.sender);
    }

    function _findHash(string memory text) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(text));
    }
}
