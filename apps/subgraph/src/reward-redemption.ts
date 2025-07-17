import { RewardRedeemed as RewardRedeemedEvent } from "../generated/RewardRedemption/RewardRedemption"
import { RewardRedeemed } from "../generated/schema"

export function handleRewardRedeemed(event: RewardRedeemedEvent): void {
  let entity = new RewardRedeemed(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.from = event.params.from
  entity.amount = event.params.amount
  entity.status = event.params.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
