import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCarritoByUsuarioId,
  addItemCarrito,
  removeItemCarrito,
  cancelarCarrito,
} from './CarritoThunk';

const initialState = {
  carrito: null,
  isLoading: false,
  isAdding: false,
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
      state.isAdding = false;
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

      .addCase(addItemCarrito.pending, (state) => {
        state.isAdding = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addItemCarrito.fulfilled, (state, action) => {
        state.isAdding = false;
        state.carrito = action.payload?.carrito || state.carrito;
        state.successMessage =
          action.payload?.message || 'Curso agregado al carrito.';
      })
      .addCase(addItemCarrito.rejected, (state, action) => {
        state.isAdding = false;
        state.error =
          action.payload?.message || 'Error al agregar el curso al carrito.';
      })

      .addCase(removeItemCarrito.pending, (state) => {
        state.isRemoving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(removeItemCarrito.fulfilled, (state, action) => {
        state.isRemoving = false;
        state.successMessage =
          action.payload?.message || 'Item eliminado correctamente.';
        state.carrito = action.payload?.carrito ?? null;
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
        state.successMessage =
          action.payload?.message || 'Carrito cancelado correctamente.';
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
export const selectCarritoAdding = (state) => Boolean(state?.carrito?.isAdding);
export const selectCarritoRemoving = (state) => Boolean(state?.carrito?.isRemoving);
export const selectCarritoCanceling = (state) => Boolean(state?.carrito?.isCanceling);
export const selectCarritoError = (state) => state?.carrito?.error ?? null;
export const selectCarritoSuccess = (state) => state?.carrito?.successMessage ?? null;

export default CarritoSlice.reducer;