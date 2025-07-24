 import { CommonFields } from "./common.type";

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

export type RewardRedemption = RewardRedemptionBase & CommonFields;

export type Reward = RewardBase & CommonFields;
