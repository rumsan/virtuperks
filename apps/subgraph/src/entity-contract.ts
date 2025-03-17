import { Address, Bytes, log } from "@graphprotocol/graph-ts"
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
  let entity = new ParticiantApplied(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.internal_id = event.params.id
  entity.participant = event.params.participant

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.status = 'UNACCEPTED'
  
  


  let task = TaskCreated.load(event.address);
  if (task) {
    // Get the EntityTaskManagerCreated entity
    if (task.entityTaskManager) {
       let taskManagerId = task.entityTaskManager as Bytes
      let entityTaskManager = EntityTaskManagerCreated.load(taskManagerId)
      
      if (entityTaskManager) {
        // Now we have the correct entityTaskManager address
         let entityTaskManagerAddress = Address.fromBytes(entityTaskManager.entityTaskManager)
        let taskDetail = fetchTaskDetails(
          task.id,
          entityTaskManagerAddress, // This is the address we need
          task.internal_id
        )

        if (taskDetail) {
          entity.taskDetail = taskDetail.id
          log.info(
            "Participant {} applied for task {}. Task Details: {}",
            [
              entity.participant.toHexString(),
              task.id.toHexString(),
              taskDetail.detailsUrl
            ]
          )
        } else {
          log.error("Failed to fetch task details for task ID: {}", [event.params.id.toHexString()])
        }
      } else {
        log.error("EntityTaskManager not found for task: {}", [task.id.toHexString()])
      }
    }
  
    else {
      log.error("Task or required fields are undefined for task ID: {}", [event.params.id.toHexString()]);
    }
    entity.save()
  }
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
