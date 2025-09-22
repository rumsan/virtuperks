import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { ParticipantTaskStatus, ParticipantWhitelisted, TaskCreated, TaskDetail, TaskIdMapping } from "../generated/schema";
import { RewardManagement } from "../generated/templates/RewardManagement/RewardManagement";



export function fetchTaskDetails(taskId: Bytes, contractAddress: Address): TaskDetail {
  let taskDetail = TaskDetail.load(taskId);

  if (!taskDetail) {
    taskDetail = new TaskDetail(taskId);
    const contract = RewardManagement.bind(contractAddress);
   
    const task = contract.getTask(taskId);
   
  
    taskDetail.name = task.name;
    
    taskDetail.detailsUrl = task.detailsUrl;
    taskDetail.owner = task.owner;
    taskDetail.expiryDate = task.expiryDate;
    taskDetail.rewardToken = task.rewardToken;
    taskDetail.totalRewardAmount = task.totalRewardAmount;
    taskDetail.isOpen = task.isOpen;
    taskDetail.requireApproval = task.requireApproval;
    taskDetail.isWhitelisted = task.isWhitelisted;
    taskDetail.isTokenDisbursed = task.isTokenDisbursed;
    taskDetail.maxParticipants = task.maxParticipants;
    taskDetail.acceptedParticipantCount = task.acceptedParticipantCount;
    taskDetail.verifiedParticipants = []; // Initialize empty array
  

    taskDetail.save();
  }

  return taskDetail;
}



export function updateParticipantTaskStatus(
  participant: Bytes,
  taskId: Bytes,
  status: string,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  taskDetailId: Bytes | null ,
  completionUrl: string | null = null
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
      statusEntity.rewardManagement = taskCreated.rewardManagement
     
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

   // Store the completion URL if provided
  if (completionUrl) {
     statusEntity.completionUrl = completionUrl;
  }
 

  statusEntity.save();
  log.info("Updated ParticipantTaskStatus: participant={}, taskId={}, status={}", [
    participant.toHexString(),
    taskId.toHexString(),
    status
  ]);
}

// New helper function to add a participant to the whitelisted array
export function addParticipantToWhitelist(
  taskId: Bytes, 
  participant: Bytes, 
  blockNumber: BigInt, 
  blockTimestamp: BigInt,
  by: Bytes
): void {
  let whitelistId = taskId.concat(participant);
  

  // let whitelistEntity = new ParticipantWhitelisted(whitelistId);
  // whitelistEntity.taskId = taskId;
  // whitelistEntity.participant = participant;
  // whitelistEntity.by = by;
  // whitelistEntity.blockNumber = blockNumber;
  // whitelistEntity.blockTimestamp = blockTimestamp;
  // whitelistEntity.save();

  
  let taskDetail = TaskDetail.load(taskId);
  if (taskDetail) {
    let whitelistedParticipants: Bytes[] = [];
    

    
    // Check if participant is already in the array using a traditional loop
    let isAlreadyWhitelisted = false;
    for (let i = 0; i < whitelistedParticipants.length; i++) {
      if (whitelistedParticipants[i].equals(participant)) {
        isAlreadyWhitelisted = true;
        break;
      }
    }
    
    // Add participant if not already in the array
    if (!isAlreadyWhitelisted) {
      whitelistedParticipants.push(participant);
      taskDetail.whitelistedParticipants = whitelistedParticipants;
      taskDetail.save();
      
      log.info("Added participant {} to whitelist for task {}", [
        participant.toHexString(),
        taskId.toHexString()
      ]);
    }
  } else {
    log.warning("Could not find TaskDetail for taskId {} when trying to add to whitelist", [
      taskId.toHexString()
    ]);
  }
}



