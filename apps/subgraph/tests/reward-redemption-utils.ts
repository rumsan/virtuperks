import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { RewardRedeemed } from "../generated/RewardRedemption/RewardRedemption"

export function createRewardRedeemedEvent(
  from: Address,
  amount: BigInt,
  status: i32
): RewardRedeemed {
  let rewardRedeemedEvent = changetype<RewardRedeemed>(newMockEvent())

  rewardRedeemedEvent.parameters = new Array()

  rewardRedeemedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  rewardRedeemedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  rewardRedeemedEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  )

  return rewardRedeemedEvent
}
