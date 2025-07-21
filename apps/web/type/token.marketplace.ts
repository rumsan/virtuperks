export type Reward = {
  id: number;
  title: string;
  // icon: LucideIcon;
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
