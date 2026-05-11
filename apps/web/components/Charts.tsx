"use client";
import dynamic from "next/dynamic";

export const BarChart: any = dynamic(
  () => import("recharts").then((m: any) => ({ default: m.BarChart })),
  { ssr: false },
);

export const Bar: any = dynamic(
  () => import("recharts").then((m: any) => ({ default: m.Bar })),
  { ssr: false },
);

export const XAxis: any = dynamic(
  () => import("recharts").then((m: any) => ({ default: m.XAxis })),
  { ssr: false },
);

export const YAxis: any = dynamic(
  () => import("recharts").then((m: any) => ({ default: m.YAxis })),
  { ssr: false },
);

export const Tooltip: any = dynamic(
  () => import("recharts").then((m: any) => ({ default: m.Tooltip })),
  { ssr: false },
);

export const ResponsiveContainer: any = dynamic(
  () => import("recharts").then((m: any) => ({ default: m.ResponsiveContainer })),
  { ssr: false },
);
