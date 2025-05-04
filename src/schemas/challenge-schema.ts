import { z } from "zod";

export const challengeSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    duration: z.coerce.number().nonnegative().min(1),
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "Start date must be before end date",
    path: ["endDate"],
  });

export type ChallengeFormData = z.infer<typeof challengeSchema>;
