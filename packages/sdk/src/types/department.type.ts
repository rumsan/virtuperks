import { TaskCreated } from "./task.type";

export interface DepartmentDetails {
  aclAddress: string;
  blockNumber: string;
  blockTimestamp: string;
  id: string;
  transactionHash: string;
  totalTokenBalance: string;
  remainingTokenBalance: string;
  __typename: string;
  _appId: string;
  name: string;
  tasks: TaskCreated[];
  rewardManagement: string;
}
