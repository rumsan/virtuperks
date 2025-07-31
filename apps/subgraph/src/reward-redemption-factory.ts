import { log } from "@graphprotocol/graph-ts"
import { RewardRedemptionCreated as RewardRedemptionCreatedEvent } from "../generated/RewardRedemptionFactory/RewardRedemptionFactory"
import { RewardRedemptionCreated } from "../generated/schema"
import { RewardRedemption } from "../generated/templates"

export function handleRewardRedemptionCreated(
  event: RewardRedemptionCreatedEvent,
): void {
  let entity = new RewardRedemptionCreated(
   event.params.rewardRedemption,
  )
  entity.rewardRedemption = event.params.rewardRedemption
  entity.name = event.params.name
  entity.tokensRequired = event.params.tokensRequired
  entity.category = event.params.category
  entity.rewardId = event.params.rewardId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

   log.debug("EntityTaskManagerCreated: {}", [entity.rewardRedemption.toHexString()]);
  
    RewardRedemption.create(event.params.rewardRedemption);
    log.debug("entityTemplateAdded: {}", [entity.rewardRedemption.toHexString()]);
}
