import { createSlice } from '@reduxjs/toolkit';
import {
  // Cursos
  fetchCursos,
  fetchAllCursos,
  fetchCursoById,
  createCurso,
  updateCurso,
  deleteCurso,
  // Materias
  fetchMaterias,
  fetchAllMaterias,
  fetchMateriaById,
  createMateria,
  updateMateria,
  deleteMateria,
  // Prerequisitos
  fetchPrerequisitosByMateria,
  fetchPrerequisitoDetalle,
  createPrerequisito,
  deletePrerequisito,
  // Docentes
  fetchDocentes,
  fetchAllDocentes,
  fetchDocenteById,
} from './CursosThunk';

const initialState = {

  //  Cursos 
  Cursos: [],
  totalItemsCursos: 0,
  totalPagesCursos: 1,
  currentPageCursos: 1,
  allCursos: [],
  CursoSeleccionado: null,

  // Materias 
  Materias: [],
  totalItemsMaterias: 0,
  totalPagesMaterias: 1,
  currentPageMaterias: 1,
  allMaterias: [],           // lista completa para el <select> de materia
  MateriaSeleccionada: null,

  // Prerequisitos 
  Prerequisitos: [],         // prerequisitos de la materia actualmente seleccionada
  PrerequisitoDetalle: null,

  // ── Docentes ─
  Docentes: [],
  totalItemsDocentes: 0,
  totalPagesDocentes: 1,
  currentPageDocentes: 1,
  allDocentes: [],           // lista completa
  DocenteSeleccionado: null,

  // ── Loadings individuales
  isLoadingCursos: false,
  isLoadingAllCursos: false,
  isLoadingCursoById: false,
  isCreatingCurso: false,
  isUpdatingCurso: false,
  isDeletingCurso: false,

  isLoadingMaterias: false,
  isLoadingAllMaterias: false,
  isLoadingMateriaById: false,
  isCreatingMateria: false,
  isUpdatingMateria: false,
  isDeletingMateria: false,

  isLoadingPrerequisitos: false,
  isLoadingPrerequisitoDetalle: false,
  isCreatingPrerequisito: false,
  isDeletingPrerequisito: false,

  isLoadingDocentes: false,
  isLoadingAllDocentes: false,
  isLoadingDocenteById: false,

  error: null,
};

