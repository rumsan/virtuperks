import { Bytes, log } from "@graphprotocol/graph-ts";
import {
  EntityTaskManagerCreated,

  ParticiantApplied,
  TaskAccepted,
  TaskApproved,
  TaskCompleted,
  TaskCreated
} from "../generated/schema";
import {
  ParticiantApplied as ParticiantAppliedEvent,
  TaskAccepted as TaskAcceptedEvent,
  TaskApproved as TaskApprovedEvent,
  TaskCompleted as TaskCompletedEvent,
  TaskCreated as TaskCreatedEvent,
} from "../generated/templates/EntityContract/EntityContract";

export function handleParticiantApplied(event: ParticiantAppliedEvent): void {
 let entity = EntityTaskManagerCreated.load(event.address as Bytes);
  if (!entity) return;
  let applicationId = event.transaction.hash.concatI32(event.logIndex.toI32());

  let application = new ParticiantApplied(applicationId);
  application.entityTaskManagerCreated = entity.entityTaskManager
  application.internal_id = event.params.id;
  application.participant = event.params.participant;
  application.blockNumber = event.block.number;
  application.blockTimestamp = event.block.timestamp;
  application.transactionHash = event.transaction.hash;
  application.save();
}

export function handleTaskAccepted(event: TaskAcceptedEvent): void {
   let entity = EntityTaskManagerCreated.load(event.address as Bytes);
  if (!entity) return;
    let acceptanceId = event.transaction.hash.concatI32(event.logIndex.toI32());


  let acceptance = new TaskAccepted(acceptanceId);
  acceptance.entityTaskManagerCreated = entity.entityTaskManager
  acceptance.internal_id = event.params.id;
  acceptance.blockNumber = event.block.number;
  acceptance.blockTimestamp = event.block.timestamp;
  acceptance.transactionHash = event.transaction.hash;
  acceptance.save();
}

export function handleTaskApproved(event: TaskApprovedEvent): void {
  let entity = EntityTaskManagerCreated.load(event.address as Bytes);
  if (!entity) return;
   let approvalId = event.transaction.hash.concatI32(event.logIndex.toI32());

  let approval = new TaskApproved(approvalId);
  approval.entityTaskManagerCreated = entity.entityTaskManager
  approval.internal_id = event.params.id;
  approval.approver = event.params.approver;
  approval.blockNumber = event.block.number;
  approval.blockTimestamp = event.block.timestamp;
  approval.transactionHash = event.transaction.hash;
  approval.save();
}

export function handleTaskCompleted(event: TaskCompletedEvent): void {
  let entity = EntityTaskManagerCreated.load(event.address as Bytes);
  if (!entity) return;
let completionId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let completion = new TaskCompleted(completionId);
  completion.entityTaskManagerCreated = entity.entityTaskManager
  completion.internal_id = event.params.id;
  completion.participant = event.params.participant;
  completion.blockNumber = event.block.number;
  completion.blockTimestamp = event.block.timestamp;
  completion.transactionHash = event.transaction.hash;
  completion.save();
}

export function handleTaskCreated(event: TaskCreatedEvent): void {
  
  let entity = EntityTaskManagerCreated.load(event.address);
  if (!entity) return;
  log.info('TaskCreated event fired', [entity.id.toHexString()]);

  // Create a new TaskCreated entity
  let taskId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let task = new TaskCreated(taskId);
 
  task.entityTaskManagerCreated = entity.entityTaskManager
  task.internal_id = event.params.id
  task.createdBy = event.params.createdBy;
  task.detailsUrl = event.params.detailsUrl;
  task.rewardToken = event.params.rewardToken;
  task.rewardAmount = event.params.rewardAmount;
  task.allowedWallets =  changetype<Bytes[]>(event.params.allowedWallets)
  task.maxParticipants = event.params.maxParticipants;
  task.expiryDate = event.params.expiryDate;
  task.owner = event.params.owner;
  task.isActive = event.params.isActive;
  task.blockNumber = event.block.number;
  task.blockTimestamp = event.block.timestamp;
  task.transactionHash = event.transaction.hash;
  task.save();
  

 
}
