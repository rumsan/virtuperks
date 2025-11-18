import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, Address } from "@graphprotocol/graph-ts"
import { OwnerAdded } from "../generated/schema"
import { OwnerAdded as OwnerAddedEvent } from "../generated/RewardManagementFactory/RewardManagementFactory"
import { handleOwnerAdded } from "../src/reward-management-factory"
import { createOwnerAddedEvent } from "./reward-management-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let entityId = Bytes.fromI32(1234567890)
    let name = "Example string value"
    let entityOwner = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newOwnerAddedEvent = createOwnerAddedEvent(entityId, name, entityOwner)
    handleOwnerAdded(newOwnerAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("OwnerAdded created and stored", () => {
    assert.entityCount("OwnerAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "OwnerAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "entityId",
      "1234567890"
    )
    assert.fieldEquals(
      "OwnerAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "name",
      "Example string value"
    )
    assert.fieldEquals(
      "OwnerAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "entityOwner",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
