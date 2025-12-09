import { z } from "zod";

export type AssignRoleForm = {
  walletAddress: string;
  role: string;
};

export const assignRoleSchema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required"),
  role: z.string().min(1, "Role is required"),
});
