"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import MagneticButton from "@/components/dashboard/MagneticButton";

export default function ConfirmDestructiveModal({
  title,
  description,
  confirmWord,
  actionLabel,
  loading,
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  confirmWord: string;
  actionLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("");

  return (
    <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-(--warning) bg-(--bg-secondary) p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-(--warning)" />
            <h3 className="text-h3 font-display">{title}</h3>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-(--bg-surface) grid place-items-center shrink-0" aria-label="Close" data-interactive>
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-(--text-secondary) mb-4">{description}</p>
        <label htmlFor="confirm-word" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
          TYPE {confirmWord} TO CONFIRM
        </label>
        <input
          id="confirm-word"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={confirmWord}
          data-interactive
          className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--warning) mb-4"
        />
        <div className="flex gap-2">
          <MagneticButton variant="secondary" onClick={onClose} className="flex-1 justify-center">
            Cancel
          </MagneticButton>
          <button
            onClick={onConfirm}
            disabled={text !== confirmWord || loading}
            className="flex-1 h-10 rounded-xl bg-(--warning) text-(--bg-primary) font-semibold text-sm disabled:opacity-40 transition-opacity"
            data-interactive
          >
            {loading ? "Working…" : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
