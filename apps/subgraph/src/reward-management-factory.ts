import { log } from "@graphprotocol/graph-ts"
import { RewardManagementCreated as RewardManagementCreatedEvent } from "../generated/RewardManagementFactory/RewardManagementFactory"

import { RewardManagementCreated } from "../generated/schema"
import { RewardManagement } from "../generated/templates"

export function handleRewardManagementCreated(
  event: RewardManagementCreatedEvent,
): void {
  let entity = new RewardManagementCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.rewardManagement = event.params.rewardManagement
  entity.aclAddress = event.params.aclAddress
  entity.appId = event.params.appId
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  log.debug("RewardManagementCreated: {}", [entity.rewardManagement.toHexString()]);
  RewardManagement.create(event.params.rewardManagement)
  log.debug("RewardManagement template created for: {}", [event.params.rewardManagement.toHexString()]);
}
