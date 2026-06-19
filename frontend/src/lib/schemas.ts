import { z } from "zod";

export const JobTypeEnum = z.enum(["Internship", "Full_time", "Part_time"]);
export const ApplicationStatusEnum = z.enum(["Applied", "Interviewing", "Offer", "Rejected"]);

export const createApplicationSchema = z.object({
  company_name: z
    .string()
    .min(2, "Company name must be at least 2 characters.")
    .max(255, "Company name must not exceed 255 characters."),
  job_title: z
    .string()
    .min(2, "Job title must be at least 2 characters.")
    .max(255, "Job title must not exceed 255 characters."),
  job_type: JobTypeEnum,
  status: ApplicationStatusEnum.default("Applied"),
  applied_date: z.string().min(1, "Applied date is required."),
  notes: z.string().max(2000, "Notes must not exceed 2000 characters.").optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided." }
);

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
