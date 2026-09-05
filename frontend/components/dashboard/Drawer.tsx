"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Drawer({
  open,
  onClose,
  title,
  children,
  width = 480,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[9996] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed top-0 right-0 bottom-0 z-[9997] bg-(--bg-secondary) border-l border-(--border) overflow-y-auto"
            style={{ width, maxWidth: "92vw" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-(--border) sticky top-0 bg-(--bg-secondary) z-10">
              {title ? <h2 className="text-h3 font-display truncate pr-4">{title}</h2> : <span />}
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-lg hover:bg-(--bg-surface) grid place-items-center ml-auto shrink-0"
                aria-label="Close"
                data-interactive
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
