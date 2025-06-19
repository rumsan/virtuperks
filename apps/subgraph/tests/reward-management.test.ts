import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import { AdditionalDisbursementToTask } from "../generated/schema"
import { AdditionalDisbursementToTask as AdditionalDisbursementToTaskEvent } from "../generated/RewardManagement/RewardManagement"
import { handleAdditionalDisbursementToTask } from "../src/reward-management"
import { createAdditionalDisbursementToTaskEvent } from "./reward-management-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let taskId = Bytes.fromI32(1234567890)
    let amount = BigInt.fromI32(234)
    let remarks = "Example string value"
    let disbursedBy = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAdditionalDisbursementToTaskEvent =
      createAdditionalDisbursementToTaskEvent(
        taskId,
        amount,
        remarks,
        disbursedBy
      )
    handleAdditionalDisbursementToTask(newAdditionalDisbursementToTaskEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AdditionalDisbursementToTask created and stored", () => {
    assert.entityCount("AdditionalDisbursementToTask", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AdditionalDisbursementToTask",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "taskId",
      "1234567890"
    )
    assert.fieldEquals(
      "AdditionalDisbursementToTask",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )
    assert.fieldEquals(
      "AdditionalDisbursementToTask",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "remarks",
      "Example string value"
    )
    assert.fieldEquals(
      "AdditionalDisbursementToTask",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "disbursedBy",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
