import { ActivityItem, getCreatorById } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const typeConfig = {
  accepted: { dot: "bg-(--success)", label: "Accepted" },
  message: { dot: "bg-(--accent)", label: "Message" },
  completed: { dot: "bg-(--text-tertiary)", label: "Completed" },
  invited: { dot: "bg-(--border-strong)", label: "Invited" },
  payment: { dot: "bg-(--success)", label: "Payment" },
};

interface ActivityFeedProps {
  items: ActivityItem[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <ul className="flex flex-col divide-y divide-(--border)" role="list">
      {items.map((item) => {
        const creator = item.creatorId ? getCreatorById(item.creatorId) : null;
        const config = typeConfig[item.type];

        return (
          <li key={item.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            {/* Avatar or dot */}
            <div
              className="mt-1 shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-(--bg-primary) select-none"
              style={{ background: creator?.gradient ?? "var(--border-strong)" }}
              aria-hidden
            >
              {creator?.name.charAt(0) ?? "·"}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-(--text-secondary) leading-snug">{item.text}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={cn("h-1.5 w-1.5 rounded-full", config.dot)}
                aria-hidden
              />
              <span className="font-mono-utility text-mono-sm text-(--text-tertiary) whitespace-nowrap">
                {item.timestamp}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
