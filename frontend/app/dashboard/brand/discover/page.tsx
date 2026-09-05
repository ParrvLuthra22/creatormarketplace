"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useInfiniteCreators, useCreatorById } from "@/lib/hooks/useCreators";
import { useCampaignModal } from "@/lib/CampaignModalContext";
import SectionLabel from "@/components/dashboard/SectionLabel";
import DashCreatorCard from "@/components/dashboard/DashCreatorCard";
import DualRangeSlider from "@/components/dashboard/DualRangeSlider";
import LimeToggle from "@/components/dashboard/LimeToggle";
import MagneticButton from "@/components/dashboard/MagneticButton";
import Drawer from "@/components/dashboard/Drawer";
import { SkeletonCreatorCard } from "@/components/dashboard/Skeleton";
import { getProfilePhotoUrl } from "@/lib/api";
import {
  InstagramIcon,
  YouTubeIcon,
  XIcon,
  LinkedInIcon,
  SnapchatIcon,
} from "@/components/auth/SocialIcons";

const NICHES = ["Fashion", "Beauty", "Tech", "Fitness", "Food", "Travel", "Finance", "Gaming"];
const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: <InstagramIcon /> },
  { id: "youtube", label: "YouTube", icon: <YouTubeIcon /> },
  { id: "twitter", label: "X", icon: <XIcon /> },
  { id: "linkedin", label: "LinkedIn", icon: <LinkedInIcon /> },
  { id: "snapchat", label: "Snapchat", icon: <SnapchatIcon /> },
];
const SORTS = [
  { value: "match", label: "Best match" },
  { value: "followers", label: "Followers" },
  { value: "engagement", label: "Engagement" },
  { value: "recent", label: "Recent activity" },
];

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

interface DraftFilters {
  search: string;
  niches: string[];
  followerRange: [number, number];
  engagementRange: [number, number];
  platforms: string[];
  location: string;
  verified: boolean;
  available: boolean;
  sort: string;
}

const DEFAULT_FILTERS: DraftFilters = {
  search: "",
  niches: [],
  followerRange: [1_000, 10_000_000],
  engagementRange: [0, 20],
  platforms: [],
  location: "",
  verified: false,
  available: false,
  sort: "match",
};

function toApiFilters(f: DraftFilters) {
  return {
    search: f.search || undefined,
    niches: f.niches.join(",") || undefined,
    minFollowers: f.followerRange[0] !== DEFAULT_FILTERS.followerRange[0] ? f.followerRange[0] : undefined,
    maxFollowers: f.followerRange[1] !== DEFAULT_FILTERS.followerRange[1] ? f.followerRange[1] : undefined,
    minEngagement: f.engagementRange[0] !== DEFAULT_FILTERS.engagementRange[0] ? f.engagementRange[0] : undefined,
    maxEngagement: f.engagementRange[1] !== DEFAULT_FILTERS.engagementRange[1] ? f.engagementRange[1] : undefined,
    platforms: f.platforms.join(",") || undefined,
    location: f.location || undefined,
    verified: f.verified ? "true" : undefined,
    available: f.available ? "true" : undefined,
    sort: f.sort,
  };
}