const CursoSlice = createSlice({
  name: 'Curso',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCursoSeleccionado(state) {
      state.CursoSeleccionado = null;
    },
    clearMateriaSeleccionada(state) {
      state.MateriaSeleccionada = null;
      state.Prerequisitos = [];        // limpiar prereqs al deseleccionar materia
    },
    clearDocenteSeleccionado(state) {
      state.DocenteSeleccionado = null;
    },
    clearPrerequisitos(state) {
      state.Prerequisitos = [];
    },
    resetCursoForm(state) {
      // Limpia todo lo relacionado al formulario activo
      state.CursoSeleccionado = null;
      state.MateriaSeleccionada = null;
      state.DocenteSeleccionado = null;
      state.Prerequisitos = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CURSOS

      .addCase(fetchCursos.pending, (state) => {
        state.isLoadingCursos = true;
        state.error = null;
      })
      .addCase(fetchCursos.fulfilled, (state, action) => {
        state.isLoadingCursos = false;
        const payload = action.payload;

        // Soporta: array directo, { Cursos:[...] }, { cursos:[...] }, { data:[...] }
        if (Array.isArray(payload)) {
          state.Cursos = payload;
          state.totalItemsCursos  = payload.length;
          state.totalPagesCursos  = 1;
          state.currentPageCursos = 1;
        } else {
          state.Cursos = Array.isArray(payload?.Cursos)  ? payload.Cursos
                      : Array.isArray(payload?.cursos)  ? payload.cursos
                      : Array.isArray(payload?.data)    ? payload.data
                      : [];
          state.totalItemsCursos  = payload?.totalItems  ?? state.Cursos.length;
          state.totalPagesCursos  = payload?.totalPages  ?? 1;
          state.currentPageCursos = payload?.currentPage ?? 1;
        }
      })
      .addCase(fetchCursos.rejected, (state, action) => {
        state.isLoadingCursos = false;
        state.error = action.payload?.message || 'Error al cargar Cursos';
      })

      .addCase(fetchAllCursos.pending, (state) => {
        state.isLoadingAllCursos = true;
        state.error = null;
      })
      .addCase(fetchAllCursos.fulfilled, (state, action) => {
        state.isLoadingAllCursos = false;
        state.allCursos = action.payload;
      })
      .addCase(fetchAllCursos.rejected, (state, action) => {
        state.isLoadingAllCursos = false;
        state.error = action.payload?.message || 'Error al cargar todos los Cursos';
      })

      .addCase(fetchCursoById.pending, (state) => {
        state.isLoadingCursoById = true;
        state.error = null;
      })
      .addCase(fetchCursoById.fulfilled, (state, action) => {
        state.isLoadingCursoById = false;
        state.CursoSeleccionado = action.payload;
      })
      .addCase(fetchCursoById.rejected, (state, action) => {
        state.isLoadingCursoById = false;
        state.error = action.payload?.message || 'Error al cargar el Curso';
      })

      .addCase(createCurso.pending, (state) => {
        state.isCreatingCurso = true;
        state.error = null;
      })
      .addCase(createCurso.fulfilled, (state, action) => {
        state.isCreatingCurso = false;
        const nuevo = action.payload;
        state.Cursos = [nuevo, ...state.Cursos];
        state.totalItemsCursos = (state.totalItemsCursos || 0) + 1;
        state.CursoSeleccionado = nuevo;
      })
      .addCase(createCurso.rejected, (state, action) => {
        state.isCreatingCurso = false;
        state.error = action.payload?.message || 'Error al crear Curso';
      })

      .addCase(updateCurso.pending, (state) => {
        state.isUpdatingCurso = true;
        state.error = null;
      })
      .addCase(updateCurso.fulfilled, (state, action) => {
        state.isUpdatingCurso = false;
        const updated = action.payload;
        state.Cursos = state.Cursos.map(c =>
          c.id_curso === updated.id_curso ? updated : c
        );
        if (state.CursoSeleccionado?.id_curso === updated.id_curso) {
          state.CursoSeleccionado = updated;
        }
      })
      .addCase(updateCurso.rejected, (state, action) => {
        state.isUpdatingCurso = false;
        state.error = action.payload?.message || 'Error al actualizar Curso';
      })

      .addCase(deleteCurso.pending, (state) => {
        state.isDeletingCurso = true;
        state.error = null;
      })
      .addCase(deleteCurso.fulfilled, (state, action) => {
        state.isDeletingCurso = false;
        const deletedId = action.payload?.id_curso;
        state.Cursos = state.Cursos.filter(c => c.id_curso !== deletedId);
        if (state.CursoSeleccionado?.id_curso === deletedId) {
          state.CursoSeleccionado = null;
        }
        state.totalItemsCursos = Math.max(0, (state.totalItemsCursos || 1) - 1);
      })
      .addCase(deleteCurso.rejected, (state, action) => {
        state.isDeletingCurso = false;
        state.error = action.payload?.message || 'Error al eliminar Curso';
      })

      // MATERIAS

      .addCase(fetchMaterias.pending, (state) => {
        state.isLoadingMaterias = true;
        state.error = null;
      })
      .addCase(fetchMaterias.fulfilled, (state, action) => {
        state.isLoadingMaterias = false;
        state.Materias = action.payload.Materias ?? action.payload;
        state.totalItemsMaterias = action.payload.totalItems ?? 0;
        state.totalPagesMaterias = action.payload.totalPages ?? 1;
        state.currentPageMaterias = action.payload.currentPage ?? 1;
      })
      .addCase(fetchMaterias.rejected, (state, action) => {
        state.isLoadingMaterias = false;
        state.error = action.payload?.message || 'Error al cargar Materias';
      })

      .addCase(fetchAllMaterias.pending, (state) => {
        state.isLoadingAllMaterias = true;
        state.error = null;
      })
      .addCase(fetchAllMaterias.fulfilled, (state, action) => {
        state.isLoadingAllMaterias = false;
        state.allMaterias = action.payload;
      })
      .addCase(fetchAllMaterias.rejected, (state, action) => {
        state.isLoadingAllMaterias = false;
        state.error = action.payload?.message || 'Error al cargar todas las Materias';
      })

      .addCase(fetchMateriaById.pending, (state) => {
        state.isLoadingMateriaById = true;
        state.error = null;
      })
      .addCase(fetchMateriaById.fulfilled, (state, action) => {
        state.isLoadingMateriaById = false;
        state.MateriaSeleccionada = action.payload;
      })
      .addCase(fetchMateriaById.rejected, (state, action) => {
        state.isLoadingMateriaById = false;
        state.error = action.payload?.message || 'Error al cargar la Materia';
      })

      .addCase(createMateria.pending, (state) => {
        state.isCreatingMateria = true;
        state.error = null;
      })
      .addCase(createMateria.fulfilled, (state, action) => {
        state.isCreatingMateria = false;
        const nueva = action.payload;
        state.Materias = [nueva, ...state.Materias];
        state.allMaterias = [nueva, ...state.allMaterias];
        state.totalItemsMaterias = (state.totalItemsMaterias || 0) + 1;
        state.MateriaSeleccionada = nueva;
      })
      .addCase(createMateria.rejected, (state, action) => {
        state.isCreatingMateria = false;
        state.error = action.payload?.message || 'Error al crear Materia';
      })

      .addCase(updateMateria.pending, (state) => {
        state.isUpdatingMateria = true;
        state.error = null;
      })
      .addCase(updateMateria.fulfilled, (state, action) => {
        state.isUpdatingMateria = false;
        const updated = action.payload;
        state.Materias = state.Materias.map(m =>
          m.id_materia === updated.id_materia ? updated : m
        );
        state.allMaterias = state.allMaterias.map(m =>
          m.id_materia === updated.id_materia ? updated : m
        );
        if (state.MateriaSeleccionada?.id_materia === updated.id_materia) {
          state.MateriaSeleccionada = updated;
        }
      })
      .addCase(updateMateria.rejected, (state, action) => {
        state.isUpdatingMateria = false;
        state.error = action.payload?.message || 'Error al actualizar Materia';
      })

      .addCase(deleteMateria.pending, (state) => {
        state.isDeletingMateria = true;
        state.error = null;
      })
      .addCase(deleteMateria.fulfilled, (state, action) => {
        state.isDeletingMateria = false;
        const deletedId = action.payload?.id_materia;
        state.Materias = state.Materias.filter(m => m.id_materia !== deletedId);
        state.allMaterias = state.allMaterias.filter(m => m.id_materia !== deletedId);
        if (state.MateriaSeleccionada?.id_materia === deletedId) {
          state.MateriaSeleccionada = null;
        }
        state.totalItemsMaterias = Math.max(0, (state.totalItemsMaterias || 1) - 1);
      })
      .addCase(deleteMateria.rejected, (state, action) => {
        state.isDeletingMateria = false;
        state.error = action.payload?.message || 'Error al eliminar Materia';
      })

      // PREREQUISITOS

      .addCase(fetchPrerequisitosByMateria.pending, (state) => {
        state.isLoadingPrerequisitos = true;
        state.error = null;
      })
      .addCase(fetchPrerequisitosByMateria.fulfilled, (state, action) => {
        state.isLoadingPrerequisitos = false;
        state.Prerequisitos = action.payload;
      })
      .addCase(fetchPrerequisitosByMateria.rejected, (state, action) => {
        state.isLoadingPrerequisitos = false;
        state.error = action.payload?.message || 'Error al cargar Prerequisitos';
      })

      .addCase(fetchPrerequisitoDetalle.pending, (state) => {
        state.isLoadingPrerequisitoDetalle = true;
        state.error = null;
      })
      .addCase(fetchPrerequisitoDetalle.fulfilled, (state, action) => {
        state.isLoadingPrerequisitoDetalle = false;
        state.PrerequisitoDetalle = action.payload;
      })
      .addCase(fetchPrerequisitoDetalle.rejected, (state, action) => {
        state.isLoadingPrerequisitoDetalle = false;
        state.error = action.payload?.message || 'Error al cargar detalle del Prerequisito';
      })

      .addCase(createPrerequisito.pending, (state) => {
        state.isCreatingPrerequisito = true;
        state.error = null;
      })
      .addCase(createPrerequisito.fulfilled, (state, action) => {
        state.isCreatingPrerequisito = false;
        state.Prerequisitos = [...state.Prerequisitos, action.payload];
      })
      .addCase(createPrerequisito.rejected, (state, action) => {
        state.isCreatingPrerequisito = false;
        state.error = action.payload?.message || 'Error al crear Prerequisito';
      })

      .addCase(deletePrerequisito.pending, (state) => {
        state.isDeletingPrerequisito = true;
        state.error = null;
      })
      .addCase(deletePrerequisito.fulfilled, (state, action) => {
        state.isDeletingPrerequisito = false;
        const deletedId = action.payload?.id;
        state.Prerequisitos = state.Prerequisitos.filter(
          p => p.id_materia_prereq !== deletedId
        );
      })
      .addCase(deletePrerequisito.rejected, (state, action) => {
        state.isDeletingPrerequisito = false;
        state.error = action.payload?.message || 'Error al eliminar Prerequisito';
      })

      // DOCENTES

      .addCase(fetchDocentes.pending, (state) => {
        state.isLoadingDocentes = true;
        state.error = null;
      })
      .addCase(fetchDocentes.fulfilled, (state, action) => {
        state.isLoadingDocentes = false;
        state.Docentes = action.payload.Docentes ?? action.payload;
        state.totalItemsDocentes = action.payload.totalItems ?? 0;
        state.totalPagesDocentes = action.payload.totalPages ?? 1;
        state.currentPageDocentes = action.payload.currentPage ?? 1;
      })
      .addCase(fetchDocentes.rejected, (state, action) => {
        state.isLoadingDocentes = false;
        state.error = action.payload?.message || 'Error al cargar Docentes';
      })

      .addCase(fetchAllDocentes.pending, (state) => {
        state.isLoadingAllDocentes = true;
        state.error = null;
      })
      .addCase(fetchAllDocentes.fulfilled, (state, action) => {
        state.isLoadingAllDocentes = false;
        state.allDocentes = action.payload;
      })
      .addCase(fetchAllDocentes.rejected, (state, action) => {
        state.isLoadingAllDocentes = false;
        state.error = action.payload?.message || 'Error al cargar todos los Docentes';
      })

      .addCase(fetchDocenteById.pending, (state) => {
        state.isLoadingDocenteById = true;
        state.error = null;
      })
      .addCase(fetchDocenteById.fulfilled, (state, action) => {
        state.isLoadingDocenteById = false;
        state.DocenteSeleccionado = action.payload;
      })
      .addCase(fetchDocenteById.rejected, (state, action) => {
        state.isLoadingDocenteById = false;
        state.error = action.payload?.message || 'Error al cargar el Docente';
      });
  },
});


