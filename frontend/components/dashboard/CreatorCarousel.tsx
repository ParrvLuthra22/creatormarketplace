"use client";

import { useRef, useState, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DashCreatorCard from "./DashCreatorCard";

interface CarouselCreator {
  id: string;
  handle: string;
  name: string;
  niches: string[];
  followers: number;
  engagement?: string | number | null;
  profilePicture?: string | null;
  verificationBadge?: string;
}

export default function CreatorCarousel({
  creators,
  onInvite,
}: {
  creators: CarouselCreator[];
  onInvite: (creatorId: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, startScroll: 0 });
  const [dragging, setDragging] = useState(false);

  function scrollByAmount(amount: number) {
    trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  function onMouseDown(e: MouseEvent) {
    const el = trackRef.current;
    if (!el) return;
    dragState.current = { dragging: true, startX: e.clientX, startScroll: el.scrollLeft };
    setDragging(true);
  }
  function onMouseMove(e: MouseEvent) {
    const el = trackRef.current;
    if (!el || !dragState.current.dragging) return;
    const delta = e.clientX - dragState.current.startX;
    el.scrollLeft = dragState.current.startScroll - delta;
  }
  function endDrag() {
    dragState.current.dragging = false;
    setDragging(false);
  }

  if (creators.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-8 text-center">
        <p className="text-sm text-(--text-tertiary)">No creator matches yet — check back soon.</p>
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-1"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        {creators.map((creator) => (
          <div key={creator.id} className="w-[260px] shrink-0">
            <DashCreatorCard
              handle={creator.handle}
              name={creator.name}
              niches={creator.niches}
              followers={creator.followers}
              engagement={creator.engagement}
              profilePicture={creator.profilePicture}
              verified={Boolean(creator.verificationBadge && creator.verificationBadge !== "none")}
              onInvite={() => onInvite(creator.id)}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollByAmount(-560)}
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-(--border) bg-(--bg-secondary) items-center justify-center text-(--text-secondary) hover:text-(--text-primary) hover:border-(--accent) transition-colors opacity-0 group-hover/carousel:opacity-100 duration-200"
        aria-label="Scroll left"
        data-interactive
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => scrollByAmount(560)}
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-(--border) bg-(--bg-secondary) items-center justify-center text-(--text-secondary) hover:text-(--text-primary) hover:border-(--accent) transition-colors opacity-0 group-hover/carousel:opacity-100 duration-200"
        aria-label="Scroll right"
        data-interactive
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
