// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface ITokenManagement {
    event TokenTransferred(
        address indexed token,
        address indexed to,
        uint256 amount,
        string remarks,
        address indexed transferredBy
    );
    event EtherWithdrawn(address indexed to, uint256 amount, address indexed by);
    event TokensAllocatedToTask(
        bytes32 indexed taskId,
        address indexed token,
        uint256 amount,
        address indexed allocatedBy
    );

    function getTotalUnallocatedTokens(address tokenAddress) external view returns (uint256);

    function transferToken(
        address tokenAddress,
        address to,
        uint256 amount,
        string memory remarks
    ) external;

    function withdrawEther(address payable to) external;

    function allocateTokensToTask(
        bytes32 taskId,
        address tokenAddress,
        address treasuryAddress,
        uint256 amount
    ) external;
}
