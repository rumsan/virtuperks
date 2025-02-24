import { Address, Bytes } from "@graphprotocol/graph-ts"
import {
  afterAll,
  assert,
  beforeAll,
  clearStore,
  describe,
  test
} from "matchstick-as/assembly/index"
import { handleEntityTaskManagerCreated } from "../src/factory-contract"
import { createEntityTaskManagerCreatedEvent } from "./factory-contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let entityTaskManager = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let aclAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let _appId = Bytes.fromI32(1234567890)
    let _name = "Example string value"
    let newEntityTaskManagerCreatedEvent = createEntityTaskManagerCreatedEvent(
      entityTaskManager,
      aclAddress,
      _appId,
      _name
    )
    handleEntityTaskManagerCreated(newEntityTaskManagerCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("EntityTaskManagerCreated created and stored", () => {
    assert.entityCount("EntityTaskManagerCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "EntityTaskManagerCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "entityTaskManager",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "EntityTaskManagerCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "aclAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "EntityTaskManagerCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_appId",
      "1234567890"
    )
    assert.fieldEquals(
      "EntityTaskManagerCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_name",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
