type TaskDetail = {
  detailsUrl: string;
  expiryDate: string;
  id: string;
  isActive: boolean;
  maxParticipants: string;
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
