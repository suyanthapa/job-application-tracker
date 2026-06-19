"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Application } from "@/types";

interface Props {
  application: Application | null;
  onConfirm: (id: string) => Promise<void>;
  onCancel: () => void;
}

export function DeleteConfirm({ application, onConfirm, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!application) return;
    setLoading(true);
    setError(null);
    try {
      await onConfirm(application.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete.");
    } finally {
      setLoading(false); /
    }
  };

  return (
    <Modal
      isOpen={!!application}
      onClose={onCancel}
      title="Delete Application"
      maxWidth="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-xl bg-red-50 border border-red-100 p-4">
          <p className="text-sm text-red-800">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{application?.job_title}</span> at{" "}
            <span className="font-semibold">{application?.company_name}</span>?
            This action cannot be undone.
          </p>
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} loading={loading}>
            Delete Application
          </Button>
        </div>
      </div>
    </Modal>
  );
}
