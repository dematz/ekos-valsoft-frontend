import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, LineChart } from "lucide-react";
import { ChartCard, SparklineChart, BarsChart } from "@/components/dashboard/StockChart";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · Inventario Inteligente" },
      { name: "description", content: "Indicadores clave y tendencias de inventario." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  // TODO: Uncomment when backend implements /api/v1/dashboard/kpis endpoint
  // const { data: kpis, isLoading } = useQuery({
  //   queryKey: ["kpis"],
  //   queryFn: kpiApi.list,
  //   retry: false,
  // });

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vista general del estado de tu inventario y predicciones IA.
        </p>
      </header>

      {/* TODO: KPIs section - enable when backend endpoint is ready
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando indicadores…</p>
      ) : !kpis?.length ? (
        <p className="text-sm text-muted-foreground">Sin datos disponibles.</p>
      ) : (
        <section className="grid grid-cols-4 gap-5">
          {kpis.map((kpi) => (
            <StatCard key={kpi.id} kpi={kpi} />
          ))}
        </section>
      )}
      */}

      <section className="mt-6 grid grid-cols-2 gap-5">
        <ChartCard title="Rotación de stock (30d)" subtitle="Tendencia diaria" icon={LineChart}>
          <SparklineChart />
        </ChartCard>
        <ChartCard title="Top categorías" subtitle="Unidades vendidas" icon={BarChart3}>
          <BarsChart />
        </ChartCard>
      </section>
    </div>
  );
}
