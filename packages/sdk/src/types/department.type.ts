import { TaskCreated } from "./task.type";

export interface DepartmentDetails {
  aclAddress: string;
  blockNumber: string;
  blockTimestamp: string;
  id: string;
  transactionHash: string;
  totalTokenBalance: string;
  remainingBalance: string;
  __typename: string;
  _appId: string;
  _name: string;
  tasks:TaskCreated[]
}
