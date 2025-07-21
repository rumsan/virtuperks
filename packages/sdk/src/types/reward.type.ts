import { CommonFields} from "./common.type";



export type RewardBase = {
  rewardRedemption: string;
  appId?: string;
  name: string;
  tokensRequired: bigint;
  image?: string;


}
export type Reward = RewardBase & CommonFields 

