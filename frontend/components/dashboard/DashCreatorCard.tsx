"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProfilePhotoUrl } from "@/lib/api";
import MagneticButton from "./MagneticButton";

interface DashCreatorCardProps {
  handle: string;
  name: string;
  niches: string[];
  followers: number;
  engagement?: string | number | null;
  profilePicture?: string | null;
  verified?: boolean;
  onInvite?: () => void;
  className?: string;
}

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function DashCreatorCard({
  handle,
  name,
  niches,
  followers,
  engagement,
  profilePicture,
  verified,
  onInvite,
  className,
}: DashCreatorCardProps) {
  const initial = name.charAt(0).toUpperCase();
  const photoUrl = profilePicture ? getProfilePhotoUrl(profilePicture) : "";
  const engagementDisplay = engagement
    ? typeof engagement === "number"
      ? `${engagement}%`
      : engagement
    : null;

  return (
    <div
      className={cn(
        "card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-5 flex flex-col",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold shrink-0">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate flex items-center gap-1">
            {name}
            {verified && <BadgeCheck size={14} className="text-(--accent) shrink-0" aria-label="Verified" />}
          </p>
          <p className="text-sm text-(--text-tertiary) truncate">{handle}</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-(--text-secondary) truncate min-h-[1rem]">
        {niches.join(", ") || "Open to collaborations"}
      </p>

      <div className="mt-4 flex items-center gap-4 font-mono-utility text-mono-sm text-(--text-tertiary)">
        <span>{formatFollowers(followers)} FOLLOWERS</span>
        {engagementDisplay && <span className="text-(--accent)">{engagementDisplay} ENG</span>}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Link
          href={`/c/${handle.replace(/^@/, "")}`}
          className="flex-1 h-9 rounded-lg border border-(--border) text-sm font-medium flex items-center justify-center hover:border-(--accent) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-1"
          data-interactive
          data-cursor="View profile"
        >
          View Profile
        </Link>
        {onInvite && (
          <MagneticButton variant="primary" className="flex-1" onClick={onInvite} data-cursor="Invite">
            Invite
          </MagneticButton>
        )}
      </div>
    </div>
  );
}
