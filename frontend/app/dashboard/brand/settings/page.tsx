"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { useBrandProfile, useUpdateBrandProfile } from "@/lib/hooks/useProfile";

export default function BrandSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const profile = useBrandProfile();
  const update = useUpdateBrandProfile();
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [brandStory, setBrandStory] = useState("");

  useEffect(() => {
    const value = profile.data?.profile || profile.data;
    if (!value) return;
    setCompanyName(value.companyName || "");
    setIndustry(value.industry || "");
    setWebsite(value.website || "");
    setBrandStory(value.brandStory || "");
  }, [profile.data]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-h2 font-display">Brand settings</h1>
        <p className="text-sm text-(--text-secondary)">{user?.email}</p>
      </div>
      <div className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-5 space-y-4">
        <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none" />
        <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Industry" className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none" />
        <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website" className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none" />
        <textarea value={brandStory} onChange={(e) => setBrandStory(e.target.value)} placeholder="Brand story" rows={5} className="w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 py-3 outline-none resize-none" />
        <button onClick={() => update.mutate({ companyName, industry, website, brandStory })} disabled={update.isPending} className="h-11 rounded-xl bg-(--accent) text-(--bg-primary) px-5 font-semibold disabled:opacity-50">
          {update.isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
