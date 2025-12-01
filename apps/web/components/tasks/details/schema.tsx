import { z } from "zod";

export const updateSchema = z.object({
  detailsUrl: z
    .string()
    .url("URL must be a valid URL starting with http:// or https://")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "URL must start with http:// or https://"
    )
    .optional()
    .or(z.literal("")),

  expiryDate: z
    .string()
    .trim()
    .refine(
      (date) => date === "" || !isNaN(new Date(date).getTime()),
      "Invalid deadline date"
    )
    .refine(
      (date) => {
        if (!date) return true; 
  
        const input = new Date(date);
        const today = new Date();
  
       
        input.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
  
        return input > today;
      },
      "Deadline must be a future date"
    )
    .optional()
    .or(z.literal("")),

});
  
