import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { alertsApi } from "@/lib/api";
import { mockAlerts } from "@/lib/mocks";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({
    meta: [
      { title: "Notificaciones · Inventario Inteligente" },
      { name: "description", content: "Feed de alertas e incidencias del sistema." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { data: alerts = mockAlerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: alertsApi.list,
    initialData: mockAlerts,
  });

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Notificaciones</h1>
        <p className="mt-1 text-sm text-muted-foreground">{alerts.length} alertas recientes</p>
      </header>

      <div className="space-y-3">
        {alerts.map((a) => (
          <NotificationItem key={a.id} alert={a} />
        ))}
      </div>
    </div>
  );
}
