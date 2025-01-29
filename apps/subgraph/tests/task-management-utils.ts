import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  ParticiantApplied,
  TaskAccepted,
  TaskApproved,
  TaskCompleted,
  TaskCreated
} from "../generated/TaskManagement/TaskManagement"

export function createParticiantAppliedEvent(
  id: string,
  participant: Address
): ParticiantApplied {
  let particiantAppliedEvent = changetype<ParticiantApplied>(newMockEvent())

  particiantAppliedEvent.parameters = new Array()

  particiantAppliedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )
  particiantAppliedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )

  return particiantAppliedEvent
}

export function createTaskAcceptedEvent(id: string): TaskAccepted {
  let taskAcceptedEvent = changetype<TaskAccepted>(newMockEvent())

  taskAcceptedEvent.parameters = new Array()

  taskAcceptedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )

  return taskAcceptedEvent
}

export function createTaskApprovedEvent(
  id: string,
  approver: Address
): TaskApproved {
  let taskApprovedEvent = changetype<TaskApproved>(newMockEvent())

  taskApprovedEvent.parameters = new Array()

  taskApprovedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )
  taskApprovedEvent.parameters.push(
    new ethereum.EventParam("approver", ethereum.Value.fromAddress(approver))
  )

  return taskApprovedEvent
}

export function createTaskCompletedEvent(
  id: string,
  participant: Address
): TaskCompleted {
  let taskCompletedEvent = changetype<TaskCompleted>(newMockEvent())

  taskCompletedEvent.parameters = new Array()

  taskCompletedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
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
  id: string,
  createdBy: Address
): TaskCreated {
  let taskCreatedEvent = changetype<TaskCreated>(newMockEvent())

  taskCreatedEvent.parameters = new Array()

  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("createdBy", ethereum.Value.fromAddress(createdBy))
  )

  return taskCreatedEvent
}
