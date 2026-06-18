export enum JobType {
  Internship = "Internship",
  Full_time = "Full_time",
  Part_time = "Part_time",
}

export enum ApplicationStatus {
  Applied = "Applied",
  Interviewing = "Interviewing",
  Offer = "Offer",
  Rejected = "Rejected",
}

export interface Application {
  id: string;
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: Date;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ListApplicationsQuery {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateApplicationDto {
  company_name: string;
  job_title: string;
  job_type: JobType;
  status?: ApplicationStatus;
  applied_date: string;
  notes?: string;
}

export interface UpdateApplicationDto {
  company_name?: string;
  job_title?: string;
  job_type?: JobType;
  status?: ApplicationStatus;
  applied_date?: string;
  notes?: string;
}
