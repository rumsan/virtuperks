export type Reward = {
  id: string;
  title: string;
  description: string;
  tokens: number;
  category: string;
  image: string;
};

export type RewardRedemption = {
  id: string;
  name: string;
  tokensRequired: string;
  appId: string;
  rewardRedemption: string;
  transactionHash: string;
  blockNumber: string;
  blockTimestamp: string;
};

export type RewardsQueryResult = {
  rewardRedemptionCreateds: RewardRedemption[];
};

export type RedemptionStatus = "completed" | "pending";

export interface Redemption {
  name: string;
  date: string;
  status: RedemptionStatus;
  txnId: string;
}

export interface RewardDetailsProps {
  rewardId: string;
  router: any;
}
