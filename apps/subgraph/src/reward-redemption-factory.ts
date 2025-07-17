import { log } from "matchstick-as"
import { RewardRedemptionCreated as RewardRedemptionCreatedEvent } from "../generated/RewardRedemptionFactory/RewardRedemptionFactory"
import { RewardRedemptionCreated } from "../generated/schema"
import { RewardRedemption } from "../generated/templates"

export function handleRewardRedemptionCreated(
  event: RewardRedemptionCreatedEvent,
): void {
  let entity = new RewardRedemptionCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.rewardRedemption = event.params.rewardRedemption
  entity.appId = event.params.appId
  entity.name = event.params.name
  entity.tokensRequired = event.params.tokensRequired

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  entity.save()
      log.debug("EntityTaskManagerCreated: {}", [entity.rewardRedemption.toHexString()]);
  
    RewardRedemption.create(event.params.rewardRedemption);
    log.debug("entityTemplateAdded: {}", [entity.rewardRedemption.toHexString()]);
}
