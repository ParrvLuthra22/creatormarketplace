"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */

import { ChangeEvent, useEffect, useState } from "react";
import { Camera, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { useCreatorProfile, useUpdateCreatorProfile } from "@/lib/hooks/useProfile";
import { useUploadFile } from "@/lib/hooks/useUploads";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const ALL_NICHES = [
  "Beauty",
  "Fashion",
  "Tech",
  "Fitness",
  "Food",
  "Travel",
  "Gaming",
  "Lifestyle",
  "Finance",
  "Art",
  "Music",
  "Parenting",
  "Sustainability",
  "Education",
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-(--border) bg-(--bg-secondary) overflow-hidden">
      <div className="px-6 py-5 border-b border-(--border)">
        <h2 className="font-semibold text-(--text-primary)">{title}</h2>
        {description ? <p className="text-sm text-(--text-secondary) mt-0.5">{description}</p> : null}
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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

export default function EditProfilePage() {
  const profileQuery = useCreatorProfile();
  const updateProfile = useUpdateCreatorProfile();
  const profilePhotoUpload = useUploadFile("/api/uploads/profile-photo");
  const coverUpload = useUploadFile("/api/uploads/cover-image");
  const portfolioUpload = useUploadFile("/api/uploads/brand-work");

  const profile = profileQuery.data?.profile || profileQuery.data;
  const [instagramHandle, setInstagramHandle] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("available");
  const [niches, setNiches] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [pricing, setPricing] = useState({
    starting: "",
    reel: "",
    story: "",
    post: "",
  });
  const [brandWork, setBrandWork] = useState<any[]>([]);

  useEffect(() => {
    if (!profile) return;
    setInstagramHandle((profile.instagramHandle || "").replace(/^@+/, ""));
    setBio(profile.bio || profile.instagramBio || "");
    setLocation(profile.location || "");
    setAvailability(profile.availability || "available");
    setNiches(profile.niches || []);
    setProfilePhoto(profile.profilePhoto || profile.youtubeThumbnailUrl || "");
    setCoverImage(profile.coverImage || profile.youtubeBannerUrl || "");
    setPricing({
      starting: profile.pricing?.starting ? String(profile.pricing.starting) : "",
      reel: profile.pricing?.reel ? String(profile.pricing.reel) : "",
      story: profile.pricing?.story ? String(profile.pricing.story) : "",
      post: profile.pricing?.post ? String(profile.pricing.post) : "",
    });
    setBrandWork(profile.brandWork || []);
  }, [profile]);

  function toggleNiche(niche: string) {
    setNiches((current) =>
      current.includes(niche)
        ? current.filter((item) => item !== niche)
        : current.length >= 3
          ? current
          : [...current, niche]
    );
    if (!niches.includes(niche) && niches.length >= 3) {
      showToast("Choose up to 3 niches", "error");
    }
  }

  async function uploadSingle(event: ChangeEvent<HTMLInputElement>, type: "profile" | "cover") {
    const file = event.target.files?.[0];
    if (!file) return;
    const result = await (type === "profile" ? profilePhotoUpload : coverUpload).mutateAsync(file);
    if (type === "profile") {
      setProfilePhoto(result.url);
    } else {
      setCoverImage(result.url);
    }
  }

  async function uploadPortfolio(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, 6);
    if (!files.length) return;
    const uploaded = await Promise.all(files.map((file) => portfolioUpload.mutateAsync(file)));
    setBrandWork((current) => [
      ...current,
      ...uploaded.map((upload, index) => {
        const item = upload.files?.[0] || upload;
        return {
        title: files[index]?.name || "Portfolio item",
        type: item.type === "video" ? "video" : "image",
        url: item.url,
        };
      }),
    ].slice(0, 6));
  }

  function save() {
    updateProfile.mutate({
      instagramHandle,
      bio,
      location,
      availability,
      niches,
      profilePhoto,
      coverImage,
      pricing: {
        starting: Number(pricing.starting) || undefined,
        reel: Number(pricing.reel) || undefined,
        story: Number(pricing.story) || undefined,
        post: Number(pricing.post) || undefined,
      },
      brandWork,
    });
  }

  if (profileQuery.isLoading) {
    return (
      <div className="grid min-h-[420px] place-items-center text-(--text-tertiary)">
        <Loader2 className="animate-spin" size={22} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl pb-28 space-y-6">
      <div>
        <h1 className="text-h2 font-display">Edit Profile</h1>
        <p className="text-sm text-(--text-tertiary) mt-1">Keep your creator profile fresh for brand discovery.</p>
      </div>

      <Section title="Basics" description="Your public identity and profile media.">
        <div className="grid gap-5">
          <div className="grid sm:grid-cols-[120px_1fr] gap-4">
            <div>
              <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">PHOTO</span>
              <label className="mt-2 h-24 w-24 rounded-full border border-(--border) bg-(--bg-surface) grid place-items-center overflow-hidden cursor-pointer hover:border-(--accent)">
                {profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profilePhoto} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Camera size={20} className="text-(--text-tertiary)" />
                )}
                <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadSingle(event, "profile")} />
              </label>
            </div>

            <div>
              <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">COVER</span>
              <label className="mt-2 h-24 rounded-xl border border-(--border) bg-(--bg-surface) grid place-items-center overflow-hidden cursor-pointer hover:border-(--accent)">
                {coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus size={20} className="text-(--text-tertiary)" />
                )}
                <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadSingle(event, "cover")} />
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="INSTAGRAM HANDLE">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-tertiary) text-sm">@</span>
                <input value={instagramHandle} onChange={(e) => setInstagramHandle(e.target.value.replace(/^@+/, ""))} className={cn(inputClass(), "w-full pl-8")} />
              </div>
            </Field>
            <Field label="LOCATION">
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" className={inputClass()} />
            </Field>
          </div>

          <Field label="BIO">
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} maxLength={300} className="w-full px-4 py-3 rounded-xl bg-(--bg-surface) border border-(--border) text-sm text-(--text-primary) outline-none focus-visible:ring-2 focus-visible:ring-(--accent) resize-none" />
          </Field>
        </div>
      </Section>

      <Section title="Niches" description="Select up to 3 areas brands should find you under.">
        <div className="flex flex-wrap gap-2">
          {ALL_NICHES.map((niche) => (
            <button
              key={niche}
              onClick={() => toggleNiche(niche)}
              className={cn(
                "font-mono-utility text-mono-sm px-3 py-1.5 rounded-full border transition-colors",
                niches.includes(niche)
                  ? "border-(--accent) text-(--accent) bg-(--accent)/10"
                  : "border-(--border) text-(--text-tertiary) hover:text-(--text-secondary)"
              )}
            >
              {niche}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Rates and Availability">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="AVAILABILITY">
            <select value={availability} onChange={(e) => setAvailability(e.target.value)} className={inputClass()}>
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </Field>
          <Field label="STARTING RATE">
            <input type="number" min={0} value={pricing.starting} onChange={(e) => setPricing((p) => ({ ...p, starting: e.target.value }))} className={inputClass()} />
          </Field>
          <Field label="REEL">
            <input type="number" min={0} value={pricing.reel} onChange={(e) => setPricing((p) => ({ ...p, reel: e.target.value }))} className={inputClass()} />
          </Field>
          <Field label="STORY">
            <input type="number" min={0} value={pricing.story} onChange={(e) => setPricing((p) => ({ ...p, story: e.target.value }))} className={inputClass()} />
          </Field>
          <Field label="POST">
            <input type="number" min={0} value={pricing.post} onChange={(e) => setPricing((p) => ({ ...p, post: e.target.value }))} className={inputClass()} />
          </Field>
        </div>
      </Section>

      <Section title="Portfolio" description="Upload up to 6 examples of brand work.">
        <div className="grid sm:grid-cols-3 gap-3">
          {brandWork.map((item, index) => (
            <div key={`${item.url}-${index}`} className="relative aspect-[4/3] rounded-xl border border-(--border) overflow-hidden bg-(--bg-surface)">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.title || "Portfolio item"} className="h-full w-full object-cover" />
              <button
                onClick={() => setBrandWork((current) => current.filter((_, i) => i !== index))}
                className="absolute right-2 top-2 h-8 w-8 rounded-lg bg-black/60 text-white grid place-items-center"
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

      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={save}
          disabled={updateProfile.isPending}
          className="h-11 px-6 rounded-xl bg-(--accent) text-(--bg-primary) text-sm font-semibold hover:bg-(--accent-hover) disabled:opacity-50 shadow-lg"
        >
          {updateProfile.isPending ? "Saving..." : "Save profile"}
        </button>
      </div>
    </div>
  );
}
