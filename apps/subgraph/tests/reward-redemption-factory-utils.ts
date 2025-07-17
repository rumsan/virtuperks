import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { RewardRedemptionCreated } from "../generated/RewardRedemptionFactory/RewardRedemptionFactory"

export function createRewardRedemptionCreatedEvent(
  rewardRedemption: Address,
  appId: Bytes,
  name: string,
  tokensRequired: BigInt
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
    new ethereum.EventParam("appId", ethereum.Value.fromFixedBytes(appId))
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

  return rewardRedemptionCreatedEvent
}
