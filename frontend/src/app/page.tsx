"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, X, BriefcaseIcon, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { ApplicationsTable } from "@/components/applications/ApplicationsTable";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { ApplicationDetail } from "@/components/applications/ApplicationDetail";
import { DeleteConfirm } from "@/components/applications/DeleteConfirm";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { ALL_STATUSES, STATUS_LABELS, STATUS_DOT } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types";
import type { CreateApplicationInput } from "@/lib/schemas";

type ActiveModal = "create" | "edit" | "view" | "delete" | null;
const LIMIT = 10;

interface Meta {
  total: number;
  totalPages: number;
}

export default function HomePage() {
  const [items, setItems] = useState<Application[]>([]);
  // Separate state for all applications used only by StatsCards + status pill counts.
  // Fetched once on mount with a high limit so counts are always accurate
  // regardless of the current page/filter.
  const [allForStats, setAllForStats] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    totalPages: 1,
  });

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selected, setSelected] = useState<Application | null>(null);

  // Fetch the current page (server-side search + filter + pagination)
  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listApplications({
        page,
        limit: LIMIT,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setItems(data.items);
      setMeta({
        total: data.meta.total,
        totalPages: data.meta.totalPages,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applications.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    void fetchPage();
  }, [fetchPage]);

  const resetPage = () => setPage(1);

  const closeModal = () => {
    setActiveModal(null);
    setSelected(null);
  };

  const handleCreate = async (payload: CreateApplicationInput) => {
    await api.createApplication(payload);
    toast.success("Application added successfully!");
    closeModal();
    void fetchPage();
  };

  const handleUpdate = async (payload: CreateApplicationInput) => {
    if (!selected) return;
    await api.updateApplication(selected.id, payload);
    toast.success("Application updated.");
    closeModal();
    void fetchPage();
  };

  const handleDelete = async (id: string) => {
    await api.deleteApplication(id);
    toast.success("Application deleted.");
    closeModal();
    void fetchPage();
  };

  const open = (modal: ActiveModal, app?: Application) => {
    setSelected(app ?? null);
    setActiveModal(modal);
  };

  const isEmpty = !loading && items.length === 0;
  const hasFilters = !!search || !!statusFilter;

  // Status pill counts come from the full unfiltered dataset
  const getStatusCount = (s: ApplicationStatus) =>
    allForStats.filter((a) => a.status === s).length;

  return (
    <div className="min-h-screen bg-blue-50/80">
      {/* Header */}
      <header className="border-b border-blue-200 bg-white shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 shadow-sm">
                <BriefcaseIcon size={17} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900 leading-none">
                  Job Application Tracker
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  void fetchPage();
                }}
                disabled={loading}
              >
                <RefreshCw
                  size={13}
                  className={loading ? "animate-spin" : ""}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button size="sm" onClick={() => open("create")}>
                <Plus size={14} /> Add Application
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Hero text */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-900 tracking-tight">
            Your Applications
          </h1>
          <p className="mt-1 text-sm text-blue-500">
            Stay on top of every opportunity — from first apply to final offer.
          </p>
        </div>

        {/* Status filter pills */}
        {allForStats.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setStatusFilter("");
                resetPage();
              }}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all ${!statusFilter ? "bg-blue-700 text-white border-blue-700 shadow-sm" : "bg-white text-blue-600 border-blue-200 hover:border-blue-300"}`}
            >
              All
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${!statusFilter ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"}`}
              >
                {allForStats.length}
              </span>
            </button>
            {ALL_STATUSES.map((s) => {
              const count = getStatusCount(s);
              if (count === 0) return null;
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(active ? "" : s);
                    resetPage();
                  }}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all ${active ? "bg-blue-700 text-white border-blue-700 shadow-sm" : "bg-white text-blue-600 border-blue-200 hover:border-blue-300"}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white" : STATUS_DOT[s]}`}
                  />
                  {STATUS_LABELS[s]}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${active ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div className="mb-5 relative max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            placeholder="Search company or role…"
            className="w-full rounded-xl border border-blue-200 bg-white py-2.5 pl-9 pr-9 text-sm text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                resetPage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600"
            ></button>
          )}
        </div>

        {/* Content */}
        {loading && <TableSkeleton />}

        {error && !loading && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-5 text-sm text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void fetchPage()}
            >
              Try again
            </Button>
          </div>
        )}

        {isEmpty && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-white py-20 text-center px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 mb-4">
              <BriefcaseIcon size={26} className="text-blue-400" />
            </div>
            <p className="text-base font-semibold text-blue-900">
              {hasFilters
                ? "No matching applications."
                : "No applications yet."}
            </p>
            <p className="mt-1.5 text-sm text-blue-400 max-w-xs">
              {hasFilters
                ? "Try adjusting your search or filter to find what you're looking for."
                : "Start tracking your job hunt. Add your first application to see it here."}
            </p>
            {!hasFilters && (
              <Button className="mt-5" onClick={() => open("create")}>
                <Plus size={14} /> Add Your First Application
              </Button>
            )}
            {hasFilters && (
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-blue-400 tabular-nums">
                Showing {(page - 1) * LIMIT + 1}–
                {Math.min(page * LIMIT, meta.total)} of {meta.total}
                {hasFilters && ` (filtered from ${allForStats.length})`}
              </p>
            </div>

            <ApplicationsTable
              applications={items}
              onView={(app) => open("view", app)}
              onEdit={(app) => open("edit", app)}
              onDelete={(app) => open("delete", app)}
            />

            {meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                >
                  ← Prev
                </Button>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${p === page ? "bg-blue-700 text-white" : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"}`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= meta.totalPages}
                >
                  Next →
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={activeModal === "create"}
        onClose={closeModal}
        title="New Application"
        maxWidth="lg"
      >
        <ApplicationForm
          onSubmit={handleCreate}
          onCancel={closeModal}
          submitLabel="Add Application"
        />
      </Modal>

      <Modal
        isOpen={activeModal === "edit"}
        onClose={closeModal}
        title="Edit Application"
        maxWidth="lg"
      >
        <ApplicationForm
          initial={selected ?? undefined}
          onSubmit={handleUpdate}
          onCancel={closeModal}
          submitLabel="Save Changes"
        />
      </Modal>

      <ApplicationDetail
        application={activeModal === "view" ? selected : null}
        onClose={closeModal}
        onEdit={(app) => open("edit", app)}
        onDelete={(app) => open("delete", app)}
      />

      <DeleteConfirm
        application={activeModal === "delete" ? selected : null}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
}
