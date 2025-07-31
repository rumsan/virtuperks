// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IAppRegistry.sol";
import "./interfaces/IRewardRedemption.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";

/// @title RewardRedemption
/// @dev Manages on-chain reward creation and redemption, integrated with AppRegistry and RewardManagement.
contract RewardRedemption is IRewardRedemption, Multicall, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IAppRegistry public app;
    IERC20 public token; // Add token variable

    bytes32 public appId;
    string public name;
    string public category;
    uint256 public tokensRequired;
    bytes32 public immutable OWNER;

    // Track redemption count per user
    mapping(address => uint256) public userRedemptionCount;
    mapping(bytes32 => mapping(address => mapping(uint256 => Redemption))) public redemptions;

    constructor(
        bytes32 _appId,
        address _registry,
        address _token,
        string memory _name,
        uint256 _tokensRequired,
        string memory _category
    ) {
        require(_token != address(0), "Invalid token address");
        require(_registry != address(0), "Invalid registry address");
        require(_tokensRequired > 0, "Invalid token amount");

        appId = _appId;
        app = IAppRegistry(_registry);
        token = IERC20(_token);
        name = _name;
        tokensRequired = _tokensRequired;
        category = _category;
        OWNER = keccak256(abi.encodePacked(address(this)));
    }

    modifier onlyOwner() {
        require(app.hasRole(appId, OWNER, msg.sender), "Only owner can call this function");
        _;
    }

    // Accept token transfers for funding
    function redeem() external nonReentrant {
        require(tokensRequired > 0, "Invalid token amount");

        // Check token allowance
        require(
            token.allowance(msg.sender, address(this)) >= tokensRequired,
            "Insufficient token allowance"
        );

        // Check token balance
        require(token.balanceOf(msg.sender) >= tokensRequired, "Insufficient token balance");

        // Transfer tokens
        token.safeTransferFrom(msg.sender, address(this), tokensRequired);

        // Get next redemption ID for this user
        uint256 redemptionId = userRedemptionCount[msg.sender];
        userRedemptionCount[msg.sender]++;

        redemptions[appId][msg.sender][redemptionId] = Redemption({
            status: RedemptionStatus.PENDING,
            from: msg.sender,
            amount: tokensRequired,
            timestamp: block.timestamp
        });

        emit RewardRedeem(msg.sender, tokensRequired, RedemptionStatus.PENDING, redemptionId);
    }

    // Admin updates status to REDEEMED or FAILED after off-chain fulfillment
    function updateRedemptionStatus(address user, uint256 redemptionId) external onlyOwner {
        Redemption storage redemption = redemptions[appId][user][redemptionId];
        require(redemption.from != address(0), "No redemption found");
        require(redemption.status == RedemptionStatus.PENDING, "Redemption not pending");
        redemption.status = RedemptionStatus.REDEEMED; // or RedemptionStatus.FAILED based on logic

        emit RewardReleased(user, redemption.amount, RedemptionStatus.REDEEMED, redemptionId);
    }

    function getRedemptionStatus(
        address user,
        uint256 redemptionId
    ) external view returns (RedemptionStatus) {
        return redemptions[appId][user][redemptionId].status;
    }

    // Get total number of redemptions for a user
    function getUserRedemptionCount(address user) external view returns (uint256) {
        return userRedemptionCount[user];
    }

    function getContractBalance() external view returns (uint256) {
        require(address(token) != address(0), "Token not initialized");
        return token.balanceOf(address(this));
    }
}
