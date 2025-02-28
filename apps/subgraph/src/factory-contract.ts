import { log } from "@graphprotocol/graph-ts";
import { EntityTaskManagerCreated as EntityTaskManagerCreatedEvent } from "../generated/FactoryContract/FactoryContract";

import { EntityTaskManagerCreated } from "../generated/schema";
import { EntityContract } from "../generated/templates";


export function handleEntityTaskManagerCreated(
  event: EntityTaskManagerCreatedEvent,
): void {

 let entityId = event.transaction.hash.concatI32(event.logIndex.toI32());

  // Create a new instance of EntityTaskManagerCreated
  let entity = new EntityTaskManagerCreated(event.params.entityTaskManager);
  entity.entityTaskManager = event.params.entityTaskManager;
  entity.aclAddress = event.params.aclAddress;
  
  entity.id = event.params.entityTaskManager;
  entity.appId = event.params._appId;
  entity.name = event.params._name;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
 log.debug("EntityTaskManagerCreated: {}", [entity.entityTaskManager.toHexString()]);
  // Create the contract template instance
  EntityContract.create(event.params.entityTaskManager);

   log.debug("entityTemplateAdded: {}", [entity.entityTaskManager.toHexString()]);

}
