import { z } from "zod";

export const challengeSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    startDate: z.date(),
    endDate: z.date().nullable().optional(),
  })
  .refine((data) => !data.endDate || data.startDate < data.endDate, {
    message: "Start date must be before end date",
    path: ["endDate"],
  });

export type ChallengeFormData = z.infer<typeof challengeSchema>;
