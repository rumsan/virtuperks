import { z } from "zod";

export type Token = {
  address?: string;
  amount: string;
};

export const tokenSchema = () => {
  const _schema = {
    amount: z
      .string()
      .min(1, "Token amount is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be a valid number",
      }),
  };
  return z.object(_schema);
};
