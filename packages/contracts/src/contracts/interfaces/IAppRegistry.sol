// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev External interface of AppRegistry declared to support ERC-165 detection.
 */
interface IAppRegistry {
    /**
     * @dev Structure containing application data
     */
    struct AppData {
        string name;
        mapping(bytes32 role => mapping(address account => bool)) hasRole;
        mapping(bytes32 role => mapping(address account => bool)) isRoleAdmin;
        mapping(bytes32 role => address[]) roleAdmins;
        bool isPrivate;
    }
    /**
     * @dev The `account` is missing a role.
     */
    error AccessControlUnauthorizedAccount(address account, bytes32 neededRole);

    /**
     * @dev The caller of a function is not the expected one.
     *
     * NOTE: Don't confuse with {AccessControlUnauthorizedAccount}.
     */
    error AccessControlBadConfirmation();

    /**
     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
     *
     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
     * {RoleAdminChanged} not being emitted signaling this.
     */
    event RoleAdminGranted(
        bytes32 indexed appId,
        bytes32 indexed role,
        address indexed account,
        address sender
    );

    /**
     * @dev Emitted when admin rights for a role are revoked from an account
     * @param appId The unique identifier for the application
     * @param role The role identifier
     * @param account The account address from which admin rights are revoked
     * @param sender The address that initiated the revocation
     */
    event RoleAdminRevoked(
        bytes32 indexed appId,
        bytes32 indexed role,
        address indexed account,
        address sender
    );

    /**
     * @dev Emitted when a new application is created
     * @param appId The unique identifier for the application
     * @param admin The initial admin address for the application
     * @param sender The address that created the application
     */
    event AppCreated(bytes32 indexed appId, address indexed admin, address indexed sender);

    /**
     * @dev Emitted when an application's name is updated
     * @param appId The unique identifier for the application
     * @param newName The new name for the application
     * @param sender The address that updated the application name
     */
    event AppNameUpdated(bytes32 indexed appId, string newName, address indexed sender);
    /**
     * @dev Emitted when `account` is granted `role`.
     *
     * `sender` is the account that originated the contract call. This account bears the admin role (for the granted role).
     * Expected in cases where the role was granted using the internal {AccessControl-_grantRole}.
     */
    event RoleGranted(
        bytes32 indexed appId,
        bytes32 indexed role,
        address indexed account,
        address sender
    );

    /**
     * @dev Emitted when `account` is revoked `role`.
     *
     * `sender` is the account that originated the contract call:
     *   - if using `revokeRole`, it is the admin role bearer
     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
     */
    event RoleRevoked(
        bytes32 indexed appId,
        bytes32 indexed role,
        address indexed account,
        address sender
    );

    /**
     * @dev Emitted when an application's privacy setting is changed
     * @param appId The unique identifier for the application
     * @param isPrivate The new privacy status of the application
     * @param sender The address that changed the privacy setting
     */
    event AppPrivacyChanged(bytes32 indexed appId, bool indexed isPrivate, address indexed sender);

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 appId, bytes32 role, address account) external view returns (bool);

    /**
     * @dev Checks if an account has admin rights for a specific role in an application
     * @param appId The unique identifier for the application
     * @param role The role identifier
     * @param account The account address to check
     * @return bool True if the account is an admin for the role, false otherwise
     */
    function isRoleAdmin(bytes32 appId, bytes32 role, address account) external view returns (bool);

    /**
     * @dev Checks if an account is an admin of the application
     * @param appId The unique identifier for the application
     * @param account The account address to check
     * @return bool True if the account is an application admin, false otherwise
     */
    function isAppAdmin(bytes32 appId, address account) external view returns (bool);
    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function grantRole(bytes32 appId, bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function revokeRole(bytes32 appId, bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been granted `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `callerConfirmation`.
     */
    function renounceRole(bytes32 appId, bytes32 role, address callerConfirmation) external;

    /**
     * @dev Grants admin rights for `role` to `account`.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleAdminGranted} event.
     */
    function grantRoleAdmin(bytes32 appId, bytes32 role, address account) external;

    /**
     * @dev Revokes admin rights for `role` from `account`.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleAdminRevoked} event.
     */
    function revokeRoleAdmin(bytes32 appId, bytes32 role, address account) external;

    /**
     * @dev Revokes admin rights for `role` from the calling account.
     *
     * This function allows an account to renounce its admin privileges for a specific role.
     *
     * Requirements:
     *
     * - the caller must be `callerConfirmation`.
     *
     * May emit a {RoleAdminRevoked} event.
     */
    function renounceRoleAdmin(bytes32 appId, bytes32 role, address callerConfirmation) external;

    /**
     * @dev Creates a new application with the given parameters
     * @param appId The unique identifier for the application
     * @param name The name of the application
     * @param admin The address that will be the admin of the application
     * @param isPrivate The privacy status of the application
     */
    function createApp(bytes32 appId, string memory name, address admin, bool isPrivate) external;

    /**
     * @dev Sets the privacy status of an application
     * @param appId The unique identifier for the application
     * @param isPrivate The new privacy status (true for private, false for public)
     */
    function setPrivate(bytes32 appId, bool isPrivate) external;

    /**
     * @dev Checks if an application is private
     * @param appId The unique identifier for the application
     * @return bool True if the application is private, false otherwise
     */
    function isPrivate(bytes32 appId) external view returns (bool);

    /**
     * @dev Retrieves the details of an application
     * @param appId The unique identifier for the application
     * @return name The name of the application
     * @return isPrivate The privacy status of the application
     */
    function getAppDetails(
        bytes32 appId
    ) external view returns (string memory name, bool isPrivate);

    /**
     * @notice Retrieves the admins of a specific role for an application
     * @param appId The unique identifier for the application
     * @param role The role identifier
     * @return Array of admin addresses for the specified role
     */
    function getRoleAdmins(bytes32 appId, bytes32 role) external view returns (address[] memory);

    /**
     * @notice Updates the name of an existing application
     * @param appId The unique identifier for the application
     * @param newName The new name for the application
     */
    function updateAppName(bytes32 appId, string memory newName) external;

    /**
     * @notice Checks if an application exists
     * @param appId The unique identifier for the application
     * @return bool True if the application exists, false otherwise
     */
    function isAppExists(bytes32 appId) external view returns (bool);

    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
