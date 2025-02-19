import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ParticiantApplied,
  TaskAccepted,
  TaskApproved,
  TaskCompleted,
  TaskCreated
} from "../generated/EntityContract/EntityContract"

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
  createdBy: Address,
  detailsUrl: string,
  rewardToken: Address,
  rewardAmount: BigInt,
  allowedWallets: Array<Address>,
  maxParticipants: BigInt,
  expiryDate: BigInt,
  owner: Address,
  isActive: boolean
): TaskCreated {
  let taskCreatedEvent = changetype<TaskCreated>(newMockEvent())

  taskCreatedEvent.parameters = new Array()

  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("createdBy", ethereum.Value.fromAddress(createdBy))
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("detailsUrl", ethereum.Value.fromString(detailsUrl))
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "rewardToken",
      ethereum.Value.fromAddress(rewardToken)
    )
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "rewardAmount",
      ethereum.Value.fromUnsignedBigInt(rewardAmount)
    )
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "allowedWallets",
      ethereum.Value.fromAddressArray(allowedWallets)
    )
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "maxParticipants",
      ethereum.Value.fromUnsignedBigInt(maxParticipants)
    )
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "expiryDate",
      ethereum.Value.fromUnsignedBigInt(expiryDate)
    )
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("isActive", ethereum.Value.fromBoolean(isActive))
  )

  return taskCreatedEvent
}
