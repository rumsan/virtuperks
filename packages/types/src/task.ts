type TaskDetail = {
  detailsUrl: string;
  expiryDate: string;
  id: string;
  isActive: boolean;
  maxParticipants: string;
  owner: string;
  rewardAmount: string;
  rewardToken: string;
};

type EntityTaskManager = {
  _appId: string;
  _name: string;
  id: string;
  __typename: string;
};

export interface TaskData {
  blockNumber: string;
  blockTimestamp: string;
  createdBy: string;
  entityTaskManager: EntityTaskManager;
  id: string;
  taskDetail: TaskDetail;
  transactionHash: string;
  __typename: string;
}

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

export type ExtendedTaskData = TaskData & {
  taskDetail: TaskDetail & {
    allowedWallets: string[];
  };
};

export type ExtendedTaskDetails = TaskDetail & {
  taskDetail: TaskDetail & {
    allowedWallets: string[];
    __typename: string;
  };
};


