import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import { RewardManagementCreated } from "../generated/RewardManagementFactory/RewardManagementFactory"

export function createRewardManagementCreatedEvent(
  rewardManagement: Address,
  aclAddress: Address,
  appId: Bytes,
  name: string
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
    new ethereum.EventParam(
      "aclAddress",
      ethereum.Value.fromAddress(aclAddress)
    )
  )
  rewardManagementCreatedEvent.parameters.push(
    new ethereum.EventParam("appId", ethereum.Value.fromFixedBytes(appId))
  )
  rewardManagementCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return rewardManagementCreatedEvent
}