export const {
  clearError,
  clearCursoSeleccionado,
  clearMateriaSeleccionada,
  clearDocenteSeleccionado,
  clearPrerequisitos,
  resetCursoForm,
} = CursoSlice.actions;


// Cursos
export const selectCursos            = (state) => state?.cursos?.Cursos || [];
export const selectAllCursos         = (state) => state?.cursos?.allCursos || [];
export const selectCursoSeleccionado = (state) => state?.cursos?.CursoSeleccionado ?? null;
export const selectTotalItemsCursos  = (state) => state?.cursos?.totalItemsCursos ?? 0;
export const selectTotalPagesCursos  = (state) => state?.cursos?.totalPagesCursos ?? 1;
export const selectCurrentPageCursos = (state) => state?.cursos?.currentPageCursos ?? 1;

// Materias
export const selectMaterias            = (state) => state?.cursos?.Materias || [];
export const selectAllMaterias         = (state) => state?.cursos?.allMaterias || [];
export const selectMateriaSeleccionada = (state) => state?.cursos?.MateriaSeleccionada ?? null;
export const selectTotalItemsMaterias  = (state) => state?.cursos?.totalItemsMaterias ?? 0;
export const selectTotalPagesMaterias  = (state) => state?.cursos?.totalPagesMaterias ?? 1;
export const selectCurrentPageMaterias = (state) => state?.cursos?.currentPageMaterias ?? 1;

