import { z } from "zod";

export type Treasurer = {
  cuid?: string | null;
  name: string | null;
  walletAddress: string | null;
};

export const treasurerSchema = () => {
  const _schema = {
    name: z.string().min(1, "Treasurer name is required"),
    walletAddress: z.string().min(1, "Wallet address is required"),
  };
  return z.object(_schema);
};
