import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AdditionalDisbursementToTask,
  ContractPaused,
  ContractUnpaused,
  DisbursementToTask,
  EtherWithdrawn,
  ParticipantApplied,
  ParticipantRemovedFromWhitelist,
  ParticipantWhitelisted,
  TaskAccepted,
  TaskApproved,
  TaskClosed,
  TaskCompleted,
  TaskCreated,
  TaskDetailsUpdated,
  TaskRejected,
  TaskVerified,
  TokenTransferred
} from "../generated/RewardManagement/RewardManagement"

export function createAdditionalDisbursementToTaskEvent(
  taskId: Bytes,
  amount: BigInt,
  remarks: string,
  disbursedBy: Address
): AdditionalDisbursementToTask {
  let additionalDisbursementToTaskEvent =
    changetype<AdditionalDisbursementToTask>(newMockEvent())

  additionalDisbursementToTaskEvent.parameters = new Array()

  additionalDisbursementToTaskEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromFixedBytes(taskId))
  )
  additionalDisbursementToTaskEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  additionalDisbursementToTaskEvent.parameters.push(
    new ethereum.EventParam("remarks", ethereum.Value.fromString(remarks))
  )
  additionalDisbursementToTaskEvent.parameters.push(
    new ethereum.EventParam(
      "disbursedBy",
      ethereum.Value.fromAddress(disbursedBy)
    )
  )

  return additionalDisbursementToTaskEvent
}

export function createContractPausedEvent(by: Address): ContractPaused {
  let contractPausedEvent = changetype<ContractPaused>(newMockEvent())

  contractPausedEvent.parameters = new Array()

  contractPausedEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return contractPausedEvent
}

export function createContractUnpausedEvent(by: Address): ContractUnpaused {
  let contractUnpausedEvent = changetype<ContractUnpaused>(newMockEvent())

  contractUnpausedEvent.parameters = new Array()

  contractUnpausedEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return contractUnpausedEvent
}

export function createDisbursementToTaskEvent(
  taskId: Bytes,
  amount: BigInt,
  disbursedBy: Address
): DisbursementToTask {
  let disbursementToTaskEvent = changetype<DisbursementToTask>(newMockEvent())

  disbursementToTaskEvent.parameters = new Array()

  disbursementToTaskEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromFixedBytes(taskId))
  )
  disbursementToTaskEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  disbursementToTaskEvent.parameters.push(
    new ethereum.EventParam(
      "disbursedBy",
      ethereum.Value.fromAddress(disbursedBy)
    )
  )

  return disbursementToTaskEvent
}

export function createEtherWithdrawnEvent(
  to: Address,
  amount: BigInt,
  by: Address
): EtherWithdrawn {
  let etherWithdrawnEvent = changetype<EtherWithdrawn>(newMockEvent())

  etherWithdrawnEvent.parameters = new Array()

  etherWithdrawnEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  etherWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  etherWithdrawnEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return etherWithdrawnEvent
}

export function createParticipantAppliedEvent(
  id: Bytes,
  participant: Address
): ParticipantApplied {
  let participantAppliedEvent = changetype<ParticipantApplied>(newMockEvent())

  participantAppliedEvent.parameters = new Array()

  participantAppliedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  participantAppliedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )

  return participantAppliedEvent
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

export function createTaskAcceptedEvent(
  id: Bytes,
  participant: Address
): TaskAccepted {
  let taskAcceptedEvent = changetype<TaskAccepted>(newMockEvent())

  taskAcceptedEvent.parameters = new Array()

  taskAcceptedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )

  return taskAcceptedEvent
}

export function createTaskApprovedEvent(
  id: Bytes,
  approver: Address
): TaskApproved {
  let taskApprovedEvent = changetype<TaskApproved>(newMockEvent())

  taskApprovedEvent.parameters = new Array()

  taskApprovedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskApprovedEvent.parameters.push(
    new ethereum.EventParam("approver", ethereum.Value.fromAddress(approver))
  )

  return taskApprovedEvent
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

export function createTaskCompletedEvent(
  id: Bytes,
  participant: Address
): TaskCompleted {
  let taskCompletedEvent = changetype<TaskCompleted>(newMockEvent())

  taskCompletedEvent.parameters = new Array()

  taskCompletedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )

  return taskCompletedEvent
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

export function createTaskRejectedEvent(
  id: Bytes,
  participant: Address,
  rejectedBy: Address,
  reason: string
): TaskRejected {
  let taskRejectedEvent = changetype<TaskRejected>(newMockEvent())

  taskRejectedEvent.parameters = new Array()

  taskRejectedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskRejectedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  taskRejectedEvent.parameters.push(
    new ethereum.EventParam(
      "rejectedBy",
      ethereum.Value.fromAddress(rejectedBy)
    )
  )
  taskRejectedEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )

  return taskRejectedEvent
}

export function createTaskVerifiedEvent(
  id: Bytes,
  participant: Address,
  verifier: Address
): TaskVerified {
  let taskVerifiedEvent = changetype<TaskVerified>(newMockEvent())

  taskVerifiedEvent.parameters = new Array()

  taskVerifiedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskVerifiedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  taskVerifiedEvent.parameters.push(
    new ethereum.EventParam("verifier", ethereum.Value.fromAddress(verifier))
  )

  return taskVerifiedEvent
}

export function createTokenTransferredEvent(
  token: Address,
  to: Address,
  amount: BigInt,
  remarks: string,
  transferredBy: Address
): TokenTransferred {
  let tokenTransferredEvent = changetype<TokenTransferred>(newMockEvent())

  tokenTransferredEvent.parameters = new Array()

  tokenTransferredEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  tokenTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  tokenTransferredEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  tokenTransferredEvent.parameters.push(
    new ethereum.EventParam("remarks", ethereum.Value.fromString(remarks))
  )
  tokenTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "transferredBy",
      ethereum.Value.fromAddress(transferredBy)
    )
  )

  return tokenTransferredEvent
}