// Prerequisitos
export const selectPrerequisitos        = (state) => state?.cursos?.Prerequisitos || [];
export const selectPrerequisitoDetalle  = (state) => state?.cursos?.PrerequisitoDetalle ?? null;

// Docentes
export const selectDocentes            = (state) => state?.cursos?.Docentes || [];
export const selectAllDocentes         = (state) => state?.cursos?.allDocentes || [];
export const selectDocenteSeleccionado = (state) => state?.cursos?.DocenteSeleccionado ?? null;
export const selectTotalItemsDocentes  = (state) => state?.cursos?.totalItemsDocentes ?? 0;
export const selectTotalPagesDocentes  = (state) => state?.cursos?.totalPagesDocentes ?? 1;
export const selectCurrentPageDocentes = (state) => state?.cursos?.currentPageDocentes ?? 1;

// Loadings
export const selectIsLoadingCursos            = (state) => Boolean(state?.cursos?.isLoadingCursos);
export const selectIsLoadingAllCursos         = (state) => Boolean(state?.cursos?.isLoadingAllCursos);
export const selectIsCreatingCurso            = (state) => Boolean(state?.cursos?.isCreatingCurso);
export const selectIsUpdatingCurso            = (state) => Boolean(state?.cursos?.isUpdatingCurso);
export const selectIsDeletingCurso            = (state) => Boolean(state?.cursos?.isDeletingCurso);

