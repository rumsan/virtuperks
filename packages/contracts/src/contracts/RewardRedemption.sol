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
    IERC20 public token;

    bytes32 public appId;
    string public name;
    uint8 public tokensRequired;
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    mapping(bytes32 => mapping(address => Redemption)) public redemptions;

      modifier onlyAdmin() {
      
        require(app.hasRole(appId, DEFAULT_ADMIN_ROLE, msg.sender), "Not authorized");
        _;
    }

    constructor(
        bytes32 _appId,
        address _registry,
        address _token,
        string memory _name,
        uint8 _tokensRequired
    ) {
        appId = _appId;
        app = IAppRegistry(_registry);
        name = _name;
        token = IERC20(_token);
        tokensRequired = _tokensRequired;
    }

    //Accept token transfers for funding
    function redeem(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than zero");

        token.safeTransferFrom(msg.sender, address(this), amount);
        redemptions[appId][msg.sender] = Redemption({
            status: RedemptionStatus.PENDING,
            from: msg.sender,
            amount: amount,
            timestamp: block.timestamp
        });
        emit RewardRedeemed(msg.sender, amount, RedemptionStatus.PENDING);
    }


    // Admin updates status to REDEEMED or FAILED after off-chain fulfillment
    function updateRedemptionStatus(address user) external onlyAdmin {
        Redemption storage redemption = redemptions[appId][user];
        require(redemption.from != address(0), "No redemption found");
        require(
            redemption.status == RedemptionStatus.PENDING,
            "Redemption not pending"
        );
        redemption.status = RedemptionStatus.REDEEMED; // or RedemptionStatus.FAILED based on logic

        // Re-emit event with new status
        emit RewardRedeemed(user, redemption.amount, RedemptionStatus.REDEEMED);
    }
}
