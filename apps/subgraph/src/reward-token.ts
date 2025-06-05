import { BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import {
  Approval as ApprovalEvent,
  Transfer as TransferEvent,
} from "../generated/RewardToken/RewardToken"
import { Approval, RewardManagementCreated, TokenMinted } from "../generated/schema"

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
  let rewardManagementCreated = RewardManagementCreated.load(event.params.owner)
}

export function handleTransfer(event: TransferEvent): void {
  // Convert the recipient address to hex string for entity ID
  let rewardManagementId = event.params.to.toHexString();
  let rewardManagement = RewardManagementCreated.load(Bytes.fromHexString(rewardManagementId) as Bytes);
  
  if (rewardManagement != null) {
    // Create unique ID for TokenMinted entity
    let tokenMintedId = event.transaction.hash.concatI32(event.logIndex.toI32());
    let tokenMinted = new TokenMinted(tokenMintedId);
    
    tokenMinted.rewardManagement = rewardManagement.id;
    tokenMinted.tokenAddress = event.address;
    tokenMinted.amount = event.params.value;
    tokenMinted.blockNumber = event.block.number;
    tokenMinted.blockTimestamp = event.block.timestamp;
    tokenMinted.transactionHash = event.transaction.hash;

    // Initialize totalTokenBalance if it's null or zero
    if (rewardManagement.totalTokenBalance.equals(BigInt.fromI32(0))) {
      rewardManagement.totalTokenBalance = event.params.value;
    } else {
      rewardManagement.totalTokenBalance = rewardManagement.totalTokenBalance.plus(event.params.value);
    }

    // Set initial values if they don't exist
    if (!rewardManagement.allocatedToTasks) {
      rewardManagement.allocatedToTasks = BigInt.fromI32(0);
    }
    if (!rewardManagement.distributed) {
      rewardManagement.distributed = BigInt.fromI32(0);
    }

    // Calculate remaining balance
    rewardManagement.remainingTokenBalance = rewardManagement.totalTokenBalance
      .minus(rewardManagement.allocatedToTasks)
      .minus(rewardManagement.distributed);

    log.info(
      "Token minted to RewardManagement: {}, Amount: {}, Total Balance: {}", 
      [
        rewardManagementId,
        event.params.value.toString(),
        rewardManagement.totalTokenBalance.toString()
      ]
    );

    tokenMinted.save();
    rewardManagement.save();
  }
}
