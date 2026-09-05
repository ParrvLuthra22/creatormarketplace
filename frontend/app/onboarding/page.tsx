"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, Loader2, Upload } from "lucide-react";
import { api, apiErrorMessage, uploadProfilePhoto } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { showToast } from "@/lib/toast";
import AnimatedCheckmark from "@/components/auth/AnimatedCheckmark";

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

const NICHES = ["Fashion", "Beauty", "Tech", "Fitness", "Food", "Travel", "Finance", "Gaming"];
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

const STEPS = ["Role", "Details", "Photo", "Confirm"] as const;

type SubmitPhase = "idle" | "submitting" | "success" | "error";

// ─── Progress indicator ───────────────────────────────────────────────────────

function ProgressIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-3 mb-10" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-3">
          <div
            className="flex items-center justify-center h-8 w-8 rounded-full border font-mono-utility text-mono-sm transition-colors duration-300"
            style={{
              borderColor: i <= step ? "var(--accent)" : "var(--border)",
              background: i < step ? "var(--accent)" : i === step ? "transparent" : "transparent",
              color: i < step ? "var(--bg-primary)" : i === step ? "var(--accent)" : "var(--text-tertiary)",
            }}
          >
            {i < step ? <Check size={14} /> : `0${i + 1}`}
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="h-px w-6 md:w-10 transition-colors duration-300"
              style={{ background: i < step ? "var(--accent)" : "var(--border)" }}
              aria-hidden
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step wrapper — consistent slide/fade transition ─────────────────────────

