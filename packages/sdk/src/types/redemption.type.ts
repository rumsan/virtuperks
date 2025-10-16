 import { CommonFields } from "./common.type";
import { RedemptionStatus } from "./enums";

export type RedemptionBase = {
  rewardId: string; 
  userWalletAddress: string;
  phoneNumber?: string;
  transactionHash : string;
  status?: RedemptionStatus;
  details?: any;
};
export type Redemption = RedemptionBase & CommonFields  & {cuid: string};
export type  CreateRedemption = RedemptionBase
export type EditRedemption = Partial<CreateRedemption> & { cuid: string };



