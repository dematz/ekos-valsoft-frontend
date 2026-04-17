import { X, TrendingUp } from 'lucide-react';
import type { ApiItem, ApiPrediction } from '@/types/api';
import { cn } from '@/lib/utils';

interface MetricProps {
  label: string;
  value: string;
  emphasis?: boolean;
}

function Metric({ label, value, emphasis }: MetricProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-lg font-semibold tabular-nums", emphasis && "text-primary")}>
        {value}
      </p>
    </div>
  );
}

interface PredictionPanelProps {
  item: ApiItem | null;
  prediction: ApiPrediction | null;
  onClose: () => void;
}

export function PredictionPanel({ item, prediction, onClose }: PredictionPanelProps) {
  const open = item !== null && prediction !== null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-screen w-[440px] border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {item && prediction && (
          <div className="flex h-full flex-col">
            <header className="flex items-start justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-primary">Predicción IA</p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight">{item.name}</h2>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">{item.sku}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Cerrar panel de predicción"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Pronóstico · {prediction.prediction_days} días
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground">
                  {prediction.recommendation}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Confianza del modelo: {(prediction.confidence * 100).toFixed(1)}%
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Metric label="Cantidad actual" value={item.quantity.toString()} />
                <Metric label="Stock mínimo" value={item.min_stock.toString()} />
                <Metric label="Horizonte" value={`${prediction.prediction_days} días`} emphasis />
                <Metric
                  label="Confianza"
                  value={`${(prediction.confidence * 100).toFixed(1)}%`}
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
                Basado en el histórico de los últimos 90 días y patrones estacionales detectados.
                Recalibrado automáticamente cada 24h.
              </div>
            </div>

            <footer className="border-t border-border px-6 py-4">
              <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                Generar orden de compra
              </button>
            </footer>
          </div>
        )}
      </aside>
    </>
  );
}
