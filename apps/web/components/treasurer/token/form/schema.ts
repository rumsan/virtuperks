import { z } from "zod";

export type Token = {
  amount: number;
};

export const tokenSchema = () => {
  return z.object({
    amount: z
      .number({ required_error: "Amount is required" })
      .min(1, "Minimum token value must be 1"),
  });
};
