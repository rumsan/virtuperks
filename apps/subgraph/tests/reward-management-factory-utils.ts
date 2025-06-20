import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import { RewardManagementCreated } from "../generated/RewardManagementFactory/RewardManagementFactory"

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
