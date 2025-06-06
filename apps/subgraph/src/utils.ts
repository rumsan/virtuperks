import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { TaskCreated} from "../generated/schema";
import {RewardManagement } from "../generated/templates/RewardManagement/RewardManagement"



export function fetchTaskDetails(taskId: Bytes, contractAddress: Address, taskCreatedId: Bytes): TaskDetail | null {
//   let taskDetail = TaskDetail.load(taskId);
//   const contract = RewardManagement.bind(contractAddress);
//   const taskData = contract.try_tasks(taskId);
//   //const wallets = contract.try_getAllowedWallets(taskId);

//   if (!taskDetail) {
//     taskDetail = new TaskDetail(taskId);
//   }

 
//   taskDetail.detailsUrl = taskData.value.getDetailsUrl()
//   taskDetail.name = taskData.value.getName()
  
//   taskDetail.rewardToken = taskData.value.getRewardToken()
//   taskDetail.totalRewardAmount = taskData.value.getTotalRewardAmount();
//   taskDetail.maxParticipants = taskData.value.getMaxParticipants();
//   taskDetail.expiryDate = taskData.value.getExpiryDate();
//   taskDetail.owner = taskData.value.getOwner();
//   taskDetail.isOpen = taskData.value.getIsOpen();
  

// //   if (!wallets.reverted) {
// //     const allowedWalletsBytes = wallets.value.map<Bytes>((address: Address) => {
// //       return address as Bytes;
// //     });
// //     taskDetail.allowedWallets = allowedWalletsBytes;
// //   }

//   taskDetail.task = taskCreatedId;
//   taskDetail.save();

//   return taskDetail;
}
