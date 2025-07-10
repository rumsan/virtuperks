export interface CreateRedemptionDto {
  userAddress: string;
  rewardId: string;
  tokens: bigint;
  taskId?: string;
}
