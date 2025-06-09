import { Address, Bytes } from "@graphprotocol/graph-ts";
import { TaskDetail } from "../generated/schema";
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
