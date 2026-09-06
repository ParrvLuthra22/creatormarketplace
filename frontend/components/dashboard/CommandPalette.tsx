"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, User, Megaphone } from "lucide-react";
import { usePublicCreators } from "@/lib/hooks/useCreators";
import { useProposals } from "@/lib/hooks/useProposals";
import { useAuthStore } from "@/lib/auth";

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const creators = usePublicCreators(query ? { search: query } : {});
  const proposals = useProposals();
  const isBrand = useAuthStore((state) => state.isBrand);

  useEffect(() => {
    inputRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const matchedCreators = (creators.data?.creators || []).slice(0, 5);
  const matchedCampaigns = useMemo(() => {
    const list = proposals.data?.proposals || [];
    if (!query) return list.slice(0, 5);
    return list
      .filter((p: { title?: string }) => (p.title || "").toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }, [proposals.data, query]);

  function go(href: string) {
    router.push(href);
    onClose();
  }

  const hasResults = matchedCreators.length > 0 || matchedCampaigns.length > 0;

  return (
    <div
      className="fixed inset-0 z-[9997] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-(--border) bg-(--bg-secondary) shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 border-b border-(--border)">
          <Search size={16} className="text-(--text-tertiary)" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search creators and campaigns…"
            className="flex-1 h-14 bg-transparent outline-none text-sm text-(--text-primary) placeholder:text-(--text-tertiary)"
            aria-label="Search"
          />
          <kbd className="font-mono-utility text-mono-sm text-(--text-tertiary) border border-(--border) rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto py-2">
          {!hasResults && (
            <p className="px-4 py-8 text-center text-sm text-(--text-tertiary)">No results found.</p>
          )}

          {matchedCreators.length > 0 && (
            <div className="mb-2">
              <p className="font-mono-utility text-mono-sm text-(--text-tertiary) px-4 py-1.5">CREATORS</p>
              {matchedCreators.map((c: { id: string; name: string; handle: string }) => (
                <button
                  key={c.id}
                  onClick={() => go(`/c/${c.handle.replace(/^@/, "")}`)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-(--bg-surface) transition-colors duration-150"
                  data-interactive
                >
                  <User size={15} className="text-(--text-tertiary) shrink-0" aria-hidden />
                  <span className="text-sm text-(--text-primary)">{c.name}</span>
                  <span className="text-xs text-(--text-tertiary)">{c.handle}</span>
                </button>
              ))}
            </div>
          )}

          {matchedCampaigns.length > 0 && (
            <div>
              <p className="font-mono-utility text-mono-sm text-(--text-tertiary) px-4 py-1.5">
                {isBrand ? "CAMPAIGNS" : "PROPOSALS"}
              </p>
              {matchedCampaigns.map((p: { _id: string; title: string; status: string }) => (
                <button
                  key={p._id}
                  onClick={() => go(isBrand ? `/dashboard/brand/campaigns/${p._id}` : "/dashboard/creator/inbox")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-(--bg-surface) transition-colors duration-150"
                  data-interactive
                >
                  <Megaphone size={15} className="text-(--text-tertiary) shrink-0" aria-hidden />
                  <span className="text-sm text-(--text-primary)">{p.title}</span>
                  <span className="text-xs text-(--text-tertiary) capitalize">{p.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
