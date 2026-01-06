import {
  AllocationsFrozen as AllocationsFrozenEvent,
  AppContractUpdated as AppContractUpdatedEvent,
  EmergencyWithdrawal as EmergencyWithdrawalEvent,
  EntityDeactivated as EntityDeactivatedEvent,
  EntityInitialized as EntityInitializedEvent,
  EntityUpgraded as EntityUpgradedEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  ParticipantRemovedFromWhitelist as ParticipantRemovedFromWhitelistEvent,
  ParticipantWhitelisted as ParticipantWhitelistedEvent,
  RewardsDistributed as RewardsDistributedEvent,
  TaskAssignmentAccepted as TaskAssignmentAcceptedEvent,
  TaskAssignmentApplied as TaskAssignmentAppliedEvent,
  TaskAssignmentApproved as TaskAssignmentApprovedEvent,
  TaskAssignmentCompleted as TaskAssignmentCompletedEvent,
  TaskAssignmentRejected as TaskAssignmentRejectedEvent,
  TaskClosed as TaskClosedEvent,
  TaskCreated as TaskCreatedEvent,
  TaskDetailsUpdated as TaskDetailsUpdatedEvent,
  TokensDeposited as TokensDepositedEvent,
  TokensWithdrawn as TokensWithdrawnEvent,
  Upgraded as UpgradedEvent
} from "../generated/Entity/Entity"
import {
  AllocationsFrozen,
  AppContractUpdated,
  EmergencyWithdrawal,
  EntityDeactivated,
  EntityInitialized,
  EntityUpgraded,
  Initialized,
  OwnershipTransferred,
  ParticipantRemovedFromWhitelist,
  ParticipantWhitelisted,
  RewardsDistributed,
  TaskAssignmentAccepted,
  TaskAssignmentApplied,
  TaskAssignmentApproved,
  TaskAssignmentCompleted,
  TaskAssignmentRejected,
  TaskClosed,
  TaskCreated,
  TaskDetailsUpdated,
  TokensDeposited,
  TokensWithdrawn,
  Upgraded
} from "../generated/schema"

export function handleAllocationsFrozen(event: AllocationsFrozenEvent): void {
  let entity = new AllocationsFrozen(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAppContractUpdated(event: AppContractUpdatedEvent): void {
  let entity = new AppContractUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldApp = event.params.oldApp
  entity.newApp = event.params.newApp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEmergencyWithdrawal(
  event: EmergencyWithdrawalEvent
): void {
  let entity = new EmergencyWithdrawal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEntityDeactivated(event: EntityDeactivatedEvent): void {
  let entity = new EntityDeactivated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEntityInitialized(event: EntityInitializedEvent): void {
  let entity = new EntityInitialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEntityUpgraded(event: EntityUpgradedEvent): void {
  let entity = new EntityUpgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newImplementation = event.params.newImplementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleParticipantRemovedFromWhitelist(
  event: ParticipantRemovedFromWhitelistEvent
): void {
  let entity = new ParticipantRemovedFromWhitelist(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.participant = event.params.participant
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleParticipantWhitelisted(
  event: ParticipantWhitelistedEvent
): void {
  let entity = new ParticipantWhitelisted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.participant = event.params.participant
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardsDistributed(event: RewardsDistributedEvent): void {
  let entity = new RewardsDistributed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.totalAmount = event.params.totalAmount
  entity.participantCount = event.params.participantCount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskAssignmentAccepted(
  event: TaskAssignmentAcceptedEvent
): void {
  let entity = new TaskAssignmentAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.participant = event.params.participant

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskAssignmentApplied(
  event: TaskAssignmentAppliedEvent
): void {
  let entity = new TaskAssignmentApplied(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.participant = event.params.participant

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskAssignmentApproved(
  event: TaskAssignmentApprovedEvent
): void {
  let entity = new TaskAssignmentApproved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.approver = event.params.approver

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskAssignmentCompleted(
  event: TaskAssignmentCompletedEvent
): void {
  let entity = new TaskAssignmentCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.participant = event.params.participant

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskAssignmentRejected(
  event: TaskAssignmentRejectedEvent
): void {
  let entity = new TaskAssignmentRejected(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.participant = event.params.participant
  entity.rejectedBy = event.params.rejectedBy
  entity.reason = event.params.reason

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskClosed(event: TaskClosedEvent): void {
  let entity = new TaskClosed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.closedBy = event.params.closedBy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskCreated(event: TaskCreatedEvent): void {
  let entity = new TaskCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.createdBy = event.params.createdBy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskDetailsUpdated(event: TaskDetailsUpdatedEvent): void {
  let entity = new TaskDetailsUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.updatedBy = event.params.updatedBy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensDeposited(event: TokensDepositedEvent): void {
  let entity = new TokensDeposited(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensWithdrawn(event: TokensWithdrawnEvent): void {
  let entity = new TokensWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
