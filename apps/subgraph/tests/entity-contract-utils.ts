import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  PINGED,
  ParticiantApplied,
  TaskAccepted,
  TaskApproved,
  TaskCompleted,
  TaskCreated
} from "../generated/EntityContract/EntityContract"

export function createPINGEDEvent(sender: Address, timestamp: BigInt): PINGED {
  let pingedEvent = changetype<PINGED>(newMockEvent())

  pingedEvent.parameters = new Array()

  pingedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  pingedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return pingedEvent
}

export function createParticiantAppliedEvent(
  id: Bytes,
  participant: Address
): ParticiantApplied {
  let particiantAppliedEvent = changetype<ParticiantApplied>(newMockEvent())

  particiantAppliedEvent.parameters = new Array()

  particiantAppliedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  particiantAppliedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )

  return particiantAppliedEvent
}

export function createTaskAcceptedEvent(id: Bytes): TaskAccepted {
  let taskAcceptedEvent = changetype<TaskAccepted>(newMockEvent())

  taskAcceptedEvent.parameters = new Array()

  taskAcceptedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
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
