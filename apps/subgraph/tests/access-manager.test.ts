import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, Address } from "@graphprotocol/graph-ts"
import { AppCreated } from "../generated/schema"
import { AppCreated as AppCreatedEvent } from "../generated/AccessManager/AccessManager"
import { handleAppCreated } from "../src/access-manager"
import { createAppCreatedEvent } from "./access-manager-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let appId = Bytes.fromI32(1234567890)
    let account = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAppCreatedEvent = createAppCreatedEvent(appId, account)
    handleAppCreated(newAppCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AppCreated created and stored", () => {
    assert.entityCount("AppCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AppCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "appId",
      "1234567890"
    )
    assert.fieldEquals(
      "AppCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "account",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
