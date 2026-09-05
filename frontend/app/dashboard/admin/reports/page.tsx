"use client";

import SectionLabel from "@/components/dashboard/SectionLabel";

export default function AdminReportsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <SectionLabel index="01" label="REPORTS" />
        <h1 className="text-h2 font-display mt-2">Reports.</h1>
      </div>
      <div className="rounded-xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-16 text-center">
        <p className="text-(--text-tertiary)">Custom reports and exports are coming soon.</p>
      </div>
    </div>
  );
}
