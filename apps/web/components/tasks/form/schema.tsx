import { z } from "zod";

type TaskBase = {
  cuid?: string;
  title: string;
  url: string;
  status: string;
  description: string;
  owner: string;
  date: string;
  participants: number;
  tokens: number;
};

export type Task = Omit<TaskBase, "participants" | "tokens"> & {
  participants?: string | null;
  tokens?: string | null;
};

export const taskSchema = () => {
  const _schema = {
    //title: z.string().min(1, "Task title is required"),
    detailsUrl: z.string().min(1, "Task url name is required"),
    //status: z.string().min(1, "Task status is required"),
   // description: z.string().min(1, "Task description is required"),
    owner: z.string().min(1, "Task owner is required"),
    rewardToken: z.string().min(1, "Task reward token is required"),
    expiryDate: z.date({ required_error: "Date is required" }),
    allowedWallets: z.string(),
    maxParticipants: z.number(),
    entityAddress: z.string({ required_error: "Entity address is required" }),
    rewardAmount: z.coerce
      .number({
        required_error: "Token is required",
        invalid_type_error: "Token must be a number",
      })
      .positive()
      .min(1, { message: "Token should be at least 1" }),
    isActive: z.boolean(),
  };

  return z.object(_schema);
};
