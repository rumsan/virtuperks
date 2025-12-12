// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../interfaces/ITokenManagement.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./DisbursementManagement.sol";

abstract contract TokenManagement is DisbursementManagement, ITokenManagement {
    using SafeERC20 for IERC20;

    function getTotalUnallocatedTokens(address tokenAddress) public view returns (uint256) {
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(address(this)) - totalAllocatedTokens[tokenAddress];
    }

    function _getTotalUnallocatedTokens(
        address tokenAddress
    ) internal view override returns (uint256) {
        return getTotalUnallocatedTokens(tokenAddress);
    }

    function transferToken(
        address tokenAddress,
        address to,
        uint256 amount,
        string memory remarks
    ) public onlyOwner nonReentrant whenNotPaused {
        require(to != address(0), "Cannot transfer to zero address");
        require(tokenAddress != address(0), "Token address cannot be zero");
        require(amount > 0, "Amount must  be greater than 0");

        IERC20 token = IERC20(tokenAddress);
        require(
            getTotalUnallocatedTokens(tokenAddress) >= amount,
            "Insufficient available token for transfer"
        );
        token.safeTransfer(to, amount);

        emit TokenTransferred(tokenAddress, to, amount, remarks, msg.sender);
    }

    //allow owner to withdraw ethereum to specified address
    function withdrawEther(address payable to) public onlyOwner nonReentrant {
        require(to != address(0), "Cannot withdraw to zero address");
        uint256 balance = address(this).balance;
        (bool sent, ) = to.call{ value: balance }("");
        require(sent, "Failed to send Ether");
        emit EtherWithdrawn(to, balance, msg.sender);
    }

    /// @notice Transfer ERC20 tokens to this contract and allocate them to a specific task
    /// @dev Users must first approve this contract to spend their tokens before calling this function
    /// @param taskId The unique identifier of the task to allocate tokens to
    /// @param tokenAddress The address of the ERC20 token to transfer
    /// @param amount The amount of tokens to transfer and allocate
    function allocateTokensToTask(
        bytes32 taskId,
        address tokenAddress,
        uint256 amount
    ) public nonReentrant whenNotPaused {
        _allocateTokensToTask(taskId, tokenAddress, amount);
    }

    function _allocateTokensToTask(
        bytes32 taskId,
        address tokenAddress,
        //address treasuryAddress, //???
        uint256 amount
    ) internal override {
        require(amount > 0, "Amount must be greater than 0");
        require(tokenAddress != address(0), "Token address cannot be zero");

        Task storage task = tasks[taskId];
        require(task.owner != address(0), "Task does not exist");
        require(task.isOpen, "Task is not open");
        require(task.rewardToken == tokenAddress, "Token address does not match task reward token");

        // Transfer tokens from user to this contract
        //IERC20 token = IERC20(tokenAddress); //???
        //token.safeTransferFrom(treasuryAddress, address(this), amount); //???

        // Update task's total reward amount and allocated tokens
        task.totalRewardAmount += amount;
        totalAllocatedTokens[tokenAddress] += amount;

        emit TokensAllocatedToTask(taskId, tokenAddress, amount, msg.sender);
    }

    function acceptTokenTransfer(
        address treasuryAddress,
        address tokenAddress,
        uint256 amount
    ) public override onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        token.safeTransferFrom(treasuryAddress, address(this), amount);
    }
}
