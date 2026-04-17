import { useMemo, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import type { ApiItem } from '@/types/api';
import { CATEGORY_NAMES } from '@/lib/mocks';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<ApiItem['status'], string> = {
  'In Stock': "bg-chart-2/10 text-chart-2",
  'Low Stock': "bg-chart-3/15 text-chart-3",
  'Out of Stock': "bg-destructive/10 text-destructive",
};

const STATUS_LABEL: Record<ApiItem['status'], string> = {
  'In Stock': "En Stock",
  'Low Stock': "Bajo",
  'Out of Stock': "Crítico",
};

const STATUS_FILTERS = ['all', 'In Stock', 'Low Stock', 'Out of Stock'] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

interface InventoryTableProps {
  items: ApiItem[];
  onPredict: (item: ApiItem) => void;
}

export function InventoryTable({ items, onPredict }: InventoryTableProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filtered = useMemo(
    () =>
      items.filter((it) => {
        const matchesQ =
          !query ||
          it.name.toLowerCase().includes(query.toLowerCase()) ||
          it.sku.toLowerCase().includes(query.toLowerCase());
        const matchesS = statusFilter === 'all' || it.status === statusFilter;
        return matchesQ && matchesS;
      }),
    [items, query, statusFilter],
  );

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o SKU…"
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s === 'all' ? 'Todos' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Producto</th>
              <th className="px-5 py-3">Categoría</th>
              <th className="px-5 py-3 text-right">Cantidad</th>
              <th className="px-5 py-3 text-right">Stock Min.</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => (
              <tr
                key={it.id}
                className="border-b border-border/60 text-sm transition-colors last:border-0 hover:bg-muted/30"
              >
                <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{it.sku}</td>
                <td className="px-5 py-3.5 font-medium">{it.name}</td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {CATEGORY_NAMES[it.category_id] ?? `Cat. ${it.category_id}`}
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums">{it.quantity}</td>
                <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">{it.min_stock}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                      STATUS_STYLES[it.status],
                    )}
                  >
                    {STATUS_LABEL[it.status]}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => onPredict(it)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Predecir Stock
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
