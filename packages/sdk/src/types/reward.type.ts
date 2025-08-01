import { CommonFields } from "./common.type";


interface RewardBaseFields {
  name: string;
  appId?: string;
  tokensRequired: bigint;
  image?: string;
}


export type Reward = RewardBaseFields & {
  rewardRedemptionId: string;
} & CommonFields;

export type CreateReward = {
  name: string;
  tokensRequired: number;
  appId?: string;
  image?: string;
};


// export type RewardRedemption = {
//   rewardId: string;
//   userAddress: string;
//   tokensRequired: number;
//   status: "pending" | "completed";
// } & CommonFields;
