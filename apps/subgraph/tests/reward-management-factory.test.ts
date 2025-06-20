import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes } from "@graphprotocol/graph-ts"
import { RewardManagementCreated } from "../generated/schema"
import { RewardManagementCreated as RewardManagementCreatedEvent } from "../generated/RewardManagementFactory/RewardManagementFactory"
import { handleRewardManagementCreated } from "../src/reward-management-factory"
import { createRewardManagementCreatedEvent } from "./reward-management-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let rewardManagement = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let registry = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let appId = Bytes.fromI32(1234567890)
    let name = "Example string value"
    let entityId = Bytes.fromI32(1234567890)
    let newRewardManagementCreatedEvent = createRewardManagementCreatedEvent(
      rewardManagement,
      registry,
      appId,
      name,
      entityId
    )
    handleRewardManagementCreated(newRewardManagementCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("RewardManagementCreated created and stored", () => {
    assert.entityCount("RewardManagementCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "RewardManagementCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "rewardManagement",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "RewardManagementCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "registry",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "RewardManagementCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "appId",
      "1234567890"
    )
    assert.fieldEquals(
      "RewardManagementCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "name",
      "Example string value"
    )
    assert.fieldEquals(
      "RewardManagementCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "entityId",
      "1234567890"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
