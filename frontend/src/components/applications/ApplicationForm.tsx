"use client";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { createApplicationSchema, type CreateApplicationInput } from "@/lib/schemas";
import { ALL_JOB_TYPES, ALL_STATUSES, JOB_TYPE_LABELS, STATUS_LABELS } from "@/lib/utils";
import type { Application, JobType, ApplicationStatus } from "@/types";
import { ApiError } from "@/lib/api";

type FormErrors = Partial<Record<keyof CreateApplicationInput, string>>;

interface ApplicationFormProps {
  initial?: Application;
  onSubmit: (payload: CreateApplicationInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

function toDateInput(iso: string) { return iso.split("T")[0] ?? ""; }

export function ApplicationForm({ initial, onSubmit, onCancel, submitLabel = "Save" }: ApplicationFormProps) {
  const [fields, setFields] = useState({
    company_name: initial?.company_name ?? "",
    job_title: initial?.job_title ?? "",
    job_type: (initial?.job_type ?? "") as JobType | "",
    status: (initial?.status ?? "Applied") as ApplicationStatus,
    applied_date: initial?.applied_date ? toDateInput(initial.applied_date) : "",
    notes: initial?.notes ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setFields({
        company_name: initial.company_name,
        job_title: initial.job_title,
        job_type: initial.job_type,
        status: initial.status,
        applied_date: toDateInput(initial.applied_date),
        notes: initial.notes ?? "",
      });
    }
  }, [initial]);

  const set = (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFields((p) => ({ ...p, [key]: e.target.value }));
      setErrors((p) => ({ ...p, [key]: undefined }));
      setApiError(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const result = createApplicationSchema.safeParse({
      ...fields,
      applied_date: fields.applied_date ? new Date(fields.applied_date).toISOString() : "",
    });

    if (!result.success) {
      const errs: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormErrors;
        if (key) errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(result.data);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors?.length) {
        const errs: FormErrors = {};
        for (const fe of err.fieldErrors) {
          errs[fe.field as keyof FormErrors] = fe.message;
        }
        setErrors(errs);
      } else {
        setApiError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Company Name" required value={fields.company_name} onChange={set("company_name")} error={errors.company_name} placeholder="e.g. Google" />
          <Input label="Job Title" required value={fields.job_title} onChange={set("job_title")} error={errors.job_title} placeholder="e.g. Software Engineer" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Job Type" required value={fields.job_type} onChange={set("job_type")} error={errors.job_type} placeholder="Select type"
            options={ALL_JOB_TYPES.map((t) => ({ value: t, label: JOB_TYPE_LABELS[t] }))} />
          <Select label="Status" value={fields.status} onChange={set("status")}
            options={ALL_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))} />
        </div>
        <Input label="Applied Date" required type="date" value={fields.applied_date} onChange={set("applied_date")} error={errors.applied_date} />
        <Textarea label="Notes" value={fields.notes} onChange={set("notes")} placeholder="Add any notes, referrals, or reminders…" />
        {apiError && (
          <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 text-sm text-red-600">{apiError}</div>
        )}
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>Cancel</Button>
          <Button type="submit" loading={submitting}>{submitLabel}</Button>
        </div>
      </div>
    </form>
  );
}
