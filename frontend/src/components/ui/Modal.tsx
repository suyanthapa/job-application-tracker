"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}

const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };

export function Modal({ isOpen, onClose, title, children, maxWidth = "md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) { document.addEventListener("keydown", fn); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[2px]" />
      <div className={`relative w-full ${widths[maxWidth]} bg-white rounded-2xl shadow-2xl border border-blue-100`}>
        <div className="flex items-center justify-between border-b border-blue-100 px-6 py-4">
          <h2 className="text-base font-semibold text-blue-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
