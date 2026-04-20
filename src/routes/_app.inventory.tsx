import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, AlertCircle } from "lucide-react";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { PredictionPanel } from "@/components/inventory/PredictionPanel";
import { ItemForm } from "@/components/inventory/ItemForm";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { inventoryApi } from "@/lib/api";
import type { ApiItem, ApiPrediction } from "@/types/api";

export const Route = createFileRoute("/_app/inventory")({
  head: () => ({
    meta: [
      { title: "Inventario · Inventario Inteligente" },
      { name: "description", content: "Gestiona SKUs y predice stock con IA." },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const qc = useQueryClient();

  const [selectedItem, setSelectedItem] = useState<ApiItem | null>(null);
  const [prediction, setPrediction] = useState<ApiPrediction | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ApiItem | null>(null);

  const { data: items, isLoading, isError, refetch } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory"] });
      setPendingDelete(null);
    },
  });

  const handlePredict = async (item: ApiItem) => {
    setSelectedItem(item);
    try {
      const result = await inventoryApi.predict(item.id);
      setPrediction(result);
    } catch {
      setPrediction(null);
    }
  };

  const handleEdit = (item: ApiItem) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleFormClose = useCallback(() => {
    setFormOpen(false);
    setEditingItem(null);
  }, []);

  const renderTable = () => {
    if (isLoading) {
      return <p className="text-sm text-muted-foreground">Cargando inventario…</p>;
    }
    if (isError) {
      return (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-5 py-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">No se pudo cargar el inventario.</p>
            <p className="text-xs text-muted-foreground">Verifica que el backend esté activo y que tu sesión sea válida.</p>
          </div>
          <button
            onClick={() => refetch()}
            className="rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
          >
            Reintentar
          </button>
        </div>
      );
    }
    if (!items?.length) {
      return <p className="text-sm text-muted-foreground">No hay ítems en el inventario.</p>;
    }
    return (
      <InventoryTable
        items={items}
        onPredict={handlePredict}
        onEdit={handleEdit}
        onDelete={setPendingDelete}
      />
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventario</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Cargando…" : isError ? "Error al cargar" : `${items?.length ?? 0} SKUs activos`}
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Agregar Ítem
        </button>
      </header>

      {renderTable()}

      <PredictionPanel
        item={selectedItem}
        prediction={prediction}
        onClose={() => { setSelectedItem(null); setPrediction(null); }}
      />

      <ItemForm
        open={formOpen}
        item={editingItem}
        onClose={handleFormClose}
        onSaved={handleFormClose}
      />

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar ítem?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará <strong>{pendingDelete?.name}</strong> ({pendingDelete?.sku}) de forma
              permanente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Eliminando…" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
