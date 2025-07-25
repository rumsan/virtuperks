 import { CommonFields } from "./common.type";
import { RedemptionStatus } from "./enums";

export type RewardBase = {
  rewardRedemption: string;   
  appId?: string;
  name: string;
  tokensRequired: bigint;
  image?: string;
};

export type RewardRedemptionBase = {
  name: string;
  rewardId: string;
  appId: string;
  tokensRequired: number;
};


export type CreateRedemption = {
  userAddress: string;
  rewardId: string;
  tokens: number;
  transactionHash?: string;
  status: RedemptionStatus;
  taskId?: string;
};


export type RewardRedemption = RewardRedemptionBase & CommonFields & {
  status: number;   
  from: string;
};


