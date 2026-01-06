import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  AllocationsFrozen,
  AppContractUpdated,
  EmergencyWithdrawal,
  EntityDeactivated,
  EntityInitialized,
  EntityUpgraded,
  Initialized,
  OwnershipTransferred,
  ParticipantRemovedFromWhitelist,
  ParticipantWhitelisted,
  RewardsDistributed,
  TaskAssignmentAccepted,
  TaskAssignmentApplied,
  TaskAssignmentApproved,
  TaskAssignmentCompleted,
  TaskAssignmentRejected,
  TaskClosed,
  TaskCreated,
  TaskDetailsUpdated,
  TokensDeposited,
  TokensWithdrawn,
  Upgraded
} from "../generated/Entity/Entity"

export function createAllocationsFrozenEvent(by: Address): AllocationsFrozen {
  let allocationsFrozenEvent = changetype<AllocationsFrozen>(newMockEvent())

  allocationsFrozenEvent.parameters = new Array()

  allocationsFrozenEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return allocationsFrozenEvent
}

export function createAppContractUpdatedEvent(
  oldApp: Address,
  newApp: Address
): AppContractUpdated {
  let appContractUpdatedEvent = changetype<AppContractUpdated>(newMockEvent())

  appContractUpdatedEvent.parameters = new Array()

  appContractUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldApp", ethereum.Value.fromAddress(oldApp))
  )
  appContractUpdatedEvent.parameters.push(
    new ethereum.EventParam("newApp", ethereum.Value.fromAddress(newApp))
  )

  return appContractUpdatedEvent
}

export function createEmergencyWithdrawalEvent(
  token: Address,
  to: Address,
  amount: BigInt,
  by: Address
): EmergencyWithdrawal {
  let emergencyWithdrawalEvent = changetype<EmergencyWithdrawal>(newMockEvent())

  emergencyWithdrawalEvent.parameters = new Array()

  emergencyWithdrawalEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  emergencyWithdrawalEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  emergencyWithdrawalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  emergencyWithdrawalEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return emergencyWithdrawalEvent
}

export function createEntityDeactivatedEvent(by: Address): EntityDeactivated {
  let entityDeactivatedEvent = changetype<EntityDeactivated>(newMockEvent())

  entityDeactivatedEvent.parameters = new Array()

  entityDeactivatedEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return entityDeactivatedEvent
}

export function createEntityInitializedEvent(
  owner: Address,
  name: string
): EntityInitialized {
  let entityInitializedEvent = changetype<EntityInitialized>(newMockEvent())

  entityInitializedEvent.parameters = new Array()

  entityInitializedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  entityInitializedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return entityInitializedEvent
}

export function createEntityUpgradedEvent(
  newImplementation: Address
): EntityUpgraded {
  let entityUpgradedEvent = changetype<EntityUpgraded>(newMockEvent())

  entityUpgradedEvent.parameters = new Array()

  entityUpgradedEvent.parameters.push(
    new ethereum.EventParam(
      "newImplementation",
      ethereum.Value.fromAddress(newImplementation)
    )
  )

  return entityUpgradedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createParticipantRemovedFromWhitelistEvent(
  taskId: Bytes,
  participant: Address,
  by: Address
): ParticipantRemovedFromWhitelist {
  let participantRemovedFromWhitelistEvent =
    changetype<ParticipantRemovedFromWhitelist>(newMockEvent())

  participantRemovedFromWhitelistEvent.parameters = new Array()

  participantRemovedFromWhitelistEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromFixedBytes(taskId))
  )
  participantRemovedFromWhitelistEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  participantRemovedFromWhitelistEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return participantRemovedFromWhitelistEvent
}

export function createParticipantWhitelistedEvent(
  taskId: Bytes,
  participant: Address,
  by: Address
): ParticipantWhitelisted {
  let participantWhitelistedEvent =
    changetype<ParticipantWhitelisted>(newMockEvent())

  participantWhitelistedEvent.parameters = new Array()

  participantWhitelistedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromFixedBytes(taskId))
  )
  participantWhitelistedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  participantWhitelistedEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return participantWhitelistedEvent
}

export function createRewardsDistributedEvent(
  taskId: Bytes,
  totalAmount: BigInt,
  participantCount: BigInt
): RewardsDistributed {
  let rewardsDistributedEvent = changetype<RewardsDistributed>(newMockEvent())

  rewardsDistributedEvent.parameters = new Array()

  rewardsDistributedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromFixedBytes(taskId))
  )
  rewardsDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "totalAmount",
      ethereum.Value.fromUnsignedBigInt(totalAmount)
    )
  )
  rewardsDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "participantCount",
      ethereum.Value.fromUnsignedBigInt(participantCount)
    )
  )

  return rewardsDistributedEvent
}

