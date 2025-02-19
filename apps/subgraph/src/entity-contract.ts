import {
  ParticiantApplied as ParticiantAppliedEvent,
  TaskAccepted as TaskAcceptedEvent,
  TaskApproved as TaskApprovedEvent,
  TaskCompleted as TaskCompletedEvent,
  TaskCreated as TaskCreatedEvent,
} from "../generated/EntityContract/EntityContract"
import {
  ParticiantApplied,
  TaskAccepted,
  TaskApproved,
  TaskCompleted,
  TaskCreated,
} from "../generated/schema"
import { Bytes } from "@graphprotocol/graph-ts"

export function handleParticiantApplied(event: ParticiantAppliedEvent): void {
  let entity = new ParticiantApplied(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.internal_id = event.params.id
  entity.participant = event.params.participant

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskAccepted(event: TaskAcceptedEvent): void {
  let entity = new TaskAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.internal_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskApproved(event: TaskApprovedEvent): void {
  let entity = new TaskApproved(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.internal_id = event.params.id
  entity.approver = event.params.approver

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskCompleted(event: TaskCompletedEvent): void {
  let entity = new TaskCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.internal_id = event.params.id
  entity.participant = event.params.participant

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskCreated(event: TaskCreatedEvent): void {
  let entity = new TaskCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.internal_id = event.params.id
  entity.createdBy = event.params.createdBy
  entity.detailsUrl = event.params.detailsUrl
  entity.rewardToken = event.params.rewardToken
  entity.rewardAmount = event.params.rewardAmount
  entity.allowedWallets = changetype<Bytes[]>(event.params.allowedWallets)
  entity.maxParticipants = event.params.maxParticipants
  entity.expiryDate = event.params.expiryDate
  entity.owner = event.params.owner
  entity.isActive = event.params.isActive

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
