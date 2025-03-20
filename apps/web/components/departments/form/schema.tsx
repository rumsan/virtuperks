import { z } from "zod";

export type Department = {
  name: string | null;
  appId?: string | null;
};

export const departmentSchema = () => {
  const _schema = {
    name: z.string().min(1, "Department name is required"),
  };
  return z.object(_schema);
};
