import React, { useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { inventoryApi, categoriesApi } from '@/lib/api';
import type { ApiItem, ItemFormData } from '@/types/api';

const STATUS_OPTIONS: { value: ApiItem['status']; label: string }[] = [
  { value: 'in stock',     label: 'En Stock' },
  { value: 'low stock',    label: 'Bajo Stock' },
  { value: 'ordered',      label: 'Pedido' },
  { value: 'discontinued', label: 'Descontinuado' },
];

const SELECT_CLS =
  'h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ' +
  'focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50';

interface ItemFormProps {
  open: boolean;
  item?: ApiItem | null;
  onClose: () => void;
  onSaved: () => void;
}

function ItemFormComponent({ open, item, onClose, onSaved }: ItemFormProps) {
  const qc = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ItemFormData>({
    mode: 'onSubmit',
    defaultValues: item ? {
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      min_stock_threshold: item.min_stock_threshold,
      category_id: item.category_id,
      status: item.status,
    } : {
      name: '',
      sku: '',
      quantity: 0,
      price: 0,
      min_stock_threshold: 0,
      category_id: 0,
      status: 'in stock',
    },
  });

  const queryOptions = useMemo(() => ({
    queryKey: ['categories'] as const,
    queryFn: categoriesApi.list,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    enabled: open,
  }), [open]);

  const { data: categories = [], isLoading: loadingCats } = useQuery(queryOptions);

  const mutation = useMutation({
    mutationFn: (data: ItemFormData) =>
      item ? inventoryApi.update(item.id, data) : inventoryApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory'] });
      reset();
      onSaved();
    },
  });

  const onSubmit = useCallback((data: ItemFormData) => {
    mutation.mutate(data);
  }, [mutation]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }}
      />

      {/* Panel */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'var(--background, #fff)',
        border: '1px solid var(--border, #e2e8f0)',
        borderRadius: 8, padding: 24,
        width: '100%', maxWidth: 520,
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>
          {item ? 'Editar Ítem' : 'Nuevo Ítem'}
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground, #64748b)', marginBottom: 20 }}>
          {item ? `Modificando ${item.name} (${item.sku})` : 'Completa los campos para agregar un nuevo ítem.'}
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
        >
          {/* Nombre */}
          <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Label htmlFor="if-name">Nombre *</Label>
            <Input
              id="if-name"
              placeholder="Ej. Auriculares Bluetooth"
              {...register('name', { required: 'El nombre es requerido' })}
            />
            {errors.name && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.name.message}</span>}
          </div>

          {/* SKU */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Label htmlFor="if-sku">SKU *</Label>
            <Input
              id="if-sku"
              placeholder="Ej. SKU-1042"
              {...register('sku', { required: 'El SKU es requerido' })}
            />
            {errors.sku && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.sku.message}</span>}
          </div>

          {/* Estado */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Label htmlFor="if-status">Estado</Label>
            <select
              id="if-status"
              className={SELECT_CLS}
              {...register('status')}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Cantidad */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Label htmlFor="if-qty">Cantidad *</Label>
            <Input
              id="if-qty"
              type="number"
              min="0"
              {...register('quantity', { required: 'La cantidad es requerida', valueAsNumber: true })}
            />
            {errors.quantity && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.quantity.message}</span>}
          </div>

          {/* Precio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Label htmlFor="if-price">Precio *</Label>
            <Input
              id="if-price"
              type="number"
              min="0"
              step="0.01"
              {...register('price', { required: 'El precio es requerido', valueAsNumber: true })}
            />
            {errors.price && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.price.message}</span>}
          </div>

          {/* Stock mínimo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Label htmlFor="if-mst">Stock Mínimo *</Label>
            <Input
              id="if-mst"
              type="number"
              min="0"
              {...register('min_stock_threshold', { required: 'El stock mínimo es requerido', valueAsNumber: true })}
            />
            {errors.min_stock_threshold && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.min_stock_threshold.message}</span>}
          </div>

          {/* Categoría */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Label htmlFor="if-cat">Categoría *</Label>
            <select
              id="if-cat"
              className={SELECT_CLS}
              disabled={loadingCats}
              {...register('category_id', { required: 'La categoría es requerida', valueAsNumber: true })}
            >
              <option value="">{loadingCats ? 'Cargando categorías…' : 'Seleccionar…'}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.category_id.message}</span>}
          </div>

          {/* Error */}
          {mutation.isError && (
            <p style={{ gridColumn: '1/-1', fontSize: '0.75rem', color: 'var(--destructive, #ef4444)' }}>
              Error al guardar. Verifica los campos e intenta de nuevo.
            </p>
          )}

          {/* Acciones */}
          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
            <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending || loadingCats}>
              {mutation.isPending ? 'Guardando…' : item ? 'Actualizar' : 'Crear Ítem'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const ItemForm = React.memo(ItemFormComponent);
