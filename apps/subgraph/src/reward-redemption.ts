import { log } from "matchstick-as"
import { RewardRedeem as RewardRedeemedEvent, RewardReleased as RewardReleasedEvent } from "../generated/templates/RewardRedemption/RewardRedemption"
import { RewardRedeem, RewardRedemptionCreated, RewardReleased } from "../generated/schema"
import { updateRedemptionStatus } from "./utils"


export function handleRewardRedeemed(event: RewardRedeemedEvent): void {
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



// Add the handler for RewardReleased
export function handleRewardReleased(event: RewardReleasedEvent): void {
  const uniqueId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new RewardReleased(uniqueId);
  
  let rewardRedemption = RewardRedemptionCreated.load(event.address);
  if (rewardRedemption) {
    entity.rewardRedemption = rewardRedemption.id;
  } else {
    log.error("No RewardRedemptionCreated found for address: {}", [event.address.toHexString()]);
  }
  
  entity.from = event.params.from;
  entity.amount = event.params.amount;
  entity.status = event.params.status;
  
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  
  entity.save();
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