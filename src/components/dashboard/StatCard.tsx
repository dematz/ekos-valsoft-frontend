import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { ApiKpi } from '@/types/api';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StatCardProps {
  kpi: ApiKpi;
}

export function StatCard({ kpi }: StatCardProps) {
  const positive = kpi.delta >= 0;

  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {kpi.label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{kpi.value}</p>
      <div className="mt-3 flex items-center gap-1.5 text-xs">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  "inline-flex cursor-default items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
                  positive ? "bg-chart-2/10 text-chart-2" : "bg-destructive/10 text-destructive",
                )}
              >
                {positive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(kpi.delta)}%
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{kpi.hint}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-muted-foreground">{kpi.hint}</span>
      </div>
    </article>
  );
}
