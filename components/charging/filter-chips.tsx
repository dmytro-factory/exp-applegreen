"use client";

import {
  CONNECTOR_LABELS,
  SPEED_TIER_LABELS,
  type ConnectorType,
  type SpeedTier,
  type StationFilters,
} from "@/lib/charging/model";

const CONNECTORS: ConnectorType[] = ["CCS", "CHAdeMO", "Type2"];
const SPEEDS: SpeedTier[] = ["ultra", "rapid", "fast"];

type Chip = { key: string; label: string; active: boolean; onClick: () => void };

function ChipButton({ label, active, onClick }: Omit<Chip, "key">) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors"
      style={{
        borderColor: active ? "var(--brand-primary)" : "#D8DEEC",
        backgroundColor: active ? "var(--brand-primary)" : "white",
        color: active ? "white" : "#3D3D3D",
      }}
    >
      {label}
    </button>
  );
}

export function FilterChips({
  filters,
  onChange,
}: {
  filters: StationFilters;
  onChange: (next: StationFilters) => void;
}) {
  const hasActive = Boolean(filters.connector || filters.speed || filters.availableOnly);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ChipButton
        label="Available"
        active={filters.availableOnly}
        onClick={() => onChange({ ...filters, availableOnly: !filters.availableOnly })}
      />
      {SPEEDS.map((speed) => (
        <ChipButton
          key={speed}
          label={SPEED_TIER_LABELS[speed]}
          active={filters.speed === speed}
          onClick={() => onChange({ ...filters, speed: filters.speed === speed ? null : speed })}
        />
      ))}
      {CONNECTORS.map((connector) => (
        <ChipButton
          key={connector}
          label={CONNECTOR_LABELS[connector]}
          active={filters.connector === connector}
          onClick={() => onChange({ ...filters, connector: filters.connector === connector ? null : connector })}
        />
      ))}
      {hasActive ? (
        <button
          type="button"
          onClick={() => onChange({ connector: null, speed: null, availableOnly: false })}
          className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
