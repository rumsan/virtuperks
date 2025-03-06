import {
  PINGED,
  ParticiantApplied,
  TaskAccepted,
  TaskApproved,
  TaskCompleted,
  TaskCreated
} from "../generated/schema"
import {
  PINGED as PINGEDEvent,
  ParticiantApplied as ParticiantAppliedEvent,
  TaskAccepted as TaskAcceptedEvent,
  TaskApproved as TaskApprovedEvent,
  TaskCompleted as TaskCompletedEvent,
  TaskCreated as TaskCreatedEvent,
} from "../generated/templates/EntityContract/EntityContract"
import { fetchTaskDetails } from "./utils"

export function handlePINGED(event: PINGEDEvent): void {
  let entity = new PINGED(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.sender = event.params.sender
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

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

//   let entity = EntityTaskManagerCreated.load(event.address);
  
//   log.info('EntityTaskManager', [event.address.toHexString()]);
// if (!entity) {
//   log.error("EntityTaskManagerCreated not found for address: {}", [event.address.toHexString()]);
//   return;
// }
//   log.info('TaskCreated event fired', [entity.id.toHexString()]);
//   log.info('id of tasks',[event.params.id.toHexString()])
  let taskId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let task = new TaskCreated(taskId);
  task.internal_id = event.params.id
  task.createdBy = event.params.createdBy

  task.blockNumber = event.block.number
  task.blockTimestamp = event.block.timestamp
  task.transactionHash = event.transaction.hash

  task.save()
  fetchTaskDetails(event.params.id, event.address);

}
