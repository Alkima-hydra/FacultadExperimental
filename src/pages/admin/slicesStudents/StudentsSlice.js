import { createSlice } from '@reduxjs/toolkit';
import {
  fetchEstudiantes,
  fetchAllEstudiantes,
  fetchEstudianteById,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
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
  error: null,
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
      // fetchEstudiantes (paginado)
      .addCase(fetchEstudiantes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEstudiantes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Estudiantes = action.payload.Estudiantes;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchEstudiantes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Error al cargar Estudiantes';
      })

      // fetchAllEstudiantes
      .addCase(fetchAllEstudiantes.pending, (state) => {
        state.isLoadingAll = true;
        state.error = null;
      })
      .addCase(fetchAllEstudiantes.fulfilled, (state, action) => {
        state.isLoadingAll = false;
        state.allEstudiantes = action.payload;
      })
      .addCase(fetchAllEstudiantes.rejected, (state, action) => {
        state.isLoadingAll = false;
        state.error = action.payload?.message || 'Error al cargar todas los Estudiantes';
      })

      // fetchEstudianteById 
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
        state.error = action.payload?.message || 'Error al cargar el Estudiante';
      })

      // createEstudiante
      .addCase(createEstudiante.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createEstudiante.fulfilled, (state, action) => {
        state.isCreating = false;
        const nueva = action.payload;
        // Si ya hay lista paginada cargada, insertamos al inicio (opcional)
        if (Array.isArray(state.Estudiantes)) {
          state.Estudiantes = [nueva, ...state.Estudiantes];
          state.totalItems = (state.totalItems || 0) + 1;
        }
        state.Estudianteseleccionado = nueva;
      })
      .addCase(createEstudiante.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload?.message || 'Error al crear Estudiante';
      })

      // updateEstudiante
      .addCase(updateEstudiante.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateEstudiante.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updated = action.payload;
        state.Estudiantes = state.Estudiantes.map(p => p.id === updated.id ? updated : p);
        if (state.Estudianteseleccionado?.id === updated.id) {
          state.Estudianteseleccionado = updated;
        }
      })
      .addCase(updateEstudiante.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload?.message || 'Error al actualizar Estudiante';
      })

      // deleteEstudiante
      .addCase(deleteEstudiante.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteEstudiante.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = action.payload.id;
        state.Estudiantes = state.Estudiantes.filter(p => p.id !== deletedId);
        if (state.Estudianteseleccionado?.id === deletedId) {
          state.Estudianteseleccionado = null;
        }
        state.totalItems = Math.max(0, (state.totalItems || 1) - 1);
      })
      .addCase(deleteEstudiante.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload?.message || 'Error al eliminar Estudiante';
      })
  },
});

// Acciones síncronas
export const { clearError, clearEstudianteseleccionado, resetPagination } = EstudiantesSlice.actions;

// Selectores
export const selectEstudiantes = (state) => state.Estudiantes.Estudiantes;
export const selectTotalItems = (state) => state.Estudiantes.totalItems;
export const selectTotalPages = (state) => state.Estudiantes.totalPages;
export const selectCurrentPage = (state) => state.Estudiantes.currentPage;
export const selectAllEstudiantes = (state) => state.Estudiantes.allEstudiantes;
export const selectEstudianteseleccionado = (state) => state.Estudiantes.Estudianteseleccionado;

// Para loading maybe borrar si no tiene la wea esa que gira al cargar
export const selectIsLoading = (state) => state.Estudiantes.isLoading;
export const selectIsLoadingAll = (state) => state.Estudiantes.isLoadingAll;
export const selectIsLoadingById = (state) => state.Estudiantes.isLoadingById;
export const selectError = (state) => state.Estudiantes.error;
export const selectIsCreating = (state) => state.Estudiantes.isCreating;
export const selectIsUpdating = (state) => state.Estudiantes.isUpdating;
export const selectIsDeleting = (state) => state.Estudiantes.isDeleting;

// Exportar reducer
export const EstudiantesReducer = EstudiantesSlice.reducer;
export default EstudiantesSlice.reducer;