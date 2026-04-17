import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, LineChart } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard, SparklineChart, BarsChart } from "@/components/dashboard/StockChart";
import { kpiApi } from "@/lib/api";
import { mockKpis } from "@/lib/mocks";

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
  const { data: kpis = mockKpis } = useQuery({
    queryKey: ["kpis"],
    queryFn: kpiApi.list,
    initialData: mockKpis,
  });

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vista general del estado de tu inventario y predicciones IA.
        </p>
      </header>

      <section className="grid grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <StatCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

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
