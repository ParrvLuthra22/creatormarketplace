"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  // TODO: no newsletter subscription endpoint exists on the backend yet —
  // wire this to a real POST once one ships instead of just acknowledging it.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    showToast("Newsletter signup isn't live yet — check back soon.", "info");
    setEmail("");
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit} aria-label="Newsletter signup">
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        required
        className="flex-1 min-w-0 bg-(--bg-surface) border border-(--border) rounded-full px-4 py-2 text-sm text-(--text-primary) placeholder:text-(--text-tertiary) focus-visible:outline-2 focus-visible:outline-(--accent) outline-none transition-colors duration-200 hover:border-(--border-strong) min-h-[44px]"
      />
      <button
        type="submit"
        className="bg-(--accent) text-(--bg-primary) rounded-full px-5 py-2 text-sm font-medium hover:bg-(--accent-hover) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) min-h-[44px] min-w-[44px] shrink-0"
        data-interactive
      >
        Go
      </button>
    </form>
  );
}
