import { log } from "@graphprotocol/graph-ts";
import {
  OwnerAdded as OwnerAddedEvent,
  RewardManagementCreated as RewardManagementCreatedEvent,
} from "../generated/RewardManagementFactory/RewardManagementFactory";
import { OwnerAdded, RewardManagementCreated } from "../generated/schema";
import { RewardManagement } from "../generated/templates";

export function handleOwnerAdded(event: OwnerAddedEvent): void {
  let entity = new OwnerAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.entityId = event.params.entityId
  entity.name = event.params.name
  entity.entityOwner = event.params.entityOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardManagementCreated(
  event: RewardManagementCreatedEvent,
): void {
  let entity = new RewardManagementCreated(
    event.params.rewardManagement

  )
  entity.rewardManagement = event.params.rewardManagement
  entity.registry = event.params.registry
  entity.appId = event.params.appId
  entity.name = event.params.name
  entity.entityId = event.params.entityId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  log.debug("EntityTaskManagerCreated: {}", [entity.rewardManagement.toHexString()]);

  RewardManagement.create(event.params.rewardManagement);
  log.debug("entityTemplateAdded: {}", [entity.rewardManagement.toHexString()]);
}
