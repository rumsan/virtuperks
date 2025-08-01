import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  RewardRedeem,
  RewardReleased
} from "../generated/RewardRedemption/RewardRedemption"

export function createRewardRedeemEvent(
  user: Address,
  amount: BigInt,
  status: i32,
  redemptionId: BigInt
): RewardRedeem {
  let rewardRedeemEvent = changetype<RewardRedeem>(newMockEvent())

  rewardRedeemEvent.parameters = new Array()

  rewardRedeemEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
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
  rewardRedeemEvent.parameters.push(
    new ethereum.EventParam(
      "redemptionId",
      ethereum.Value.fromUnsignedBigInt(redemptionId)
    )
  )

  return rewardRedeemEvent
}

export function createRewardReleasedEvent(
  user: Address,
  amount: BigInt,
  status: i32,
  redemptionId: BigInt
): RewardReleased {
  let rewardReleasedEvent = changetype<RewardReleased>(newMockEvent())

  rewardReleasedEvent.parameters = new Array()

  rewardReleasedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
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
  rewardReleasedEvent.parameters.push(
    new ethereum.EventParam(
      "redemptionId",
      ethereum.Value.fromUnsignedBigInt(redemptionId)
    )
  )

  return rewardReleasedEvent
}
