import { z } from "zod";

export type Task = {
  cuid?: string;
  title: string;
  url: string;
  status: string;
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
    owner: z.string().min(1, "Task owner is required"),
    date: z.date({ required_error: "Date is required" }),
    participants: z.number().min(1, "Task participants is required"),
    tokens: z.number().min(1, "Task token is required"),
  };
  return z.object(_schema);
};
