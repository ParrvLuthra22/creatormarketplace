"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Heart, MessageCircle } from "lucide-react";

export interface ShowcaseItem {
  id: string;
  type: "image" | "video" | "embed";
  url: string;
  /** Poster image for grid display — only meaningful for type "embed" (YouTube). */
  thumbnailUrl?: string;
  caption?: string;
  likeCount?: number;
  commentsCount?: number;
  externalUrl?: string;
}

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

function formatCount(n?: number) {
  if (!n) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: ShowcaseItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const open = index !== null;
  const item = open ? items[index as number] : null;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(((index as number) - 1 + items.length) % items.length);
      if (e.key === "ArrowRight") onNavigate(((index as number) + 1) % items.length);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, index, items.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[9997] bg-black/90 backdrop-blur-md grid place-items-center p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 50) {
              onNavigate(((index as number) + (dx < 0 ? 1 : -1) + items.length) % items.length);
            }
            touchStartX.current = null;
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Media viewer"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white transition-colors"
            aria-label="Close"
            data-interactive
          >
            <X size={20} />
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate((((index as number) - 1) % items.length + items.length) % items.length); }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white transition-colors"
                aria-label="Previous"
                data-interactive
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate(((index as number) + 1) % items.length); }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white transition-colors"
                aria-label="Next"
                data-interactive
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <motion.div
            key={item.id}
            className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[70vh] rounded-2xl overflow-hidden bg-(--bg-secondary) flex items-center justify-center">
              {item.type === "embed" ? (
                <iframe
                  src={item.url}
                  title={item.caption || "Video"}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full aspect-video"
                />
              ) : item.type === "video" ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={item.url} controls autoPlay className="max-h-[70vh] w-full object-contain" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.caption || "Work sample"} className="max-h-[70vh] w-full object-contain" />
              )}
            </div>

            {(item.caption || item.likeCount || item.commentsCount) && (
              <div className="w-full mt-4 flex items-start justify-between gap-4 text-white">
                {item.caption && <p className="text-sm text-white/80 leading-relaxed max-w-xl">{item.caption}</p>}
                <div className="flex items-center gap-4 shrink-0 font-mono-utility text-mono-sm text-white/60">
                  {formatCount(item.likeCount) && (
                    <span className="flex items-center gap-1.5"><Heart size={13} /> {formatCount(item.likeCount)}</span>
                  )}
                  {formatCount(item.commentsCount) && (
                    <span className="flex items-center gap-1.5"><MessageCircle size={13} /> {formatCount(item.commentsCount)}</span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
