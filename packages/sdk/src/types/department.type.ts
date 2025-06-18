import { TaskCreated } from "./task.type";

export interface DepartmentDetails {
  aclAddress: string;
  blockNumber: string;
  blockTimestamp: string;
  id: string;
  transactionHash: string;
  totalAvailableTokens: string;
  totalMintedTokens: string;
  __typename: string;
  _appId: string;
  name: string;
  tasks: TaskCreated[];
  rewardManagement: string;
}
