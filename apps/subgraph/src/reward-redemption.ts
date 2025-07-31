import { log } from "@graphprotocol/graph-ts"
import {
  RewardRedeem as RewardRedeemEvent,
  RewardReleased as RewardReleasedEvent,
} from "../generated/RewardRedemption/RewardRedemption"
import { RewardRedeem, RewardRedemptionCreated, RewardReleased } from "../generated/schema"
import { updateRedemptionStatus } from "./utils"

export function handleRewardRedeem(event: RewardRedeemEvent): void {
  log.info("handleRewardRedeem: {}", [event.address.toHexString()]);
  let entity = new RewardRedeem(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  let rewardRedemption = RewardRedemptionCreated.load(event.address)
  if (rewardRedemption) {
      
    entity.rewardRedemption = rewardRedemption.id
        log.info("RewardManagementCreated found for address: {}", [event.address.toHexString()]);
    } else {
       log.error("No RewardManagementCreated found for address: {}", [event.address.toHexString()]);
  }
  entity.from = event.params.from
  entity.amount = event.params.amount
  entity.status = event.params.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

   // Also update the redemption status
  updateRedemptionStatus(
    event.params.from,
    event.address,
    event.params.amount,
    event.params.status,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash
  );
}

export function handleRewardReleased(event: RewardReleasedEvent): void {
  let entity = new RewardReleased(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  let rewardRedemption = RewardRedemptionCreated.load(event.address)
  if (rewardRedemption) {
      
    entity.rewardRedemption = rewardRedemption.id
        log.info("RewardManagementCreated found for address: {}", [event.address.toHexString()]);
    } else {
       log.error("No RewardManagementCreated found for address: {}", [event.address.toHexString()]);
  }
  entity.from = event.params.from
  entity.amount = event.params.amount
  entity.status = event.params.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
   // Also update the redemption status
  updateRedemptionStatus(
    event.params.from,
    event.address,
    event.params.amount,
    event.params.status,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash
  );
}