export function createTaskAssignmentAcceptedEvent(
  id: Bytes,
  participant: Address
): TaskAssignmentAccepted {
  let taskAssignmentAcceptedEvent =
    changetype<TaskAssignmentAccepted>(newMockEvent())

  taskAssignmentAcceptedEvent.parameters = new Array()

  taskAssignmentAcceptedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskAssignmentAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )

  return taskAssignmentAcceptedEvent
}

export function createTaskAssignmentAppliedEvent(
  id: Bytes,
  participant: Address
): TaskAssignmentApplied {
  let taskAssignmentAppliedEvent =
    changetype<TaskAssignmentApplied>(newMockEvent())

  taskAssignmentAppliedEvent.parameters = new Array()

  taskAssignmentAppliedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskAssignmentAppliedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )

  return taskAssignmentAppliedEvent
}

export function createTaskAssignmentApprovedEvent(
  id: Bytes,
  approver: Address
): TaskAssignmentApproved {
  let taskAssignmentApprovedEvent =
    changetype<TaskAssignmentApproved>(newMockEvent())

  taskAssignmentApprovedEvent.parameters = new Array()

  taskAssignmentApprovedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskAssignmentApprovedEvent.parameters.push(
    new ethereum.EventParam("approver", ethereum.Value.fromAddress(approver))
  )

  return taskAssignmentApprovedEvent
}

export function createTaskAssignmentCompletedEvent(
  id: Bytes,
  participant: Address
): TaskAssignmentCompleted {
  let taskAssignmentCompletedEvent =
    changetype<TaskAssignmentCompleted>(newMockEvent())

  taskAssignmentCompletedEvent.parameters = new Array()

  taskAssignmentCompletedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskAssignmentCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )

  return taskAssignmentCompletedEvent
}

export function createTaskAssignmentRejectedEvent(
  id: Bytes,
  participant: Address,
  rejectedBy: Address,
  reason: string
): TaskAssignmentRejected {
  let taskAssignmentRejectedEvent =
    changetype<TaskAssignmentRejected>(newMockEvent())

  taskAssignmentRejectedEvent.parameters = new Array()

  taskAssignmentRejectedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskAssignmentRejectedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  taskAssignmentRejectedEvent.parameters.push(
    new ethereum.EventParam(
      "rejectedBy",
      ethereum.Value.fromAddress(rejectedBy)
    )
  )
  taskAssignmentRejectedEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )

  return taskAssignmentRejectedEvent
}

export function createTaskClosedEvent(
  id: Bytes,
  closedBy: Address
): TaskClosed {
  let taskClosedEvent = changetype<TaskClosed>(newMockEvent())

  taskClosedEvent.parameters = new Array()

  taskClosedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskClosedEvent.parameters.push(
    new ethereum.EventParam("closedBy", ethereum.Value.fromAddress(closedBy))
  )

  return taskClosedEvent
}

export function createTaskCreatedEvent(
  id: Bytes,
  createdBy: Address
): TaskCreated {
  let taskCreatedEvent = changetype<TaskCreated>(newMockEvent())

  taskCreatedEvent.parameters = new Array()

  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("createdBy", ethereum.Value.fromAddress(createdBy))
  )

  return taskCreatedEvent
}

export function createTaskDetailsUpdatedEvent(
  id: Bytes,
  updatedBy: Address
): TaskDetailsUpdated {
  let taskDetailsUpdatedEvent = changetype<TaskDetailsUpdated>(newMockEvent())

  taskDetailsUpdatedEvent.parameters = new Array()

  taskDetailsUpdatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskDetailsUpdatedEvent.parameters.push(
    new ethereum.EventParam("updatedBy", ethereum.Value.fromAddress(updatedBy))
  )

  return taskDetailsUpdatedEvent
}

export function createTokensDepositedEvent(
  token: Address,
  amount: BigInt,
  by: Address
): TokensDeposited {
  let tokensDepositedEvent = changetype<TokensDeposited>(newMockEvent())

  tokensDepositedEvent.parameters = new Array()

  tokensDepositedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  tokensDepositedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  tokensDepositedEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return tokensDepositedEvent
}

export function createTokensWithdrawnEvent(
  token: Address,
  to: Address,
  amount: BigInt,
  by: Address
): TokensWithdrawn {
  let tokensWithdrawnEvent = changetype<TokensWithdrawn>(newMockEvent())

  tokensWithdrawnEvent.parameters = new Array()

  tokensWithdrawnEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  tokensWithdrawnEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  tokensWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  tokensWithdrawnEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return tokensWithdrawnEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}
