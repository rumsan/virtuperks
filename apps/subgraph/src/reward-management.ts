import { Bytes, log } from '@graphprotocol/graph-ts';
import {
  AdditionalDisbursementToTask as AdditionalDisbursementToTaskEvent,
  ContractPaused as ContractPausedEvent,
  ContractUnpaused as ContractUnpausedEvent,
  DisbursementToParticipant as DisbursementToParticipantEvent,
  DisbursementToTask as DisbursementToTaskEvent,
  EtherWithdrawn as EtherWithdrawnEvent,
  ParticipantRemovedFromWhitelist as ParticipantRemovedFromWhitelistEvent,
  ParticipantWhitelisted as ParticipantWhitelistedEvent,
  TaskAssignmentAccepted as TaskAssignmentAcceptedEvent,
  TaskAssignmentApplied as TaskAssignmentAppliedEvent,
  TaskAssignmentApproved as TaskAssignmentApprovedEvent,
  TaskAssignmentCompleted as TaskAssignmentCompletedEvent,
  TaskAssignmentRejected as TaskAssignmentRejectedEvent,
  TaskAssignmentVerified as TaskAssignmentVerifiedEvent,
  TaskClosed as TaskClosedEvent,
  TaskCreated as TaskCreatedEvent,
  TaskDetailsUpdated as TaskDetailsUpdatedEvent,
  TokenTransferred as TokenTransferredEvent,
  TokensAllocatedToTask as TokensAllocatedToTaskEvent,
} from '../generated/RewardManagement/RewardManagement';
import {
  AdditionalDisbursementToTask,
  ContractPaused,
  ContractUnpaused,
  DisbursementToParticipant,
  DisbursementToTask,
  EtherWithdrawn,
  ParticipantRemovedFromWhitelist,
  ParticipantWhitelisted,
  RewardManagementCreated,
  TaskAssignmentAccepted,
  TaskAssignmentApplied,
  TaskAssignmentApproved,
  TaskAssignmentCompleted,
  TaskAssignmentRejected,
  TaskAssignmentVerified,
  TaskClosed,
  TaskCreated,
  TaskDetail,
  TaskDetailsUpdated,
  TaskIdMapping,
  TokenTransferred,
  TokensAllocatedToTask,
} from '../generated/schema';
import { RewardManagement } from '../generated/templates/RewardManagement/RewardManagement';
import { fetchTaskDetails, updateParticipantTaskStatus } from './utils';

