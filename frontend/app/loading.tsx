// Root loading UI — shown during initial server render / suspense
export default function RootLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-8 w-8 rounded-full border-2 animate-spin"
          style={{
            borderColor: "var(--border)",
            borderTopColor: "var(--accent)",
          }}
          aria-hidden
        />
        <span className="font-mono-utility text-mono-sm" style={{ color: "var(--text-tertiary)" }}>
          LOADING
        </span>
      </div>
    </div>
  );
}
