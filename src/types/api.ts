export type ApiItem = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  min_stock: number;
  category_id: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
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

export type ApiAlert = {
  id: string;
  type: 'stock' | 'forecast' | 'system';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  body: string;
  time: string;
};
