"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { useBrandProfile, useUpdateBrandProfile } from "@/lib/hooks/useProfile";
import { uploadProfilePhoto, getProfilePhotoUrl, apiErrorMessage } from "@/lib/api";
import { showToast } from "@/lib/toast";
import SectionLabel from "@/components/dashboard/SectionLabel";
import MagneticButton from "@/components/dashboard/MagneticButton";
import { SkeletonCard } from "@/components/dashboard/Skeleton";

const INDUSTRIES = [
  "Fashion & Apparel",
  "Beauty & Cosmetics",
  "Tech & SaaS",
  "Food & Beverage",
  "Fitness & Wellness",
  "Travel & Hospitality",
  "Finance",
  "Gaming & Entertainment",
  "Other",
];

export default function BrandProfilePage() {
  const user = useAuthStore((state) => state.user);
  const profile = useBrandProfile();
  const update = useUpdateBrandProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [brandStory, setBrandStory] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const value = profile.data?.profile || profile.data;
    if (!value) return;
    setCompanyName(value.companyName || "");
    setIndustry(value.industry || "");
    setWebsite(value.website || "");
    setBrandStory(value.brandStory || "");
    setLogoUrl(value.logoUrl || "");
    setDirty(false);
  }, [profile.data]);

  function markDirty<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setDirty(true);
    };
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("File is too large (max 5MB)", "error");
      return;
    }
    setUploading(true);
    try {
      const res = await uploadProfilePhoto(file);
      setLogoUrl(res.url);
      setDirty(true);
      showToast("Logo uploaded — save to apply.", "success");
    } catch (err) {
      showToast(apiErrorMessage(err), "error");
    } finally {
      setUploading(false);
    }
  }

  function handleSave() {
    update.mutate(
      { companyName, industry, website, brandStory },
      { onSuccess: () => setDirty(false) }
    );
  }

  if (profile.isLoading) {
    return (
      <div className="max-w-[1000px] mx-auto">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="mb-8">
        <SectionLabel index="01" label="PROFILE" />
        <h1 className="text-h2 font-display mt-2">Your brand profile.</h1>
        <p className="text-sm text-(--text-secondary) mt-1">{user?.email}</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Form */}
        <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 space-y-6">
          <div className="flex items-center gap-5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative h-20 w-20 rounded-xl border-2 border-dashed border-(--border) bg-(--bg-surface) overflow-hidden flex items-center justify-center hover:border-(--accent) transition-colors duration-200 shrink-0"
              data-interactive
              data-cursor="Upload logo"
              aria-label="Upload logo"
            >
              {uploading ? (
                <Loader2 size={20} className="animate-spin text-(--accent)" />
              ) : logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getProfilePhotoUrl(logoUrl)} alt="Brand logo" className="h-full w-full object-cover" />
              ) : (
                <Camera size={22} className="text-(--text-tertiary)" />
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="sr-only" />
            </button>
            <div>
              <p className="text-sm font-medium">Brand logo</p>
              <p className="text-xs text-(--text-tertiary) mt-0.5">PNG or JPG, up to 5MB</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="p-company" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
                COMPANY NAME
              </label>
              <input
                id="p-company"
                value={companyName}
                onChange={(e) => markDirty(setCompanyName)(e.target.value)}
                placeholder="Acme Inc."
                data-interactive
                className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
              />
            </div>
            <div>
              <label htmlFor="p-industry" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
                INDUSTRY
              </label>
              <select
                id="p-industry"
                value={industry}
                onChange={(e) => markDirty(setIndustry)(e.target.value)}
                data-interactive
                className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
              >
                <option value="">Select an industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="p-website" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
              WEBSITE
            </label>
            <input
              id="p-website"
              value={website}
              onChange={(e) => markDirty(setWebsite)(e.target.value)}
              placeholder="https://yourbrand.com"
              data-interactive
              className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            />
          </div>

          <div>
            <label htmlFor="p-story" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
              BRAND STORY
            </label>
            <textarea
              id="p-story"
              value={brandStory}
              onChange={(e) => markDirty(setBrandStory)(e.target.value)}
              placeholder="Tell creators what your brand is about…"
              rows={5}
              data-interactive
              className="w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 py-3 outline-none resize-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            />
          </div>

          <div
            className="flex justify-end sticky bottom-0 pt-2 -mb-6 pb-6 bg-(--bg-secondary) transition-opacity duration-200"
            style={{ opacity: dirty ? 1 : 0.4, pointerEvents: dirty ? "auto" : "none" }}
          >
            <MagneticButton variant="primary" onClick={handleSave} disabled={update.isPending || !dirty}>
              {update.isPending ? "Saving…" : "Save changes"}
            </MagneticButton>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-20 space-y-3">
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">PREVIEW</p>
          <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
            <div className="h-14 w-14 rounded-xl overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold text-lg mb-4">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getProfilePhotoUrl(logoUrl)} alt="" className="h-full w-full object-cover" />
              ) : (
                (companyName || "B").charAt(0)
              )}
            </div>
            <p className="font-display font-semibold text-lg truncate">{companyName || "Your company name"}</p>
            <p className="text-sm text-(--text-tertiary) mt-0.5">{industry || "Industry"}</p>
            {website && (
              <p className="text-xs text-(--accent) mt-2 truncate">{website}</p>
            )}
            <p className="text-sm text-(--text-secondary) mt-4 leading-relaxed line-clamp-4">
              {brandStory || "Your brand story will appear here — this is what creators see when reviewing your campaigns."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
