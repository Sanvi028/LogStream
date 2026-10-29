
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { AnalyticsSummary } from "../../types/log";

export default function LogsOverTimeChart({
  data,
}: {
  data: AnalyticsSummary["logsOverTime"];
}) {
  return (
    <div className="rounded-xl border border-slate-900 bg-slate-900/40 p-4">
      <p className="text-sm font-medium text-slate-300">
        Logs over time (last 24 hours)
      </p>

      <div className="mt-3 h-56">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No log activity available for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="logsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />

              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={30}
                allowDecimals={false}
              />

              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value) => [value, "Logs"]}
                labelFormatter={(label) => `Time: ${label}`}
              />

              <Area
                type="linear"
                dataKey="count"
                name="Logs"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#logsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
