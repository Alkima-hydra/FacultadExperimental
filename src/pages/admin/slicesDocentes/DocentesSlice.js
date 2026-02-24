import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  fetchDocentes,
  fetchAllDocentes,
  fetchDocenteById,
  createDocente,
  updateDocente,
  deleteDocente,
} from './DocentesThunk';

const initialState = {
  Docentes: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,

  allDocentes: [],
  Docenteseleccionado: null,

  isLoading: false,
  isLoadingAll: false,
  isLoadingById: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

const DocentesSlice = createSlice({
  name: 'Docentes',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearDocenteseleccionado(state) {
      state.Docenteseleccionado = null;
    },
    resetPagination(state) {
      state.Docentes = [];
      state.totalItems = 0;
      state.totalPages = 1;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDocentes (paginado)
      .addCase(fetchDocentes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocentes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Docentes = action.payload.Docentes;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchDocentes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Error al cargar Docentes';
      })

      // fetchAllDocentes
      .addCase(fetchAllDocentes.pending, (state) => {
        state.isLoadingAll = true;
        state.error = null;
      })
      .addCase(fetchAllDocentes.fulfilled, (state, action) => {
        state.isLoadingAll = false;
        state.allDocentes = action.payload;
      })
      .addCase(fetchAllDocentes.rejected, (state, action) => {
        state.isLoadingAll = false;
        state.error = action.payload?.message || 'Error al cargar todas los Docentes';
      })

      // fetchDocenteById 
      .addCase(fetchDocenteById.pending, (state) => {
        state.isLoadingById = true;
        state.error = null;
      })
      .addCase(fetchDocenteById.fulfilled, (state, action) => {
        state.isLoadingById = false;
        state.Docenteseleccionado = action.payload;
      })
      .addCase(fetchDocenteById.rejected, (state, action) => {
        state.isLoadingById = false;
        state.error = action.payload?.message || 'Error al cargar el Docente';
      })

      // createDocente
      .addCase(createDocente.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createDocente.fulfilled, (state, action) => {
        state.isCreating = false;
        const nueva = action.payload;
        // Si ya hay lista paginada cargada, insertamos al inicio (opcional)
        if (Array.isArray(state.Docentes)) {
          state.Docentes = [nueva, ...state.Docentes];
          state.totalItems = (state.totalItems || 0) + 1;
        }
        state.Docenteseleccionado = nueva;
      })
      .addCase(createDocente.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload?.message || 'Error al crear Docente';
      })

      // updateDocente
      .addCase(updateDocente.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateDocente.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updated = action.payload;
        state.Docentes = state.Docentes.map(p => p.id === updated.id ? updated : p);
        if (state.Docenteseleccionado?.id === updated.id) {
          state.Docenteseleccionado = updated;
        }
      })
      .addCase(updateDocente.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload?.message || 'Error al actualizar Docente';
      })

      // deleteDocente
      .addCase(deleteDocente.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteDocente.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = action.payload.id;
        state.Docentes = state.Docentes.filter(p => p.id !== deletedId);
        if (state.Docenteseleccionado?.id === deletedId) {
          state.Docenteseleccionado = null;
        }
        state.totalItems = Math.max(0, (state.totalItems || 1) - 1);
      })
      .addCase(deleteDocente.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload?.message || 'Error al eliminar Docente';
      })
  },
});

// Acciones síncronas
export const { clearError, clearDocenteseleccionado, resetPagination } = DocentesSlice.actions;

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

// Selectores
// Nota: en rootReducer el slice está montado como `Docente`
const selectDocenteSlice = (state) => state?.Docente ?? EMPTY_OBJECT;

export const selectDocentes = createSelector(
  [selectDocenteSlice],
  (slice) => slice.Docentes ?? EMPTY_ARRAY
);

export const selectTotalItems = (state) => state?.Docente?.totalItems ?? 0;
export const selectTotalPages = (state) => state?.Docente?.totalPages ?? 1;
export const selectCurrentPage = (state) => state?.Docente?.currentPage ?? 1;

export const selectAllDocentes = createSelector(
  [selectDocenteSlice],
  (slice) => slice.allDocentes ?? EMPTY_ARRAY
);

export const selectDocenteseleccionado = (state) => state?.Docente?.Docenteseleccionado ?? null;

export const selectIsLoading = (state) => Boolean(state?.Docente?.isLoading);
export const selectIsLoadingAll = (state) => Boolean(state?.Docente?.isLoadingAll);
export const selectIsLoadingById = (state) => Boolean(state?.Docente?.isLoadingById);
export const selectError = (state) => state?.Docente?.error ?? null;
export const selectIsCreating = (state) => Boolean(state?.Docente?.isCreating);
export const selectIsUpdating = (state) => Boolean(state?.Docente?.isUpdating);
export const selectIsDeleting = (state) => Boolean(state?.Docente?.isDeleting);

// Exportar reducer
export const DocentesReducer = DocentesSlice.reducer;
export default DocentesSlice.reducer;