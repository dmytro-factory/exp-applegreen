"use client";

import { useId, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MissionMilestone, MissionPhase } from "@/app/(marketing)/mission/data";
import { cn } from "@/lib/utils";
import {
  MISSION_PHASE_COLORS,
  MISSION_PHASE_LABELS,
  buildMilestoneGanttModel,
  buildMissionTickOffsets,
  formatMissionDateTime,
  formatMissionTickLabel,
} from "@/components/mission/milestone-gantt-utils";

type MilestoneGanttProps = {
  milestones: MissionMilestone[];
  className?: string;
};

type MilestoneBarShapeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  payload?: {
    pushbackCount?: number;
  };
  patternId?: string;
};

function MilestoneBarShape({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill = "currentColor",
  payload,
  patternId,
}: MilestoneBarShapeProps) {
  const pushbackCount = payload?.pushbackCount ?? 0;
  const showBadge = pushbackCount > 0 && width >= 48;
  const badgeSize = Math.min(height - 4, 18);
  const badgeX = x + width - badgeSize - 4;
  const badgeY = y + (height - badgeSize) / 2;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={5} ry={5} fill={fill} />
      {pushbackCount > 0 && patternId ? (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={5}
          ry={5}
          fill={`url(#${patternId})`}
          opacity={0.75}
        />
      ) : null}
      {showBadge ? (
        <g aria-label={`${pushbackCount} pushbacks`}>
          <rect
            x={badgeX}
            y={badgeY}
            width={badgeSize}
            height={badgeSize}
            rx={badgeSize / 2}
            fill="rgba(15, 23, 42, 0.85)"
          />
          <text
            x={badgeX + badgeSize / 2}
            y={badgeY + badgeSize / 2}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10}
            fontWeight={700}
          >
            {pushbackCount}
          </text>
        </g>
      ) : null}
    </g>
  );
}

const phaseLegendOrder: MissionPhase[] = ["WORKER", "SCRUTINY", "USER-TESTING"];

export function MilestoneGantt({ milestones, className }: MilestoneGanttProps) {
  const chartPatternId = useId().replace(/:/g, "");

  const model = useMemo(() => buildMilestoneGanttModel(milestones), [milestones]);
  const tickOffsets = useMemo(
    () => buildMissionTickOffsets(model.totalDurationMinutes, 5),
    [model.totalDurationMinutes],
  );
  const chartHeight = Math.max(360, model.rows.length * 52 + 72);

  return (
    <section
      className={cn(
        "w-full min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6",
        className,
      )}
      aria-label="Mission milestone gantt chart"
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {phaseLegendOrder.map((phase) => (
          <span
            key={phase}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold tracking-[0.04em] text-foreground"
          >
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: MISSION_PHASE_COLORS[phase] }}
            />
            {MISSION_PHASE_LABELS[phase]}
          </span>
        ))}
        <span className="text-xs text-muted-foreground">Striped bars and badges highlight pushbacks.</span>
      </div>

      <div className="w-full min-w-0" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={model.rows}
            layout="vertical"
            margin={{ top: 12, right: 32, bottom: 20, left: 8 }}
            barCategoryGap={14}
          >
            <defs>
              <pattern
                id={chartPatternId}
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(15, 23, 42, 0.45)" strokeWidth="3" />
              </pattern>
            </defs>

            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis
              type="number"
              domain={[0, model.totalDurationMinutes]}
              ticks={tickOffsets}
              tickFormatter={(offset) => formatMissionTickLabel(model.timelineStartMs, Number(offset))}
              axisLine={{ stroke: "rgba(148, 163, 184, 0.6)" }}
              tickLine={false}
              tick={{ fontSize: 12, fill: "rgb(100 116 139)" }}
              minTickGap={20}
            />
            <YAxis
              dataKey="title"
              type="category"
              width={220}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "rgb(30 41 59)" }}
              interval={0}
            />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
              formatter={(value) => [`${value} min`, "Duration"]}
              labelFormatter={(label, payload) => {
                const row = payload?.[0]?.payload as MissionMilestone | undefined;

                if (!row) {
                  return String(label);
                }

                return `${row.title} · ${formatMissionDateTime(row.start)} → ${formatMissionDateTime(row.end)}`;
              }}
            />

            <Bar
              dataKey="startOffsetMinutes"
              stackId="mission"
              fill="transparent"
              isAnimationActive={false}
              legendType="none"
            />
            <Bar
              dataKey="durationMinutes"
              stackId="mission"
              isAnimationActive={false}
              shape={<MilestoneBarShape patternId={chartPatternId} />}
            >
              {model.rows.map((row) => (
                <Cell key={row.id} fill={MISSION_PHASE_COLORS[row.phase]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
