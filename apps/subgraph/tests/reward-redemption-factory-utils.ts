import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { RewardRedemptionCreated } from "../generated/RewardRedemptionFactory/RewardRedemptionFactory"

export function createRewardRedemptionCreatedEvent(
  rewardRedemption: Address,
  name: string,
  tokensRequired: BigInt,
  category: string,
  rewardId: Bytes
): RewardRedemptionCreated {
  let rewardRedemptionCreatedEvent =
    changetype<RewardRedemptionCreated>(newMockEvent())

  rewardRedemptionCreatedEvent.parameters = new Array()

  rewardRedemptionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "rewardRedemption",
      ethereum.Value.fromAddress(rewardRedemption)
    )
  )
  rewardRedemptionCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  rewardRedemptionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokensRequired",
      ethereum.Value.fromUnsignedBigInt(tokensRequired)
    )
  )
  rewardRedemptionCreatedEvent.parameters.push(
    new ethereum.EventParam("category", ethereum.Value.fromString(category))
  )
  rewardRedemptionCreatedEvent.parameters.push(
    new ethereum.EventParam("rewardId", ethereum.Value.fromFixedBytes(rewardId))
  )

  return rewardRedemptionCreatedEvent
}
