import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AdditionalDisbursementToTask,
  ContractPaused,
  ContractUnpaused,
  DisbursementToParticipant,
  DisbursementToTask,
  EtherWithdrawn,
  ParticipantRemovedFromWhitelist,
  ParticipantWhitelisted,
  TaskAssignmentAccepted,
  TaskAssignmentApplied,
  TaskAssignmentApproved,
  TaskAssignmentCompleted,
  TaskAssignmentRejected,
  TaskAssignmentVerified,
  TaskClosed,
  TaskCreated,
  TaskDetailsUpdated,
  TokenTransferred,
  TokensAllocatedToTask
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

export function createDisbursementToParticipantEvent(
  taskId: Bytes,
  amount: BigInt,
  participant: Address,
  disbursedBy: Address
): DisbursementToParticipant {
  let disbursementToParticipantEvent =
    changetype<DisbursementToParticipant>(newMockEvent())

  disbursementToParticipantEvent.parameters = new Array()

  disbursementToParticipantEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromFixedBytes(taskId))
  )
  disbursementToParticipantEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  disbursementToParticipantEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  disbursementToParticipantEvent.parameters.push(
    new ethereum.EventParam(
      "disbursedBy",
      ethereum.Value.fromAddress(disbursedBy)
    )
  )

  return disbursementToParticipantEvent
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

export function createTaskAssignmentVerifiedEvent(
  id: Bytes,
  participant: Address,
  verifier: Address
): TaskAssignmentVerified {
  let taskAssignmentVerifiedEvent =
    changetype<TaskAssignmentVerified>(newMockEvent())

  taskAssignmentVerifiedEvent.parameters = new Array()

  taskAssignmentVerifiedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  taskAssignmentVerifiedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  taskAssignmentVerifiedEvent.parameters.push(
    new ethereum.EventParam("verifier", ethereum.Value.fromAddress(verifier))
  )

  return taskAssignmentVerifiedEvent
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

export function createTokensAllocatedToTaskEvent(
  taskId: Bytes,
  token: Address,
  amount: BigInt,
  allocatedBy: Address
): TokensAllocatedToTask {
  let tokensAllocatedToTaskEvent =
    changetype<TokensAllocatedToTask>(newMockEvent())

  tokensAllocatedToTaskEvent.parameters = new Array()

  tokensAllocatedToTaskEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromFixedBytes(taskId))
  )
  tokensAllocatedToTaskEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  tokensAllocatedToTaskEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  tokensAllocatedToTaskEvent.parameters.push(
    new ethereum.EventParam(
      "allocatedBy",
      ethereum.Value.fromAddress(allocatedBy)
    )
  )

  return tokensAllocatedToTaskEvent
}
