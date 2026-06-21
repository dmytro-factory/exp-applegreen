"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from "recharts";

// Deterministic per-station busyness curve (0-100) so the chart is stable across renders.
function busynessCurve(seed: string): { hour: string; value: number }[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  }

  const hours = [6, 8, 10, 12, 14, 16, 18, 20, 22];
  return hours.map((hour) => {
    const morning = Math.exp(-((hour - 8) ** 2) / 6) * 70;
    const evening = Math.exp(-((hour - 17) ** 2) / 8) * 95;
    const jitter = ((hash + hour * 13) % 17) - 8;
    const value = Math.max(8, Math.min(100, Math.round(morning + evening + jitter)));
    return { hour: `${hour}:00`, value };
  });
}

export function PeakChart({ stationId }: { stationId: string }) {
  const data = busynessCurve(stationId);
  const peak = data.reduce((max, point) => Math.max(max, point.value), 0);

  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            interval={1}
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((point) => (
              <Cell key={point.hour} fill={point.value === peak ? "#006551" : "#62A60E"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
