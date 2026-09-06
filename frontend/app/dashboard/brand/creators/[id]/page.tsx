"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPublicCreatorStats, getProfilePhotoUrl, apiErrorMessage, type PublicCreatorStatsResponse } from "@/lib/api";
import { useCampaignModal } from "@/lib/CampaignModalContext";
import MagneticButton from "@/components/dashboard/MagneticButton";
import { SkeletonCard } from "@/components/dashboard/Skeleton";

export default function BrandCreatorProfilePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { openModal } = useCampaignModal();

  const [data, setData] = useState<PublicCreatorStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError("");
      try {
        const res = await getPublicCreatorStats(id);
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) setError(apiErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (id) void run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <SkeletonCard />
      </div>
    );
  }

  if (error || !data?.creator) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-(--text-tertiary) mb-4">{error || "Creator not found."}</p>
        <button onClick={() => router.back()} className="text-(--accent) text-sm font-medium" data-interactive>
          ← Go back
        </button>
      </div>
    );
  }

  const { creator, stats } = data;
  const initial = (creator.name || "C").charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 font-mono-utility text-mono-sm text-(--text-tertiary) hover:text-(--text-primary) transition-colors"
        data-interactive
      >
        <ArrowLeft size={13} /> BACK
      </button>

      <div className="flex items-start gap-5 flex-wrap">
        <div className="h-20 w-20 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold text-2xl shrink-0">
          {creator.profilePicture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getProfilePhotoUrl(creator.profilePicture)} alt={creator.name} className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className="flex-1 min-w-[200px]">
          <h1 className="text-h2 font-display">{creator.name}</h1>
          <p className="text-sm text-(--text-tertiary) mt-1">@{creator.instagramHandle || "creator"}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {(creator.niches?.length ? creator.niches : ["Open to collaborations"]).map((n) => (
              <span key={n} className="rounded-full border border-(--border) px-3 py-1 text-xs text-(--text-secondary)">
                {n}
              </span>
            ))}
          </div>
        </div>
        <MagneticButton variant="primary" onClick={() => openModal(creator.id)} className="shrink-0">
          Send Proposal
        </MagneticButton>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-5">
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1.5">FOLLOWERS</p>
          <p className="text-h3 font-display">{stats.followers || "—"}</p>
        </div>
        <div className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-5">
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1.5">ENGAGEMENT</p>
          <p className="text-h3 font-display">{stats.engagement || "—"}</p>
        </div>
        <div className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-5">
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1.5">AVG. REACH</p>
          <p className="text-h3 font-display">{stats.avgReach ?? "—"}</p>
        </div>
        <div className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-5">
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1.5">PAST DEALS</p>
          <p className="text-h3 font-display">{stats.pastBrandCollaborations}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">PRICING</p>
          <p className="text-sm text-(--text-secondary)">
            {creator.pricing?.starting
              ? `Starting from ₹${creator.pricing.starting.toLocaleString("en-IN")} per ${creator.pricing.per || "post"}`
              : "Custom pricing — request a proposal."}
          </p>
        </div>
        <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">AVAILABILITY</p>
          <p className="text-sm capitalize" style={{ color: creator.availability === "unavailable" ? "var(--warning)" : "var(--success)" }}>
            {creator.availability || "Available"}
          </p>
        </div>
      </div>

      {creator.brandWork && creator.brandWork.length > 0 && (
        <div>
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">PAST BRAND WORK</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {creator.brandWork.map((work: any, i: number) => (
              <div key={i} className="rounded-xl border border-(--border) bg-(--bg-secondary) overflow-hidden">
                {work.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={work.url} alt={work.title || "Brand partnership"} className="h-36 w-full object-cover" />
                )}
                <p className="p-4 text-sm font-medium">{work.title || "Brand partnership"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
