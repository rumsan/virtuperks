import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { ParticipantTaskStatus, TaskCreated, TaskDetail, TaskIdMapping } from "../generated/schema";
import { EntityContract } from "../generated/templates/EntityContract/EntityContract";

export function fetchTaskDetails(taskId: Bytes, contractAddress: Address, taskCreatedId: Bytes): TaskDetail | null {
  let taskDetail = TaskDetail.load(taskId);
  const contract = EntityContract.bind(contractAddress);
  const taskData = contract.try_tasks(taskId);
  const wallets = contract.try_getAllowedWallets(taskId);

  if (!taskDetail) {
    taskDetail = new TaskDetail(taskId);
  }

  if (taskData.reverted || wallets.reverted) {
    log.error("Data fetch reverted for taskId: {}", [taskId.toHexString()]);
    return null;
  }

 
  taskDetail.detailsUrl = taskData.value.getDetailsUrl()
  taskDetail.taskName = taskData.value.getTaskName()
  
  taskDetail.rewardToken = taskData.value.getRewardToken()
  taskDetail.rewardAmount = taskData.value.getRewardAmount();
  taskDetail.maxParticipants = taskData.value.getMaxParticipants();
  taskDetail.expiryDate = taskData.value.getExpiryDate();
  taskDetail.owner = taskData.value.getOwner();
  taskDetail.isActive = taskData.value.getIsActive();
  

  if (!wallets.reverted) {
    const allowedWalletsBytes = wallets.value.map<Bytes>((address: Address) => {
      return address as Bytes;
    });
    taskDetail.allowedWallets = allowedWalletsBytes;
  }

  taskDetail.task = taskCreatedId;
  taskDetail.save();

  return taskDetail;
}

export function updateParticipantTaskStatus(
  participant: Bytes,
  taskId: Bytes,
  status: string,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  taskDetailId:Bytes | null 
): void {
  let id = participant.toHexString() + "-" + taskId.toHexString();
  let idBytes = Bytes.fromUTF8(id);
  
  let statusEntity = ParticipantTaskStatus.load(idBytes);
  if (!statusEntity) {
    statusEntity = new ParticipantTaskStatus(idBytes);
    statusEntity.participant = participant;
    statusEntity.taskId = taskId;
  }
  //load takcreated via taskIdMaping
  let mapping = TaskIdMapping.load(taskId)
  if (mapping) {
    let taskCreated = TaskCreated.load(mapping.taskCreated);
    if(taskCreated){
      statusEntity.entityTaskManager = taskCreated.entityTaskManager
     
    } else {
      log.warning("TaskCreated not found for taskId: {}", [taskId.toHexString()]);
      
    }

  }else {
    log.warning("TaskIdMapping not found for taskId: {}", [taskId.toHexString()]);
  }
  
  
 

  // Convert BigInt values if needed
  statusEntity.lastUpdatedBlock = blockNumber;
  statusEntity.lastUpdatedTimestamp = blockTimestamp;
  statusEntity.status = status;
  if (taskDetailId) {
    statusEntity.taskDetail = taskDetailId;
  }
 

  statusEntity.save();
  log.info("Updated ParticipantTaskStatus: participant={}, taskId={}, status={}", [
    participant.toHexString(),
    taskId.toHexString(),
    status
  ]);
}