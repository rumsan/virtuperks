export type TaskDetail = {
  allowedWallets: string[];
  taskName: string;
  detailsUrl: string;
  expiryDate: number;
  id: string;
  isOpen: boolean;
  maxParticipants: string;
  owner: string;
  rewardAmount: string;
  rewardToken: string;
  isTokenDisbursed: boolean;
};
