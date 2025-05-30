import {
  AppCreated as AppCreatedEvent,
  AppNameUpdated as AppNameUpdatedEvent,
  AppPrivacyChanged as AppPrivacyChangedEvent,
  RoleAdminGranted as RoleAdminGrantedEvent,
  RoleAdminRevoked as RoleAdminRevokedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent
} from "../generated/AppRegistry/AppRegistry"
import {
  AppCreated,
  AppNameUpdated,
  AppPrivacyChanged,
  RoleAdminGranted,
  RoleAdminRevoked,
  RoleGranted,
  RoleRevoked
} from "../generated/schema"

export function handleAppCreated(event: AppCreatedEvent): void {
  let entity = new AppCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.appId = event.params.appId
  entity.admin = event.params.admin
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAppNameUpdated(event: AppNameUpdatedEvent): void {
  let entity = new AppNameUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.appId = event.params.appId
  entity.newName = event.params.newName
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAppPrivacyChanged(event: AppPrivacyChangedEvent): void {
  let entity = new AppPrivacyChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.appId = event.params.appId
  entity.isPrivate = event.params.isPrivate
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleAdminGranted(event: RoleAdminGrantedEvent): void {
  let entity = new RoleAdminGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.appId = event.params.appId
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleAdminRevoked(event: RoleAdminRevokedEvent): void {
  let entity = new RoleAdminRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.appId = event.params.appId
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.appId = event.params.appId
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.appId = event.params.appId
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
