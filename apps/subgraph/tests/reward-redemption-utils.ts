import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  RewardRedeem,
  RewardReleased
} from "../generated/RewardRedemption/RewardRedemption"

export function createRewardRedeemEvent(
  from: Address,
  amount: BigInt,
  status: i32
): RewardRedeem {
  let rewardRedeemEvent = changetype<RewardRedeem>(newMockEvent())

  rewardRedeemEvent.parameters = new Array()

  rewardRedeemEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  rewardRedeemEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  rewardRedeemEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  )

  return rewardRedeemEvent
}

export function createRewardReleasedEvent(
  from: Address,
  amount: BigInt,
  status: i32
): RewardReleased {
  let rewardReleasedEvent = changetype<RewardReleased>(newMockEvent())

  rewardReleasedEvent.parameters = new Array()

  rewardReleasedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  rewardReleasedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  rewardReleasedEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  )

  return rewardReleasedEvent
}
