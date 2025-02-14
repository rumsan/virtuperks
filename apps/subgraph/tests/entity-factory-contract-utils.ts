import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import { EntityTaskManagerCreated } from "../generated/EntityFactoryContract/EntityFactoryContract"

export function createEntityTaskManagerCreatedEvent(
  entityTaskManager: Address,
  aclAddress: Address,
  _appId: Bytes
): EntityTaskManagerCreated {
  let entityTaskManagerCreatedEvent =
    changetype<EntityTaskManagerCreated>(newMockEvent())

  entityTaskManagerCreatedEvent.parameters = new Array()

  entityTaskManagerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "entityTaskManager",
      ethereum.Value.fromAddress(entityTaskManager)
    )
  )
  entityTaskManagerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "aclAddress",
      ethereum.Value.fromAddress(aclAddress)
    )
  )
  entityTaskManagerCreatedEvent.parameters.push(
    new ethereum.EventParam("_appId", ethereum.Value.fromFixedBytes(_appId))
  )

  return entityTaskManagerCreatedEvent
}
