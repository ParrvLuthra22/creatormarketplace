"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import SectionLabel from "@/components/dashboard/SectionLabel";

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — nothing to fall back to here
    }
  }

  return (
    <div className="relative rounded-xl border border-(--border) bg-(--bg-surface) p-4 font-mono-utility text-sm text-(--text-primary) overflow-x-auto">
      <button
        onClick={copy}
        className="absolute top-3 right-3 h-7 w-7 rounded-lg hover:bg-(--bg-secondary) grid place-items-center text-(--text-tertiary) hover:text-(--text-primary) transition-colors"
        aria-label="Copy to clipboard"
        data-interactive
      >
        {copied ? <Check size={13} className="text-(--accent)" /> : <Copy size={13} />}
      </button>
      <pre className="whitespace-pre-wrap pr-8">{children}</pre>
    </div>
  );
}

export default function AdminSetupPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <SectionLabel index="01" label="ADMIN SETUP" />
        <h1 className="text-h2 font-display mt-2">Grant admin access.</h1>
        <p className="text-sm text-(--text-secondary) mt-2">
          Admin access is granted server-side by a seed script — there&apos;s no self-service way to become an
          admin from this UI, by design.
        </p>
      </div>

      <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 space-y-4">
        <div>
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">1. SET THE ENV VAR</p>
          <p className="text-sm text-(--text-secondary) mb-3">
            In the backend&apos;s environment (<code className="font-mono-utility text-xs">.env</code>), list the
            email addresses that should become admins:
          </p>
          <CodeBlock>{`ADMIN_EMAILS=you@example.com,teammate@example.com`}</CodeBlock>
        </div>

        <div>
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">2. RUN THE SEED SCRIPT</p>
          <p className="text-sm text-(--text-secondary) mb-3">
            From the <code className="font-mono-utility text-xs">backend/</code> directory — each email must
            already have a CreatorLyff account:
          </p>
          <CodeBlock>{`npm run seed:admin`}</CodeBlock>
        </div>

        <div>
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">3. LOG BACK IN</p>
          <p className="text-sm text-(--text-secondary)">
            Sign out and back in so your session picks up <code className="font-mono-utility text-xs">isAdmin</code>,
            then visit <code className="font-mono-utility text-xs">/dashboard/admin</code>.
          </p>
        </div>
      </div>

      <p className="text-xs text-(--text-tertiary)">
        See the <code className="font-mono-utility text-xs">README.md</code>&apos;s Admin Access section for more detail.
      </p>
    </div>
  );
}
