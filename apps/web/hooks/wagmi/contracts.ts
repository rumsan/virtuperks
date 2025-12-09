import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AppRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const appRegistryAbi = [
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'appId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'admin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AppCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'appId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AppNameUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'appId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'isPrivate', internalType: 'bool', type: 'bool', indexed: true },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AppPrivacyChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'appId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'RoleAdminGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'appId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'RoleAdminRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'appId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'appId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_ADMINS_PER_ROLE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'admin', internalType: 'address', type: 'address' },
      { name: '_isPrivate', internalType: 'bool', type: 'bool' },
    ],
    name: 'createApp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'appId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getAppDetails',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'isPrivateApp', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getRoleAdmins',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRoleAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'isAppAdmin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'appId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'isAppExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'appId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'isPrivate',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'isRoleAdmin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRoleAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRoleAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_isPrivate', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPrivate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'newName', internalType: 'string', type: 'string' },
    ],
    name: 'updateAppName',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Reward Token
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rewardTokenAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
      { name: '_decimals', internalType: 'uint8', type: 'uint8' },
      { name: '_appId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_appRegistry', internalType: 'address', type: 'address' },
      { name: '_forwarder', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'appId',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'appRegistry',
    outputs: [
      { name: '', internalType: 'contract IAppRegistry', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'forwarder', internalType: 'address', type: 'address' }],
    name: 'isTrustedForwarder',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_address', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'trustedForwarder',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RewardManagement
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rewardManagementAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_appId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_registry', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  { type: 'error', inputs: [], name: 'FailedCall' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'remarks',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'disbursedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AdditionalDisbursementToTask',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'by', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'ContractPaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'by', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'ContractUnpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'disbursedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DisbursementToParticipant',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'disbursedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DisbursementToTask',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'by', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'EtherWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'by', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'ParticipantRemovedFromWhitelist',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'by', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'ParticipantWhitelisted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TaskAssignmentAccepted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TaskAssignmentApplied',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'approver',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TaskAssignmentApproved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TaskAssignmentCompleted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'rejectedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'TaskAssignmentRejected',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'participant',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'verifier',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TaskAssignmentVerified',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'closedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TaskClosed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'createdBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TaskCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'updatedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TaskDetailsUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'remarks',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'transferredBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TokenTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'allocatedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TokensAllocatedToTask',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'OWNER',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PARTICIPANT',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'text', internalType: 'string', type: 'string' }],
    name: '_findHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'taskId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'participant', internalType: 'address', type: 'address' },
    ],
    name: 'acceptParticipant',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'taskId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'throwError', internalType: 'bool', type: 'bool' },
    ],
    name: 'addToWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'taskId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'treasuryAddress', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'allocateTokensToTask',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'app',
    outputs: [
      { name: '', internalType: 'contract IAppRegistry', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'appId',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'taskId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'participant', internalType: 'address', type: 'address' },
    ],
    name: 'approveTaskSubmission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'taskId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'closeTask',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'taskId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'completionUrl', internalType: 'string', type: 'string' },
    ],
    name: 'completeTask',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'taskId', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'task',
        internalType: 'struct ITaskManagement.Task',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'detailsUrl', internalType: 'string', type: 'string' },
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'expiryDate', internalType: 'uint256', type: 'uint256' },
          { name: 'rewardToken', internalType: 'address', type: 'address' },
          {
            name: 'totalRewardAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'isOpen', internalType: 'bool', type: 'bool' },
          { name: 'requireApproval', internalType: 'bool', type: 'bool' },
          { name: 'isWhitelisted', internalType: 'bool', type: 'bool' },
          { name: 'isTokenDisbursed', internalType: 'bool', type: 'bool' },
          { name: 'maxParticipants', internalType: 'uint256', type: 'uint256' },
          {
            name: 'acceptedParticipantCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'approvedParticipants',
            internalType: 'address[]',
            type: 'address[]',
          },
        ],
      },
      { name: 'treasuryAddress', internalType: 'address', type: 'address' },
      {
        name: '_whitelistParticipants',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    name: 'createTask',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'taskId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'remarks', internalType: 'string', type: 'string' },
    ],
    name: 'disburseAdditionalTokenToTaskParticipants',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'taskId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'disburseToSingleParticipant',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'taskId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'disburseTokensToTaskParticipants',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'taskId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'participant', internalType: 'address', type: 'address' },
    ],
    name: 'getParticipantTaskAssignment',
    outputs: [
      {
        name: '',
        internalType: 'struct ITaskManagement.TaskAssignment',
        type: 'tuple',
        components: [
          { name: 'participant', internalType: 'address', type: 'address' },
          {
            name: 'status',
            internalType: 'enum ITaskManagement.AssignmentStatus',
            type: 'uint8',
          },
          { name: 'completionUrl', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getTotalUnallocatedTokens',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'taskId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'isMaxParticipantsReached',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'taskId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'isTaskExpired',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'taskId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'isTaskOpen',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'isWhitelisted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'taskId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'participate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'taskId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'participant', internalType: 'address', type: 'address' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'rejectTaskSubmission',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'taskId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'participant', internalType: 'address', type: 'address' },
    ],
    name: 'removeFromWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'taskAssignments',
    outputs: [
      { name: 'participant', internalType: 'address', type: 'address' },
      {
        name: 'status',
        internalType: 'enum ITaskManagement.AssignmentStatus',
        type: 'uint8',
      },
      { name: 'completionUrl', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'tasks',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'detailsUrl', internalType: 'string', type: 'string' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'expiryDate', internalType: 'uint256', type: 'uint256' },
      { name: 'rewardToken', internalType: 'address', type: 'address' },
      { name: 'totalRewardAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'isOpen', internalType: 'bool', type: 'bool' },
      { name: 'requireApproval', internalType: 'bool', type: 'bool' },
      { name: 'isWhitelisted', internalType: 'bool', type: 'bool' },
      { name: 'isTokenDisbursed', internalType: 'bool', type: 'bool' },
      { name: 'maxParticipants', internalType: 'uint256', type: 'uint256' },
      {
        name: 'acceptedParticipantCount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'totalAllocatedTokens',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'remarks', internalType: 'string', type: 'string' },
    ],
    name: 'transferToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'taskId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'newDetailsUrl', internalType: 'string', type: 'string' },
      { name: 'newExpiryDate', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateTaskDetails',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address payable', type: 'address' }],
    name: 'withdrawEther',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RewardManagementFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rewardManagementFactoryAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'entityId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'entityOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnerAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'rewardManagement',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'registry',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'appId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'entityId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'RewardManagementCreated',
  },
  {
    type: 'function',
    inputs: [
      { name: 'entityId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'appId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'registry', internalType: 'address', type: 'address' },
      {
        name: 'entity',
        internalType: 'struct IRewardManagementFactory.Entity',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          {
            name: 'entityOwners',
            internalType: 'address[]',
            type: 'address[]',
          },
        ],
      },
    ],
    name: 'createRewardManagement',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'entities',
    outputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'entityId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getEntityOwners',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link appRegistryAbi}__
 */
export const useReadAppRegistry = /*#__PURE__*/ createUseReadContract({
  abi: appRegistryAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadAppRegistryDefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: appRegistryAbi,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"MAX_ADMINS_PER_ROLE"`
 */
export const useReadAppRegistryMaxAdminsPerRole =
  /*#__PURE__*/ createUseReadContract({
    abi: appRegistryAbi,
    functionName: 'MAX_ADMINS_PER_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"getAppDetails"`
 */
export const useReadAppRegistryGetAppDetails =
  /*#__PURE__*/ createUseReadContract({
    abi: appRegistryAbi,
    functionName: 'getAppDetails',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"getRoleAdmins"`
 */
export const useReadAppRegistryGetRoleAdmins =
  /*#__PURE__*/ createUseReadContract({
    abi: appRegistryAbi,
    functionName: 'getRoleAdmins',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadAppRegistryHasRole = /*#__PURE__*/ createUseReadContract({
  abi: appRegistryAbi,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"isAppAdmin"`
 */
export const useReadAppRegistryIsAppAdmin = /*#__PURE__*/ createUseReadContract(
  { abi: appRegistryAbi, functionName: 'isAppAdmin' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"isAppExists"`
 */
export const useReadAppRegistryIsAppExists =
  /*#__PURE__*/ createUseReadContract({
    abi: appRegistryAbi,
    functionName: 'isAppExists',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"isPrivate"`
 */
export const useReadAppRegistryIsPrivate = /*#__PURE__*/ createUseReadContract({
  abi: appRegistryAbi,
  functionName: 'isPrivate',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"isRoleAdmin"`
 */
export const useReadAppRegistryIsRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: appRegistryAbi,
    functionName: 'isRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadAppRegistrySupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: appRegistryAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link appRegistryAbi}__
 */
export const useWriteAppRegistry = /*#__PURE__*/ createUseWriteContract({
  abi: appRegistryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"createApp"`
 */
export const useWriteAppRegistryCreateApp =
  /*#__PURE__*/ createUseWriteContract({
    abi: appRegistryAbi,
    functionName: 'createApp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteAppRegistryGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: appRegistryAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"grantRoleAdmin"`
 */
export const useWriteAppRegistryGrantRoleAdmin =
  /*#__PURE__*/ createUseWriteContract({
    abi: appRegistryAbi,
    functionName: 'grantRoleAdmin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteAppRegistryRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: appRegistryAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"renounceRoleAdmin"`
 */
export const useWriteAppRegistryRenounceRoleAdmin =
  /*#__PURE__*/ createUseWriteContract({
    abi: appRegistryAbi,
    functionName: 'renounceRoleAdmin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteAppRegistryRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: appRegistryAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"revokeRoleAdmin"`
 */
export const useWriteAppRegistryRevokeRoleAdmin =
  /*#__PURE__*/ createUseWriteContract({
    abi: appRegistryAbi,
    functionName: 'revokeRoleAdmin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"setPrivate"`
 */
export const useWriteAppRegistrySetPrivate =
  /*#__PURE__*/ createUseWriteContract({
    abi: appRegistryAbi,
    functionName: 'setPrivate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"updateAppName"`
 */
export const useWriteAppRegistryUpdateAppName =
  /*#__PURE__*/ createUseWriteContract({
    abi: appRegistryAbi,
    functionName: 'updateAppName',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link appRegistryAbi}__
 */
export const useSimulateAppRegistry = /*#__PURE__*/ createUseSimulateContract({
  abi: appRegistryAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"createApp"`
 */
export const useSimulateAppRegistryCreateApp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: appRegistryAbi,
    functionName: 'createApp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateAppRegistryGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: appRegistryAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"grantRoleAdmin"`
 */
export const useSimulateAppRegistryGrantRoleAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: appRegistryAbi,
    functionName: 'grantRoleAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateAppRegistryRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: appRegistryAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"renounceRoleAdmin"`
 */
export const useSimulateAppRegistryRenounceRoleAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: appRegistryAbi,
    functionName: 'renounceRoleAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateAppRegistryRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: appRegistryAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"revokeRoleAdmin"`
 */
export const useSimulateAppRegistryRevokeRoleAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: appRegistryAbi,
    functionName: 'revokeRoleAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"setPrivate"`
 */
export const useSimulateAppRegistrySetPrivate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: appRegistryAbi,
    functionName: 'setPrivate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link appRegistryAbi}__ and `functionName` set to `"updateAppName"`
 */
export const useSimulateAppRegistryUpdateAppName =
  /*#__PURE__*/ createUseSimulateContract({
    abi: appRegistryAbi,
    functionName: 'updateAppName',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link appRegistryAbi}__
 */
export const useWatchAppRegistryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: appRegistryAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link appRegistryAbi}__ and `eventName` set to `"AppCreated"`
 */
export const useWatchAppRegistryAppCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: appRegistryAbi,
    eventName: 'AppCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link appRegistryAbi}__ and `eventName` set to `"AppNameUpdated"`
 */
export const useWatchAppRegistryAppNameUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: appRegistryAbi,
    eventName: 'AppNameUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link appRegistryAbi}__ and `eventName` set to `"AppPrivacyChanged"`
 */
export const useWatchAppRegistryAppPrivacyChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: appRegistryAbi,
    eventName: 'AppPrivacyChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link appRegistryAbi}__ and `eventName` set to `"RoleAdminGranted"`
 */
export const useWatchAppRegistryRoleAdminGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: appRegistryAbi,
    eventName: 'RoleAdminGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link appRegistryAbi}__ and `eventName` set to `"RoleAdminRevoked"`
 */
export const useWatchAppRegistryRoleAdminRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: appRegistryAbi,
    eventName: 'RoleAdminRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link appRegistryAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchAppRegistryRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: appRegistryAbi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link appRegistryAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchAppRegistryRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: appRegistryAbi,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__
 */
export const useReadRewardToken = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"MINTER_ROLE"`
 */
export const useReadRewardTokenMinterRole = /*#__PURE__*/ createUseReadContract(
  { abi: rewardTokenAbi, functionName: 'MINTER_ROLE' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadRewardTokenAllowance = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"appId"`
 */
export const useReadRewardTokenAppId = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
  functionName: 'appId',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"appRegistry"`
 */
export const useReadRewardTokenAppRegistry =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardTokenAbi,
    functionName: 'appRegistry',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadRewardTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadRewardTokenDecimals = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"isTrustedForwarder"`
 */
export const useReadRewardTokenIsTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardTokenAbi,
    functionName: 'isTrustedForwarder',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"name"`
 */
export const useReadRewardTokenName = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadRewardTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadRewardTokenTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardTokenAbi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"trustedForwarder"`
 */
export const useReadRewardTokenTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardTokenAbi,
    functionName: 'trustedForwarder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__
 */
export const useWriteRewardToken = /*#__PURE__*/ createUseWriteContract({
  abi: rewardTokenAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteRewardTokenApprove = /*#__PURE__*/ createUseWriteContract({
  abi: rewardTokenAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteRewardTokenBurn = /*#__PURE__*/ createUseWriteContract({
  abi: rewardTokenAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useWriteRewardTokenBurnFrom = /*#__PURE__*/ createUseWriteContract(
  { abi: rewardTokenAbi, functionName: 'burnFrom' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteRewardTokenMint = /*#__PURE__*/ createUseWriteContract({
  abi: rewardTokenAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteRewardTokenTransfer = /*#__PURE__*/ createUseWriteContract(
  { abi: rewardTokenAbi, functionName: 'transfer' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteRewardTokenTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardTokenAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__
 */
export const useSimulateRewardToken = /*#__PURE__*/ createUseSimulateContract({
  abi: rewardTokenAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateRewardTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardTokenAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateRewardTokenBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardTokenAbi,
    functionName: 'burn',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useSimulateRewardTokenBurnFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardTokenAbi,
    functionName: 'burnFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateRewardTokenMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardTokenAbi,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateRewardTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardTokenAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateRewardTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardTokenAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardTokenAbi}__
 */
export const useWatchRewardTokenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rewardTokenAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchRewardTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardTokenAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchRewardTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardTokenAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__
 */
export const useReadRewardManagement = /*#__PURE__*/ createUseReadContract({
  abi: rewardManagementAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"OWNER"`
 */
export const useReadRewardManagementOwner = /*#__PURE__*/ createUseReadContract(
  { abi: rewardManagementAbi, functionName: 'OWNER' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"PARTICIPANT"`
 */
export const useReadRewardManagementParticipant =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardManagementAbi,
    functionName: 'PARTICIPANT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"_findHash"`
 */
export const useReadRewardManagementFindHash =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardManagementAbi,
    functionName: '_findHash',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"app"`
 */
export const useReadRewardManagementApp = /*#__PURE__*/ createUseReadContract({
  abi: rewardManagementAbi,
  functionName: 'app',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"appId"`
 */
export const useReadRewardManagementAppId = /*#__PURE__*/ createUseReadContract(
  { abi: rewardManagementAbi, functionName: 'appId' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"getParticipantTaskAssignment"`
 */
export const useReadRewardManagementGetParticipantTaskAssignment =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardManagementAbi,
    functionName: 'getParticipantTaskAssignment',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"getTotalUnallocatedTokens"`
 */
export const useReadRewardManagementGetTotalUnallocatedTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardManagementAbi,
    functionName: 'getTotalUnallocatedTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"isMaxParticipantsReached"`
 */
export const useReadRewardManagementIsMaxParticipantsReached =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardManagementAbi,
    functionName: 'isMaxParticipantsReached',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"isTaskExpired"`
 */
export const useReadRewardManagementIsTaskExpired =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardManagementAbi,
    functionName: 'isTaskExpired',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"isTaskOpen"`
 */
export const useReadRewardManagementIsTaskOpen =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardManagementAbi,
    functionName: 'isTaskOpen',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"isWhitelisted"`
 */
export const useReadRewardManagementIsWhitelisted =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardManagementAbi,
    functionName: 'isWhitelisted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"name"`
 */
export const useReadRewardManagementName = /*#__PURE__*/ createUseReadContract({
  abi: rewardManagementAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"paused"`
 */
export const useReadRewardManagementPaused =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardManagementAbi,
    functionName: 'paused',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"taskAssignments"`
 */
export const useReadRewardManagementTaskAssignments =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardManagementAbi,
    functionName: 'taskAssignments',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"tasks"`
 */
export const useReadRewardManagementTasks = /*#__PURE__*/ createUseReadContract(
  { abi: rewardManagementAbi, functionName: 'tasks' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"totalAllocatedTokens"`
 */
export const useReadRewardManagementTotalAllocatedTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardManagementAbi,
    functionName: 'totalAllocatedTokens',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__
 */
export const useWriteRewardManagement = /*#__PURE__*/ createUseWriteContract({
  abi: rewardManagementAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"acceptParticipant"`
 */
export const useWriteRewardManagementAcceptParticipant =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'acceptParticipant',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"addToWhitelist"`
 */
export const useWriteRewardManagementAddToWhitelist =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'addToWhitelist',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"allocateTokensToTask"`
 */
export const useWriteRewardManagementAllocateTokensToTask =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'allocateTokensToTask',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"approveTaskSubmission"`
 */
export const useWriteRewardManagementApproveTaskSubmission =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'approveTaskSubmission',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"closeTask"`
 */
export const useWriteRewardManagementCloseTask =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'closeTask',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"completeTask"`
 */
export const useWriteRewardManagementCompleteTask =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'completeTask',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"createTask"`
 */
export const useWriteRewardManagementCreateTask =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'createTask',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"disburseAdditionalTokenToTaskParticipants"`
 */
export const useWriteRewardManagementDisburseAdditionalTokenToTaskParticipants =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'disburseAdditionalTokenToTaskParticipants',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"disburseToSingleParticipant"`
 */
export const useWriteRewardManagementDisburseToSingleParticipant =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'disburseToSingleParticipant',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"disburseTokensToTaskParticipants"`
 */
export const useWriteRewardManagementDisburseTokensToTaskParticipants =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'disburseTokensToTaskParticipants',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteRewardManagementMulticall =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"participate"`
 */
export const useWriteRewardManagementParticipate =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'participate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"pause"`
 */
export const useWriteRewardManagementPause =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"rejectTaskSubmission"`
 */
export const useWriteRewardManagementRejectTaskSubmission =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'rejectTaskSubmission',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"removeFromWhitelist"`
 */
export const useWriteRewardManagementRemoveFromWhitelist =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'removeFromWhitelist',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"transferToken"`
 */
export const useWriteRewardManagementTransferToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'transferToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"unpause"`
 */
export const useWriteRewardManagementUnpause =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"updateTaskDetails"`
 */
export const useWriteRewardManagementUpdateTaskDetails =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'updateTaskDetails',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"withdrawEther"`
 */
export const useWriteRewardManagementWithdrawEther =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementAbi,
    functionName: 'withdrawEther',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__
 */
export const useSimulateRewardManagement =
  /*#__PURE__*/ createUseSimulateContract({ abi: rewardManagementAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"acceptParticipant"`
 */
export const useSimulateRewardManagementAcceptParticipant =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'acceptParticipant',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"addToWhitelist"`
 */
export const useSimulateRewardManagementAddToWhitelist =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'addToWhitelist',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"allocateTokensToTask"`
 */
export const useSimulateRewardManagementAllocateTokensToTask =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'allocateTokensToTask',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"approveTaskSubmission"`
 */
export const useSimulateRewardManagementApproveTaskSubmission =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'approveTaskSubmission',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"closeTask"`
 */
export const useSimulateRewardManagementCloseTask =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'closeTask',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"completeTask"`
 */
export const useSimulateRewardManagementCompleteTask =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'completeTask',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"createTask"`
 */
export const useSimulateRewardManagementCreateTask =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'createTask',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"disburseAdditionalTokenToTaskParticipants"`
 */
export const useSimulateRewardManagementDisburseAdditionalTokenToTaskParticipants =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'disburseAdditionalTokenToTaskParticipants',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"disburseToSingleParticipant"`
 */
export const useSimulateRewardManagementDisburseToSingleParticipant =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'disburseToSingleParticipant',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"disburseTokensToTaskParticipants"`
 */
export const useSimulateRewardManagementDisburseTokensToTaskParticipants =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'disburseTokensToTaskParticipants',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateRewardManagementMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"participate"`
 */
export const useSimulateRewardManagementParticipate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'participate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"pause"`
 */
export const useSimulateRewardManagementPause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"rejectTaskSubmission"`
 */
export const useSimulateRewardManagementRejectTaskSubmission =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'rejectTaskSubmission',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"removeFromWhitelist"`
 */
export const useSimulateRewardManagementRemoveFromWhitelist =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'removeFromWhitelist',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"transferToken"`
 */
export const useSimulateRewardManagementTransferToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'transferToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"unpause"`
 */
export const useSimulateRewardManagementUnpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"updateTaskDetails"`
 */
export const useSimulateRewardManagementUpdateTaskDetails =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'updateTaskDetails',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementAbi}__ and `functionName` set to `"withdrawEther"`
 */
export const useSimulateRewardManagementWithdrawEther =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementAbi,
    functionName: 'withdrawEther',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__
 */
export const useWatchRewardManagementEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rewardManagementAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"AdditionalDisbursementToTask"`
 */
export const useWatchRewardManagementAdditionalDisbursementToTaskEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'AdditionalDisbursementToTask',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"ContractPaused"`
 */
export const useWatchRewardManagementContractPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'ContractPaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"ContractUnpaused"`
 */
export const useWatchRewardManagementContractUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'ContractUnpaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"DisbursementToParticipant"`
 */
export const useWatchRewardManagementDisbursementToParticipantEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'DisbursementToParticipant',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"DisbursementToTask"`
 */
export const useWatchRewardManagementDisbursementToTaskEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'DisbursementToTask',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"EtherWithdrawn"`
 */
export const useWatchRewardManagementEtherWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'EtherWithdrawn',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"ParticipantRemovedFromWhitelist"`
 */
export const useWatchRewardManagementParticipantRemovedFromWhitelistEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'ParticipantRemovedFromWhitelist',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"ParticipantWhitelisted"`
 */
export const useWatchRewardManagementParticipantWhitelistedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'ParticipantWhitelisted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"TaskAssignmentAccepted"`
 */
export const useWatchRewardManagementTaskAssignmentAcceptedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'TaskAssignmentAccepted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"TaskAssignmentApplied"`
 */
export const useWatchRewardManagementTaskAssignmentAppliedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'TaskAssignmentApplied',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"TaskAssignmentApproved"`
 */
export const useWatchRewardManagementTaskAssignmentApprovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'TaskAssignmentApproved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"TaskAssignmentCompleted"`
 */
export const useWatchRewardManagementTaskAssignmentCompletedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'TaskAssignmentCompleted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"TaskAssignmentRejected"`
 */
export const useWatchRewardManagementTaskAssignmentRejectedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'TaskAssignmentRejected',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"TaskAssignmentVerified"`
 */
export const useWatchRewardManagementTaskAssignmentVerifiedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'TaskAssignmentVerified',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"TaskClosed"`
 */
export const useWatchRewardManagementTaskClosedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'TaskClosed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"TaskCreated"`
 */
export const useWatchRewardManagementTaskCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'TaskCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"TaskDetailsUpdated"`
 */
export const useWatchRewardManagementTaskDetailsUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'TaskDetailsUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"TokenTransferred"`
 */
export const useWatchRewardManagementTokenTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'TokenTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementAbi}__ and `eventName` set to `"TokensAllocatedToTask"`
 */
export const useWatchRewardManagementTokensAllocatedToTaskEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementAbi,
    eventName: 'TokensAllocatedToTask',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementFactoryAbi}__
 */
export const useReadRewardManagementFactory =
  /*#__PURE__*/ createUseReadContract({ abi: rewardManagementFactoryAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementFactoryAbi}__ and `functionName` set to `"entities"`
 */
export const useReadRewardManagementFactoryEntities =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardManagementFactoryAbi,
    functionName: 'entities',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardManagementFactoryAbi}__ and `functionName` set to `"getEntityOwners"`
 */
export const useReadRewardManagementFactoryGetEntityOwners =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardManagementFactoryAbi,
    functionName: 'getEntityOwners',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementFactoryAbi}__
 */
export const useWriteRewardManagementFactory =
  /*#__PURE__*/ createUseWriteContract({ abi: rewardManagementFactoryAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardManagementFactoryAbi}__ and `functionName` set to `"createRewardManagement"`
 */
export const useWriteRewardManagementFactoryCreateRewardManagement =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardManagementFactoryAbi,
    functionName: 'createRewardManagement',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementFactoryAbi}__
 */
export const useSimulateRewardManagementFactory =
  /*#__PURE__*/ createUseSimulateContract({ abi: rewardManagementFactoryAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardManagementFactoryAbi}__ and `functionName` set to `"createRewardManagement"`
 */
export const useSimulateRewardManagementFactoryCreateRewardManagement =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardManagementFactoryAbi,
    functionName: 'createRewardManagement',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementFactoryAbi}__
 */
export const useWatchRewardManagementFactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rewardManagementFactoryAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementFactoryAbi}__ and `eventName` set to `"OwnerAdded"`
 */
export const useWatchRewardManagementFactoryOwnerAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementFactoryAbi,
    eventName: 'OwnerAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardManagementFactoryAbi}__ and `eventName` set to `"RewardManagementCreated"`
 */
export const useWatchRewardManagementFactoryRewardManagementCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardManagementFactoryAbi,
    eventName: 'RewardManagementCreated',
  })
