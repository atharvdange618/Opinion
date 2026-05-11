"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { option: "React", votes: 48 },
  { option: "Vue", votes: 31 },
  { option: "Svelte", votes: 62 },
  { option: "Angular", votes: 19 },
  { option: "Solid", votes: 27 },
];

const COLORS = [
  "oklch(0.68 0.1 250 / 0.75)", // Primary pastel blue
  "oklch(0.78 0.08 230 / 0.75)", // Sky blue
  "oklch(0.60 0.12 260 / 0.75)", // Royal blue
  "oklch(0.75 0.1 275 / 0.75)", // Soft lavender
  "oklch(0.85 0.04 250 / 0.75)", // Slate gray-blue
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-muted-foreground">{payload[0].value} votes</p>
      </div>
    );
  }
  return null;
};

export function HeroArt() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/60 backdrop-blur-2xl p-6 shadow-xl ring-1 ring-foreground/5">
      <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Live results
      </p>
      <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
        What's your favourite JS framework?
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          barCategoryGap="30%"
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="oklch(0.21 0.01 30 / 0.08)"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="option"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "oklch(0.6 0.01 30)" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "oklch(0.6 0.01 30)" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0.08 }} />
          <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="inline-block size-1.5 rounded-full bg-primary/60" />
        187 responses · updated just now
      </div>
    </div>
  );
}
