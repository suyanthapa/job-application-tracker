export type JobType = "Internship" | "Full_time" | "Part_time";
export type ApplicationStatus =
  | "Applied"
  | "Interviewing"
  | "Offer"
  | "Rejected";

export interface Application {
  id: string;
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApplicationsResponse {
  items: Application[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    errors?: { field: string; message: string }[];
  };
}

export interface ApplicationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}
