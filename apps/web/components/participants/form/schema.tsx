import { z } from "zod";

export type Participant = {
  cuid?: string | null;
  name: string | null;
  email: string | null;
  walletAddress: string | null;
  gender: string | null;
  manager: string | null;
  userRole: string | null;
};

export const participantSchema = () => {
  const _schema = {
    name: z.string().min(1, "Participant name is required"),
    email: z.string().min(1, "Participant email name is required"),
    walletAddress: z.string().min(1, "Participant wallet address is required"),
    gender: z.string().min(1, "Gender is required"),
    manager: z.string().min(1, "Manager is required"),
    userRole: z.string().min(1, "User role is required"),
  };
  return z.object(_schema);
};
