import { log } from '@graphprotocol/graph-ts';
import { RewardManagementCreated as RewardManagementCreatedEvent } from '../generated/RewardManagementFactory/RewardManagementFactory';
import { RewardManagementCreated } from '../generated/schema';

import { RewardManagement } from '../generated/templates';

export function handleRewardManagementCreated(
  event: RewardManagementCreatedEvent,
): void {
  let entity = new RewardManagementCreated(event.params.rewardManagement);
  entity.rewardManagement = event.params.rewardManagement;
  entity.registry = event.params.registry;
  entity.appId = event.params.appId;
  entity.name = event.params.name;
  entity.entityId = event.params.entityId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  log.debug('EntityTaskManagerCreated: {}', [
    entity.rewardManagement.toHexString(),
  ]);

  RewardManagement.create(event.params.rewardManagement);
  log.debug('entityTemplateAdded: {}', [entity.rewardManagement.toHexString()]);
}
