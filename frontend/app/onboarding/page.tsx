"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { showToast } from "@/lib/toast";

const niches = ["Fashion", "Beauty", "Tech", "Fitness", "Food", "Travel", "Finance", "Gaming"];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuthStore();
  const [accountType, setAccountType] = useState<"Brand" | "Creator">(user?.accountType || "Creator");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      await api.post("/api/auth/onboarding", {
        accountType,
        ...(accountType === "Creator" ? { instagramHandle } : {}),
      });

      if (accountType === "Creator") {
        await api.put("/api/profile/creator", { niches: selectedNiches, instagramHandle });
      } else {
        await api.put("/api/profile/brand", { companyName, industry });
      }

      const nextUser = await refreshUser();
      showToast("Onboarding complete", "success");
      router.push(nextUser?.accountType === "Brand" ? "/dashboard/brand" : "/dashboard/creator");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-(--border) bg-(--bg-secondary) p-6 space-y-6">
        <div>
          <p className="font-mono-utility text-mono-sm text-(--accent)">SETUP</p>
          <h1 className="text-h2 font-display mt-2">Tell us how you’ll use CreatorLyff.</h1>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(["Creator", "Brand"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setAccountType(role)}
              className={`rounded-xl border p-4 text-left ${accountType === role ? "border-(--accent) bg-(--bg-surface)" : "border-(--border)"}`}
            >
              <p className="font-semibold">{role}</p>
              <p className="text-sm text-(--text-tertiary) mt-1">
                {role === "Creator" ? "Receive proposals from brands." : "Discover and invite creators."}
              </p>
            </button>
          ))}
        </div>

        {accountType === "Creator" ? (
          <div className="space-y-4">
            <input
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              placeholder="@instagram"
              className="w-full h-11 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none"
            />
            <div className="flex flex-wrap gap-2">
              {niches.map((niche) => (
                <button
                  key={niche}
                  onClick={() =>
                    setSelectedNiches((prev) =>
                      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
                    )
                  }
                  className={`rounded-full border px-3 py-1.5 text-sm ${selectedNiches.includes(niche) ? "border-(--accent) text-(--accent)" : "border-(--border) text-(--text-secondary)"}`}
                >
                  {niche}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" className="h-11 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none" />
            <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Industry" className="h-11 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none" />
          </div>
        )}

        <button
          disabled={loading || (accountType === "Creator" && !instagramHandle)}
          onClick={submit}
          className="h-11 rounded-xl bg-(--accent) text-(--bg-primary) px-5 font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
