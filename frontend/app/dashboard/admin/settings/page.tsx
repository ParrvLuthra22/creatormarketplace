"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import SectionLabel from "@/components/dashboard/SectionLabel";
import MagneticButton from "@/components/dashboard/MagneticButton";
import { SettingsCard, PasswordModal } from "@/components/dashboard/AccountSettings";

export default function AdminSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <SectionLabel index="01" label="SETTINGS" />
        <h1 className="text-h2 font-display mt-2">Admin settings.</h1>
      </div>

      <SettingsCard title="Account">
        <div className="space-y-4">
          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1.5">EMAIL</p>
            <p className="text-sm text-(--text-secondary)">{user?.email}</p>
          </div>
          <MagneticButton variant="secondary" onClick={() => setPasswordModalOpen(true)}>
            Change password
          </MagneticButton>
        </div>
      </SettingsCard>

      <SettingsCard title="Admin Access">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-(--bg-surface)">
          <Terminal size={17} className="text-(--warning) shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-(--text-secondary) leading-relaxed mb-2">
              New admins are granted via a server-side seed script, not through this UI.
            </p>
            <Link href="/dashboard/admin/setup" className="text-sm text-(--accent) hover:opacity-80 transition-opacity font-medium">
              View setup instructions →
            </Link>
          </div>
        </div>
      </SettingsCard>

      {passwordModalOpen && <PasswordModal onClose={() => setPasswordModalOpen(false)} />}
    </div>
  );
}
