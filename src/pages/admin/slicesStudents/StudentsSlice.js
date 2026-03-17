import { createSlice } from '@reduxjs/toolkit';
import {
  fetchEstudiantes,
  fetchAllEstudiantes,
  fetchEstudianteById,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
  buscarEstudiantes,
} from './StudentsThunk';

const initialState = {
  Estudiantes: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,

  allEstudiantes: [],
  Estudianteseleccionado: null,

  isLoading: false,
  isLoadingAll: false,
  isLoadingById: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isSearching: false,
  error: null,
};

const actualizarEstudianteEnColecciones = (state, estudianteActualizado) => {
  if (!estudianteActualizado?.id_estudiante) return;

  state.Estudiantes = (state.Estudiantes || []).map((e) =>
    e.id_estudiante === estudianteActualizado.id_estudiante
      ? { ...e, ...estudianteActualizado }
      : e
  );

  state.allEstudiantes = (state.allEstudiantes || []).map((e) =>
    e.id_estudiante === estudianteActualizado.id_estudiante
      ? { ...e, ...estudianteActualizado }
      : e
  );

  if (state.Estudianteseleccionado?.id_estudiante === estudianteActualizado.id_estudiante) {
    state.Estudianteseleccionado = {
      ...state.Estudianteseleccionado,
      ...estudianteActualizado,
    };
  }
};

const EstudiantesSlice = createSlice({
  name: 'Estudiantes',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearEstudianteseleccionado(state) {
      state.Estudianteseleccionado = null;
    },
    resetPagination(state) {
      state.Estudiantes = [];
      state.totalItems = 0;
      state.totalPages = 1;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstudiantes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEstudiantes.fulfilled, (state, action) => {
        state.isLoading = false;
        const estudiantes =
          action.payload?.Estudiantes ??
          action.payload?.estudiantes ??
          [];

        state.Estudiantes = estudiantes;
        state.totalItems = action.payload?.totalItems ?? estudiantes.length;
        state.totalPages = action.payload?.totalPages ?? 1;
        state.currentPage = action.payload?.currentPage ?? 1;
      })
      .addCase(fetchEstudiantes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Error al cargar estudiantes';
      })

      .addCase(fetchAllEstudiantes.pending, (state) => {
        state.isLoadingAll = true;
        state.error = null;
      })
      .addCase(fetchAllEstudiantes.fulfilled, (state, action) => {
        state.isLoadingAll = false;
        state.allEstudiantes = action.payload || [];
      })
      .addCase(fetchAllEstudiantes.rejected, (state, action) => {
        state.isLoadingAll = false;
        state.error = action.payload?.message || 'Error al cargar todos los estudiantes';
      })

      .addCase(fetchEstudianteById.pending, (state) => {
        state.isLoadingById = true;
        state.error = null;
      })
      .addCase(fetchEstudianteById.fulfilled, (state, action) => {
        state.isLoadingById = false;
        state.Estudianteseleccionado = action.payload;
      })
      .addCase(fetchEstudianteById.rejected, (state, action) => {
        state.isLoadingById = false;
        state.error = action.payload?.message || 'Error al cargar el estudiante';
      })

      .addCase(createEstudiante.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createEstudiante.fulfilled, (state, action) => {
        state.isCreating = false;

        const nuevoEstudiante =
          action.payload?.data?.estudiante ||
          action.payload?.estudiante ||
          action.payload?.Estudiante ||
          null;

        if (nuevoEstudiante?.id_estudiante) {
          state.Estudiantes = [nuevoEstudiante, ...(state.Estudiantes || [])];
          state.allEstudiantes = [nuevoEstudiante, ...(state.allEstudiantes || [])];
          state.totalItems = (state.totalItems || 0) + 1;
          state.Estudianteseleccionado = nuevoEstudiante;
        }
      })
      .addCase(createEstudiante.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload?.message || 'Error al crear estudiante';
      })

      .addCase(updateEstudiante.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateEstudiante.fulfilled, (state, action) => {
        state.isUpdating = false;
        const actualizado = action.payload?.estudiante || action.payload?.Estudiante || action.payload;
        actualizarEstudianteEnColecciones(state, actualizado);
      })
      .addCase(updateEstudiante.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload?.message || 'Error al actualizar estudiante';
      })

      .addCase(deleteEstudiante.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteEstudiante.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = action.payload?.id;

        if (deletedId !== undefined) {
          state.Estudiantes = (state.Estudiantes || []).filter(
            (e) => e.id_estudiante !== deletedId
          );
          state.allEstudiantes = (state.allEstudiantes || []).filter(
            (e) => e.id_estudiante !== deletedId
          );
        }

        if (state.Estudianteseleccionado?.id_estudiante === deletedId) {
          state.Estudianteseleccionado = null;
        }

        state.totalItems = Math.max(0, (state.totalItems || 1) - 1);
      })
      .addCase(deleteEstudiante.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload?.message || 'Error al eliminar estudiante';
      })

      .addCase(buscarEstudiantes.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(buscarEstudiantes.fulfilled, (state, action) => {
        state.isSearching = false;
        state.Estudiantes = action.payload?.estudiantes ?? action.payload?.Estudiantes ?? [];
        state.totalItems = action.payload?.totalItems ?? 0;
        state.totalPages = action.payload?.totalPages ?? 1;
        state.currentPage = action.payload?.currentPage ?? 1;
      })
      .addCase(buscarEstudiantes.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload?.message || 'Error al buscar estudiantes';
      });
  },
});

export const { clearError, clearEstudianteseleccionado, resetPagination } = EstudiantesSlice.actions;

export const selectEstudiantes = (state) => state?.students?.Estudiantes || [];
export const selectTotalItems = (state) => state?.students?.totalItems ?? 0;
export const selectTotalPages = (state) => state?.students?.totalPages ?? 1;
export const selectCurrentPage = (state) => state?.students?.currentPage ?? 1;
export const selectAllEstudiantes = (state) => state?.students?.allEstudiantes || [];
export const selectEstudianteseleccionado = (state) => state?.students?.Estudianteseleccionado ?? null;

export const selectIsLoading = (state) => Boolean(state?.students?.isLoading);
export const selectIsLoadingAll = (state) => Boolean(state?.students?.isLoadingAll);
export const selectIsLoadingById = (state) => Boolean(state?.students?.isLoadingById);
export const selectIsSearching = (state) => Boolean(state?.students?.isSearching);
export const selectError = (state) => state?.students?.error ?? null;
export const selectIsCreating = (state) => Boolean(state?.students?.isCreating);
export const selectIsUpdating = (state) => Boolean(state?.students?.isUpdating);
export const selectIsDeleting = (state) => Boolean(state?.students?.isDeleting);

export const EstudiantesReducer = EstudiantesSlice.reducer;
export default EstudiantesSlice.reducer;