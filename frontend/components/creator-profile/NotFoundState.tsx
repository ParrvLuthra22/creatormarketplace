import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Server-renderable (no "use client") so app/c/[handle]/page.tsx can show it
// directly when the creator doesn't exist, without ever mounting the client
// profile component and its scroll-tracking hooks.
export default function NotFoundState() {
  return (
    <div className="min-h-screen bg-(--bg-primary) grid place-items-center px-6">
      <div className="text-center max-w-md">
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4">404 / CREATOR NOT FOUND</p>
        <h1 className="text-h1 font-display mb-4">
          This profile doesn&rsquo;t <span className="font-serif text-(--text-secondary)">exist.</span>
        </h1>
        <p className="text-(--text-secondary) mb-8">
          The creator you&rsquo;re looking for isn&rsquo;t on CreatorLyff, or their profile isn&rsquo;t public.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-(--accent) text-(--bg-primary) font-semibold text-sm hover:bg-(--accent-hover) transition-colors duration-200"
          data-interactive
        >
          Browse creators <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
