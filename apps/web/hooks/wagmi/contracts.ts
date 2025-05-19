import {
  createUseReadContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
  createUseWriteContract,
} from "wagmi/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Access Manager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const accessManagerAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "error",
    inputs: [{ name: "target", internalType: "address", type: "address" }],
    name: "AddressEmptyCode",
  },
  { type: "error", inputs: [], name: "FailedCall" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "appId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "AppCreated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "appId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
      {
        name: "previousOwner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "newOwner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "OwnershipTransferred",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "appId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: false,
      },
      { name: "role", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "RoleGranted",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "appId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: false,
      },
      { name: "role", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "RoleRevoked",
  },
  {
    type: "function",
    inputs: [
      { name: "appId", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" },
    ],
    name: "createApp",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "appId", internalType: "bytes32", type: "bytes32" },
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "appId", internalType: "bytes32", type: "bytes32" },
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" },
    ],
    name: "hasRole",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "data", internalType: "bytes[]", type: "bytes[]" }],
    name: "multicall",
    outputs: [{ name: "results", internalType: "bytes[]", type: "bytes[]" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "appId", internalType: "bytes32", type: "bytes32" },
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "appId", internalType: "bytes32", type: "bytes32" },
      { name: "newOwner", internalType: "address", type: "address" },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EntityTaskManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const entityTaskManagerAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "aclAddress", internalType: "address", type: "address" },
      { name: "_appId", internalType: "bytes32", type: "bytes32" },
      { name: "_name", internalType: "string", type: "string" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "sender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "timestamp",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "PINGED",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "id", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "participant",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "ParticiantApplied",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "id", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "participant",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "TaskAccepted",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "id", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "approver",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "TaskApproved",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "id", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "participant",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "TaskCompleted",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "id", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "createdBy",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "TaskCreated",
  },
  {
    type: "function",
    inputs: [],
    name: "ENTITY_OWNER",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "PARTICIPANT",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "taskId", internalType: "bytes32", type: "bytes32" },
      { name: "participant", internalType: "address", type: "address" },
    ],
    name: "acceptParticipant",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "acl",
    outputs: [
      { name: "", internalType: "contract IAccessManagerV2", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "appId",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "taskId", internalType: "bytes32", type: "bytes32" }],
    name: "completeTask",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "task",
        internalType: "struct IEntityTaskManager.Task",
        type: "tuple",
        components: [
          { name: "detailsUrl", internalType: "string", type: "string" },
          { name: "rewardToken", internalType: "address", type: "address" },
          { name: "rewardAmount", internalType: "uint256", type: "uint256" },
          {
            name: "allowedWallets",
            internalType: "address[]",
            type: "address[]",
          },
          { name: "maxParticipants", internalType: "uint256", type: "uint256" },
          { name: "expiryDate", internalType: "uint256", type: "uint256" },
          { name: "owner", internalType: "address", type: "address" },
          { name: "isActive", internalType: "bool", type: "bool" },
        ],
      },
    ],
    name: "createTask",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "detailsUrl", internalType: "string", type: "string" }],
    name: "findHash",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [{ name: "taskId", internalType: "bytes32", type: "bytes32" }],
    name: "getAllowedWallets",
    outputs: [
      { name: "allowedWallets", internalType: "address[]", type: "address[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "taskId", internalType: "bytes32", type: "bytes32" }],
    name: "participate",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "ping",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "", internalType: "bytes32", type: "bytes32" },
      { name: "", internalType: "address", type: "address" },
    ],
    name: "taskAssignments",
    outputs: [
      {
        name: "",
        internalType: "enum IEntityTaskManager.STATUS",
        type: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    name: "tasks",
    outputs: [
      { name: "detailsUrl", internalType: "string", type: "string" },
      { name: "rewardToken", internalType: "address", type: "address" },
      { name: "rewardAmount", internalType: "uint256", type: "uint256" },
      { name: "maxParticipants", internalType: "uint256", type: "uint256" },
      { name: "expiryDate", internalType: "uint256", type: "uint256" },
      { name: "owner", internalType: "address", type: "address" },
      { name: "isActive", internalType: "bool", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "taskId", internalType: "bytes32", type: "bytes32" }],
    name: "verifyCompletion",
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Reward Token
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rewardTokenAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "_appId", internalType: "bytes32", type: "bytes32" },
      { name: "_name", internalType: "string", type: "string" },
      { name: "_symbol", internalType: "string", type: "string" },
      { name: "_decimals", internalType: "uint8", type: "uint8" },
      { name: "_accessManager", internalType: "address", type: "address" },
      { name: "_forwarder", internalType: "address", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "error",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "allowance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC20InsufficientAllowance",
  },
  {
    type: "error",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "balance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC20InsufficientBalance",
  },
  {
    type: "error",
    inputs: [{ name: "approver", internalType: "address", type: "address" }],
    name: "ERC20InvalidApprover",
  },
  {
    type: "error",
    inputs: [{ name: "receiver", internalType: "address", type: "address" }],
    name: "ERC20InvalidReceiver",
  },
  {
    type: "error",
    inputs: [{ name: "sender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSender",
  },
  {
    type: "error",
    inputs: [{ name: "spender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSpender",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "spender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Transfer",
  },
  {
    type: "function",
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "accessManager",
    outputs: [
      { name: "", internalType: "contract IAccessManagerV2", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "appId",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "value", internalType: "uint256", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "forwarder", internalType: "address", type: "address" }],
    name: "isTrustedForwarder",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_address", internalType: "address", type: "address" },
      { name: "_amount", internalType: "uint256", type: "uint256" },
    ],
    name: "mint",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "trustedForwarder",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__
 */
export const useReadAccessManager = /*#__PURE__*/ createUseReadContract({
  abi: accessManagerAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadAccessManagerHasRole = /*#__PURE__*/ createUseReadContract({
  abi: accessManagerAbi,
  functionName: "hasRole",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__
 */
export const useWriteAccessManager = /*#__PURE__*/ createUseWriteContract({
  abi: accessManagerAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"createApp"`
 */
export const useWriteAccessManagerCreateApp =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: "createApp",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteAccessManagerGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: "grantRole",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteAccessManagerMulticall =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: "multicall",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteAccessManagerRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: "revokeRole",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteAccessManagerTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: "transferOwnership",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__
 */
export const useSimulateAccessManager = /*#__PURE__*/ createUseSimulateContract(
  { abi: accessManagerAbi },
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"createApp"`
 */
export const useSimulateAccessManagerCreateApp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: "createApp",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateAccessManagerGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: "grantRole",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateAccessManagerMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: "multicall",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateAccessManagerRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: "revokeRole",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateAccessManagerTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: "transferOwnership",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__
 */
export const useWatchAccessManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: accessManagerAbi });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"AppCreated"`
 */
export const useWatchAccessManagerAppCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: "AppCreated",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchAccessManagerOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: "OwnershipTransferred",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchAccessManagerRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: "RoleGranted",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchAccessManagerRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: "RoleRevoked",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link entityTaskManagerAbi}__
 */
export const useReadEntityTaskManager = /*#__PURE__*/ createUseReadContract({
  abi: entityTaskManagerAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"ENTITY_OWNER"`
 */
export const useReadEntityTaskManagerEntityOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: entityTaskManagerAbi,
    functionName: "ENTITY_OWNER",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"PARTICIPANT"`
 */
export const useReadEntityTaskManagerParticipant =
  /*#__PURE__*/ createUseReadContract({
    abi: entityTaskManagerAbi,
    functionName: "PARTICIPANT",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"acl"`
 */
export const useReadEntityTaskManagerAcl = /*#__PURE__*/ createUseReadContract({
  abi: entityTaskManagerAbi,
  functionName: "acl",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"appId"`
 */
export const useReadEntityTaskManagerAppId =
  /*#__PURE__*/ createUseReadContract({
    abi: entityTaskManagerAbi,
    functionName: "appId",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"findHash"`
 */
export const useReadEntityTaskManagerFindHash =
  /*#__PURE__*/ createUseReadContract({
    abi: entityTaskManagerAbi,
    functionName: "findHash",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"getAllowedWallets"`
 */
export const useReadEntityTaskManagerGetAllowedWallets =
  /*#__PURE__*/ createUseReadContract({
    abi: entityTaskManagerAbi,
    functionName: "getAllowedWallets",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"name"`
 */
export const useReadEntityTaskManagerName = /*#__PURE__*/ createUseReadContract(
  { abi: entityTaskManagerAbi, functionName: "name" },
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"taskAssignments"`
 */
export const useReadEntityTaskManagerTaskAssignments =
  /*#__PURE__*/ createUseReadContract({
    abi: entityTaskManagerAbi,
    functionName: "taskAssignments",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"tasks"`
 */
export const useReadEntityTaskManagerTasks =
  /*#__PURE__*/ createUseReadContract({
    abi: entityTaskManagerAbi,
    functionName: "tasks",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link entityTaskManagerAbi}__
 */
export const useWriteEntityTaskManager = /*#__PURE__*/ createUseWriteContract({
  abi: entityTaskManagerAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"acceptParticipant"`
 */
export const useWriteEntityTaskManagerAcceptParticipant =
  /*#__PURE__*/ createUseWriteContract({
    abi: entityTaskManagerAbi,
    functionName: "acceptParticipant",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"completeTask"`
 */
export const useWriteEntityTaskManagerCompleteTask =
  /*#__PURE__*/ createUseWriteContract({
    abi: entityTaskManagerAbi,
    functionName: "completeTask",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"createTask"`
 */
export const useWriteEntityTaskManagerCreateTask =
  /*#__PURE__*/ createUseWriteContract({
    abi: entityTaskManagerAbi,
    functionName: "createTask",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"participate"`
 */
export const useWriteEntityTaskManagerParticipate =
  /*#__PURE__*/ createUseWriteContract({
    abi: entityTaskManagerAbi,
    functionName: "participate",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"ping"`
 */
export const useWriteEntityTaskManagerPing =
  /*#__PURE__*/ createUseWriteContract({
    abi: entityTaskManagerAbi,
    functionName: "ping",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"verifyCompletion"`
 */
export const useWriteEntityTaskManagerVerifyCompletion =
  /*#__PURE__*/ createUseWriteContract({
    abi: entityTaskManagerAbi,
    functionName: "verifyCompletion",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link entityTaskManagerAbi}__
 */
export const useSimulateEntityTaskManager =
  /*#__PURE__*/ createUseSimulateContract({ abi: entityTaskManagerAbi });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"acceptParticipant"`
 */
export const useSimulateEntityTaskManagerAcceptParticipant =
  /*#__PURE__*/ createUseSimulateContract({
    abi: entityTaskManagerAbi,
    functionName: "acceptParticipant",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"completeTask"`
 */
export const useSimulateEntityTaskManagerCompleteTask =
  /*#__PURE__*/ createUseSimulateContract({
    abi: entityTaskManagerAbi,
    functionName: "completeTask",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"createTask"`
 */
export const useSimulateEntityTaskManagerCreateTask =
  /*#__PURE__*/ createUseSimulateContract({
    abi: entityTaskManagerAbi,
    functionName: "createTask",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"participate"`
 */
export const useSimulateEntityTaskManagerParticipate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: entityTaskManagerAbi,
    functionName: "participate",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"ping"`
 */
export const useSimulateEntityTaskManagerPing =
  /*#__PURE__*/ createUseSimulateContract({
    abi: entityTaskManagerAbi,
    functionName: "ping",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `functionName` set to `"verifyCompletion"`
 */
export const useSimulateEntityTaskManagerVerifyCompletion =
  /*#__PURE__*/ createUseSimulateContract({
    abi: entityTaskManagerAbi,
    functionName: "verifyCompletion",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link entityTaskManagerAbi}__
 */
export const useWatchEntityTaskManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: entityTaskManagerAbi });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `eventName` set to `"PINGED"`
 */
export const useWatchEntityTaskManagerPingedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: entityTaskManagerAbi,
    eventName: "PINGED",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `eventName` set to `"ParticiantApplied"`
 */
export const useWatchEntityTaskManagerParticiantAppliedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: entityTaskManagerAbi,
    eventName: "ParticiantApplied",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `eventName` set to `"TaskAccepted"`
 */
export const useWatchEntityTaskManagerTaskAcceptedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: entityTaskManagerAbi,
    eventName: "TaskAccepted",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `eventName` set to `"TaskApproved"`
 */
export const useWatchEntityTaskManagerTaskApprovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: entityTaskManagerAbi,
    eventName: "TaskApproved",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `eventName` set to `"TaskCompleted"`
 */
export const useWatchEntityTaskManagerTaskCompletedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: entityTaskManagerAbi,
    eventName: "TaskCompleted",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link entityTaskManagerAbi}__ and `eventName` set to `"TaskCreated"`
 */
export const useWatchEntityTaskManagerTaskCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: entityTaskManagerAbi,
    eventName: "TaskCreated",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__
 */
export const useReadRewardToken = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"MINTER_ROLE"`
 */
export const useReadRewardTokenMinterRole = /*#__PURE__*/ createUseReadContract(
  { abi: rewardTokenAbi, functionName: "MINTER_ROLE" },
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"accessManager"`
 */
export const useReadRewardTokenAccessManager =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardTokenAbi,
    functionName: "accessManager",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadRewardTokenAllowance = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
  functionName: "allowance",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"appId"`
 */
export const useReadRewardTokenAppId = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
  functionName: "appId",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadRewardTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadRewardTokenDecimals = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
  functionName: "decimals",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"isTrustedForwarder"`
 */
export const useReadRewardTokenIsTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardTokenAbi,
    functionName: "isTrustedForwarder",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"name"`
 */
export const useReadRewardTokenName = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
  functionName: "name",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadRewardTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: rewardTokenAbi,
  functionName: "symbol",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadRewardTokenTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardTokenAbi,
    functionName: "totalSupply",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"trustedForwarder"`
 */
export const useReadRewardTokenTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: rewardTokenAbi,
    functionName: "trustedForwarder",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__
 */
export const useWriteRewardToken = /*#__PURE__*/ createUseWriteContract({
  abi: rewardTokenAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteRewardTokenApprove = /*#__PURE__*/ createUseWriteContract({
  abi: rewardTokenAbi,
  functionName: "approve",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteRewardTokenBurn = /*#__PURE__*/ createUseWriteContract({
  abi: rewardTokenAbi,
  functionName: "burn",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useWriteRewardTokenBurnFrom = /*#__PURE__*/ createUseWriteContract(
  { abi: rewardTokenAbi, functionName: "burnFrom" },
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteRewardTokenMint = /*#__PURE__*/ createUseWriteContract({
  abi: rewardTokenAbi,
  functionName: "mint",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteRewardTokenTransfer = /*#__PURE__*/ createUseWriteContract(
  { abi: rewardTokenAbi, functionName: "transfer" },
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteRewardTokenTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardTokenAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__
 */
export const useSimulateRewardToken = /*#__PURE__*/ createUseSimulateContract({
  abi: rewardTokenAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateRewardTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardTokenAbi,
    functionName: "approve",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateRewardTokenBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardTokenAbi,
    functionName: "burn",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useSimulateRewardTokenBurnFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardTokenAbi,
    functionName: "burnFrom",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateRewardTokenMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardTokenAbi,
    functionName: "mint",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateRewardTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardTokenAbi,
    functionName: "transfer",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateRewardTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardTokenAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardTokenAbi}__
 */
export const useWatchRewardTokenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rewardTokenAbi });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchRewardTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardTokenAbi,
    eventName: "Approval",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rewardTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchRewardTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rewardTokenAbi,
    eventName: "Transfer",
  });
