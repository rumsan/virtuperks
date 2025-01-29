import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { ParticiantApplied } from "../generated/schema"
import { ParticiantApplied as ParticiantAppliedEvent } from "../generated/TaskManagement/TaskManagement"
import { handleParticiantApplied } from "../src/task-management"
import { createParticiantAppliedEvent } from "./task-management-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = "Example string value"
    let participant = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newParticiantAppliedEvent = createParticiantAppliedEvent(
      id,
      participant
    )
    handleParticiantApplied(newParticiantAppliedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ParticiantApplied created and stored", () => {
    assert.entityCount("ParticiantApplied", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ParticiantApplied",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "participant",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
