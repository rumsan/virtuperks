import { log } from "@graphprotocol/graph-ts"
import {
  EntityTaskManagerCreated,
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
  let participant = new ParticiantApplied(
    event.params.id
  )
   participant.internal_id = event.params.id
  participant.participant = event.params.participant

  participant.blockNumber = event.block.number
  participant.blockTimestamp = event.block.timestamp
  participant.transactionHash = event.transaction.hash
  participant.status = 'UNACCEPTED'
  
  


  //  let entity = EntityTaskManagerCreated.load(event.address);
 
  
  let taskDetail = fetchTaskDetails(event.params.id, event.address, event.params.id);
  if (taskDetail) {
    participant.taskDetail = taskDetail.id;
    log.info("TaskDetail saved: {}", [taskDetail.id.toHexString()]);
  } else {
    log.error("Failed to fetch TaskDetail for task ID: {}", [event.params.id.toHexString()]);
  }
 participant.save()
}

export function handleTaskAccepted(event: TaskAcceptedEvent): void {
  let entity = new TaskAccepted(
   event.params.id
  )
  entity.internal_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.status = 'ACCEPTED'
    let taskDetail = fetchTaskDetails(event.params.id, event.address, event.params.id);
  if (taskDetail) {
    entity.taskDetail = taskDetail.id;
    log.info("TaskDetail saved: {}", [taskDetail.id.toHexString()]);
  } else {
    log.error("Failed to fetch TaskDetail for task ID: {}", [event.params.id.toHexString()]);
  }


  entity.save()
}

export function handleTaskApproved(event: TaskApprovedEvent): void {
  let entity = new TaskApproved(
   event.params.id
  )
  entity.internal_id = event.params.id
  entity.approver = event.params.approver

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.status = 'VERIFIED'
   let taskDetail = fetchTaskDetails(event.params.id, event.address, event.params.id);
  if (taskDetail) {
    entity.taskDetail = taskDetail.id;
    log.info("TaskDetail saved: {}", [taskDetail.id.toHexString()]);
  } else {
    log.error("Failed to fetch TaskDetail for task ID: {}", [event.params.id.toHexString()]);
  }


  entity.save()
}

export function handleTaskCompleted(event: TaskCompletedEvent): void {
  let entity = new TaskCompleted(
    event.params.id
  )
  entity.internal_id = event.params.id
  entity.participant = event.params.participant

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.status = 'COMPLETED'

   let taskDetail = fetchTaskDetails(event.params.id, event.address, event.params.id);
  if (taskDetail) {
    entity.taskDetail = taskDetail.id;
    log.info("TaskDetail saved: {}", [taskDetail.id.toHexString()]);
  } else {
    log.error("Failed to fetch TaskDetail for task ID: {}", [event.params.id.toHexString()]);
  }

  entity.save()

  
}

export function handleTaskCreated(event: TaskCreatedEvent): void {
  


  log.info('TaskCreated event fired: {}', [event.address.toHexString()]);

  

  //let taskId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let task = new TaskCreated(event.params.id);
  task.internal_id = event.params.id
  task.createdBy = event.params.createdBy

  task.blockNumber = event.block.number
  task.blockTimestamp = event.block.timestamp
  task.transactionHash = event.transaction.hash
  // task.entityTaskManager = event.address;

  

  // Optionally link the task to an EntityTaskManagerCreated entity
  let entity = EntityTaskManagerCreated.load(event.address);
 
  if (entity) {
    
    task.entityTaskManager = entity.id
    log.info("Linked TaskCreated to EntityTaskManagerCreated: {}", [entity.id.toHexString()]);
  } else {
    log.info("No EntityTaskManagerCreated found for address: {}", [event.address.toHexString()]);
  }
  
  let taskDetail = fetchTaskDetails(event.params.id, event.address, event.params.id);
  if (taskDetail) {
    task.taskDetail = taskDetail.id;
    log.info("TaskDetail saved: {}", [taskDetail.id.toHexString()]);
  } else {
    log.error("Failed to fetch TaskDetail for task ID: {}", [event.params.id.toHexString()]);
  }
  task.save()


  

}