export default function BrandDiscoverPage() {
  const [draft, setDraft] = useState<DraftFilters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<DraftFilters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { openModal } = useCampaignModal();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const query = useInfiniteCreators(toApiFilters(applied));
  const creators = query.data?.pages.flatMap((p) => p.creators) || [];
  const distinctLocations: string[] = query.data?.pages[0]?.distinctLocations || [];
  const total = query.data?.pages[0]?.total ?? 0;

  const selectedDetail = useCreatorById(selectedId || undefined);
  const selectedCard = creators.find((c: any) => c.id === selectedId);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  function toggleNiche(n: string) {
    setDraft((prev) => ({
      ...prev,
      niches: prev.niches.includes(n) ? prev.niches.filter((x) => x !== n) : [...prev.niches, n],
    }));
  }
  function togglePlatform(p: string) {
    setDraft((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p) ? prev.platforms.filter((x) => x !== p) : [...prev.platforms, p],
    }));
  }
  function applyFilters() {
    setApplied(draft);
  }
  function resetFilters() {
    setDraft(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
  }

  const filtersDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(applied), [draft, applied]);

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-8">
        <SectionLabel index="01" label={`DISCOVER · ${total} CREATOR${total === 1 ? "" : "S"} MATCH`} />
        <h1 className="text-h2 font-display mt-2">Discover creators.</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filter sidebar */}
        <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-20 space-y-6">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-tertiary)" />
            <input
              value={draft.search}
              onChange={(e) => setDraft((p) => ({ ...p, search: e.target.value }))}
              placeholder="Search by name, niche, handle…"
              data-interactive
              className="h-11 w-full rounded-xl bg-(--bg-secondary) border border-(--border) pl-10 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--accent) transition-all duration-200"
            />
          </div>

          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">NICHES</p>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((n) => {
                const active = draft.niches.includes(n);
                return (
                  <button
                    key={n}
                    onClick={() => toggleNiche(n)}
                    data-interactive
                    className="rounded-full border px-3 py-1.5 text-xs transition-colors duration-150"
                    style={{
                      borderColor: active ? "var(--accent)" : "var(--border)",
                      color: active ? "var(--accent)" : "var(--text-secondary)",
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">FOLLOWERS</p>
            <DualRangeSlider
              min={1_000}
              max={10_000_000}
              step={1_000}
              value={draft.followerRange}
              onChange={(v) => setDraft((p) => ({ ...p, followerRange: v }))}
              formatValue={formatFollowers}
            />
          </div>

          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">ENGAGEMENT RATE</p>
            <DualRangeSlider
              min={0}
              max={20}
              step={0.5}
              value={draft.engagementRange}
              onChange={(v) => setDraft((p) => ({ ...p, engagementRange: v }))}
              formatValue={(n) => `${n}%`}
            />
          </div>

          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">PLATFORMS</p>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const active = draft.platforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    data-interactive
                    data-cursor={p.label}
                    aria-label={p.label}
                    aria-pressed={active}
                    className="h-9 w-9 rounded-lg border flex items-center justify-center transition-colors duration-150"
                    style={{
                      borderColor: active ? "var(--accent)" : "var(--border)",
                      color: active ? "var(--accent)" : "var(--text-secondary)",
                    }}
                  >
                    {p.icon}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">LOCATION</p>
            <select
              value={draft.location}
              onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))}
              data-interactive
              className="h-10 w-full rounded-xl bg-(--bg-secondary) border border-(--border) px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            >
              <option value="">Any location</option>
              {distinctLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 pt-1">
            <LimeToggle checked={draft.verified} onChange={(v) => setDraft((p) => ({ ...p, verified: v }))} label="Verified only" />
            <LimeToggle checked={draft.available} onChange={(v) => setDraft((p) => ({ ...p, available: v }))} label="Available now" />
          </div>

          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">SORT BY</p>
            <select
              value={draft.sort}
              onChange={(e) => setDraft((p) => ({ ...p, sort: e.target.value }))}
              data-interactive
              className="h-10 w-full rounded-xl bg-(--bg-secondary) border border-(--border) px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="sticky bottom-0 pt-4 pb-2 bg-(--bg-primary) flex gap-2">
            <MagneticButton variant="secondary" onClick={resetFilters} className="flex-1 justify-center">
              Reset
            </MagneticButton>
            <MagneticButton variant="primary" onClick={applyFilters} disabled={!filtersDirty} className="flex-1 justify-center">
              <SlidersHorizontal size={13} /> Apply
            </MagneticButton>
          </div>
        </aside>

        {/* Results grid */}
        <div className="flex-1 min-w-0">
          {query.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5].map((i) => <SkeletonCreatorCard key={i} />)}
            </div>
          ) : creators.length === 0 ? (
            <div className="rounded-xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-16 text-center">
              <p className="text-h3 font-display mb-2">No creators match.</p>
              <p className="text-sm text-(--text-tertiary) mb-6">Try widening your filters.</p>
              <MagneticButton variant="primary" onClick={resetFilters} className="mx-auto">
                Reset filters
              </MagneticButton>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {creators.map((creator: any) => (
                  <button key={creator.id} onClick={() => setSelectedId(creator.id)} className="text-left" data-interactive>
                    <DashCreatorCard
                      handle={creator.handle}
                      name={creator.name}
                      niches={creator.niches}
                      followers={creator.followers}
                      engagement={creator.engagement}
                      profilePicture={creator.profilePicture}
                      verified={creator.verificationBadge && creator.verificationBadge !== "none"}
                    />
                  </button>
                ))}
              </div>
              <div ref={sentinelRef} className="h-10 flex items-center justify-center mt-4">
                {query.isFetchingNextPage && (
                  <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">LOADING MORE…</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Creator detail drawer */}
      <Drawer open={Boolean(selectedId)} onClose={() => setSelectedId(null)} title={selectedCard?.name}>
        {selectedCard && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold text-lg shrink-0">
                {selectedCard.profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getProfilePhotoUrl(selectedCard.profilePicture)} alt={selectedCard.name} className="h-full w-full object-cover" />
                ) : (
                  selectedCard.name.charAt(0)
                )}
              </div>
              <div>
                <p className="font-semibold">{selectedCard.name}</p>
                <p className="text-sm text-(--text-tertiary)">{selectedCard.handle}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1">FOLLOWERS</p>
                <p className="text-h3 font-display">{formatFollowers(selectedCard.followers)}</p>
              </div>
              <div>
                <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1">ENGAGEMENT</p>
                <p className="text-h3 font-display">{selectedCard.engagement || "—"}</p>
              </div>
            </div>

            <div>
              <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">NICHES</p>
              <p className="text-sm text-(--text-secondary)">{(selectedCard.niches || []).join(", ") || "Open to collaborations"}</p>
            </div>

            {selectedDetail.data?.creator?.instagramHandle && (
              <div>
                <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">ABOUT</p>
                <p className="text-sm text-(--text-secondary) leading-relaxed">
                  {selectedDetail.data.creator.bio || "No bio yet."}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <a
                href={`/c/${selectedCard.handle.replace(/^@/, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 h-11 rounded-xl border border-(--border) text-sm font-medium flex items-center justify-center hover:border-(--accent) transition-colors"
                data-interactive
              >
                View Full Profile
              </a>
              <MagneticButton
                variant="primary"
                className="flex-1 justify-center"
                onClick={() => {
                  openModal(selectedCard.id);
                  setSelectedId(null);
                }}
              >
                Invite to Campaign
              </MagneticButton>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
