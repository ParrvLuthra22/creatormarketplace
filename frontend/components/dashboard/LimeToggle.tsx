"use client";

export default function LimeToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-3 py-1 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2 rounded-sm"
      data-interactive
    >
      <span className="text-sm text-(--text-secondary)">{label}</span>
      <span className="lime-switch" data-on={checked} aria-hidden />
    </button>
  );
}
