import { z } from "zod";

export type Department = {
  name: string;
  appId?: string;
  entityOwners: string[];
};

export const departmentSchema = () => {
  const _schema = {
    name: z.string().min(1, "Department name is required"),
    entityOwners: z
  .array(
    z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address"),
  )
  .min(1, "At least one entity owner is required")
  .max(5, "A maximum of 5 entity owners is allowed")
  .refine(
    (addresses) =>
      new Set(addresses.map((a) => a.toLowerCase())).size === addresses.length,
    {
      message: "Duplicate wallet addresses are not allowed",
    }
  )
  .default([]),
  currentWallet: z.string().optional(),
  };
  return z.object(_schema);
};
