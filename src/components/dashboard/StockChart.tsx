import type { LucideIcon } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, icon: Icon, children }: ChartCardProps) {
  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <header className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </header>
      <div className="h-64">{children}</div>
    </article>
  );
}

const SPARKLINE_POINTS = [12, 18, 14, 22, 28, 24, 31, 29, 36, 33, 40, 38, 45, 42, 48];

export function SparklineChart() {
  const points = SPARKLINE_POINTS;
  const max = Math.max(...points);
  const w = 600;
  const h = 240;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * (h - 20) - 10}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
      <defs>
        <linearGradient id="lg1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.488 0.18 264)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="oklch(0.488 0.18 264)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lg1)" />
      <path
        d={path}
        fill="none"
        stroke="oklch(0.488 0.18 264)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const BARS_DATA = [
  { label: "Audio", value: 78 },
  { label: "Periféricos", value: 92 },
  { label: "Pantallas", value: 54 },
  { label: "Video", value: 40 },
  { label: "Almacenam.", value: 66 },
  { label: "Accesorios", value: 85 },
];

export function BarsChart() {
  const max = Math.max(...BARS_DATA.map((d) => d.value));
  return (
    <div className="flex h-full items-end gap-3 pt-4">
      {BARS_DATA.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-md bg-primary/85 transition-all hover:bg-primary"
            style={{ height: `${(d.value / max) * 100}%` }}
          />
          <span className="text-[11px] font-medium text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
