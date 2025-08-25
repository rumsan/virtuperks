import { z } from "zod";

export const taskSchema = () => {
  return z.object({
    name: z.string().min(1, "Task name is required"),
    detailsUrl: z.string().min(1, "Task details URL is required"),
    owner: z.string().min(1, "Task owner is required"),
    entityAddress: z.string().min(1, "Entity address is required"),

    // Expiry date
    expiryDate: z.coerce
      .date({
        required_error: "Expiry date is required",
        invalid_type_error: "Invalid date",
      })
      .refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const expiry = new Date(date);
          expiry.setHours(0, 0, 0, 0);

          return expiry > today;
        },
        { message: "Expiry date must be after today" },
      ),

    rewardToken: z
      .string()
      .min(1, "Reward token address is required")
      .default(process.env.NEXT_PUBLIC_RAHAT_TOKEN || ""),

    totalRewardAmount: z.coerce
      .number({
        required_error: "Reward amount is required",
        invalid_type_error: "Reward amount must be greater than 0 number",
      })
      .refine((val) => val > 0, {
        message: "Reward amount must be greater than 0",
      }),

    isOpen: z.boolean().default(true),
    isTokenDisbursed: z.boolean().default(false),
    acceptedParticipantCount: z.number().optional().default(0),

    verifiedParticipants: z
      .array(
        z
          .string()
          .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address"),
      )
      .optional()
      .default([]),

    requireApproval: z.boolean().default(true),
    isWhitelisted: z.boolean().default(true),

    maxParticipants: z
      .number()
      .int()
      .positive()
      .min(1, "At least one participant must be allowed"),

    whitelistedParticipants: z
      .array(
        z
          .string()
          .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address"),
      )
      .min(1, "At least one participant address is required")
      .optional()
      .default([]),
  });
};

export type TaskFormData = z.infer<ReturnType<typeof taskSchema>>;
