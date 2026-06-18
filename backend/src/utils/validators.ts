import { z } from "zod";
import { ApplicationStatus, JobType } from "../types/index.js";

export const createApplicationSchema = z.object({
  body: z.object({
    company_name: z
      .string()
      .min(2, "company_name must be at least 2 characters")
      .max(255, "company_name must not exceed 255 characters"),
    job_title: z
      .string()
      .min(2, "job_title must be at least 2 characters")
      .max(255),
    job_type: z.nativeEnum(JobType),
    status: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.Applied),
    applied_date: z.string().datetime("Invalid applied_date format"),
    notes: z.string().max(2000).optional(),
  }),
});

export const updateApplicationSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid application ID"),
  }),
  body: z
    .object({
      company_name: z
        .string()
        .min(2, "company_name must be at least 2 characters")
        .max(255)
        .optional(),
      job_title: z
        .string()
        .min(2, "job_title must be at least 2 characters")
        .max(255)
        .optional(),
      job_type: z.nativeEnum(JobType).optional(),
      status: z.nativeEnum(ApplicationStatus).optional(),
      applied_date: z
        .string()
        .datetime("Invalid applied_date format")
        .optional(),
      notes: z.string().max(2000).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export const getApplicationByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid application ID"),
  }),
});

export const getApplicationsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    status: z.nativeEnum(ApplicationStatus).optional(),
    search: z.string().max(100).optional(),
  }),
});

// Type Definitions

export type CreateApplicationInput = z.infer<
  typeof createApplicationSchema
>["body"];
export type UpdateApplicationInput = z.infer<
  typeof updateApplicationSchema
>["body"];
export type GetApplicationsInput = z.infer<
  typeof getApplicationsSchema
>["query"];
