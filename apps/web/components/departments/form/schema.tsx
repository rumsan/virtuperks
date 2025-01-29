import { z } from "zod";

export type Department = {
  name: string | null;
  owner: string | null;
  walletAddress: string | null;
};

export const departmentSchema = () => {
  const _schema = {
    name: z.string().min(1, "Department name is required"),
    owner: z.string().min(1, "Department owner is required"),
    walletAddress: z.string().min(1, "Wallet address is required"),
  };
  return z.object(_schema);
};
