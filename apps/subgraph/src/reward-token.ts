import {
  Approval as ApprovalEvent,
  Transfer as TransferEvent,
} from "../generated/RewardToken/RewardToken"
import { Approval, EntityTaskManagerCreated, TokenMinted } from "../generated/schema"

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
  let entityContract = EntityTaskManagerCreated.load(event.params.owner);
}

export function handleTransfer(event: TransferEvent): void {
  let entityId = event.params.to;
  let entity = EntityTaskManagerCreated.load(entityId);
  if (entity == null) {
    return;
  }

  let mindId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let tokenMinted = new TokenMinted(mindId);
  tokenMinted.entityTaskManager = entityId;
  tokenMinted.tokenAddress = event.address;
  tokenMinted.amount = event.params.value;
  tokenMinted.blockNumber = event.block.number;
  tokenMinted.blockTimestamp = event.block.timestamp;
  tokenMinted.transactionHash = event.transaction.hash;

  // These are now guaranteed to exist since they're required in the schema
  entity.totalTokenBalance = entity.totalTokenBalance.plus(event.params.value);
  entity.remainingBalance = entity.totalTokenBalance
    .minus(entity.allocatedToTasks)
    .minus(entity.distributed);
  
  entity.save();
  tokenMinted.save();
}
