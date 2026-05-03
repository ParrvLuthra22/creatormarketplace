"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { usePublicCreators } from "@/lib/hooks/useCreators";

export default function BrandDiscoverPage() {
  const [search, setSearch] = useState("");
  const creators = usePublicCreators({ search });

  return (
    <div className="max-w-[1200px] space-y-6">
      <div>
        <h1 className="text-h2 font-display">Discover creators</h1>
        <p className="text-sm text-(--text-secondary)">Live creator profiles from the backend.</p>
      </div>
      <div className="relative max-w-xl">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-tertiary)" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, niche, or handle" className="h-12 w-full rounded-xl bg-(--bg-surface) border border-(--border) pl-11 pr-4 outline-none" />
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {(creators.data?.creators || []).map((creator: any) => (
          <Link key={creator.id} href={`/c/${creator.handle.replace(/^@/, "")}`} className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-5 hover:border-(--accent) transition-colors">
            <div className="h-12 w-12 rounded-full bg-(--accent) text-(--bg-primary) grid place-items-center font-bold">{creator.name.charAt(0)}</div>
            <h2 className="mt-4 font-semibold">{creator.name}</h2>
            <p className="text-sm text-(--text-tertiary)">{creator.handle}</p>
            <p className="mt-3 text-sm text-(--text-secondary)">{(creator.niches || []).join(", ") || "Open to collaborations"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
