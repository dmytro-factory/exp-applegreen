import type { StationAvailability } from "@/lib/charging/model";

export function AvailabilityBadge({ availability }: { availability: StationAvailability }) {
  const hasFree = availability.available > 0;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold"
      style={{
        backgroundColor: hasFree ? "var(--brand-badge-bg)" : "#E5E7EB",
        color: hasFree ? "var(--brand-primary)" : "#6B7280",
      }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: hasFree ? "var(--brand-primary)" : "#9CA3AF" }}
      />
      {availability.available}/{availability.total} available
    </span>
  );
}
