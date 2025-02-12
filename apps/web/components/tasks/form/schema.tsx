import { z } from "zod";

export type Task = {
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

export const taskSchema = () => {
  const _schema = {
    title: z.string().min(1, "Task title is required"),
    url: z.string().min(1, "Task url name is required"),
    status: z.string().min(1, "Task status is required"),
    description: z.string().min(1, "Task description is required"),
    owner: z.string().min(1, "Task owner is required"),
    date: z.date({ required_error: "Date is required" }),
    participants: z.number().min(1, "Task participants is required"),
    tokens: z.coerce
      .number({
        required_error: "Token is required",
        invalid_type_error: "Token must be a number",
      })
      .positive()
      .min(1, { message: "Token should be at least 1" }),
  };
  return z.object(_schema);
};
