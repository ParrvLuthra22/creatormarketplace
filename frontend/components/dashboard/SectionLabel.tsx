import { cn } from "@/lib/utils";

/** Editorial numbered section label — "01 — OVERVIEW". */
export default function SectionLabel({
  index,
  label,
  className,
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <p className={cn("font-mono-utility text-mono-sm text-(--text-tertiary)", className)}>
      <span className="text-(--accent)">{index}</span> — {label}
    </p>
  );
}
