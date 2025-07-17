import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { RewardRedemptionCreated } from "../generated/schema"
import { RewardRedemptionCreated as RewardRedemptionCreatedEvent } from "../generated/RewardRedemptionFactory/RewardRedemptionFactory"
import { handleRewardRedemptionCreated } from "../src/reward-redemption-factory"
import { createRewardRedemptionCreatedEvent } from "./reward-redemption-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let rewardRedemption = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let appId = Bytes.fromI32(1234567890)
    let name = "Example string value"
    let tokensRequired = BigInt.fromI32(234)
    let newRewardRedemptionCreatedEvent = createRewardRedemptionCreatedEvent(
      rewardRedemption,
      appId,
      name,
      tokensRequired
    )
    handleRewardRedemptionCreated(newRewardRedemptionCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("RewardRedemptionCreated created and stored", () => {
    assert.entityCount("RewardRedemptionCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "RewardRedemptionCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "rewardRedemption",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "RewardRedemptionCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "appId",
      "1234567890"
    )
    assert.fieldEquals(
      "RewardRedemptionCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "name",
      "Example string value"
    )
    assert.fieldEquals(
      "RewardRedemptionCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokensRequired",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
