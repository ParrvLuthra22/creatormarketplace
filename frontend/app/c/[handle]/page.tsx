import type { Metadata } from "next";
import CreatorProfileClient from "./CreatorProfileClient";
import NotFoundState from "@/components/creator-profile/NotFoundState";

const SITE_URL = "https://creatorlyff.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface CreatorByHandleResponse {
  success: boolean;
  creator?: {
    user: {
      _id: string;
      fullName: string;
      verificationBadge?: string;
    };
    profile: {
      instagramHandle: string;
      bio?: string;
      instagramBio?: string;
      youtubeBio?: string;
      coverImage?: string;
      youtubeBannerUrl?: string;
      profilePhoto?: string;
      youtubeThumbnailUrl?: string;
      niches?: string[];
      location?: string;
    };
  };
  pastCollaborations?: { name: string; logoUrl: string | null }[];
  profileViews30d?: number;
}

// Server-side fetch, shared (via Next.js's automatic fetch memoization) between
// generateMetadata and the page body below — a single request per page load.
// Deliberately NOT run for the client — the by-handle endpoint increments a
// real profile-view counter, so CreatorProfileClient reuses this same payload
// as react-query initialData instead of fetching it again itself.
async function fetchCreator(handle: string): Promise<CreatorByHandleResponse | null> {
  const url = `${API_URL}/api/profile/creator/by-handle/${encodeURIComponent(handle)}`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { next: { revalidate: 60 } });
      if (res.status === 404) return null;
      if (!res.ok) continue; // transient failure — retry once before giving up
      return await res.json();
    } catch {
      // network hiccup — retry once
    }
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle: rawHandle } = await params;
  const handle = rawHandle.replace(/^@+/, "");
  const data = await fetchCreator(handle);
  const creator = data?.creator;

  if (!creator) {
    return { title: { absolute: "Creator not found · CreatorLyff" } };
  }

  const { user, profile } = creator;
  const name = user.fullName || "Creator";
  const bio = profile.bio || profile.instagramBio || profile.youtubeBio || "";
  const description = bio
    ? bio.length > 155
      ? `${bio.slice(0, 155).trim()}…`
      : bio
    : `${name} on CreatorLyff — ${(profile.niches || []).join(", ") || "creator"}${profile.location ? ` based in ${profile.location}` : ""}.`;
  const image = profile.coverImage || profile.youtubeBannerUrl || profile.profilePhoto || profile.youtubeThumbnailUrl;
  const canonical = `${SITE_URL}/c/${handle}`;

  return {
    title: { absolute: `${name} (@${handle}) · CreatorLyff` },
    description,
    alternates: { canonical },
    openGraph: {
      type: "profile",
      url: canonical,
      title: `${name} (@${handle})`,
      description,
      siteName: "CreatorLyff",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} (@${handle})`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PublicCreatorProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle: rawHandle } = await params;
  const handle = rawHandle.replace(/^@+/, "");
  const data = await fetchCreator(handle);
  const creator = data?.creator;

  if (!creator) {
    return <NotFoundState />;
  }

  const jsonLd = creator
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: creator.user.fullName,
        alternateName: `@${handle}`,
        url: `${SITE_URL}/c/${handle}`,
        image: creator.profile.profilePhoto || creator.profile.youtubeThumbnailUrl || undefined,
        description: creator.profile.bio || creator.profile.instagramBio || undefined,
        address: creator.profile.location
          ? { "@type": "PostalAddress", addressLocality: creator.profile.location }
          : undefined,
        sameAs: [
          creator.profile.instagramHandle ? `https://instagram.com/${creator.profile.instagramHandle.replace(/^@+/, "")}` : null,
        ].filter(Boolean),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <CreatorProfileClient handle={handle} initialData={data ?? undefined} />
    </>
  );
}
