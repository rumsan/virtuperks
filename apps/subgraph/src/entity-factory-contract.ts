import { EntityTaskManagerCreated as EntityTaskManagerCreatedEvent } from "../generated/EntityFactoryContract/EntityFactoryContract"
import { EntityTaskManagerCreated } from "../generated/schema"

export function handleEntityTaskManagerCreated(
  event: EntityTaskManagerCreatedEvent,
): void {
  let entity = new EntityTaskManagerCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.entityTaskManager = event.params.entityTaskManager
  entity.aclAddress = event.params.aclAddress
  entity._appId = event.params._appId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
