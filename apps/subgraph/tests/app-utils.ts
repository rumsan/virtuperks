import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
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
  Upgraded
} from "../generated/App/App"

export function createAppCreatedEvent(
  owner: Address,
  name: string
): AppCreated {
  let appCreatedEvent = changetype<AppCreated>(newMockEvent())

  appCreatedEvent.parameters = new Array()

  appCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  appCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return appCreatedEvent
}

export function createAppDeactivatedEvent(by: Address): AppDeactivated {
  let appDeactivatedEvent = changetype<AppDeactivated>(newMockEvent())

  appDeactivatedEvent.parameters = new Array()

  appDeactivatedEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return appDeactivatedEvent
}

export function createAppNameUpdatedEvent(
  oldName: string,
  newName: string,
  by: Address
): AppNameUpdated {
  let appNameUpdatedEvent = changetype<AppNameUpdated>(newMockEvent())

  appNameUpdatedEvent.parameters = new Array()

  appNameUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldName", ethereum.Value.fromString(oldName))
  )
  appNameUpdatedEvent.parameters.push(
    new ethereum.EventParam("newName", ethereum.Value.fromString(newName))
  )
  appNameUpdatedEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return appNameUpdatedEvent
}

export function createAppStoppedEvent(by: Address): AppStopped {
  let appStoppedEvent = changetype<AppStopped>(newMockEvent())

  appStoppedEvent.parameters = new Array()

  appStoppedEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return appStoppedEvent
}

export function createEntityCreatedEvent(
  entityAddress: Address,
  owner: Address
): EntityCreated {
  let entityCreatedEvent = changetype<EntityCreated>(newMockEvent())

  entityCreatedEvent.parameters = new Array()

  entityCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "entityAddress",
      ethereum.Value.fromAddress(entityAddress)
    )
  )
  entityCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return entityCreatedEvent
}

export function createEntityImplementationUpdatedEvent(
  oldImpl: Address,
  newImpl: Address
): EntityImplementationUpdated {
  let entityImplementationUpdatedEvent =
    changetype<EntityImplementationUpdated>(newMockEvent())

  entityImplementationUpdatedEvent.parameters = new Array()

  entityImplementationUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldImpl", ethereum.Value.fromAddress(oldImpl))
  )
  entityImplementationUpdatedEvent.parameters.push(
    new ethereum.EventParam("newImpl", ethereum.Value.fromAddress(newImpl))
  )

  return entityImplementationUpdatedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createTokensRecoveredEvent(
  token: Address,
  to: Address,
  amount: BigInt,
  by: Address
): TokensRecovered {
  let tokensRecoveredEvent = changetype<TokensRecovered>(newMockEvent())

  tokensRecoveredEvent.parameters = new Array()

  tokensRecoveredEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  tokensRecoveredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  tokensRecoveredEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  tokensRecoveredEvent.parameters.push(
    new ethereum.EventParam("by", ethereum.Value.fromAddress(by))
  )

  return tokensRecoveredEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}
