// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

interface IEntity {
    struct EntityInfo {
        string name;
        string url;
        address owner;
        bool isActive;
    }

    event EntityInitialized(address indexed owner, string name);
    event EntityDeactivated(address indexed by);
    event EntityUpgraded(address indexed newImplementation);
    event AppContractUpdated(address indexed oldApp, address indexed newApp);
    event TokensDeposited(address indexed token, uint256 amount, address indexed by);
    event RewardsDistributed(bytes32 indexed taskId, uint256 totalAmount, uint256 participantCount);
    event AllocationsFrozen(address indexed by);
    event EmergencyWithdrawal(address indexed token, address indexed to, uint256 amount, address indexed by);
    event TokensWithdrawn(address indexed token, address indexed to, uint256 amount, address indexed by);

    function initialize(
        address appContract,
        address owner,
        string memory name,
        string memory url
    ) external;
    
    function pause() external;
    function unpause() external;
    function updateAppContract(address newApp) external;
    function deactivateEntity() external;
    function getEntityInfo() external view returns (EntityInfo memory);
    function getUnallocatedTokens(address token) external view returns (uint256);
    function getTotalAllocatedTokens(address token) external view returns (uint256);
    function withdrawUnallocatedTokens(address token, address to, uint256 amount) external;
    function emergencyWithdrawAll(address token, address to) external;
    function withdrawETH(address payable to) external;
    function depositTokens(address token, uint256 amount) external;
    function distributeRewards(bytes32 taskId) external;
}