export const selectIsLoadingMaterias          = (state) => Boolean(state?.cursos?.isLoadingMaterias);
export const selectIsLoadingAllMaterias       = (state) => Boolean(state?.cursos?.isLoadingAllMaterias);
export const selectIsCreatingMateria          = (state) => Boolean(state?.cursos?.isCreatingMateria);
export const selectIsUpdatingMateria          = (state) => Boolean(state?.cursos?.isUpdatingMateria);
export const selectIsDeletingMateria          = (state) => Boolean(state?.cursos?.isDeletingMateria);

export const selectIsLoadingPrerequisitos     = (state) => Boolean(state?.cursos?.isLoadingPrerequisitos);
export const selectIsCreatingPrerequisito     = (state) => Boolean(state?.cursos?.isCreatingPrerequisito);
export const selectIsDeletingPrerequisito     = (state) => Boolean(state?.cursos?.isDeletingPrerequisito);

export const selectIsLoadingDocentes          = (state) => Boolean(state?.cursos?.isLoadingDocentes);
export const selectIsLoadingAllDocentes       = (state) => Boolean(state?.cursos?.isLoadingAllDocentes);

export const selectError = (state) => state?.cursos?.error ?? null;


export const CursoReducer = CursoSlice.reducer;
export default CursoSlice.reducer;