export function handleAdditionalDisbursementToTask(
  event: AdditionalDisbursementToTaskEvent,
): void {
  let entity = new AdditionalDisbursementToTask(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.taskId = event.params.taskId;
  entity.amount = event.params.amount;
  entity.remarks = event.params.remarks;
  entity.disbursedBy = event.params.disbursedBy;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleContractPaused(event: ContractPausedEvent): void {
  let entity = new ContractPaused(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.by = event.params.by;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleContractUnpaused(event: ContractUnpausedEvent): void {
  let entity = new ContractUnpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.by = event.params.by;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleDisbursementToParticipant(
  event: DisbursementToParticipantEvent,
): void {
  let entity = new DisbursementToParticipant(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.taskId = event.params.taskId;
  entity.amount = event.params.amount;
  entity.participant = event.params.participant;
  entity.disbursedBy = event.params.disbursedBy;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleDisbursementToTask(event: DisbursementToTaskEvent): void {
  let entity = new DisbursementToTask(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.taskId = event.params.taskId;
  entity.amount = event.params.amount;
  entity.disbursedBy = event.params.disbursedBy;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  // Link to RewardManagement
  let rewardManagement = RewardManagementCreated.load(event.address);
  if (rewardManagement != null) {
    entity.rewardManagement = rewardManagement.id;
  }

  entity.save();
}

export function handleEtherWithdrawn(event: EtherWithdrawnEvent): void {
  let entity = new EtherWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.to = event.params.to;
  entity.amount = event.params.amount;
  entity.by = event.params.by;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleParticipantRemovedFromWhitelist(
  event: ParticipantRemovedFromWhitelistEvent,
): void {
  let entity = new ParticipantRemovedFromWhitelist(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.taskId = event.params.taskId;
  entity.participant = event.params.participant;
  entity.by = event.params.by;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleParticipantWhitelisted(
  event: ParticipantWhitelistedEvent,
): void {
  let entity = new ParticipantWhitelisted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.taskId = event.params.taskId;
  entity.participant = event.params.participant;
  entity.by = event.params.by;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTaskAssignmentAccepted(
  event: TaskAssignmentAcceptedEvent,
): void {
  let entity = new TaskAssignmentAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.internal_id = event.params.id;
  entity.participant = event.params.participant;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  // Create TaskDetail entity first
  let taskDetail = fetchTaskDetails(event.params.id, event.address);
  entity.taskDetail = taskDetail.id;

  entity.save();

  updateParticipantTaskStatus(
    event.params.participant,
    event.params.id,
    'ACCEPTED',
    event.block.number,
    event.block.timestamp,
    taskDetail ? taskDetail.id : null,
  );
}

export function handleTaskAssignmentApplied(
  event: TaskAssignmentAppliedEvent,
): void {
  let entity = new TaskAssignmentApplied(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.internal_id = event.params.id;
  entity.participant = event.params.participant;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  // Create TaskDetail entity first
  let taskDetail = fetchTaskDetails(event.params.id, event.address);
  entity.taskDetail = taskDetail.id;

  entity.save();

  updateParticipantTaskStatus(
    event.params.participant,
    event.params.id,
    'PENDING',
    event.block.number,
    event.block.timestamp,
    taskDetail ? taskDetail.id : null,
  );
}

export function handleTaskAssignmentApproved(
  event: TaskAssignmentApprovedEvent,
): void {
  let entity = new TaskAssignmentApproved(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.internal_id = event.params.id;
  entity.approver = event.params.approver;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTaskAssignmentCompleted(
  event: TaskAssignmentCompletedEvent,
): void {
  let entity = new TaskAssignmentCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.internal_id = event.params.id;
  entity.participant = event.params.participant;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  // Create TaskDetail entity first
  let taskDetail = fetchTaskDetails(event.params.id, event.address);
  entity.taskDetail = taskDetail.id;
  // Get the completion URL from the contract
  let contract = RewardManagement.bind(event.address);
  let taskAssignmentResult = contract.try_getParticipantTaskAssignment(
    event.params.id,
    event.params.participant,
  );

  // Store the completion URL if available
  if (!taskAssignmentResult.reverted) {
    let taskAssignment = taskAssignmentResult.value;
    entity.completionUrl = taskAssignment.completionUrl;
    log.info('Completion URL found for task {} and participant {}: {}', [
      event.params.id.toHexString(),
      event.params.participant.toHexString(),
      taskAssignment.completionUrl,
    ]);
  } else {
    log.error(
      'Failed to fetch task assignment for task {} and participant {}',
      [event.params.id.toHexString(), event.params.participant.toHexString()],
    );
  }

  entity.save();
  updateParticipantTaskStatus(
    event.params.participant,
    event.params.id,
    'COMPLETED',
    event.block.number,
    event.block.timestamp,
    taskDetail ? taskDetail.id : null,
    entity.completionUrl,
  );
}

export function handleTaskAssignmentRejected(
  event: TaskAssignmentRejectedEvent,
): void {
  let entity = new TaskAssignmentRejected(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.internal_id = event.params.id;
  entity.participant = event.params.participant;
  entity.rejectedBy = event.params.rejectedBy;
  entity.reason = event.params.reason;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let taskDetail = fetchTaskDetails(event.params.id, event.address);
  entity.taskDetail = taskDetail.id;

  entity.save();
  updateParticipantTaskStatus(
    event.params.participant,
    event.params.id,
    'REJECTED',
    event.block.number,
    event.block.timestamp,
    taskDetail ? taskDetail.id : null,
    null, // completionUrl - not applicable for rejected tasks
    event.params.reason, // rejectedReason - correct position (8th parameter)
  );
}

export function handleTaskAssignmentVerified(
  event: TaskAssignmentVerifiedEvent,
): void {
  let entity = new TaskAssignmentVerified(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.internal_id = event.params.id;
  entity.participant = event.params.participant;
  entity.verifier = event.params.verifier;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  // Create TaskDetail entity first
  let taskDetail = fetchTaskDetails(event.params.id, event.address);
  entity.taskDetail = taskDetail.id;

  // Get the completion URL from the contract
  let contract = RewardManagement.bind(event.address);
  let taskAssignmentResult = contract.try_getParticipantTaskAssignment(
    event.params.id,
    event.params.participant,
  );

  entity.save();
  updateParticipantTaskStatus(
    event.params.participant,
    event.params.id,
    'VERIFIED',
    event.block.number,
    event.block.timestamp,
    taskDetail ? taskDetail.id : null,
    null,
  );
}

export function handleTaskClosed(event: TaskClosedEvent): void {
  let entity = new TaskClosed(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.internal_id = event.params.id;
  entity.closedBy = event.params.closedBy;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  // Create TaskDetail entity first
  let taskDetail = fetchTaskDetails(event.params.id, event.address);
  entity.taskDetail = taskDetail.id;

  // Update TaskDetail.isOpen using TaskIdMapping
  let mapping = TaskIdMapping.load(event.params.id);
  if (mapping) {
    let taskCreated = TaskCreated.load(mapping.taskCreated);
    if (taskCreated && taskCreated.taskDetail) {
      let taskDetail = TaskDetail.load(taskCreated.taskDetail as Bytes);
      if (taskDetail) {
        taskDetail.isOpen = false;
        taskDetail.save();
        log.info('Updated TaskDetail: taskId={0}, isOpen={1}', [
          event.params.id.toHexString(),
          taskDetail.isOpen.toString(),
        ]);
      } else {
        log.warning('TaskDetail not found for taskId: {0}', [
          event.params.id.toHexString(),
        ]);
      }
    } else {
      log.warning(
        'TaskCreated not found or taskDetail is null for taskId: {0}',
        [event.params.id.toHexString()],
      );
    }
  } else {
    log.warning('TaskIdMapping not found for taskId: {0}', [
      event.params.id.toHexString(),
    ]);
  }

  entity.save();
}

export function handleTaskCreated(event: TaskCreatedEvent): void {
  let entity = new TaskCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  // Get or create RewardManagementCreated entity
  let rewardManagement = RewardManagementCreated.load(event.address);

  if (rewardManagement) {
    entity.rewardManagement = rewardManagement.id;
    log.info('RewardManagementCreated found for address: {}', [
      event.address.toHexString(),
    ]);
  } else {
    log.error('No RewardManagementCreated found for address: {}', [
      event.address.toHexString(),
    ]);
  }

  // Create TaskDetail entity first
  let taskDetail = fetchTaskDetails(event.params.id, event.address);

  taskDetail.task = entity.id;
  taskDetail.save();

  let mapping = new TaskIdMapping(event.params.id);
  mapping.taskCreated = entity.id;
  mapping.save();

  entity.internal_id = event.params.id;
  entity.taskDetail = taskDetail.id;
  entity.createdBy = event.params.createdBy;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTaskDetailsUpdated(event: TaskDetailsUpdatedEvent): void {
  let entity = new TaskDetailsUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.internal_id = event.params.id;
  entity.updatedBy = event.params.updatedBy;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTokenTransferred(event: TokenTransferredEvent): void {
  let entity = new TokenTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.token = event.params.token;
  entity.to = event.params.to;
  entity.amount = event.params.amount;
  entity.remarks = event.params.remarks;
  entity.transferredBy = event.params.transferredBy;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  let rewardManagement = RewardManagementCreated.load(event.address);
  if (rewardManagement != null) {
    entity.rewardManagement = rewardManagement.id;
    // Update totalAvailableTokens (ensure non-negative)
  }

  entity.save();
}

export function handleTokensAllocatedToTask(
  event: TokensAllocatedToTaskEvent,
): void {
  let entity = new TokensAllocatedToTask(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.taskId = event.params.taskId;
  entity.token = event.params.token;
  entity.amount = event.params.amount;
  entity.allocatedBy = event.params.allocatedBy;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
