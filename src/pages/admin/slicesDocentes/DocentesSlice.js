import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  fetchDocentes,
  fetchAllDocentes,
  fetchDocenteById,
  createDocente,
  updateDocente,
  deleteDocente,
  buscarDocentes,
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
  isSearching: false,
  error: null,
};

const actualizarDocenteEnColecciones = (state, docenteActualizado) => {
  if (!docenteActualizado?.id_docente) return;

  state.Docentes = (state.Docentes || []).map((d) =>
    d.id_docente === docenteActualizado.id_docente
      ? { ...d, ...docenteActualizado }
      : d
  );

  state.allDocentes = (state.allDocentes || []).map((d) =>
    d.id_docente === docenteActualizado.id_docente
      ? { ...d, ...docenteActualizado }
      : d
  );

  if (state.Docenteseleccionado?.id_docente === docenteActualizado.id_docente) {
    state.Docenteseleccionado = {
      ...state.Docenteseleccionado,
      ...docenteActualizado,
    };
  }
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
      .addCase(fetchDocentes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocentes.fulfilled, (state, action) => {
        state.isLoading = false;
        const docentes = action.payload?.docentes ?? action.payload?.Docentes ?? [];
        state.Docentes = docentes;
        state.totalItems = action.payload?.totalItems ?? docentes.length;
        state.totalPages = action.payload?.totalPages ?? 1;
        state.currentPage = action.payload?.currentPage ?? 1;
      })
      .addCase(fetchDocentes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Error al cargar docentes';
      })

      .addCase(fetchAllDocentes.pending, (state) => {
        state.isLoadingAll = true;
        state.error = null;
      })
      .addCase(fetchAllDocentes.fulfilled, (state, action) => {
        state.isLoadingAll = false;
        state.allDocentes = action.payload || [];
      })
      .addCase(fetchAllDocentes.rejected, (state, action) => {
        state.isLoadingAll = false;
        state.error = action.payload?.message || 'Error al cargar todos los docentes';
      })

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
        state.error = action.payload?.message || 'Error al cargar el docente';
      })

      .addCase(createDocente.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createDocente.fulfilled, (state, action) => {
        state.isCreating = false;

        const nuevoDocente =
          action.payload?.data?.docente ||
          action.payload?.docente ||
          action.payload?.Docente ||
          null;

        if (nuevoDocente?.id_docente) {
          state.Docentes = [nuevoDocente, ...(state.Docentes || [])];
          state.allDocentes = [nuevoDocente, ...(state.allDocentes || [])];
          state.totalItems = (state.totalItems || 0) + 1;
          state.Docenteseleccionado = nuevoDocente;
        }
      })
      .addCase(createDocente.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload?.message || 'Error al crear docente';
      })

      .addCase(updateDocente.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateDocente.fulfilled, (state, action) => {
        state.isUpdating = false;
        const actualizado =
          action.payload?.docente ||
          action.payload?.Docente ||
          action.payload;

        actualizarDocenteEnColecciones(state, actualizado);
      })
      .addCase(updateDocente.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload?.message || 'Error al actualizar docente';
      })

      .addCase(deleteDocente.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteDocente.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = action.payload?.id;

        if (deletedId !== undefined) {
          state.Docentes = (state.Docentes || []).filter(
            (d) => d.id_docente !== deletedId
          );
          state.allDocentes = (state.allDocentes || []).filter(
            (d) => d.id_docente !== deletedId
          );
        }

        if (state.Docenteseleccionado?.id_docente === deletedId) {
          state.Docenteseleccionado = null;
        }

        state.totalItems = Math.max(0, (state.totalItems || 1) - 1);
      })
      .addCase(deleteDocente.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload?.message || 'Error al eliminar docente';
      })

      .addCase(buscarDocentes.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(buscarDocentes.fulfilled, (state, action) => {
        state.isSearching = false;
        const docentes = action.payload?.docentes ?? action.payload?.Docentes ?? [];
        state.Docentes = docentes;
        state.totalItems = action.payload?.totalItems ?? docentes.length;
        state.totalPages = action.payload?.totalPages ?? 1;
        state.currentPage = action.payload?.currentPage ?? 1;
      })
      .addCase(buscarDocentes.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload?.message || 'Error al buscar docentes';
      });
  },
});

export const { clearError, clearDocenteseleccionado, resetPagination } = DocentesSlice.actions;

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

const selectDocenteSlice = (state) => state?.docentes ?? EMPTY_OBJECT;

export const selectDocentes = createSelector(
  [selectDocenteSlice],
  (slice) => slice.Docentes ?? EMPTY_ARRAY
);

export const selectTotalItems = (state) => state?.docentes?.totalItems ?? 0;
export const selectTotalPages = (state) => state?.docentes?.totalPages ?? 1;
export const selectCurrentPage = (state) => state?.docentes?.currentPage ?? 1;

export const selectAllDocentes = createSelector(
  [selectDocenteSlice],
  (slice) => slice.allDocentes ?? EMPTY_ARRAY
);

export const selectDocenteseleccionado = (state) => state?.docentes?.Docenteseleccionado ?? null;

export const selectIsLoading = (state) => Boolean(state?.docentes?.isLoading);
export const selectIsLoadingAll = (state) => Boolean(state?.docentes?.isLoadingAll);
export const selectIsLoadingById = (state) => Boolean(state?.docentes?.isLoadingById);
export const selectIsSearching = (state) => Boolean(state?.docentes?.isSearching);
export const selectError = (state) => state?.docentes?.error ?? null;
export const selectIsCreating = (state) => Boolean(state?.docentes?.isCreating);
export const selectIsUpdating = (state) => Boolean(state?.docentes?.isUpdating);
export const selectIsDeleting = (state) => Boolean(state?.docentes?.isDeleting);

export const DocentesReducer = DocentesSlice.reducer;
export default DocentesSlice.reducer;