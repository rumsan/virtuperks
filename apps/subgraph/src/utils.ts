import { Address, Bytes } from "@graphprotocol/graph-ts";
import { TaskDetail } from "../generated/schema";
import { EntityContract } from "../generated/templates/EntityContract/EntityContract";


export function fetchTaskDetails(taskId:Bytes, contractAddress: Address): TaskDetail | null {
   
    let taskDetail = TaskDetail.load(taskId);

    const contract = EntityContract.bind(contractAddress);
    //const taskString = taskId.toString()
  
    const taskData = contract.try_tasks(taskId);
   

   if (!taskDetail) {
  
    taskDetail = new TaskDetail(taskId);
  }

  if (taskData.reverted) {
  
    return null;
  }

 
  taskDetail.detailsUrl = taskData.value.getDetailsUrl()
  taskDetail.rewardToken = taskData.value.getRewardToken()
  taskDetail.rewardAmount = taskData.value.getRewardAmount();
  
  taskDetail.maxParticipants = taskData.value.getMaxParticipants()
  taskDetail.expiryDate = taskData.value.getExpiryDate();
  taskDetail.owner = taskData.value.getOwner();
  taskDetail.isActive = taskData.value.getIsActive();
  
  //taskDetail.createdBy = taskData.value.;

 
  taskDetail.save();

  return taskDetail;

}