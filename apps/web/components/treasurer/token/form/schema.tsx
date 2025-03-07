import { z } from "zod";

export type Token = {
  amount: string;
};

export const tokenSchema = () => {
  const _schema = {
    amount: z.string(),
  };
  return z.object(_schema);
};
