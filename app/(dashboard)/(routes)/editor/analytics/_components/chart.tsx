// app/(dashboard)/(routes)/editor/analytics/_components/chart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── Articles published over time ─────────────────────────────────────────────

interface TimeChartProps {
  data: { name: string; total: number }[];
}

import { TooltipProps } from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: Array<{ value?: number | string }>;
  label?: string | number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-background border border-border px-3 py-2">
      <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-1">
        {label}
      </p>
      <p className="font-serif text-lg font-bold text-foreground leading-none">
        {payload[0].value}
        <span className="font-mono text-[9px] text-muted-foreground ml-1.5 uppercase tracking-widest">
          articles
        </span>
      </p>
    </div>
  );
};

export function TimeChart({ data }: TimeChartProps) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barCategoryGap="35%">
        <XAxis
          dataKey="name"
          tick={{ fontFamily: "monospace", fontSize: 9, fill: "hsl(var(--muted-foreground))", letterSpacing: "0.1em" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontFamily: "monospace", fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          width={24}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
        <Bar dataKey="total" radius={0}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.total === max && max > 0 ? "#C89B2A" : "hsl(var(--foreground))"}
              opacity={entry.total === 0 ? 0.15 : entry.total === max ? 1 : 0.7}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Media format breakdown (horizontal bars) ─────────────────────────────────

interface FormatBreakdownProps {
  data: { name: string; total: number }[];
}

const FORMAT_COLORS: Record<string, string> = {
  Text:    "hsl(var(--foreground))",
  Video:   "#C89B2A",
  Audio:   "#1A3A5C",
  Gallery: "hsl(var(--muted-foreground))",
  Other:   "hsl(var(--border))",
};

export function FormatBreakdown({ data }: FormatBreakdownProps) {
  const total = data.reduce((s, d) => s + d.total, 0) || 1;

  return (
    <div className="space-y-3">
      {data.map(({ name, total: count }) => {
        const pct = Math.round((count / total) * 100);
        return (
          <div key={name}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground">
                {name}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground">
                {count} · {pct}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted overflow-hidden">
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  backgroundColor: FORMAT_COLORS[name] ?? FORMAT_COLORS.Other,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Articles per beat (horizontal bar chart) ─────────────────────────────────

interface WriterChartProps {
  data: { name: string; total: number; published: number }[];
}

export function WriterChart({ data }: WriterChartProps) {
  if (!data.length) return (
    <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase text-center py-8">
      No beats yet
    </p>
  );

  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="space-y-2">
      {data.map(({ name, total, published }) => {
        const totalPct     = Math.round((total     / maxTotal) * 100);
        const publishedPct = Math.round((published / maxTotal) * 100);
        return (
          <div key={name} className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] tracking-wide text-muted-foreground truncate max-w-[60%]">
                {name}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground">
                {published}/{total}
              </span>
            </div>
            {/* total (background) */}
            <div className="h-2 w-full bg-muted relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-muted-foreground/30 transition-all duration-500"
                style={{ width: `${totalPct}%` }}
              />
              {/* published (foreground) */}
              <div
                className="absolute inset-y-0 left-0 bg-foreground transition-all duration-700"
                style={{ width: `${publishedPct}%` }}
              />
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-1.5 bg-foreground inline-block" />
          <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">Published</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-1.5 bg-muted-foreground/30 inline-block" />
          <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">Draft</span>
        </div>
      </div>
    </div>
  );
}
