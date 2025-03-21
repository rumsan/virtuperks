export type TaskDetail = {
  allowedWallets: string[];
  detailsUrl: string;
  expiryDate: string;
  id: string;
  isActive: boolean;
  maxParticipants: string;
  owner: string;
  rewardAmount: string;
  rewardToken: string;
};

type EntityTaskManagerCreated = {
  _appId: string;
  _name: string;
  id: string;
};




export interface AcceptedTaskData {
  blockNumber: string;
  blockTimestamp: string;
  id: string;
  internal_id: string;
  participant: string;
  status: string;
  taskDetail: TaskDetail & {
    allowedWallets: string[];
    __typename: string;
  };
  transactionHash: string;
  __typename: string;
}




export type  TaskCreated   =  {
  blockNumber: string; 
  blockTimestamp: string; 
  createdBy: string; 
  entityTaskManager: EntityTaskManagerCreated; 
  id: string; 
  taskDetail: TaskDetail; 
  transactionHash: string; 
  __typename: string; 
}

