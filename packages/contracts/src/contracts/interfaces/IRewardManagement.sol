// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./ITaskManagement.sol";
import "./IParticipantManagement.sol";
import "./IDisbursementManagement.sol";
import "./ITokenManagement.sol";

interface IRewardManagement is
    ITaskManagement,
    IParticipantManagement,
    IDisbursementManagement,
    ITokenManagement
{
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);

    function _findHash(string memory text) external pure returns (bytes32);
    function pause() external;
    function unpause() external;
    function name() external view returns (string memory);
}
