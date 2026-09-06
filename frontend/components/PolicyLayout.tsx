import { ReactNode } from "react";
import Link from "next/link";

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
  badge?: string;
}

export function PolicyLayout({ title, lastUpdated, children, badge }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary)">
      {/* Hero header */}
      <div className="border-b border-(--border) pt-40 pb-12 px-6 md:px-20 max-w-[1400px] mx-auto">
        {badge && (
          <span className="inline-block px-3 py-1 mb-5 rounded-md border border-(--accent)/20 bg-(--accent)/8 font-mono-utility text-mono-sm text-(--accent)">
            {badge}
          </span>
        )}
        <h1 className="text-hero font-display leading-[0.95] tracking-[-0.04em] mb-3">{title}</h1>
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">Last updated: {lastUpdated}</p>
      </div>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-20 py-12 md:pb-20">
        <div
          className="h-[2px] mb-10 rounded-full"
          style={{ background: "linear-gradient(to right, var(--accent) 0%, color-mix(in srgb, var(--accent) 10%, transparent) 40%, transparent 80%)" }}
          aria-hidden
        />

        <div className="rounded-3xl border border-(--border) bg-(--bg-secondary) p-8 md:p-16">{children}</div>

        {/* Back link */}
        <div className="mt-9 flex items-center gap-4">
          <Link
            href="/"
            className="font-mono-utility text-mono-sm text-(--text-tertiary) hover:text-(--accent) transition-colors duration-150"
            data-interactive
          >
            ← Back to Home
          </Link>
          <span className="text-(--border-strong)">·</span>
          <a
            href="mailto:parrvcodes@gmail.com"
            className="font-mono-utility text-mono-sm text-(--text-tertiary) hover:text-(--accent) transition-colors duration-150"
            data-interactive
          >
            Contact Us
          </a>
        </div>
      </main>
    </div>
  );
}

// ─── Shared content primitives — used by privacy-policy, terms-and-conditions,
// and data-deletion, which all share this section/bullet/divider structure. ───

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="block w-[3px] h-5 rounded-sm bg-(--accent) shrink-0" aria-hidden />
        <h2 className="font-mono-utility text-mono-sm text-(--accent) tracking-[0.15em] uppercase m-0">{title}</h2>
      </div>
      <div className="pl-[15px]">{children}</div>
    </section>
  );
}

export const policyDivider = <div className="h-px bg-(--border) my-8" aria-hidden />;

export function PolicyBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 mb-2.5">
      <span className="mt-2 w-[5px] h-[5px] rounded-full bg-(--accent) shrink-0" aria-hidden />
      <span className="text-sm text-(--text-secondary) leading-[1.9]">{children}</span>
    </li>
  );
}
