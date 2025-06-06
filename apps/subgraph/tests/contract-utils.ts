import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  AppCreated,
  AppNameUpdated,
  AppPrivacyChanged,
  RoleAdminGranted,
  RoleAdminRevoked,
  RoleGranted,
  RoleRevoked
} from "../generated/Contract/Contract"

export function createAppCreatedEvent(
  appId: Bytes,
  admin: Address,
  sender: Address
): AppCreated {
  let appCreatedEvent = changetype<AppCreated>(newMockEvent())

  appCreatedEvent.parameters = new Array()

  appCreatedEvent.parameters.push(
    new ethereum.EventParam("appId", ethereum.Value.fromFixedBytes(appId))
  )
  appCreatedEvent.parameters.push(
    new ethereum.EventParam("admin", ethereum.Value.fromAddress(admin))
  )
  appCreatedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return appCreatedEvent
}

export function createAppNameUpdatedEvent(
  appId: Bytes,
  newName: string,
  sender: Address
): AppNameUpdated {
  let appNameUpdatedEvent = changetype<AppNameUpdated>(newMockEvent())

  appNameUpdatedEvent.parameters = new Array()

  appNameUpdatedEvent.parameters.push(
    new ethereum.EventParam("appId", ethereum.Value.fromFixedBytes(appId))
  )
  appNameUpdatedEvent.parameters.push(
    new ethereum.EventParam("newName", ethereum.Value.fromString(newName))
  )
  appNameUpdatedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return appNameUpdatedEvent
}

export function createAppPrivacyChangedEvent(
  appId: Bytes,
  isPrivate: boolean,
  sender: Address
): AppPrivacyChanged {
  let appPrivacyChangedEvent = changetype<AppPrivacyChanged>(newMockEvent())

  appPrivacyChangedEvent.parameters = new Array()

  appPrivacyChangedEvent.parameters.push(
    new ethereum.EventParam("appId", ethereum.Value.fromFixedBytes(appId))
  )
  appPrivacyChangedEvent.parameters.push(
    new ethereum.EventParam("isPrivate", ethereum.Value.fromBoolean(isPrivate))
  )
  appPrivacyChangedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return appPrivacyChangedEvent
}

export function createRoleAdminGrantedEvent(
  appId: Bytes,
  role: Bytes,
  account: Address,
  sender: Address
): RoleAdminGranted {
  let roleAdminGrantedEvent = changetype<RoleAdminGranted>(newMockEvent())

  roleAdminGrantedEvent.parameters = new Array()

  roleAdminGrantedEvent.parameters.push(
    new ethereum.EventParam("appId", ethereum.Value.fromFixedBytes(appId))
  )
  roleAdminGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleAdminGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleAdminGrantedEvent
}

export function createRoleAdminRevokedEvent(
  appId: Bytes,
  role: Bytes,
  account: Address,
  sender: Address
): RoleAdminRevoked {
  let roleAdminRevokedEvent = changetype<RoleAdminRevoked>(newMockEvent())

  roleAdminRevokedEvent.parameters = new Array()

  roleAdminRevokedEvent.parameters.push(
    new ethereum.EventParam("appId", ethereum.Value.fromFixedBytes(appId))
  )
  roleAdminRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleAdminRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleAdminRevokedEvent
}

export function createRoleGrantedEvent(
  appId: Bytes,
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("appId", ethereum.Value.fromFixedBytes(appId))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  appId: Bytes,
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("appId", ethereum.Value.fromFixedBytes(appId))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}
