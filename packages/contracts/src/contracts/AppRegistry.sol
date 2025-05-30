// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./interfaces/IAppRegistry.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AppRegistry
 * @dev Implements role-based access control for multiple applications within a single contract.
 * Each application is identified by a unique bytes32 identifier and can have its own set of roles and admins.
 */
contract AppRegistry is IAppRegistry, Context, ERC165, ReentrancyGuard {
    mapping(bytes32 appId => AppData) private _apps;

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    uint256 public constant MAX_ADMINS_PER_ROLE = 20;

    /**
     * @dev Modifier that checks that an account has a specific role's admin rights. Reverts
     * with an {AccessControlUnauthorizedAccount} error including the required role.
     */
    modifier onlyRoleAdmin(bytes32 appId, bytes32 role) {
        require(
            isRoleAdmin(appId, role, _msgSender()) || isAppAdmin(appId, _msgSender()),
            "AppRegistry: Not a role admin"
        );
        //_checkRoleAdmin(appId, role, _msgSender());
        _;
    }

    /**
     * @dev Modifier that checks that an account has the DEFAULT_ADMIN_ROLE for a specific app.
     * Reverts with an {AccessControlUnauthorizedAccount} error if the account is not an admin.
     */
    modifier onlyAppAdmin(bytes32 appId) {
        if (!isAppAdmin(appId, _msgSender())) {
            revert AccessControlUnauthorizedAccount(_msgSender(), DEFAULT_ADMIN_ROLE);
        }
        _;
    }

    /**
     * @dev Modifier that checks if the app exists. Reverts with an error if the app does not exist.
     */
    modifier appExists(bytes32 appId) {
        require(_isAppExists(appId), "AppRegistry: App does not exist.");
        _;
    }

    /**
     * @dev See {IERC165-supportsInterface}
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC165, IAppRegistry) returns (bool) {
        return
            interfaceId == type(IAppRegistry).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(
        bytes32 appId,
        bytes32 role,
        address account
    ) public view virtual override returns (bool) {
        return _apps[appId].hasRole[role][account];
    }

    /**
     * @dev Returns `true` if `account` has been granted admin rights for `role`.
     */
    function isRoleAdmin(
        bytes32 appId,
        bytes32 role,
        address account
    ) public view virtual override returns (bool) {
        return _apps[appId].isRoleAdmin[role][account];
    }

    /**
     * @dev Returns `true` if `account` is an admin of the app.
     */
    function isAppAdmin(
        bytes32 appId,
        address account
    ) public view virtual override returns (bool) {
        return _apps[appId].isRoleAdmin[DEFAULT_ADMIN_ROLE][account];
    }

    /**
     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `_msgSender()`
     * is missing admin rights for `role`.
     */
    function _checkRoleAdmin(bytes32 appId, bytes32 role) internal view virtual {
        _checkRoleAdmin(appId, role, _msgSender());
    }

    /**
     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `account`
     * is missing admin rights for `role`.
     */
    function _checkRoleAdmin(bytes32 appId, bytes32 role, address account) internal view virtual {
        if (!isRoleAdmin(appId, role, account)) {
            revert AccessControlUnauthorizedAccount(account, role);
        }
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleGranted} event.
     */
    function grantRole(
        bytes32 appId,
        bytes32 role,
        address account
    ) public virtual override onlyRoleAdmin(appId, role) {
        require(account != address(0), "AppRegistry: Account cannot be zero address");
        _grantRole(appId, role, account);
    }

    /**
     * @dev Grants `role` admin to `account`.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleAdminGranted} event.
     */
    function grantRoleAdmin(
        bytes32 appId,
        bytes32 role,
        address account
    ) public virtual override onlyRoleAdmin(appId, role) {
        require(account != address(0), "AppRegistry: Account cannot be zero address");
        _grantRoleAdmin(appId, role, account);
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleRevoked} event.
     */
    function revokeRole(
        bytes32 appId,
        bytes32 role,
        address account
    ) public virtual override onlyRoleAdmin(appId, role) {
        _revokeRole(appId, role, account);
    }

    /**
     * @dev Revokes `role` admin from `account`.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleAdminRevoked} event.
     */
    function revokeRoleAdmin(
        bytes32 appId,
        bytes32 role,
        address account
    ) public virtual override onlyRoleAdmin(appId, role) nonReentrant {
        _revokeRoleAdmin(appId, role, account);
    }

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been revoked `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `callerConfirmation`.
     *
     * May emit a {RoleRevoked} event.
     */
    function renounceRole(
        bytes32 appId,
        bytes32 role,
        address callerConfirmation
    ) public virtual override {
        if (callerConfirmation != _msgSender()) {
            revert AccessControlBadConfirmation();
        }

        _revokeRole(appId, role, callerConfirmation);
    }

    /**
     * @dev Revokes `role` admin from the calling account.
     *
     * This function allows an account to renounce its admin privileges for a specific role.
     * It is useful in cases where an account no longer wishes to hold admin responsibilities.
     *
     * Requirements:
     *
     * - The caller must confirm their address by passing it as `callerConfirmation`.
     *
     * May emit a {RoleAdminRevoked} event.
     */
    function renounceRoleAdmin(
        bytes32 appId,
        bytes32 role,
        address callerConfirmation
    ) public virtual override nonReentrant {
        if (callerConfirmation != _msgSender()) {
            revert AccessControlBadConfirmation();
        }

        _revokeRoleAdmin(appId, role, callerConfirmation);
    }

    /**
     * @dev Attempts to grant `role` to `account` and returns a boolean indicating if `role` was granted.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleGranted} event.
     */
    function _grantRole(
        bytes32 appId,
        bytes32 role,
        address account
    ) internal virtual returns (bool) {
        if (!hasRole(appId, role, account)) {
            _apps[appId].hasRole[role][account] = true;
            emit RoleGranted(appId, role, account, _msgSender());
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Attempts to grant `role` admin to `account` and returns a boolean indicating if `role` was granted.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleAdminGranted} event.
     */
    function _grantRoleAdmin(bytes32 appId, bytes32 role, address account) internal returns (bool) {
        if (!isRoleAdmin(appId, role, account)) {
            address[] storage roleAdmins = _apps[appId].roleAdmins[role];
            require(roleAdmins.length < MAX_ADMINS_PER_ROLE, "AppRegistry: Max admins reached");

            _grantRole(appId, role, account);
            _apps[appId].isRoleAdmin[role][account] = true;
            roleAdmins.push(account);

            emit RoleAdminGranted(appId, role, account, _msgSender());
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Attempts to revoke `role` from `account` and returns a boolean indicating if `role` was revoked.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleRevoked} event.
     */
    function _revokeRole(
        bytes32 appId,
        bytes32 role,
        address account
    ) internal virtual returns (bool) {
        if (hasRole(appId, role, account)) {
            _apps[appId].hasRole[role][account] = false;
            emit RoleRevoked(appId, role, account, _msgSender());
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Attempts to revoke `role` admin from `account` and returns a boolean indicating if `role` was revoked.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleAdminRevoked} event.
     */
    function _revokeRoleAdmin(
        bytes32 appId,
        bytes32 role,
        address account
    ) internal virtual returns (bool) {
        if (isRoleAdmin(appId, role, account)) {
            address[] storage roleAdmins = _apps[appId].roleAdmins[role];
            uint256 adminCount = roleAdmins.length;

            require(adminCount > 1, "AppRegistry: Cannot revoke last admin");

            // Gas optimization - cache array length and avoid multiple storage reads
            for (uint256 i = 0; i < adminCount; i++) {
                if (roleAdmins[i] == account) {
                    // Replace the element with the last one and pop
                    roleAdmins[i] = roleAdmins[adminCount - 1];
                    roleAdmins.pop();

                    // Update role admin status
                    _apps[appId].isRoleAdmin[role][account] = false;

                    // For DEFAULT_ADMIN_ROLE, also revoke the role itself
                    if (role == DEFAULT_ADMIN_ROLE) {
                        _apps[appId].hasRole[role][account] = false;
                    }

                    emit RoleAdminRevoked(appId, role, account, _msgSender());
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }

    /**
     * @notice Creates a new application with the specified ID, name, admin, and privacy setting
     * @dev Creates a new application and assigns the DEFAULT_ADMIN_ROLE to the specified admin
     * @param appId The unique identifier for the application
     * @param name The name of the application
     * @param admin The address that will be granted the DEFAULT_ADMIN_ROLE
     * @param _isPrivate Whether the application is private or public
     */
    function createApp(
        bytes32 appId,
        string memory name,
        address admin,
        bool _isPrivate
    ) public virtual override nonReentrant {
        require(appId != bytes32(0), "AppRegistry: App ID cannot be zero");
        require(bytes(name).length > 0, "AppRegistry: App name cannot be empty");
        require(admin != address(0), "AppRegistry: Admin cannot be zero address");
        require(!_isAppExists(appId), "AppRegistry: App already exists.");

        _apps[appId].name = name;
        _apps[appId].isPrivate = _isPrivate;

        _grantRoleAdmin(appId, DEFAULT_ADMIN_ROLE, admin);
        emit AppCreated(appId, admin, _msgSender());
    }

    /**
     * @notice Updates the name of an existing application
     * @dev Only the app admin can update the name
     * @param appId The unique identifier for the application
     * @param newName The new name for the application
     */
    function updateAppName(
        bytes32 appId,
        string memory newName
    ) public virtual override onlyAppAdmin(appId) appExists(appId) {
        require(bytes(newName).length > 0, "AppRegistry: App name cannot be empty");
        require(
            keccak256(abi.encodePacked(_apps[appId].name)) != keccak256(abi.encodePacked(newName)),
            "AppRegistry: New name must be different"
        );

        _apps[appId].name = newName;
        emit AppNameUpdated(appId, newName, _msgSender());
    }

    /**
     * @notice Retrieves the details of an application
     * @param appId The unique identifier for the application
     * @return name The name of the application
     * @return isPrivateApp Whether the application is private or public
     */
    function getAppDetails(
        bytes32 appId
    )
        public
        view
        virtual
        override
        appExists(appId)
        returns (string memory name, bool isPrivateApp)
    {
        return (_apps[appId].name, _apps[appId].isPrivate);
    }

    /**
     * @notice Retrieves the admins of a specific role for an application
     * @param appId The unique identifier for the application
     * @param role The role identifier
     * @return addresses The list of admin addresses for the specified role
     */
    function getRoleAdmins(
        bytes32 appId,
        bytes32 role
    ) public view virtual appExists(appId) returns (address[] memory) {
        return _apps[appId].roleAdmins[role];
    }

    /**
     * @notice Checks if an application is private
     * @param appId The unique identifier for the application
     * @return bool True if the application is private, false otherwise
     */
    function isPrivate(bytes32 appId) public view virtual appExists(appId) returns (bool) {
        return _apps[appId].isPrivate;
    }

    /**
     * @notice Sets the privacy status of an application
     * @dev Only the app admin can set the privacy status
     * @param appId The unique identifier for the application
     * @param _isPrivate The new privacy status
     */
    function setPrivate(
        bytes32 appId,
        bool _isPrivate
    ) public virtual onlyAppAdmin(appId) appExists(appId) {
        require(_apps[appId].isPrivate != _isPrivate, "AppRegistry: App already in the same state");
        _apps[appId].isPrivate = _isPrivate;
        emit AppPrivacyChanged(appId, _isPrivate, _msgSender());
    }

    /**
     * @notice Checks if an application exists
     * @param appId The unique identifier for the application
     * @return bool True if the application exists, false otherwise
     */
    function isAppExists(bytes32 appId) public view virtual override returns (bool) {
        return _isAppExists(appId);
    }

    /**
     * @dev Internal function to check if an application exists
     * @param appId The unique identifier for the application
     * @return bool True if the application exists, false otherwise
     */
    function _isAppExists(bytes32 appId) internal view returns (bool) {
        return keccak256(abi.encodePacked(_apps[appId].name)) != keccak256(abi.encodePacked(""));
    }
}
