"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Search } from "lucide-react";
import Container from "@/components/ui/Container";
import { usePublicCreators } from "@/lib/hooks/useCreators";
import { cn } from "@/lib/utils";

const NICHES = ["All", "Tech", "Fitness", "Lifestyle", "Food", "Travel", "Fashion", "Finance", "Gaming", "Art"];

function formatNumber(value: number | string | null | undefined) {
  const numeric = Number(String(value || 0).replace(/,/g, ""));
  if (numeric >= 1_000_000) return `${(numeric / 1_000_000).toFixed(1)}M`;
  if (numeric >= 1_000) return `${Math.round(numeric / 1_000)}K`;
  return new Intl.NumberFormat().format(numeric || 0);
}

function DiscoverCard({ creator, locked }: { creator: any; locked: boolean }) {
  const handle = String(creator.handle || "@creator").replace(/^@+/, "");
  const href = locked ? "/login/brand" : `/c/${handle}`;

  return (
    <Link
      href={href}
      className="relative min-h-[320px] rounded-2xl overflow-hidden border border-(--border) bg-(--bg-secondary) group block"
      data-interactive
    >
      {creator.profilePicture ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={creator.profilePicture} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#D4FF4F_0%,#1C1C1C_55%,#0A0A0A_100%)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(creator.niches || []).slice(0, 2).map((niche: string) => (
            <span key={niche} className="font-mono-utility border border-(--accent)/40 text-(--accent) rounded-full px-2 py-0.5 text-[0.65rem]">
              {niche.toUpperCase()}
            </span>
          ))}
        </div>
        <h3 className="font-display font-semibold text-white text-xl">{creator.name}</h3>
        <p className="font-mono-utility text-mono-sm text-white/55 mt-0.5">{creator.handle}</p>
        <div className="flex gap-5 mt-4">
          <div>
            <p className="font-mono-utility text-[0.65rem] text-white/45">FOLLOWERS</p>
            <p className="text-sm font-semibold text-white">{formatNumber(creator.followers)}</p>
          </div>
          <div>
            <p className="font-mono-utility text-[0.65rem] text-white/45">STATUS</p>
            <p className="text-sm font-semibold text-(--accent)">{creator.verificationBadge === "none" ? "Listed" : "Verified"}</p>
          </div>
        </div>
      </div>
      {locked ? (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-12 w-12 rounded-full bg-(--bg-surface) flex items-center justify-center">
            <Lock size={18} className="text-(--accent)" />
          </div>
          <p className="text-sm font-medium text-white">Sign up to view creator details</p>
        </div>
      ) : null}
    </Link>
  );
}

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [activeNiche, setActiveNiche] = useState("All");
  const creatorsQuery = usePublicCreators({ search: query, niche: activeNiche === "All" ? undefined : activeNiche });
  const locked = creatorsQuery.data?.authenticated === false;

  const filteredCreators = useMemo(
    () => {
      const creators = creatorsQuery.data?.creators || [];
      return (
      creators.filter((creator: any) => {
        const haystack = `${creator.name} ${creator.handle} ${(creator.niches || []).join(" ")}`.toLowerCase();
        return !query || haystack.includes(query.toLowerCase());
      })
      );
    },
    [creatorsQuery.data, query]
  );

  return (
    <div className="min-h-screen bg-(--bg-primary)">
      <section className="pt-32 pb-16 text-center">
        <Container>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-6 block">BROWSE · DISCOVER · COLLABORATE</span>
          <h1 className="text-hero font-display leading-[0.9] tracking-[-0.05em] mb-8">
            Discover creators across <span className="font-serif text-(--accent)">every niche.</span>
          </h1>
          <p className="text-body-lg text-(--text-secondary) max-w-lg mx-auto mb-10">
            Browse live creator profiles from CreatorLyff, then reach out from your brand dashboard.
          </p>

          <div className="relative max-w-xl mx-auto mb-8">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-(--text-tertiary)" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, niche, or handle..."
              className="w-full h-14 pl-14 pr-5 rounded-2xl bg-(--bg-secondary) border border-(--border) text-body text-(--text-primary) placeholder:text-(--text-tertiary) outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {NICHES.map((niche) => (
              <button
                key={niche}
                onClick={() => setActiveNiche(niche)}
                className={cn(
                  "font-mono-utility text-mono-sm px-4 py-2 rounded-full border transition-colors shrink-0",
                  activeNiche === niche
                    ? "bg-(--accent) text-(--bg-primary) border-(--accent)"
                    : "border-(--border) text-(--text-tertiary) hover:text-(--text-secondary)"
                )}
              >
                {niche}
              </button>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          {creatorsQuery.isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="min-h-[320px] rounded-2xl bg-(--bg-secondary) border border-(--border) animate-pulse" />
              ))}
            </div>
          ) : filteredCreators.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredCreators.map((creator: any) => (
                <DiscoverCard key={creator.id || creator.profilePicture} creator={creator} locked={locked} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-10 text-center">
              <p className="text-(--text-primary) font-medium">No creators found.</p>
              <p className="text-sm text-(--text-tertiary) mt-1">Try a broader search or clear the niche filter.</p>
            </div>
          )}

          {locked ? (
            <div className="mt-12 rounded-2xl border border-(--accent)/25 bg-(--bg-secondary) p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div>
                <h2 className="text-h3 font-display">Ready to unlock full profiles?</h2>
                <p className="text-sm text-(--text-secondary) mt-1">Create a brand account to view stats and send campaign proposals.</p>
              </div>
              <Link href="/login/brand?mode=signup" className="h-11 px-5 rounded-full bg-(--accent) text-(--bg-primary) font-semibold inline-flex items-center gap-2 justify-center">
                Get started <ArrowRight size={14} />
              </Link>
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  );
}
