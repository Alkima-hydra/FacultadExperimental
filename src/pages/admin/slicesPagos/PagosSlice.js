import { createSlice } from "@reduxjs/toolkit";
import { fetchPagos } from "./PagosThunk";

const initialState = {
  pagos: [],
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
  pagos: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  isLoadingAll: false,
  isSearching: false,
  error: null,
};

const PagosSlice = createSlice({
  name: "pagos",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetPagination(state) {
      state.pagos = [];
      state.totalItems = 0;
      state.totalPages = 1;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPagos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPagos.fulfilled, (state, action) => {
        console.log("fetchPagos fulfilled payload:", action.payload);
        state.isLoading = false;
        state.pagos = action.payload?.pagos || [];
        state.totalItems = action.payload?.totalItems || 0;
        state.totalPages = action.payload?.totalPages || 1;
        state.currentPage = action.payload?.currentPage || 1;
      })
      .addCase(fetchPagos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ocurrió un error al cargar los pagos";
      });
  }
});

export const { clearError, resetPagination } = PagosSlice.actions;

export const selectPagosState = (state) => state.pagos || EMPTY_STATE;

export const selectPagos = (state) => {
  const pagosState = state.pagos;
  return pagosState?.pagos || EMPTY_ARRAY;
};

export const selectPagosLoading = (state) => {
  const pagosState = state.pagos;
  return pagosState?.isLoading || false;
};

export const selectPagosError = (state) => {
  const pagosState = state.pagos;
  return pagosState?.error || null;
};

export const selectTotalItems = (state) => state?.pagos?.totalItems ?? 0;
export const selectTotalPages = (state) => state?.pagos?.totalPages ?? 1;
export const selectCurrentPage = (state) => state?.pagos?.currentPage ?? 1;

export default PagosSlice.reducer;