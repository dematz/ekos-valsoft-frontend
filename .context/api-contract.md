# Contrato de API (Backend Laravel)
- **Base URL:** http://localhost:8000/api/v1
- **Item Entity:** - id: number, name: string, sku: string, quantity: number, 
  - min_stock: number, category_id: number, status: 'In Stock'|'Low Stock'|'Out of Stock'
- **IA Prediction Response:**
  - prediction_days: number, confidence: float, recommendation: string
- **Auth:** Bearer Token via Sanctum.