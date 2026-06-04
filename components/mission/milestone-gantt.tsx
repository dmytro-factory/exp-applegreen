"use client";

import { useId, useMemo, useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MissionMilestone } from "@/app/(marketing)/mission/data";
import { cn } from "@/lib/utils";
import {
  MISSION_PHASE_COLORS,
  MISSION_PHASE_LABELS,
  type GanttPhase,
  type MilestoneGanttDatum,
  buildMilestoneGanttModel,
  buildMissionTickOffsets,
  formatMissionDateTime,
  formatMissionTickLabel,
} from "@/components/mission/milestone-gantt-utils";

type MilestoneGanttProps = {
  milestones: MissionMilestone[];
  className?: string;
};

type PhaseSegment = {
  phase: GanttPhase;
  startOffsetMinutes: number;
  durationMinutes: number;
  pushbackCount: number;
};

type MilestoneBarShapeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  payload?: {
    startOffsetMinutes?: number;
    durationMinutes?: number;
    pushbackCount?: number;
    phases?: PhaseSegment[];
    orchestratorSegments?: PhaseSegment[];
    title?: string;
    start?: string;
    end?: string;
  };
  patternId?: string;
};

function MilestoneBarShape({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
  patternId,
}: MilestoneBarShapeProps) {
  const phases = payload?.phases ?? [];
  const orchestratorSegments = payload?.orchestratorSegments ?? [];
  const allSegments: PhaseSegment[] = [...orchestratorSegments, ...phases].sort(
    (a, b) => a.startOffsetMinutes - b.startOffsetMinutes,
  );
  const totalDuration = payload?.durationMinutes ?? 1;
  const milestoneStartOffset = payload?.startOffsetMinutes ?? 0;
  const scale = width / Math.max(totalDuration, 1);
  const minSegmentWidth = 3;

  const totalPushbackCount = payload?.pushbackCount ?? 0;
  const showBadge = totalPushbackCount > 0 && width >= 24;
  const badgeSize = Math.min(height - 4, 18);
  const badgeX = x + width - badgeSize - 4;
  const badgeY = y + (height - badgeSize) / 2;

  return (
    <g>
      {/* subtle background for the full milestone span */}
      <rect
        x={x}
        y={y + 2}
        width={width}
        height={height - 4}
        rx={5}
        ry={5}
        fill="rgba(148, 163, 184, 0.06)"
      />

      {allSegments.map((segment, index) => {
        const relativeStart = segment.startOffsetMinutes - milestoneStartOffset;
        let segmentWidth = Math.max(segment.durationMinutes * scale, minSegmentWidth);
        let segmentX = x + relativeStart * scale;

        // clamp to bar bounds
        if (segmentX < x) {
          segmentWidth -= x - segmentX;
          segmentX = x;
        }
        if (segmentX + segmentWidth > x + width) {
          segmentWidth = Math.max(x + width - segmentX, 0);
        }
        if (segmentWidth <= 0) return null;

        const isOrchestrator = segment.phase === "ORCHESTRATOR";

        return (
          <g key={index}>
            <rect
              x={segmentX}
              y={y + 4}
              width={segmentWidth}
              height={height - 8}
              rx={isOrchestrator ? 2 : 3}
              ry={isOrchestrator ? 2 : 3}
              fill={MISSION_PHASE_COLORS[segment.phase]}
              opacity={isOrchestrator ? 0.55 : 1}
            />
            {segment.pushbackCount > 0 && patternId ? (
              <rect
                x={segmentX}
                y={y + 4}
                width={segmentWidth}
                height={height - 8}
                rx={3}
                ry={3}
                fill={`url(#${patternId})`}
                opacity={0.75}
              />
            ) : null}
          </g>
        );
      })}

      {showBadge ? (
        <g aria-label={`${totalPushbackCount} pushbacks`}>
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
            {totalPushbackCount}
          </text>
        </g>
      ) : null}
    </g>
  );
}

const phaseLegendOrder: GanttPhase[] = ["WORKER", "ORCHESTRATOR", "SCRUTINY", "USER-TESTING"];

type MissionTooltipPayloadEntry = {
  dataKey?: string;
  payload?: MilestoneGanttDatum;
  value?: number;
};

export function MilestoneGantt({ milestones, className }: MilestoneGanttProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const chartPatternId = useId().replace(/:/g, "");

  const model = useMemo(() => buildMilestoneGanttModel(milestones), [milestones]);
  const tickOffsets = useMemo(
    () => buildMissionTickOffsets(model.totalDurationMinutes, 5),
    [model.totalDurationMinutes],
  );
  const chartHeight = Math.max(360, model.rows.length * 56 + 72);

  if (!mounted) {
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
        </div>
        <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
          Loading timeline...
        </div>
      </section>
    );
  }

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
        <span className="text-xs text-muted-foreground">Hatched bars mark rejections — workers had to fix issues before the milestone could be sealed.</span>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[720px]" style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={chartHeight}>
            <BarChart
              data={model.rows}
              layout="vertical"
              margin={{ top: 12, right: 48, bottom: 20, left: 8 }}
              barCategoryGap={16}
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
                width={200}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "rgb(30 41 59)" }}
                interval={0}
              />
              <Tooltip
                cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                content={({ active, payload, label }) => {
                  const tooltipPayload = payload as readonly MissionTooltipPayloadEntry[] | undefined;
                  const visibleRows = tooltipPayload?.filter(
                    (entry) => entry.dataKey !== "startOffsetMinutes" && typeof entry.value === "number",
                  );

                  if (!active || !visibleRows || visibleRows.length === 0) {
                    return null;
                  }

                  const row = visibleRows[0];
                  const milestone = row.payload;
                  const durationValue = Number(row.value);
                  const heading = milestone
                    ? `${milestone.title} · ${formatMissionDateTime(milestone.start)} → ${formatMissionDateTime(milestone.end)}`
                    : String(label);

                  return (
                    <div className="rounded-lg border border-border bg-white px-3 py-2 text-xs shadow-sm">
                      <p className="font-semibold text-foreground">{heading}</p>
                      <p className="mt-1 text-muted-foreground">Total duration: {durationValue} min</p>
                      {milestone?.phases && milestone.phases.length > 0 ? (
                        <div className="mt-2 space-y-1">
                          {milestone.phases.map((phase, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span
                                className="inline-block h-2 w-2 rounded-full"
                                style={{ backgroundColor: MISSION_PHASE_COLORS[phase.phase] }}
                              />
                              <span className="text-muted-foreground">
                                {MISSION_PHASE_LABELS[phase.phase]}: {phase.durationMinutes} min
                                {phase.pushbackCount > 0 ? ` (${phase.pushbackCount} pushback${phase.pushbackCount === 1 ? "" : "s"})` : ""}
                              </span>
                            </div>
                          ))}
                          {milestone.orchestratorSegments && milestone.orchestratorSegments.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block h-2 w-2 rounded-full"
                                style={{ backgroundColor: MISSION_PHASE_COLORS.ORCHESTRATOR }}
                              />
                              <span className="text-muted-foreground">
                                {MISSION_PHASE_LABELS.ORCHESTRATOR}:{" "}
                                {Math.round(
                                  milestone.orchestratorSegments.reduce(
                                    (sum, seg) => sum + seg.durationMinutes,
                                    0,
                                  ),
                                )}{" "}
                                min
                              </span>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
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
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
