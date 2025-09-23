import { CommonFields } from "./common.type";


interface RewardBase {
  title: string;
  description?: string;
  category?: string;
  tokens: number;
  isActive: boolean;
  wallet?: string;
  imageUrl?: string;
}


export type Reward = RewardBase & CommonFields;
export type CreateReward = RewardBase
export type EditReward = Partial<CreateReward> & { cuid: string };




