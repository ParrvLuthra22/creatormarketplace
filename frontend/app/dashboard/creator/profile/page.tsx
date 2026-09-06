"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */

import { ChangeEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Camera,
  ImagePlus,
  Loader2,
  Music2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Unlink,
  X,
} from "lucide-react";
import { useCreatorProfile, useUpdateCreatorProfile } from "@/lib/hooks/useProfile";
import { useUploadFile } from "@/lib/hooks/useUploads";
import { useRefreshStats, useDisconnectProvider } from "@/lib/hooks/useSocialSync";
import { useVerificationStatus, useRequestVerification } from "@/lib/hooks/useVerification";
import { useAuthStore } from "@/lib/auth";
import { API_URL } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useEscapeToClose } from "@/lib/hooks/useEscapeToClose";
import SectionLabel from "@/components/dashboard/SectionLabel";
import MagneticButton from "@/components/dashboard/MagneticButton";
import LimeToggle from "@/components/dashboard/LimeToggle";
import { InstagramIcon, YouTubeIcon, XIcon, LinkedInIcon, SnapchatIcon } from "@/components/auth/SocialIcons";

const ALL_NICHES = ["Beauty", "Fashion", "Tech", "Fitness", "Food", "Travel", "Gaming", "Lifestyle", "Finance", "Art", "Music", "Parenting", "Sustainability", "Education"];
const CONTENT_STYLES = ["Vlog", "Tutorial", "Review", "Aesthetic", "Comedy", "Educational"];
const AVAILABILITY_OPTIONS = [
  { id: "available", label: "Available" },
  { id: "limited", label: "Limited" },
  { id: "unavailable", label: "Unavailable" },
];

function Section({ index, title, description, children }: { index: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-(--border) bg-(--bg-secondary) overflow-hidden">
      <div className="px-6 py-5 border-b border-(--border)">
        <SectionLabel index={index} label={title.toUpperCase()} className="mb-1" />
        {description ? <p className="text-sm text-(--text-secondary)">{description}</p> : null}
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">{label}</span>
      {children}
    </label>
  );
}

function inputClass() {
  return "h-11 px-4 rounded-xl bg-(--bg-surface) border border-(--border) text-sm text-(--text-primary) placeholder:text-(--text-tertiary) outline-none focus-visible:ring-2 focus-visible:ring-(--accent) transition-all";
}

