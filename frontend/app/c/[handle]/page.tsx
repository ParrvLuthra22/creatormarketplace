"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, MapPin, Star } from "lucide-react";
import Container from "@/components/ui/Container";
import { useCreatorByHandle } from "@/lib/hooks/useCreators";

function formatNumber(value: number | string | null | undefined) {
  const numeric = Number(String(value || 0).replace(/,/g, ""));
  if (numeric >= 1_000_000) return `${(numeric / 1_000_000).toFixed(1)}M`;
  if (numeric >= 1_000) return `${Math.round(numeric / 1_000)}K`;
  return new Intl.NumberFormat().format(numeric || 0);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-4">
      <p className="text-h3 font-display tabular-nums">{value}</p>
      <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mt-0.5">{label}</p>
    </div>
  );
}

export default function PublicCreatorProfile() {
  const params = useParams<{ handle: string }>();
  const handle = String(params?.handle || "").replace(/^@+/, "");
  const creatorQuery = useCreatorByHandle(handle);
  const creator = creatorQuery.data?.creator;
  const user = creator?.user || {};
  const profile = creator?.profile || {};
  const followerCount = profile.combinedFollowerCount || profile.instagramFollowerCount || profile.followers || profile.youtubeSubscriberCount || 0;
  const niches = profile.niches || [];
  const verified = user.verificationBadge && user.verificationBadge !== "none";

  if (creatorQuery.isLoading) {
    return (
      <div className="min-h-screen bg-(--bg-primary) pt-32">
        <Container>
          <div className="h-[520px] rounded-2xl bg-(--bg-secondary) border border-(--border) animate-pulse" />
        </Container>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-(--bg-primary) pt-32">
        <Container className="max-w-2xl text-center">
          <h1 className="text-h2 font-display">Creator not found</h1>
          <p className="text-(--text-secondary) mt-3">That profile is not published on CreatorLyff yet.</p>
          <Link href="/discover" className="mt-6 inline-flex h-11 px-5 rounded-full bg-(--accent) text-(--bg-primary) font-semibold items-center gap-2">
            Browse creators <ArrowRight size={14} />
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary)">
      <div className="relative h-[320px] overflow-hidden">
        {profile.youtubeBannerUrl || profile.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.youtubeBannerUrl || profile.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#D4FF4F_0%,#222_50%,#0A0A0A_100%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-(--bg-primary)" />
      </div>

      <Container className="max-w-5xl -mt-16 relative pb-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
          <div className="h-24 w-24 rounded-full border-4 border-(--bg-primary) bg-(--bg-surface) overflow-hidden grid place-items-center text-3xl font-bold relative">
            {profile.profilePhoto || profile.youtubeThumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.profilePhoto || profile.youtubeThumbnailUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              String(user.fullName || "C").charAt(0)
            )}
            {verified ? (
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-(--accent) flex items-center justify-center border-2 border-(--bg-primary)">
                <Star size={12} className="text-(--bg-primary)" fill="currentColor" />
              </div>
            ) : null}
          </div>

          <div className="flex-1 min-w-0 pb-2">
            <h1 className="text-h2 font-display">{user.fullName || profile.youtubeChannelTitle || "Creator"}</h1>
            <p className="text-(--text-tertiary) font-mono-utility text-mono-sm mt-1">@{handle}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {niches.map((niche: string) => (
                <span key={niche} className="font-mono-utility text-mono-sm border border-(--accent)/40 text-(--accent) rounded-full px-3 py-1">
                  {niche}
                </span>
              ))}
            </div>
            {profile.location ? (
              <div className="flex items-center gap-1.5 text-(--text-tertiary) text-sm mt-3">
                <MapPin size={13} /> {profile.location}
              </div>
            ) : null}
          </div>

          <Link href="/login/brand?mode=signup" className="h-11 px-6 rounded-full bg-(--accent) text-(--bg-primary) font-semibold text-sm hover:bg-(--accent-hover) inline-flex items-center gap-2">
            Invite to Collaborate <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-4 rounded-2xl border border-(--border) bg-(--bg-secondary) overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-(--border) mt-8">
          <Stat label="FOLLOWERS" value={formatNumber(followerCount)} />
          <Stat label="INSTAGRAM" value={formatNumber(profile.instagramFollowerCount || profile.followers || 0)} />
          <Stat label="YOUTUBE" value={formatNumber(profile.youtubeSubscriberCount || 0)} />
          <Stat label="AVAILABILITY" value={profile.availability || "available"} />
        </div>

        <section className="grid lg:grid-cols-[1fr_320px] gap-8 mt-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-h3 font-display mb-3">About</h2>
              <p className="text-body-lg text-(--text-secondary) leading-relaxed">{profile.bio || profile.instagramBio || profile.youtubeBio || "This creator has not added a bio yet."}</p>
            </div>

            <div>
              <h2 className="text-h3 font-display mb-4">Brand Work</h2>
              {profile.brandWork?.length ? (
                <div className="grid sm:grid-cols-3 gap-3">
                  {profile.brandWork.map((item: any, index: number) => (
                    <div key={`${item.url}-${index}`} className="aspect-[4/3] rounded-xl border border-(--border) overflow-hidden bg-(--bg-secondary)">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={item.title || "Brand work"} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-6 text-sm text-(--text-secondary)">Portfolio work will appear here after the creator uploads examples.</div>
              )}
            </div>

            {profile.recentYouTubeVideos?.length ? (
              <div>
                <h2 className="text-h3 font-display mb-4">Recent YouTube Videos</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {profile.recentYouTubeVideos.slice(0, 4).map((video: any) => (
                    <div key={video.videoId} className="rounded-xl border border-(--border) bg-(--bg-secondary) overflow-hidden">
                      {video.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={video.thumbnailUrl} alt="" className="aspect-video w-full object-cover" />
                      ) : null}
                      <div className="p-4">
                        <p className="font-medium text-sm">{video.title}</p>
                        <p className="text-xs text-(--text-tertiary) mt-1">{formatNumber(video.viewCount)} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-5 h-fit">
            <h2 className="text-h3 font-display">Collab Rates</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-(--text-secondary)">Starting</span><b>${profile.pricing?.starting || "Contact"}</b></div>
              <div className="flex justify-between"><span className="text-(--text-secondary)">Reel</span><b>${profile.pricing?.reel || "Contact"}</b></div>
              <div className="flex justify-between"><span className="text-(--text-secondary)">Story</span><b>${profile.pricing?.story || "Contact"}</b></div>
              <div className="flex justify-between"><span className="text-(--text-secondary)">Post</span><b>${profile.pricing?.post || "Contact"}</b></div>
            </div>
            <Link href="/login/brand?mode=signup" className="mt-5 h-11 w-full rounded-xl bg-(--accent) text-(--bg-primary) font-semibold inline-flex items-center justify-center">
              Start a campaign
            </Link>
          </aside>
        </section>
      </Container>
    </div>
  );
}
