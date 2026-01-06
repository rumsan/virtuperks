import {
  AppCreated as AppCreatedEvent,
  AppDeactivated as AppDeactivatedEvent,
  AppNameUpdated as AppNameUpdatedEvent,
  AppStopped as AppStoppedEvent,
  EntityCreated as EntityCreatedEvent,
  EntityImplementationUpdated as EntityImplementationUpdatedEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  TokensRecovered as TokensRecoveredEvent,
  Upgraded as UpgradedEvent,
} from "../generated/App/App"
import {
  AppCreated,
  AppDeactivated,
  AppNameUpdated,
  AppStopped,
  EntityCreated,
  EntityImplementationUpdated,
  Initialized,
  OwnershipTransferred,
  TokensRecovered,
  Upgraded,
} from "../generated/schema"

export function handleAppCreated(event: AppCreatedEvent): void {
  let entity = new AppCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAppDeactivated(event: AppDeactivatedEvent): void {
  let entity = new AppDeactivated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAppNameUpdated(event: AppNameUpdatedEvent): void {
  let entity = new AppNameUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldName = event.params.oldName
  entity.newName = event.params.newName
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAppStopped(event: AppStoppedEvent): void {
  let entity = new AppStopped(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.by = event.params.by

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEntityCreated(event: EntityCreatedEvent): void {
  let entity = new EntityCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.entityAddress = event.params.entityAddress
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEntityImplementationUpdated(
  event: EntityImplementationUpdatedEvent,
): void {
  let entity = new EntityImplementationUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldImpl = event.params.oldImpl
  entity.newImpl = event.params.newImpl

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent,
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensRecovered(event: TokensRecoveredEvent): void {
  let entity = new TokensRecovered(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
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
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
