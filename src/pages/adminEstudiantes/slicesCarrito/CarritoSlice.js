import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCarritoByUsuarioId,
  removeItemCarrito,
  cancelarCarrito,
} from './CarritoThunk';

const initialState = {
  carrito: null,
  isLoading: false,
  isRemoving: false,
  isCanceling: false,
  error: null,
  successMessage: null,
};

const CarritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    clearCarritoError(state) {
      state.error = null;
    },
    clearCarritoSuccess(state) {
      state.successMessage = null;
    },
    clearCarrito(state) {
      state.carrito = null;
      state.isLoading = false;
      state.isRemoving = false;
      state.isCanceling = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarritoByUsuarioId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCarritoByUsuarioId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.carrito = action.payload;
      })
      .addCase(fetchCarritoByUsuarioId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Error al cargar el carrito.';
      })

      .addCase(removeItemCarrito.pending, (state) => {
        state.isRemoving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(removeItemCarrito.fulfilled, (state, action) => {
        state.isRemoving = false;
        state.successMessage = action.payload?.message || 'Item eliminado.';

        if (!state.carrito) return;

        state.carrito.items = (state.carrito.items || []).filter(
          (item) => String(item.id_compra_curso) !== String(action.payload.id_compra_curso)
        );

        state.carrito.cantidad_items = state.carrito.items.length;
        state.carrito.total = Number(action.payload.total || 0);
      })
      .addCase(removeItemCarrito.rejected, (state, action) => {
        state.isRemoving = false;
        state.error = action.payload?.message || 'Error al eliminar el item.';
      })

      .addCase(cancelarCarrito.pending, (state) => {
        state.isCanceling = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(cancelarCarrito.fulfilled, (state, action) => {
        state.isCanceling = false;
        state.successMessage = action.payload?.message || 'Carrito cancelado.';
        state.carrito = null;
      })
      .addCase(cancelarCarrito.rejected, (state, action) => {
        state.isCanceling = false;
        state.error = action.payload?.message || 'Error al cancelar el carrito.';
      });
  },
});

export const {
  clearCarritoError,
  clearCarritoSuccess,
  clearCarrito,
} = CarritoSlice.actions;

export const selectCarrito = (state) => state?.carrito?.carrito ?? null;
export const selectCarritoLoading = (state) => Boolean(state?.carrito?.isLoading);
export const selectCarritoRemoving = (state) => Boolean(state?.carrito?.isRemoving);
export const selectCarritoCanceling = (state) => Boolean(state?.carrito?.isCanceling);
export const selectCarritoError = (state) => state?.carrito?.error ?? null;
export const selectCarritoSuccess = (state) => state?.carrito?.successMessage ?? null;

export const CarritoReducer = CarritoSlice.reducer;
export default CarritoSlice.reducer;