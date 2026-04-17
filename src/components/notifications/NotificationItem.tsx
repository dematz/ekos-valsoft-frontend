import { AlertTriangle, Info, TriangleAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ApiAlert } from '@/types/api';
import { cn } from '@/lib/utils';

type SeverityConfig = {
  icon: LucideIcon;
  tone: string;
  ring: string;
  label: string;
};

const SEVERITY_CONFIG: Record<ApiAlert['severity'], SeverityConfig> = {
  critical: { icon: AlertTriangle, tone: "text-destructive", ring: "bg-destructive/10", label: "Crítico" },
  warning: { icon: TriangleAlert, tone: "text-chart-3", ring: "bg-chart-3/15", label: "Atención" },
  info: { icon: Info, tone: "text-primary", ring: "bg-primary/10", label: "Info" },
};

interface NotificationItemProps {
  alert: ApiAlert;
}

export function NotificationItem({ alert }: NotificationItemProps) {
  const cfg = SEVERITY_CONFIG[alert.severity];
  const Icon = cfg.icon;

  return (
    <article className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          cfg.ring,
          cfg.tone,
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold tracking-tight">{alert.title}</h3>
          <span
            className={cn(
              "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              cfg.ring,
              cfg.tone,
            )}
          >
            {cfg.label}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{alert.body}</p>
        <p className="mt-2 text-xs text-muted-foreground/70">{alert.time}</p>
      </div>
    </article>
  );
}
