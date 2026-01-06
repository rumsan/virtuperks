// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interfaces/IApp.sol";
import "./Entity.sol";

contract App is Initializable, OwnableUpgradeable, UUPSUpgradeable, IApp {
    using SafeERC20 for IERC20;

    // =============================================================
    // ========================= STORAGE ============================
    // =============================================================

    /// @notice App name
    string private name;
    
    /// @notice App active status
    bool private isActive;
    
    /// @notice Entities belonging to this app
    address[] private entities;

    /// @notice Current Entity implementation used for NEW entities (proxies)
    address public entityImplementation;

    /// @notice Permanent global shutdown flag (optional governance kill-switch)
    bool public stopped;

    /// @notice Storage gap for future upgrades
    uint256[47] private __gap;

    // =============================================================
    // ========================= EVENTS =============================
    // =============================================================

    // Events are defined in IApp interface

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // =============================================================
    // ===================== INITIALIZER / UUPS =====================
    // =============================================================

    function initialize(address initialOwner, address initialEntityImplementation, string memory appName) public initializer {
        require(initialOwner != address(0), "App: invalid owner");
        _requireIsContract(initialEntityImplementation, "App: invalid entity impl");
        require(bytes(appName).length > 0, "App: name empty");

        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();

        entityImplementation = initialEntityImplementation;
        stopped = false;
        name = appName;
        isActive = true;

        emit EntityImplementationUpdated(address(0), initialEntityImplementation);
        emit AppCreated(initialOwner, appName);
    }

    /// @dev Authorization check for UUPS upgrade pattern.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {
        // Optionally emit an upgrade event here if you want:
        // emit AppUpgraded(newImplementation);
        _requireIsContract(newImplementation, "App: invalid new impl");
    }

    // =============================================================
    // ========================= MODIFIERS ==========================
    // =============================================================

    modifier appActive() {
        require(isActive, "App: app is deactivated");
        _;
    }

    modifier notStopped() {
        require(!stopped, "App: stopped");
        _;
    }

    // =============================================================
    // ======================= ADMIN CONTROLS =======================
    // =============================================================

    /// @notice Permanent global shutdown: prevents creating apps/entities forever.
    function stop() external onlyOwner {
        require(!stopped, "App: already stopped");
        stopped = true;
        emit AppStopped(msg.sender);
    }

    /// @notice Update the implementation used for NEW entity proxies
    /// @dev Existing entities are NOT affected; only newly created proxies use this.
    function setEntityImplementation(address newImplementation) external onlyOwner notStopped {
        _requireIsContract(newImplementation, "App: invalid entity impl");

        address old = entityImplementation;
        entityImplementation = newImplementation;

        emit EntityImplementationUpdated(old, newImplementation);
    }

    // =============================================================
    // ======================= APP MANAGEMENT =======================
    // =============================================================

    /// @notice Update the app name
    function updateAppName(string memory newName) external override onlyOwner {
        require(bytes(newName).length > 0, "App: name empty");
        
        string memory oldName = name;
        name = newName;
        
        emit AppNameUpdated(oldName, newName, msg.sender);
    }

    /// @notice Permanently deactivates the App
    function deactivateApp() external override onlyOwner {
        require(isActive, "App: already deactivated");
        isActive = false;
        emit AppDeactivated(msg.sender);
    }

    // =============================================================
    // ======================== ENTITY FACTORY ======================
    // =============================================================

    function createEntity(
        address entityOwner,
        string memory entityName,
        string memory url
    )
        external
        onlyOwner
        notStopped
        appActive
        returns (address)
    {
        _requireIsContract(entityImplementation, "App: entity impl not set");
        require(entityOwner != address(0), "App: invalid entity owner");
        require(bytes(entityName).length > 0, "App: entity name empty");

        bytes memory initData = abi.encodeWithSelector(
            Entity.initialize.selector,
            address(this), // appContract inside Entity
            entityOwner,
            entityName,
            url
        );

        ERC1967Proxy proxy = new ERC1967Proxy(entityImplementation, initData);

        address entityAddress = address(proxy);
        entities.push(entityAddress);

        emit EntityCreated(entityAddress, entityOwner);

        return entityAddress;
    }

    // =============================================================
    // ============================ VIEWS ===========================
    // =============================================================

    function getAppName() external view override returns (string memory) {
        return name;
    }

    function isAppActive() external view override returns (bool) {
        return isActive;
    }

    function getAppEntities() external view returns (address[] memory) {
        return entities;
    }

    // =============================================================
    // ========================== RECOVERY ==========================
    // =============================================================

    /// @notice Recover ERC20 tokens mistakenly sent to App
    function recoverERC20(address token, address to, uint256 amount) external onlyOwner {
        require(token != address(0), "App: invalid token");
        require(to != address(0), "App: invalid recipient");
        require(amount > 0, "App: invalid amount");

        IERC20(token).safeTransfer(to, amount);
        emit TokensRecovered(token, to, amount, msg.sender);
    }

    function withdrawETH(address payable to) external onlyOwner {
        require(to != address(0), "invalid recipient");
        uint256 bal = address(this).balance;
        require(bal > 0, "no ETH");
        (bool ok, ) = to.call{value: bal}("");
        require(ok, "ETH transfer failed");
    }

        /**
     * @dev Reverts if ETH is sent to this contract
     */
    receive() external payable {
        revert("NoEthReception: ETH not accepted");
    }

    /**
     * @dev Reverts if ETH is sent to this contract via fallback
     */
    fallback() external payable {
        revert("NoEthReception: ETH not accepted");
    }

    // =============================================================
    // ========================== INTERNAL ==========================
    // =============================================================

    function _requireIsContract(address a, string memory err) internal view {
        require(a != address(0), err);
        require(a.code.length > 0, err);
    }
}