import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  OwnerAdded,
  RewardManagementCreated
} from "../generated/RewardManagementFactory/RewardManagementFactory"

export function createOwnerAddedEvent(
  entityId: Bytes,
  name: string,
  entityOwner: Address
): OwnerAdded {
  let ownerAddedEvent = changetype<OwnerAdded>(newMockEvent())

  ownerAddedEvent.parameters = new Array()

  ownerAddedEvent.parameters.push(
    new ethereum.EventParam("entityId", ethereum.Value.fromFixedBytes(entityId))
  )
  ownerAddedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  ownerAddedEvent.parameters.push(
    new ethereum.EventParam(
      "entityOwner",
      ethereum.Value.fromAddress(entityOwner)
    )
  )

  return ownerAddedEvent
}

export function createRewardManagementCreatedEvent(
  rewardManagement: Address,
  registry: Address,
  appId: Bytes,
  name: string,
  entityId: Bytes
): RewardManagementCreated {
  let rewardManagementCreatedEvent =
    changetype<RewardManagementCreated>(newMockEvent())

  rewardManagementCreatedEvent.parameters = new Array()

  rewardManagementCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "rewardManagement",
      ethereum.Value.fromAddress(rewardManagement)
    )
  )
  rewardManagementCreatedEvent.parameters.push(
    new ethereum.EventParam("registry", ethereum.Value.fromAddress(registry))
  )
  rewardManagementCreatedEvent.parameters.push(
    new ethereum.EventParam("appId", ethereum.Value.fromFixedBytes(appId))
  )
  rewardManagementCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  rewardManagementCreatedEvent.parameters.push(
    new ethereum.EventParam("entityId", ethereum.Value.fromFixedBytes(entityId))
  )

  return rewardManagementCreatedEvent
}
