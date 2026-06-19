import type { ApplicationStatus, JobType } from "@/types";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  Applied: "Applied",
  Interviewing: "Interviewing",
  Offer: "Offer",
  Rejected: "Rejected",
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  Internship: "Internship",
  Full_time: "Full-time",
  Part_time: "Part-time",
};

export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  Interviewing: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Offer: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Rejected: "bg-red-50 text-red-600 ring-1 ring-red-200",
};

export const STATUS_DOT: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-500",
  Interviewing: "bg-amber-500",
  Offer: "bg-emerald-500",
  Rejected: "bg-red-500",
};

export const ALL_STATUSES: ApplicationStatus[] = [
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
];

export const ALL_JOB_TYPES: JobType[] = [
  "Internship",
  "Full_time",
  "Part_time",
];

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
