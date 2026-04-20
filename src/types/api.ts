export type ApiItem = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  min_stock_threshold: number;
  category_id: number;
  status: 'in stock' | 'low stock' | 'ordered' | 'discontinued';
  category?: { id: number; name: string };
};

export type ApiPrediction = {
  prediction_days: number;
  confidence: number;
  recommendation: string;
};

export type ApiKpi = {
  id: string;
  label: string;
  value: string;
  delta: number;
  hint: string;
};

export type ApiCategory = {
  id: number;
  name: string;
  description: string | null;
};

export type ItemFormData = {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  min_stock_threshold: number;
  category_id: number;
  status: ApiItem['status'];
};

export type ApiAlert = {
  id: string;
  type: 'stock' | 'forecast' | 'system';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  body: string;
  time: string;
};
