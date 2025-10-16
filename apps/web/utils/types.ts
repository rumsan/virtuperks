import { Redemption } from "@workspace/sdk/type";

export type RedemptionWithRelations = Redemption & {
  reward: {
    cuid: string;
    title: string;
    tokens: number;
    wallet: string;
  };
  phone: {
    cuid: string;
    phoneNumber: string;
    userWalletAddress: string;
  };
};
