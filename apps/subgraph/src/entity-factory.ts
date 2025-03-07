import { log } from "@graphprotocol/graph-ts";
import { EntityTaskManagerCreated as EntityTaskManagerCreatedEvent } from "../generated/EntityFactory/EntityFactory";
import { EntityTaskManagerCreated } from "../generated/schema";
import { EntityContract } from "../generated/templates";


export function handleEntityTaskManagerCreated(
  event: EntityTaskManagerCreatedEvent,
): void {
  let entity = new EntityTaskManagerCreated(
    event.params.entityTaskManager
  )
  entity.entityTaskManager = event.params.entityTaskManager
  entity.aclAddress = event.params.aclAddress
  entity._appId = event.params._appId
  entity._name = event.params._name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  

  entity.save()
   log.debug("EntityTaskManagerCreated: {}", [entity.entityTaskManager.toHexString()]);

  EntityContract.create(event.params.entityTaskManager);
   log.debug("entityTemplateAdded: {}", [entity.entityTaskManager.toHexString()]);
}

