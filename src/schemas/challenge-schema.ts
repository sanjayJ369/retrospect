import { z } from "zod";

export const challengeEditSchema = z.object({
  title: z.string().min(1, "Title is reqired"),
  description: z.string().optional(),
});

export const challengeSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    startDate: z.date(),
    endDate: z.date().nullable().optional(),

    duration: z.number().min(1, "Duration must be at least 1 day").optional(),

    isLimitless: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.isLimitless && !data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "An end date is required unless the challenge is limitless.",
        path: ["endDate"],
      });
    }

    if (data.endDate && data.startDate > data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date must be before the end date.",
        path: ["endDate"],
      });
    }
  });

export type ChallengeFormData = z.infer<typeof challengeSchema>;
export type ChallengeEditData = z.infer<typeof challengeEditSchema>;
