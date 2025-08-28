import { z } from "zod";

export type Token = {
  address?: string;
  amount?: number;
};

export const tokenSchema = () =>
  z.object({
    amount: z
      .number({ required_error: "Token amount is required" })
      .min(1, "Minimum token value must be 1"),
  });