function VerificationModal({ onClose }: { onClose: () => void }) {
  const uploadEvidence = useUploadFile("/api/uploads/chat-attachment");
  const requestVerification = useRequestVerification();
  const [evidence, setEvidence] = useState<{ type: string; url: string; filename: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  useEscapeToClose(onClose);

  async function addFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 10 - evidence.length);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(files.map((f) => uploadEvidence.mutateAsync(f)));
      setEvidence((prev) => [...prev, ...uploaded.map((u) => ({ type: u.type, url: u.url, filename: u.filename }))].slice(0, 10));
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    await requestVerification.mutateAsync({ evidence: evidence.map(({ type, url }) => ({ type, url })) });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div
        className="w-full max-w-lg rounded-2xl border border-(--border) bg-(--bg-secondary) p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="verification-modal-title"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id="verification-modal-title" className="text-h3 font-display">Request verification</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-(--bg-surface) grid place-items-center" aria-label="Close" data-interactive>
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-(--text-secondary) mb-5">
          Verified creators get a badge that signals credibility to brands. Upload evidence of past brand
          collaborations, media features, or other proof of your work — up to 10 items.
        </p>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {evidence.map((item, i) => (
            <div key={i} className="relative aspect-square rounded-lg border border-(--border) overflow-hidden bg-(--bg-surface)">
              {item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.filename} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-[10px] text-(--text-tertiary) p-1 text-center">{item.filename}</div>
              )}
              <button
                onClick={() => setEvidence((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 h-5 w-5 rounded bg-black/70 text-white grid place-items-center"
                aria-label="Remove"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {evidence.length < 10 && (
            <label className="aspect-square rounded-lg border border-dashed border-(--border-strong) grid place-items-center cursor-pointer hover:border-(--accent)">
              {uploading ? <Loader2 size={16} className="animate-spin text-(--accent)" /> : <Plus size={16} className="text-(--text-tertiary)" />}
              <input type="file" multiple accept="image/*,application/pdf" className="sr-only" onChange={addFiles} disabled={uploading} />
            </label>
          )}
        </div>

        <MagneticButton
          variant="primary"
          className="w-full justify-center"
          onClick={submit}
          disabled={requestVerification.isPending || evidence.length === 0}
        >
          {requestVerification.isPending ? "Submitting…" : "Submit request"}
        </MagneticButton>
      </div>
    </div>
  );
}

function PlatformCard({
  id,
  label,
  icon,
  connected,
  followers,
  handle,
  updatedAt,
  canRefresh,
  comingSoon,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  connected: boolean;
  followers?: number;
  handle?: string;
  updatedAt?: string;
  canRefresh?: boolean;
  comingSoon?: boolean;
}) {
  const disconnect = useDisconnectProvider();
  const refreshStats = useRefreshStats();

  return (
    <div className="rounded-xl border border-(--border) bg-(--bg-surface) p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <span className="shrink-0">{icon}</span>
        <span className="font-medium text-sm">{label}</span>
      </div>

      {comingSoon ? (
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">COMING SOON</p>
      ) : connected ? (
        <>
          <div>
            {followers !== undefined && <p className="text-lg font-display">{followers.toLocaleString()} followers</p>}
            {handle && <p className="text-sm text-(--text-secondary)">@{handle.replace(/^@+/, "")}</p>}
            {updatedAt && <p className="text-xs text-(--text-tertiary) mt-1">Synced {new Date(updatedAt).toLocaleDateString()}</p>}
          </div>
          <div className="flex items-center gap-2 mt-auto pt-1">
            {canRefresh && (
              <button
                onClick={() => refreshStats.mutate()}
                disabled={refreshStats.isPending}
                className="flex items-center gap-1.5 text-xs text-(--text-secondary) hover:text-(--text-primary) transition-colors"
                data-interactive
              >
                <RefreshCw size={12} className={refreshStats.isPending ? "animate-spin" : ""} /> Refresh
              </button>
            )}
            <button
              onClick={() => disconnect.mutate(id)}
              disabled={disconnect.isPending}
              className="flex items-center gap-1.5 text-xs text-(--text-tertiary) hover:text-(--warning) transition-colors ml-auto"
              data-interactive
            >
              <Unlink size={12} /> Disconnect
            </button>
          </div>
        </>
      ) : (
        <a
          href={`${API_URL}/api/auth/${id}`}
          className="mt-auto h-9 rounded-lg border border-(--border) text-sm font-medium flex items-center justify-center hover:border-(--accent) transition-colors"
          data-interactive
        >
          Connect
        </a>
      )}
    </div>
  );
}

export default function EditProfilePage() {
  const user = useAuthStore((state) => state.user);
  const profileQuery = useCreatorProfile();
  const updateProfile = useUpdateCreatorProfile();
  const profilePhotoUpload = useUploadFile("/api/uploads/profile-photo");
  const coverUpload = useUploadFile("/api/uploads/cover-image");
  const portfolioUpload = useUploadFile("/api/uploads/brand-work");
  const refreshStats = useRefreshStats();
  const verificationQuery = useVerificationStatus();

  const profile = profileQuery.data?.profile || profileQuery.data;
  const [instagramHandle, setInstagramHandle] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("available");
  const [niches, setNiches] = useState<string[]>([]);
  const [contentStyle, setContentStyle] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [pricing, setPricing] = useState({ starting: "", per: "post", reel: "", story: "", post: "", youtube: "" });
  const [openToNegotiation, setOpenToNegotiation] = useState(true);
  const [brandWork, setBrandWork] = useState<any[]>([]);
  const [dirty, setDirty] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [dragOverPhoto, setDragOverPhoto] = useState(false);

  function loadFromProfile(p: any) {
    setInstagramHandle((p.instagramHandle || "").replace(/^@+/, ""));
    setBio(p.bio || p.instagramBio || "");
    setLocation(p.location || "");
    setAvailability(p.availability || "available");
    setNiches(p.niches || []);
    setContentStyle(p.contentStyle || []);
    setProfilePhoto(p.profilePhoto || p.youtubeThumbnailUrl || "");
    setCoverImage(p.coverImage || p.youtubeBannerUrl || "");
    setPricing({
      starting: p.pricing?.starting ? String(p.pricing.starting) : "",
      per: p.pricing?.per || "post",
      reel: p.pricing?.reel ? String(p.pricing.reel) : "",
      story: p.pricing?.story ? String(p.pricing.story) : "",
      post: p.pricing?.post ? String(p.pricing.post) : "",
      youtube: p.pricing?.youtube ? String(p.pricing.youtube) : "",
    });
    setOpenToNegotiation(p.openToNegotiation ?? true);
    setBrandWork(p.brandWork || []);
  }

  useEffect(() => {
    if (profile) loadFromProfile(profile);
  }, [profile]);

  function markDirty() {
    setDirty(true);
  }

  function toggleNiche(niche: string) {
    setNiches((current) => {
      if (current.includes(niche)) return current.filter((item) => item !== niche);
      if (current.length >= 3) {
        showToast("Choose up to 3 niches", "error");
        return current;
      }
      return [...current, niche];
    });
    markDirty();
  }

  function toggleContentStyle(style: string) {
    setContentStyle((current) => (current.includes(style) ? current.filter((s) => s !== style) : [...current, style]));
    markDirty();
  }

  async function uploadSingle(file: File, type: "profile" | "cover") {
    const result = await (type === "profile" ? profilePhotoUpload : coverUpload).mutateAsync(file);
    if (type === "profile") setProfilePhoto(result.url);
    else setCoverImage(result.url);
    markDirty();
  }

  async function uploadPortfolio(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, 6 - brandWork.length);
    if (!files.length) return;
    const uploaded = await Promise.all(files.map((file) => portfolioUpload.mutateAsync(file)));
    setBrandWork((current) =>
      [
        ...current,
        ...uploaded.map((upload, index) => {
          const item = upload.files?.[0] || upload;
          return { title: files[index]?.name || "Portfolio item", type: item.type === "video" ? "video" : "image", url: item.url };
        }),
      ].slice(0, 6)
    );
    markDirty();
  }

  function save() {
    updateProfile.mutate(
      {
        instagramHandle,
        bio,
        location,
        availability,
        niches,
        contentStyle,
        profilePhoto,
        coverImage,
        pricing: {
          starting: Number(pricing.starting) || undefined,
          per: pricing.per,
          reel: Number(pricing.reel) || undefined,
          story: Number(pricing.story) || undefined,
          post: Number(pricing.post) || undefined,
          youtube: Number(pricing.youtube) || undefined,
        },
        openToNegotiation,
        brandWork,
      },
      { onSuccess: () => setDirty(false) }
    );
  }

  function discard() {
    if (profile) loadFromProfile(profile);
    setDirty(false);
  }

  if (profileQuery.isLoading) {
    return (
      <div className="grid min-h-[420px] place-items-center text-(--text-tertiary)">
        <Loader2 className="animate-spin" size={22} />
      </div>
    );
  }

  const connected = user?.connectedPlatforms || ({} as Record<string, boolean>);
  const vStatus = verificationQuery.data?.verificationStatus || "unverified";
  const vBadge = verificationQuery.data?.verificationBadge || "none";
  const latestRequest = verificationQuery.data?.latestRequest;

  return (
    <div className="max-w-3xl pb-28 space-y-6">
      <div>
        <SectionLabel index="00" label="MY PROFILE" />
        <h1 className="text-h2 font-display mt-2">Edit Profile</h1>
        <p className="text-sm text-(--text-tertiary) mt-1">Keep your creator profile fresh for brand discovery.</p>
      </div>

      <Section index="01" title="Basics" description="Your public identity and profile media.">
        <div className="grid gap-5">
          <div className="grid sm:grid-cols-[120px_1fr] gap-4">
            <div>
              <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">PHOTO</span>
              <label
                className={cn(
                  "mt-2 h-24 w-24 rounded-full border-2 border-dashed grid place-items-center overflow-hidden cursor-pointer transition-colors",
                  dragOverPhoto ? "border-(--accent)" : "border-(--border) hover:border-(--accent)"
                )}
                style={{ background: dragOverPhoto ? "rgba(212,255,79,0.08)" : "var(--bg-surface)" }}
                onDragOver={(e) => { e.preventDefault(); setDragOverPhoto(true); }}
                onDragLeave={() => setDragOverPhoto(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverPhoto(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) void uploadSingle(file, "profile");
                }}
              >
                {profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profilePhoto} alt="Profile photo preview" className="h-full w-full object-cover" />
                ) : (
                  <Camera size={20} className="text-(--text-tertiary)" />
                )}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && uploadSingle(e.target.files[0], "profile")} />
              </label>
            </div>

            <div>
              <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">COVER</span>
              <label className="mt-2 h-24 rounded-xl border border-(--border) bg-(--bg-surface) grid place-items-center overflow-hidden cursor-pointer hover:border-(--accent)">
                {coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverImage} alt="Cover image preview" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus size={20} className="text-(--text-tertiary)" />
                )}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && uploadSingle(e.target.files[0], "cover")} />
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="INSTAGRAM HANDLE">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-tertiary) text-sm">@</span>
                <input value={instagramHandle} autoComplete="off" onChange={(e) => { setInstagramHandle(e.target.value.replace(/^@+/, "")); markDirty(); }} className={cn(inputClass(), "w-full pl-8")} />
              </div>
            </Field>
            <Field label="LOCATION">
              <input value={location} autoComplete="address-level2" onChange={(e) => { setLocation(e.target.value); markDirty(); }} placeholder="City, Country" className={inputClass()} />
            </Field>
          </div>

          <Field label={`BIO (${bio.length}/300)`}>
            <textarea value={bio} onChange={(e) => { setBio(e.target.value); markDirty(); }} rows={5} maxLength={300} className="w-full px-4 py-3 rounded-xl bg-(--bg-surface) border border-(--border) text-sm text-(--text-primary) outline-none focus-visible:ring-2 focus-visible:ring-(--accent) resize-none" />
          </Field>

          <div>
            <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">AVAILABILITY</span>
            <div className="flex gap-2">
              {AVAILABILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { setAvailability(opt.id); markDirty(); }}
                  className="rounded-full border px-4 py-2 text-sm transition-colors"
                  style={{
                    borderColor: availability === opt.id ? "var(--accent)" : "var(--border)",
                    color: availability === opt.id ? "var(--accent)" : "var(--text-secondary)",
                  }}
                  data-interactive
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section index="02" title="Niches & Style" description="Select up to 3 niches, and any content styles that fit.">
        <div className="space-y-5">
          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">NICHES</p>
            <div className="flex flex-wrap gap-2">
              {ALL_NICHES.map((niche) => (
                <button
                  key={niche}
                  onClick={() => toggleNiche(niche)}
                  className={cn(
                    "font-mono-utility text-mono-sm px-3 py-1.5 rounded-full border transition-colors",
                    niches.includes(niche) ? "border-(--accent) text-(--accent)" : "border-(--border) text-(--text-tertiary) hover:text-(--text-secondary)"
                  )}
                  style={{ background: niches.includes(niche) ? "rgba(212,255,79,0.1)" : "transparent" }}
                >
                  {niche}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">CONTENT STYLE</p>
            <div className="flex flex-wrap gap-2">
              {CONTENT_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleContentStyle(style)}
                  className={cn(
                    "font-mono-utility text-mono-sm px-3 py-1.5 rounded-full border transition-colors",
                    contentStyle.includes(style) ? "border-(--accent) text-(--accent)" : "border-(--border) text-(--text-tertiary) hover:text-(--text-secondary)"
                  )}
                  style={{ background: contentStyle.includes(style) ? "rgba(212,255,79,0.1)" : "transparent" }}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section index="03" title="Connected Platforms" description="Sync stats and let brands see where your audience lives.">
        <div className="flex justify-end mb-3">
          <button
            onClick={() => refreshStats.mutate()}
            disabled={refreshStats.isPending}
            className="flex items-center gap-1.5 text-sm text-(--accent) hover:opacity-80 transition-opacity"
            data-interactive
          >
            <RefreshCw size={13} className={refreshStats.isPending ? "animate-spin" : ""} /> Refresh all stats
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <PlatformCard id="instagram" label="Instagram" icon={<InstagramIcon />} connected={Boolean(connected.instagram)} followers={profile?.instagramFollowerCount} updatedAt={profile?.instagramDataUpdatedAt} canRefresh />
          <PlatformCard id="youtube" label="YouTube" icon={<YouTubeIcon />} connected={Boolean(connected.youtube)} followers={profile?.youtubeSubscriberCount} updatedAt={profile?.youtubeDataUpdatedAt} canRefresh />
          <PlatformCard id="twitter" label="X" icon={<XIcon />} connected={Boolean(connected.twitter)} followers={profile?.twitterFollowerCount} handle={profile?.twitterHandle} />
          <PlatformCard id="linkedin" label="LinkedIn" icon={<LinkedInIcon />} connected={Boolean(connected.linkedin)} handle={profile?.linkedinHandle} />
          <PlatformCard id="snapchat" label="Snapchat" icon={<SnapchatIcon />} connected={Boolean(connected.snapchat)} handle={profile?.snapchatHandle} />
          <PlatformCard id="tiktok" label="TikTok" icon={<Music2 size={18} />} connected={false} comingSoon />
        </div>
      </Section>

      <Section index="04" title="Pricing" description="Structured rates make it easier for brands to send the right offer.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="STARTING RATE (₹)">
            <input type="number" min={0} value={pricing.starting} onChange={(e) => { setPricing((p) => ({ ...p, starting: e.target.value })); markDirty(); }} className={inputClass()} />
          </Field>
          <Field label="PER">
            <select value={pricing.per} onChange={(e) => { setPricing((p) => ({ ...p, per: e.target.value })); markDirty(); }} className={inputClass()}>
              <option value="reel">Reel</option>
              <option value="story">Story</option>
              <option value="post">Post</option>
              <option value="video">Video</option>
            </select>
          </Field>
          <Field label="REEL RATE (₹)">
            <input type="number" min={0} value={pricing.reel} onChange={(e) => { setPricing((p) => ({ ...p, reel: e.target.value })); markDirty(); }} className={inputClass()} />
          </Field>
          <Field label="STORY RATE (₹)">
            <input type="number" min={0} value={pricing.story} onChange={(e) => { setPricing((p) => ({ ...p, story: e.target.value })); markDirty(); }} className={inputClass()} />
          </Field>
          <Field label="POST RATE (₹)">
            <input type="number" min={0} value={pricing.post} onChange={(e) => { setPricing((p) => ({ ...p, post: e.target.value })); markDirty(); }} className={inputClass()} />
          </Field>
          <Field label="YOUTUBE INTEGRATION (₹)">
            <input type="number" min={0} value={pricing.youtube} onChange={(e) => { setPricing((p) => ({ ...p, youtube: e.target.value })); markDirty(); }} className={inputClass()} />
          </Field>
        </div>
        <div className="mt-5">
          <LimeToggle checked={openToNegotiation} onChange={(v) => { setOpenToNegotiation(v); markDirty(); }} label="Open to negotiation" />
        </div>
      </Section>

      <Section index="05" title="Portfolio" description="Upload up to 6 examples of brand work.">
        <div className="grid sm:grid-cols-3 gap-3">
          {brandWork.map((item, index) => (
            <div key={`${item.url}-${index}`} className="relative aspect-[4/3] rounded-xl border border-(--border) overflow-hidden bg-(--bg-surface) group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.title || "Portfolio item"} className="h-full w-full object-cover" />
              <button
                onClick={() => { setBrandWork((current) => current.filter((_, i) => i !== index)); markDirty(); }}
                className="absolute right-2 top-2 h-8 w-8 rounded-lg bg-black/60 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove portfolio item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {brandWork.length < 6 ? (
            <label className="aspect-[4/3] rounded-xl border border-dashed border-(--border-strong) bg-(--bg-surface) grid place-items-center cursor-pointer hover:border-(--accent)">
              <span className="flex items-center gap-2 text-sm text-(--text-secondary)">
                <Plus size={16} /> Add work
              </span>
              <input type="file" multiple accept="image/*,video/*" className="sr-only" onChange={uploadPortfolio} />
            </label>
          ) : null}
        </div>
      </Section>

      <Section index="06" title="Verification" description="A verified badge signals credibility to brands.">
        {vStatus === "verified" ? (
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-(--accent)" />
            <div>
              <p className="text-sm font-medium flex items-center gap-1.5">
                Verified <BadgeCheck size={14} className="text-(--accent)" />
                {vBadge === "premium" && <span className="font-mono-utility text-mono-sm text-(--accent)">PREMIUM</span>}
              </p>
              {latestRequest?.createdAt && (
                <p className="text-xs text-(--text-tertiary) mt-0.5">Requested {new Date(latestRequest.createdAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ) : vStatus === "pending" ? (
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-(--warning) animate-pulse shrink-0" />
            <div>
              <p className="text-sm font-medium">Under review</p>
              <p className="text-xs text-(--text-tertiary) mt-0.5">We&apos;ll email you within 3-5 days.</p>
            </div>
          </div>
        ) : (
          <div>
            {vStatus === "rejected" && latestRequest?.rejectionReason && (
              <p className="text-sm text-(--warning) mb-4">Previous request declined: {latestRequest.rejectionReason}</p>
            )}
            <MagneticButton variant="primary" onClick={() => setVerificationModalOpen(true)}>
              Request Verification Badge
            </MagneticButton>
          </div>
        )}
      </Section>

      <StickySaveBar dirty={dirty} pending={updateProfile.isPending} onDiscard={discard} onSave={save} />

      {verificationModalOpen && <VerificationModal onClose={() => setVerificationModalOpen(false)} />}
    </div>
  );
}

function StickySaveBar({
  dirty,
  pending,
  onDiscard,
  onSave,
}: {
  dirty: boolean;
  pending: boolean;
  onDiscard: () => void;
  onSave: () => void;
}) {
  return (
    <AnimatePresence>
      {dirty && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
          className="fixed bottom-0 left-0 right-0 md:left-[72px] z-40 border-t border-(--border) bg-(--bg-secondary)/95 backdrop-blur-md px-6 py-4 flex items-center justify-end gap-3"
        >
          <button onClick={onDiscard} className="h-10 px-4 rounded-xl text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors" data-interactive>
            Discard
          </button>
          <MagneticButton variant="primary" onClick={onSave} disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
