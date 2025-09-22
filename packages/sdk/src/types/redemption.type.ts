 import { CommonFields } from "./common.type";
import { RedemptionStatus } from "./enums";

export type RedemptionBase = {
  userAddress: string;
  rewardId: string;
  userPhoneNumber?: string;
  transactionHash?: string;
  status: RedemptionStatus;
  
};
export type Redemption = RedemptionBase & CommonFields  & {cuid: string};
export type  CreateRedemption = RedemptionBase
export type EditRedemption = Partial<CreateRedemption> & { cuid: string };



