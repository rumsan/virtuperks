import { z } from "zod";

export const updateSchema = z.object({
  detailsUrl: z
    .string()
    .url("Invalid URL format")
    .startsWith("http", "URL must start with http:// or https://")
    .optional()
    .or(z.literal("")),

  expiryDate: z
    .string()
    .refine(
      (date) => !date || !isNaN(new Date(date).getTime()),
      "Invalid deadline date"
    )
    .optional()
    .or(z.literal("")),
});

