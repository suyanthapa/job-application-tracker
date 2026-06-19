"use client";
import { useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { JOB_TYPE_LABELS, formatDate } from "@/lib/utils";
import type { Application } from "@/types";

type SortOrder = "none" | "newest" | "oldest";

interface ApplicationsTableProps {
  applications: Application[];
  onView: (app: Application) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}

export function ApplicationsTable({
  applications,
  onView,
  onEdit,
  onDelete,
}: ApplicationsTableProps) {
  const [sort, setSort] = useState<SortOrder>("none");

  const cycle = () =>
    setSort((p) =>
      p === "none" ? "newest" : p === "newest" ? "oldest" : "none",
    );

  const sorted = [...applications].sort((a, b) => {
    if (sort === "none") return 0;
    const d =
      new Date(a.applied_date).getTime() - new Date(b.applied_date).getTime();
    return sort === "newest" ? -d : d;
  });

  const SortIcon =
    sort === "newest" ? ArrowDown : sort === "oldest" ? ArrowUp : ArrowUpDown;
  const sortLabel =
    sort === "newest"
      ? "Newest first"
      : sort === "oldest"
        ? "Oldest first"
        : "Applied Date";

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
              {["SN", "Company", "Job Title", "Type", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-400"
                >
                  {h}
                </th>
              ))}
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-400">
                <button
                  onClick={cycle}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-blue-100 ${sort !== "none" ? "text-blue-800 bg-blue-100" : "text-blue-400"}`}
                >
                  <SortIcon size={11} />
                  {sortLabel}
                </button>
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-blue-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {sorted.map((app, i) => (
              <tr
                key={app.id}
                className="group hover:bg-blue-50 transition-colors duration-150 [&_td]:group-hover:bg-blue-50"
              >
                <td className="px-5 py-4 tabular-nums text-xs font-semibold text-blue-300">
                  {i + 1}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-blue-900">
                      {app.company_name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-blue-700">{app.job_title}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 border border-blue-100">
                    {JOB_TYPE_LABELS[app.job_type]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {" "}
                  {<StatusBadge status={app.status} />}
                </td>
                <td className="px-5 py-4 tabular-nums text-blue-500 text-xs">
                  {formatDate(app.applied_date)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(app)}
                      aria-label="View"
                      className="text-blue-400 hover:text-blue-700 hover:bg-blue-100"
                    >
                      <Eye size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(app)}
                      aria-label="Edit"
                      className="text-blue-400 hover:text-blue-700 hover:bg-blue-100"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(app)}
                      aria-label="Delete"
                      className="text-blue-300 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-blue-400">
            {applications.length} application
            {applications.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={cycle}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${sort !== "none" ? "border-blue-700 bg-blue-700 text-white" : "border-blue-200 bg-white text-blue-600 hover:border-blue-300"}`}
          >
            <SortIcon size={11} />
            {sortLabel}
          </button>
        </div>
        {sorted.map((app, i) => (
          <div
            key={app.id}
            className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-sm">
                  {app.company_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs tabular-nums font-semibold text-blue-300">
                      #{i + 1}
                    </span>
                    <p className="font-semibold text-blue-900 leading-tight">
                      {app.company_name}
                    </p>
                  </div>
                  <p className="text-xs text-blue-500 mt-0.5">
                    {app.job_title}
                  </p>
                </div>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-blue-50 pt-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-500 border border-blue-100">
                  {JOB_TYPE_LABELS[app.job_type]}
                </span>
                <span className="text-xs text-blue-400 tabular-nums">
                  {formatDate(app.applied_date)}
                </span>
              </div>
              <div className="flex gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(app)}
                  className="text-blue-400 hover:text-blue-700 hover:bg-blue-100"
                >
                  <Eye size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(app)}
                  className="text-blue-400 hover:text-blue-700 hover:bg-blue-100"
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(app)}
                  className="text-blue-300 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
