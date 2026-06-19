"use client";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { JOB_TYPE_LABELS, formatDate, timeAgo } from "@/lib/utils";
import type { Application } from "@/types";
import { Pencil, Trash2, Building2, Briefcase, Calendar, Clock } from "lucide-react";

interface Props {
  application: Application | null;
  onClose: () => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">{icon}</div>
      <div>
        <dt className="text-xs font-medium text-blue-400">{label}</dt>
        <dd className="text-sm font-medium text-blue-900 mt-0.5">{value}</dd>
      </div>
    </div>
  );
}

export function ApplicationDetail({ application, onClose, onEdit, onDelete }: Props) {
  if (!application) return null;
  return (
    <Modal isOpen={!!application} onClose={onClose} title="Application Details" maxWidth="md">
      <div className="flex flex-col gap-5">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 px-4 py-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-blue-900 leading-tight">{application.job_title}</p>
            <p className="mt-1 text-sm text-blue-600 font-medium">{application.company_name}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Row icon={<Building2 size={13} />} label="Company" value={application.company_name} />
          <Row icon={<Briefcase size={13} />} label="Job Type" value={JOB_TYPE_LABELS[application.job_type]} />
          <Row icon={<Calendar size={13} />} label="Applied Date" value={`${formatDate(application.applied_date)} · ${timeAgo(application.applied_date)}`} />
          <Row icon={<Clock size={13} />} label="Last Updated" value={formatDate(application.updated_at)} />
        </dl>
        {application.notes && (
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">Notes</p>
            <p className="text-sm leading-relaxed text-blue-800 whitespace-pre-wrap">{application.notes}</p>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-blue-100 pt-4">
          <Button variant="ghost" size="sm" onClick={() => onDelete(application)} className="text-red-500 hover:bg-red-50 hover:text-red-600">
            <Trash2 size={13} /> Delete
          </Button>
          <Button size="sm" onClick={() => onEdit(application)}>
            <Pencil size={13} /> Edit Application
          </Button>
        </div>
      </div>
    </Modal>
  );
}