function Step({ children, dir }: { children: React.ReactNode; dir: 1 | -1 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 * dir }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 * dir }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuthStore();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const [accountType, setAccountType] = useState<"Brand" | "Creator">(user?.accountType || "Creator");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");

  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<SubmitPhase>("idle");
  const [error, setError] = useState("");

  function goNext() {
    setDir(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function goBack() {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  const detailsValid =
    accountType === "Creator" ? instagramHandle.trim().length > 0 : companyName.trim().length > 0;

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoUploading(true);
    try {
      const res = await uploadProfilePhoto(file);
      setPhotoUrl(res.url);
    } catch (err) {
      showToast(apiErrorMessage(err), "error");
      setPhotoPreview("");
    } finally {
      setPhotoUploading(false);
    }
  }

  async function submit() {
    setPhase("submitting");
    setError("");
    try {
      await api.post("/api/auth/onboarding", {
        accountType,
        ...(accountType === "Creator" ? { instagramHandle } : {}),
      });

      if (accountType === "Creator") {
        await api.put("/api/profile/creator", {
          niches: selectedNiches,
          instagramHandle,
          location,
          ...(photoUrl ? { profilePhoto: photoUrl } : {}),
        });
      } else {
        await api.put("/api/profile/brand", {
          companyName,
          industry,
          website,
          ...(photoUrl ? { logoUrl: photoUrl } : {}),
        });
      }

      const nextUser = await refreshUser();
      setPhase("success");
      setTimeout(() => {
        router.push(nextUser?.accountType === "Brand" ? "/dashboard/brand" : "/dashboard/creator");
      }, 1200);
    } catch (err) {
      setError(apiErrorMessage(err));
      setPhase("error");
    }
  }

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) px-6 py-16 flex items-center justify-center">
      <div className="mx-auto w-full max-w-xl">
        <p className="font-mono-utility text-mono-sm text-(--accent) mb-2">SETUP</p>
        <h1 className="text-h2 font-display mb-8">Tell us how you&apos;ll use CreatorLyff.</h1>

        <ProgressIndicator step={step} />

        <div className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-6 md:p-8 min-h-[360px] flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait" custom={dir}>
              {step === 0 && (
                <Step key="role" dir={dir}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(["Creator", "Brand"] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => setAccountType(role)}
                        data-interactive
                        data-cursor={`Choose ${role}`}
                        className="rounded-xl border p-4 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
                        style={{
                          borderColor: accountType === role ? "var(--accent)" : "var(--border)",
                          background: accountType === role ? "var(--bg-surface)" : "transparent",
                        }}
                      >
                        <p className="font-semibold">{role}</p>
                        <p className="text-sm text-(--text-tertiary) mt-1">
                          {role === "Creator" ? "Receive proposals from brands." : "Discover and invite creators."}
                        </p>
                      </button>
                    ))}
                  </div>
                </Step>
              )}

              {step === 1 && (
                <Step key="details" dir={dir}>
                  {accountType === "Creator" ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="ob-ig" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
                          INSTAGRAM HANDLE
                        </label>
                        <input
                          id="ob-ig"
                          value={instagramHandle}
                          onChange={(e) => setInstagramHandle(e.target.value)}
                          placeholder="@yourhandle"
                          data-interactive
                          data-cursor="Enter"
                          className="w-full h-12 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:border-(--accent) transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
                          NICHES (up to 3)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {NICHES.map((niche) => {
                            const active = selectedNiches.includes(niche);
                            return (
                              <button
                                key={niche}
                                onClick={() =>
                                  setSelectedNiches((prev) =>
                                    active
                                      ? prev.filter((n) => n !== niche)
                                      : prev.length < 3
                                      ? [...prev, niche]
                                      : prev
                                  )
                                }
                                data-interactive
                                data-cursor={active ? "Remove" : "Add"}
                                className="rounded-full border px-3 py-1.5 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
                                style={{
                                  borderColor: active ? "var(--accent)" : "var(--border)",
                                  color: active ? "var(--accent)" : "var(--text-secondary)",
                                }}
                              >
                                {niche}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="ob-location" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
                          LOCATION (optional)
                        </label>
                        <input
                          id="ob-location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Mumbai, India"
                          data-interactive
                          data-cursor="Enter"
                          className="w-full h-12 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:border-(--accent) transition-all duration-200"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="ob-company" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
                          COMPANY NAME
                        </label>
                        <input
                          id="ob-company"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Acme Inc."
                          data-interactive
                          data-cursor="Enter"
                          className="w-full h-12 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:border-(--accent) transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="ob-industry" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
                          INDUSTRY
                        </label>
                        <select
                          id="ob-industry"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          data-interactive
                          className="w-full h-12 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:border-(--accent) transition-all duration-200"
                        >
                          <option value="">Select an industry</option>
                          {INDUSTRIES.map((ind) => (
                            <option key={ind} value={ind}>
                              {ind}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="ob-website" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
                          WEBSITE (optional)
                        </label>
                        <input
                          id="ob-website"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://yourbrand.com"
                          data-interactive
                          data-cursor="Enter"
                          className="w-full h-12 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:border-(--accent) transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}
                </Step>
              )}

              {step === 2 && (
                <Step key="photo" dir={dir}>
                  <div className="flex flex-col items-center text-center py-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      data-interactive
                      data-cursor="Upload photo"
                      className="relative h-28 w-28 rounded-full border-2 border-dashed border-(--border) flex items-center justify-center overflow-hidden hover:border-(--accent) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
                    >
                      {photoPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                      ) : (
                        <Camera size={28} className="text-(--text-tertiary)" aria-hidden />
                      )}
                      {photoUploading && (
                        <div className="absolute inset-0 bg-(--bg-primary)/60 flex items-center justify-center">
                          <Loader2 size={20} className="animate-spin text-(--accent)" aria-hidden />
                        </div>
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="sr-only"
                      aria-label="Upload profile photo"
                    />
                    <p className="text-sm text-(--text-secondary) mt-4 max-w-xs">
                      Add a profile photo so brands and creators recognize you. You can skip this for now.
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      data-interactive
                      data-cursor="Upload"
                      className="mt-4 inline-flex items-center gap-2 font-mono-utility text-mono-sm text-(--accent) hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
                    >
                      <Upload size={14} aria-hidden />
                      {photoUrl ? "REPLACE PHOTO" : "CHOOSE A PHOTO"}
                    </button>
                  </div>
                </Step>
              )}

              {step === 3 && (
                <Step key="confirm" dir={dir}>
                  {phase === "success" ? (
                    <div className="flex flex-col items-center text-center py-6">
                      <AnimatedCheckmark />
                      <h2 className="text-h3 font-display mt-6 mb-2">You&apos;re all set.</h2>
                      <p className="text-sm text-(--text-secondary)">Taking you to your dashboard…</p>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-h3 font-display mb-4">Review &amp; confirm</h2>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-(--border) py-2">
                          <dt className="text-(--text-tertiary)">Account type</dt>
                          <dd>{accountType}</dd>
                        </div>
                        {accountType === "Creator" ? (
                          <>
                            <div className="flex justify-between border-b border-(--border) py-2">
                              <dt className="text-(--text-tertiary)">Instagram</dt>
                              <dd>{instagramHandle || "—"}</dd>
                            </div>
                            <div className="flex justify-between border-b border-(--border) py-2">
                              <dt className="text-(--text-tertiary)">Niches</dt>
                              <dd>{selectedNiches.join(", ") || "—"}</dd>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between border-b border-(--border) py-2">
                              <dt className="text-(--text-tertiary)">Company</dt>
                              <dd>{companyName || "—"}</dd>
                            </div>
                            <div className="flex justify-between border-b border-(--border) py-2">
                              <dt className="text-(--text-tertiary)">Industry</dt>
                              <dd>{industry || "—"}</dd>
                            </div>
                          </>
                        )}
                      </dl>
                      {phase === "error" && (
                        <p className="mt-4 text-caption text-(--warning)" role="alert" aria-live="assertive">
                          {error}
                        </p>
                      )}
                    </div>
                  )}
                </Step>
              )}
            </AnimatePresence>
          </div>

          {phase !== "success" && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-(--border)">
              <button
                onClick={goBack}
                disabled={step === 0 || phase === "submitting"}
                data-interactive
                data-cursor="Back"
                className="font-mono-utility text-mono-sm text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-200 disabled:opacity-0 focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
              >
                ← BACK
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  onClick={goNext}
                  disabled={step === 1 && !detailsValid}
                  data-interactive
                  data-cursor="Continue"
                  className="h-11 rounded-xl bg-(--accent) text-(--bg-primary) px-6 font-semibold disabled:opacity-50 hover:bg-(--accent-hover) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={phase === "submitting"}
                  data-interactive
                  data-cursor="Finish"
                  className="h-11 rounded-xl bg-(--accent) text-(--bg-primary) px-6 font-semibold disabled:opacity-60 hover:bg-(--accent-hover) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
                >
                  {phase === "submitting" ? "Setting up…" : "Complete setup"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
