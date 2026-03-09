import { createAsyncThunk } from '@reduxjs/toolkit';
import { carritoApi } from '../../../lib/api';

const normalizarCarrito = (payload) => {
  const carrito = payload?.carrito;

  if (!carrito) return null;

  return {
    id_compra_total: carrito.id_compra_total,
    estudiante_id_estudiante: carrito.estudiante_id_estudiante,
    total: Number(carrito.total || 0),
    moneda: carrito.moneda || 'BOB',
    estado: carrito.estado || 'PENDIENTE',
    creado_en: carrito.creado_en || null,
    cantidad_items: carrito.cantidad_items || 0,
    items: (carrito.items || []).map((item) => ({
      id_compra_curso: item.id_compra_curso,
      compra_total_id_compra_total: item.compra_total_id_compra_total,
      curso_id_curso: item.curso_id_curso,
      precio_item: Number(item.precio_item || 0),
      curso: item.curso || null,
      materia: item.materia || null,
      docente: item.docente || null,
      usuario_docente: item.usuario_docente || null,
    })),
  };
};

export const fetchCarritoByUsuarioId = createAsyncThunk(
  'carrito/fetchCarritoByUsuarioId',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue({
          message: 'No se encontró el id del usuario.',
        });
      }

      const res = await carritoApi.fetchCarritoByUsuarioId(userId);

      if (!res?.ok) {
        return rejectWithValue({
          message: res?.msg || 'No se pudo cargar el carrito.',
        });
      }

      return normalizarCarrito(res);
    } catch (error) {
      return rejectWithValue({
        message: error?.message || 'Error al cargar el carrito.',
      });
    }
  }
);

export const addItemCarrito = createAsyncThunk(
  'carrito/addItemCarrito',
  async ({ id_usuario, id_curso }, { rejectWithValue }) => {
    try {
      const res = await carritoApi.addItemCarrito({ id_usuario, id_curso });

      if (!res?.ok) {
        return rejectWithValue({
          message: res?.msg || 'No se pudo agregar el curso al carrito.',
        });
      }

      return {
        carrito: normalizarCarrito(res),
        message: res?.msg || 'Curso agregado correctamente al carrito.',
      };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || 'Error al agregar el curso al carrito.',
      });
    }
  }
);

export const removeItemCarrito = createAsyncThunk(
  'carrito/removeItemCarrito',
  async (idCompraCurso, { rejectWithValue }) => {
    try {
      const res = await carritoApi.removeItemCarrito(idCompraCurso);

      if (!res?.ok) {
        return rejectWithValue({
          message: res?.msg || 'No se pudo eliminar el item del carrito.',
        });
      }

      return {
        id_compra_curso: idCompraCurso,
        total: Number(res?.total || 0),
        message: res?.msg || 'Item eliminado correctamente.',
      };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || 'Error al eliminar el item.',
      });
    }
  }
);

export const cancelarCarrito = createAsyncThunk(
  'carrito/cancelarCarrito',
  async (idCompraTotal, { rejectWithValue }) => {
    try {
      const res = await carritoApi.cancelarCarrito(idCompraTotal);

      if (!res?.ok) {
        return rejectWithValue({
          message: res?.msg || 'No se pudo cancelar el carrito.',
        });
      }

      return {
        id_compra_total: idCompraTotal,
        message: res?.msg || 'Carrito cancelado correctamente.',
      };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || 'Error al cancelar el carrito.',
      });
    }
  }
);