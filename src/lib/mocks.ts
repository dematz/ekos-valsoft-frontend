import type { ApiItem, ApiKpi, ApiAlert, ApiPrediction } from '@/types/api';

export const CATEGORY_NAMES: Record<number, string> = {
  1: "Audio",
  2: "Periféricos",
  3: "Pantallas",
  4: "Video",
  5: "Accesorios",
  6: "Almacenamiento",
};

export const mockKpis: ApiKpi[] = [
  { id: "k1", label: "SKUs activos", value: "1,284", delta: 2.4, hint: "vs. semana pasada" },
  { id: "k2", label: "Stock crítico", value: "37", delta: -8.1, hint: "12 resueltos hoy" },
  { id: "k3", label: "Rotación mensual", value: "4.6x", delta: 0.3, hint: "promedio 30d" },
  { id: "k4", label: "Precisión IA", value: "94.2%", delta: 1.1, hint: "modelo v2.3" },
];

export const mockInventory: ApiItem[] = [
  { id: 1, sku: "SKU-1042", name: "Auriculares Bluetooth Pro", category_id: 1, quantity: 128, min_stock: 40, status: "In Stock" },
  { id: 2, sku: "SKU-1108", name: "Teclado mecánico TKL", category_id: 2, quantity: 22, min_stock: 30, status: "Low Stock" },
  { id: 3, sku: "SKU-1199", name: 'Monitor 27" 4K', category_id: 3, quantity: 6, min_stock: 15, status: "Out of Stock" },
  { id: 4, sku: "SKU-1247", name: "Webcam 1080p", category_id: 4, quantity: 84, min_stock: 25, status: "In Stock" },
  { id: 5, sku: "SKU-1311", name: "Hub USB-C 7-en-1", category_id: 5, quantity: 14, min_stock: 20, status: "Low Stock" },
  { id: 6, sku: "SKU-1422", name: "SSD NVMe 1TB", category_id: 6, quantity: 47, min_stock: 18, status: "In Stock" },
  { id: 7, sku: "SKU-1503", name: "Mouse ergonómico", category_id: 2, quantity: 3, min_stock: 25, status: "Out of Stock" },
  { id: 8, sku: "SKU-1611", name: "Cargador GaN 65W", category_id: 5, quantity: 92, min_stock: 30, status: "In Stock" },
];

export const mockAlerts: ApiAlert[] = [
  { id: "a1", type: "stock", severity: "critical", title: 'Stock crítico: Monitor 27" 4K', body: "Quedan 6 unidades. Punto de reorden: 15.", time: "Hace 12 min" },
  { id: "a2", type: "forecast", severity: "warning", title: "Demanda anómala detectada", body: "Auriculares Bluetooth Pro: pico de +180% en últimas 24h.", time: "Hace 1 h" },
  { id: "a3", type: "stock", severity: "warning", title: "Reorden sugerido", body: "Hub USB-C 7-en-1 cerca del umbral. Sugerencia: 60 uds.", time: "Hace 3 h" },
  { id: "a4", type: "system", severity: "info", title: "Modelo IA actualizado", body: "Predicción de stock recalibrada con datos de la semana.", time: "Ayer" },
  { id: "a5", type: "stock", severity: "critical", title: "Agotado próximo: Mouse ergonómico", body: "3 unidades restantes. ETA proveedor: 5 días.", time: "Ayer" },
];

export function predictStock(item: ApiItem): ApiPrediction {
  const base = Math.max(20, Math.round(item.quantity * 1.4 + item.min_stock));
  const suggested = Math.max(0, base - item.quantity);
  return {
    prediction_days: 30,
    recommendation: `Ordenar ${suggested} unidades para cubrir los próximos 30 días.`,
    confidence: parseFloat((0.88 + Math.random() * 0.08).toFixed(4)),
  };
}
