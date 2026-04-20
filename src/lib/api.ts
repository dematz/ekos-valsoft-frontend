import type { ApiItem, ApiPrediction, ApiAlert, ApiKpi, ApiCategory, ItemFormData } from '@/types/api';

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1",
  timeoutMs: 15000,
} as const;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(
    path.startsWith("http") ? path : `${API_CONFIG.baseURL}${path.startsWith("/") ? path : `/${path}`}`,
  );
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function apiRequest<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, params, headers, ...rest } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);

  const token = localStorage.getItem("auth_token");

  try {
    const res = await fetch(buildUrl(path, params), {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers ?? {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();
    const data = text ? (JSON.parse(text) as unknown) : undefined;

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
      throw new ApiError(res.status, `Request failed: ${res.status}`, data);
    }
    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) => apiRequest<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: RequestOptions) => apiRequest<T>(path, { ...opts, method: "DELETE" }),
};

export const inventoryApi = {
  list: () => api.get<{ data: ApiItem[] }>('/items').then((res) => res.data),
  create: (data: ItemFormData) =>
    api.post<{ data: ApiItem }>('/items', data).then((res) => res.data),
  update: (id: number, data: Partial<ItemFormData>) =>
    api.put<{ data: ApiItem }>(`/items/${id}`, data).then((res) => res.data),
  remove: (id: number) => api.delete(`/items/${id}`),
  predict: (id: number) => api.get<ApiPrediction>(`/items/${id}/prediction`),
};

export const categoriesApi = {
  list: () => api.get<{ data: ApiCategory[] }>('/categories').then((res) => res.data),
};

export const alertsApi = {
  list: () => api.get<ApiAlert[]>('/alerts'),
};

export const kpiApi = {
  list: () => api.get<ApiKpi[]>('/dashboard/kpis'),
};
