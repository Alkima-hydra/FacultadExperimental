import { createSlice } from "@reduxjs/toolkit";
import { fetchSaldosByEstudianteId } from "./SaldoMovimientosThunk";

const initialState = {
  movimientos: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  isLoadingAll: false,
  isSearching: false,
  error: null,
};

const EMPTY_ARRAY = [];
const EMPTY_STATE = {
  movimientos: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  isLoadingAll: false,
  isSearching: false,
  error: null,
};

const SaldosSlice = createSlice({
  name: "saldosMovimientos",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetPagination(state) {
      state.movimientos = [];
      state.totalItems = 0;
      state.totalPages = 1;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSaldosByEstudianteId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSaldosByEstudianteId.fulfilled, (state, action) => {
        console.log("fetchSaldosByEstudianteId fulfilled payload:", action.payload);
        state.isLoading = false;
        state.movimientos = action.payload.movimientos|| [];
      })
      .addCase(fetchSaldosByEstudianteId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ocurrió un error al cargar los saldos";
      });
  }
});

export const { clearError, resetPagination } = SaldosSlice.actions;

export const selectSaldosState = (state) => state.saldosMovimientos || EMPTY_STATE;

export const selectSaldos = (state) => {
  const saldosState = state.saldosMovimientos;
  return saldosState?.movimientos || EMPTY_ARRAY;
};

export const selectSaldosLoading = (state) => {
  const saldosState = state.saldosMovimientos;
  return saldosState?.isLoading || false;
};

export const selectSaldosError = (state) => {
  const saldosState = state.saldosMovimientos;
  return saldosState?.error || null;
};

export const selectTotalItems = (state) => state?.saldosMovimientos?.totalItems ?? 0;
export const selectTotalPages = (state) => state?.saldosMovimientos?.totalPages ?? 1;
export const selectCurrentPage = (state) => state?.saldosMovimientos?.currentPage ?? 1;

export default SaldosSlice.reducer;