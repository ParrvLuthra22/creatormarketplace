import { PolicyLayout, PolicySection, policyDivider } from "@/components/PolicyLayout";
import { Trash2, UserX, Mail, AlertCircle, CheckCircle, Clock } from "lucide-react";

function StepCard({ step, text, subdued = false }: { step: string; text: string; subdued?: boolean }) {
  return (
    <div
      className="flex items-start gap-4 rounded-xl px-5 py-4 mb-2.5 border"
      style={{
        background: subdued ? "var(--bg-surface)" : "color-mix(in srgb, var(--accent) 5%, transparent)",
        borderColor: subdued ? "var(--border)" : "color-mix(in srgb, var(--accent) 20%, transparent)",
      }}
    >
      <div
        className="shrink-0 w-6 h-6 rounded-md border flex items-center justify-center"
        style={{
          background: subdued ? "var(--bg-secondary)" : "color-mix(in srgb, var(--accent) 12%, transparent)",
          borderColor: subdued ? "var(--border-strong)" : "color-mix(in srgb, var(--accent) 25%, transparent)",
        }}
      >
        <span className={`text-[10px] font-extrabold ${subdued ? "text-(--text-tertiary)" : "text-(--accent)"}`}>{step}</span>
      </div>
      <p className="text-sm text-(--text-secondary) leading-[1.8] m-0">{text}</p>
    </div>
  );
}

const DELETED_ITEMS = [
  { icon: <UserX size={14} />, label: "User account & credentials" },
  { icon: <Trash2 size={14} />, label: "Creator or brand profile" },
  { icon: <Trash2 size={14} />, label: "Instagram username & follower data" },
  { icon: <Trash2 size={14} />, label: "Cached Instagram media posts" },
  { icon: <Trash2 size={14} />, label: "All sent and received proposals" },
  { icon: <Trash2 size={14} />, label: "Chat messages and conversations" },
  { icon: <Trash2 size={14} />, label: "Stored access tokens" },
  { icon: <Trash2 size={14} />, label: "Subscription and billing metadata" },
];

const TIMELINE = [
  { icon: <CheckCircle size={15} className="text-(--accent)" />, time: "Immediate", text: "Account deletion from your dashboard takes effect instantly" },
  { icon: <Clock size={15} className="text-(--text-tertiary)" />, time: "Within 30 days", text: "Data deleted via Facebook app revocation or email request" },
  { icon: <Clock size={15} className="text-(--text-tertiary)" />, time: "Within 90 days", text: "Residual data in encrypted backups is purged during routine backup cycles" },
];

export default function DataDeletion() {
  return (
    <PolicyLayout title="Data Deletion Instructions" lastUpdated="April 9, 2026" badge="Your Rights">
      <PolicySection title="Your Right to Delete">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          CreatorLyff is committed to respecting your privacy and your right to be forgotten. You can request the deletion of your personal data — including any Instagram data accessed through Facebook Login — at any time using the methods below.
        </p>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Method 1 — Delete from Dashboard (Recommended)">
        <p className="text-sm text-(--text-secondary) leading-[1.9] mb-5">
          The fastest way to delete all your data is directly from your account settings:
        </p>
        <StepCard step="1" text="Log in to your CreatorLyff account" />
        <StepCard step="2" text="Go to Dashboard → Settings" />
        <StepCard step="3" text="Scroll down to the Danger Zone section" />
        <StepCard step="4" text='Click "Delete Account" and confirm the action' />
        <StepCard step="5" text="Your account, profile, and all associated data will be permanently deleted immediately" />

        <div
          className="flex items-start gap-3 rounded-xl px-5 py-4 mt-5 border"
          style={{ background: "color-mix(in srgb, var(--accent) 5%, transparent)", borderColor: "color-mix(in srgb, var(--accent) 15%, transparent)" }}
        >
          <AlertCircle size={16} className="text-(--accent) mt-0.5 shrink-0" />
          <p className="text-[13px] text-(--text-secondary) leading-[1.8] m-0">
            <strong className="text-(--text-primary)">This is permanent.</strong> Account deletion removes your user record, creator/brand profile, Instagram data, and all proposals or conversations associated with your account. This action cannot be undone.
          </p>
        </div>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Method 2 — Revoke via Facebook App Settings">
        <p className="text-sm text-(--text-secondary) leading-[1.9] mb-5">
          If you connected via Instagram/Facebook Login, you can revoke our app&apos;s permissions directly through Meta — this triggers an automatic data deletion:
        </p>
        <StepCard step="1" text="Go to facebook.com/settings" subdued />
        <StepCard step="2" text="Navigate to Security & Login → Apps and Websites" subdued />
        <StepCard step="3" text='Find "CreatorLyff" in the list of connected apps' subdued />
        <StepCard step="4" text='Click "Remove" next to CreatorLyff' subdued />
        <StepCard step="5" text="Meta will automatically send us a deletion request and we will remove all your Instagram data within 30 days" subdued />
      </PolicySection>

      {policyDivider}

      <PolicySection title="Method 3 — Email Request">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9] mb-6">
          You can also request data deletion by emailing us directly. We will process your request within <strong className="text-(--text-primary)">7 business days</strong> and send you a confirmation once completed.
        </p>
        <a
          href="mailto:parrvcodes@gmail.com?subject=Data Deletion Request&body=Hello,%0A%0AI would like to request the deletion of all my personal data from CreatorLyff.%0A%0AAccount email: [your email here]%0A%0AThank you."
          className="inline-flex items-center gap-2.5 rounded-full bg-(--accent) text-(--bg-primary) px-9 py-4 font-extrabold text-[15px] tracking-[-0.01em] no-underline hover:bg-(--accent-hover) transition-colors duration-200"
          data-interactive
        >
          <Mail size={16} />
          Send Deletion Request Email
        </a>
      </PolicySection>

      {policyDivider}

      <PolicySection title="What Gets Deleted">
        <p className="text-sm text-(--text-secondary) leading-[1.9] mb-5">
          Upon account deletion, the following data is permanently removed from our systems:
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {DELETED_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-[10px] border border-(--border) bg-(--bg-surface) px-4 py-3">
              <span className="text-(--accent)">{item.icon}</span>
              <span className="text-[13px] text-(--text-secondary)">{item.label}</span>
            </div>
          ))}
        </div>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Deletion Timeline">
        <div className="flex flex-col gap-2.5">
          {TIMELINE.map((item, i) => (
            <div key={i} className="flex items-start gap-4 rounded-xl border border-(--border) bg-(--bg-surface) px-5 py-4">
              <div className="shrink-0 mt-0.5">{item.icon}</div>
              <div>
                <p className="text-[10px] font-extrabold text-(--accent) uppercase tracking-[0.12em] mb-1">{item.time}</p>
                <p className="text-sm text-(--text-secondary) leading-[1.8] m-0">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </PolicySection>

      {policyDivider}

      <PolicySection title="Questions?">
        <p className="text-[15px] text-(--text-secondary) leading-[1.9]">
          If you have any questions about data deletion or want to confirm your data has been removed, contact us at{" "}
          <a href="mailto:parrvcodes@gmail.com" className="text-(--accent) no-underline">parrvcodes@gmail.com</a>. We aim to respond within 3 business days.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
