import { CommonFields } from "./common.type";


interface RewardBase {
  title: string;
  description?: string;
  tokens: number;
  isActive: boolean;
  wallet?: string;
  imageUrl?: string;
}


export type Reward = RewardBase & CommonFields;
export type CreateReward = RewardBase
export type EditReward = Partial<CreateReward> & { cuid: string };




// export type RewardRedemption = {
//   rewardId: string;
//   userAddress: string;
//   tokensRequired: number;
//   status: "pending" | "completed";
// } & CommonFields;
