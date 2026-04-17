import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { PredictionPanel } from "@/components/inventory/PredictionPanel";
import { inventoryApi } from "@/lib/api";
import { mockInventory, predictStock } from "@/lib/mocks";
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
  const [selectedItem, setSelectedItem] = useState<ApiItem | null>(null);
  const [prediction, setPrediction] = useState<ApiPrediction | null>(null);

  const { data: items = mockInventory } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryApi.list,
    initialData: mockInventory,
  });

  const handlePredict = async (item: ApiItem) => {
    setSelectedItem(item);
    try {
      const result = await inventoryApi.predict(item.id);
      setPrediction(result);
    } catch {
      setPrediction(predictStock(item));
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
    setPrediction(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventario</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} SKUs activos · sincronizado hace 2 min
          </p>
        </div>
      </header>

      <InventoryTable items={items} onPredict={handlePredict} />
      <PredictionPanel item={selectedItem} prediction={prediction} onClose={handleClose} />
    </div>
  );
}
