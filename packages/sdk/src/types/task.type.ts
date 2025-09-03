import { CommonFields } from "./common.type";
import { EntityTaskManagerCreated } from "./entity.type";
import { TaskDetail } from "./taskDetail.type";

export interface AcceptedTaskData extends CommonFields {
  participant?: string;
  status?: string;
  taskDetail: TaskDetail & {
    allowedWallets: string[];
    __typename: string;
  };
}


export type RewardManagement = {
  appId: string;
  id: string;
  name: string;
  rewardManagement: string; 
};

export type TaskCreated = CommonFields & {
  internal_id: string;
  entityTaskManager?: EntityTaskManagerCreated;
  rewardManagement?: RewardManagement; 
  status: string;
  taskDetail: TaskDetail;
  taskId: string;
};


export interface TaskCreateParams {
  
  taskId: string;        
  

  name: string;           
  detailsUrl: string;    
  owner: string;         
  expiryDate: number;     
  
 
  rewardToken: string;   
  totalRewardAmount: string;
  isOpen: boolean;
  isTokenDisbursed: boolean;
  
 
  requireApproval: boolean; 
  isWhitelisted: boolean;  
  

  maxParticipants: number;  
  acceptedParticipantCount: number;
  
  
  whitelistedParticipants?: string[];  
}


export interface Tasks {
  id: string;
  internal_id: string;
  taskDetail: {
    name: string;
    isOpen: boolean;
    detailsUrl: string;
    maxParticipants: number;
    expiryDate: number;
    totalRewardAmount: number;
    acceptedParticipantCount: number;
  };
}