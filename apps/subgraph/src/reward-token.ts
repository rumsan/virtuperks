import {
  Approval as ApprovalEvent,
  Transfer as TransferEvent,
} from "../generated/RewardToken/RewardToken"
import { Approval, Transfer, RewardManagementCreated } from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash


  if (event.params.from.toHexString() == "0x0000000000000000000000000000000000000000") {
    let rewardManagement = RewardManagementCreated.load(event.params.to);
    if (rewardManagement != null) {
      
      rewardManagement.totalMintedTokens = rewardManagement.totalMintedTokens.plus(
        event.params.value
      );
      rewardManagement.totalAvailableTokens = rewardManagement.totalAvailableTokens.plus(
        event.params.value
      );
      rewardManagement.save();
      entity.rewardManagement = rewardManagement.id;
    }
  }

  entity.save()
}
