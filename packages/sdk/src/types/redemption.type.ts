import type { Reward } from "./reward.type";

export interface Redemption {
  id: number;
  userAddress: string;
  rewardId: string;
  reward?: Reward;  
  tokens: bigint;
  transactionHash?: string;
  status: RedemptionStatus;
  taskId?: string;
  redeemedAt: Date;
}

export type RedemptionStatus = "PENDING" | "COMPLETED";
