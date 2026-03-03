import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCursos, fetchAllCursos, fetchCursoById, createCurso, updateCurso, deleteCurso, buscarCursos,
  fetchMaterias, fetchAllMaterias, fetchMateriaById, createMateria, updateMateria, deleteMateria, buscarMaterias,
  fetchPrerequisitosByMateria, fetchPrerequisitoDetalle, createPrerequisito, deletePrerequisito,
  fetchDocentes, fetchAllDocentes, fetchDocenteById,
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
    clearError(state) { state.error = null; },
    clearCursoSeleccionado(state) { state.CursoSeleccionado = null; },
    clearMateriaSeleccionada(state) { state.MateriaSeleccionada = null; state.Prerequisitos = []; },
    clearDocenteSeleccionado(state) { state.DocenteSeleccionado = null; },
    clearPrerequisitos(state) { state.Prerequisitos = []; },
    resetCursoForm(state) {
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
      .addCase(fetchCursos.pending, (s) => { s.isLoadingCursos = true;  s.error = null; })
      .addCase(fetchCursos.fulfilled,  (s, a) => {
        s.isLoadingCursos = false;
        const p = a.payload;
        if (Array.isArray(p)) {
          s.Cursos = p; s.totalItemsCursos = p.length; s.totalPagesCursos = 1; s.currentPageCursos = 1;
        } else {
          s.Cursos = Array.isArray(p?.cursos) ? p.cursos : Array.isArray(p?.Cursos) ? p.Cursos : Array.isArray(p?.data) ? p.data : [];
          s.totalItemsCursos  = p?.totalItems  ?? s.Cursos.length;
          s.totalPagesCursos  = p?.totalPages  ?? 1;
          s.currentPageCursos = p?.currentPage ?? 1;
        }
      })
      .addCase(fetchCursos.rejected, (s, a) => { s.isLoadingCursos = false; s.error = a.payload?.message || 'Error al cargar cursos'; })

      .addCase(buscarCursos.pending, (s) => { s.isLoadingCursos = true;  s.error = null; })
      .addCase(buscarCursos.fulfilled, (s, a) => {
        s.isLoadingCursos = false;
        const p = a.payload;
        s.Cursos = Array.isArray(p?.cursos) ? p.cursos : [];
        s.totalItemsCursos  = p?.totalItems  ?? s.Cursos.length;
        s.totalPagesCursos  = p?.totalPages  ?? 1;
        s.currentPageCursos = p?.currentPage ?? 1;
      })
      .addCase(buscarCursos.rejected, (s, a) => { s.isLoadingCursos = false; s.error = a.payload?.message || 'Error al buscar cursos'; })

      .addCase(fetchAllCursos.pending, (s) => { s.isLoadingAllCursos = true;  s.error = null; })
      .addCase(fetchAllCursos.fulfilled, (s, a) => { s.isLoadingAllCursos = false; s.allCursos = a.payload; })
      .addCase(fetchAllCursos.rejected, (s, a) => { s.isLoadingAllCursos = false; s.error = a.payload?.message || 'Error'; })

      .addCase(fetchCursoById.pending, (s) => { s.isLoadingCursoById = true;  s.error = null; })
      .addCase(fetchCursoById.fulfilled, (s, a) => { s.isLoadingCursoById = false; s.CursoSeleccionado = a.payload; })
      .addCase(fetchCursoById.rejected, (s, a) => { s.isLoadingCursoById = false; s.error = a.payload?.message || 'Error'; })

      .addCase(createCurso.pending, (s) => { s.isCreatingCurso = true;  s.error = null; })
      .addCase(createCurso.fulfilled, (s, a) => {
        s.isCreatingCurso = false;
        s.Cursos = [a.payload, ...s.Cursos];
        s.totalItemsCursos = (s.totalItemsCursos || 0) + 1;
        s.CursoSeleccionado = a.payload;
      })
      .addCase(createCurso.rejected, (s, a) => { s.isCreatingCurso = false; s.error = a.payload?.message || 'Error al crear curso'; })

      .addCase(updateCurso.pending, (s) => { s.isUpdatingCurso = true;  s.error = null; })
      .addCase(updateCurso.fulfilled, (s, a) => {
        s.isUpdatingCurso = false;
        const u = a.payload;
        s.Cursos = s.Cursos.map(c => c.id_curso === u.id_curso ? u : c);
        if (s.CursoSeleccionado?.id_curso === u.id_curso) s.CursoSeleccionado = u;
      })
      .addCase(updateCurso.rejected,  (s, a) => { s.isUpdatingCurso = false; s.error = a.payload?.message || 'Error al actualizar curso'; })

      .addCase(deleteCurso.pending, (s) => { s.isDeletingCurso = true;  s.error = null; })
      .addCase(deleteCurso.fulfilled, (s, a) => {
        s.isDeletingCurso = false;
        const id = a.payload?.id_curso;
        s.Cursos = s.Cursos.filter(c => c.id_curso !== id);
        if (s.CursoSeleccionado?.id_curso === id) s.CursoSeleccionado = null;
        s.totalItemsCursos = Math.max(0, (s.totalItemsCursos || 1) - 1);
      })
      .addCase(deleteCurso.rejected,  (s, a) => { s.isDeletingCurso = false; s.error = a.payload?.message || 'Error al eliminar curso'; })

      // MATERIAS 
      .addCase(fetchMaterias.pending,   (s) => { s.isLoadingMaterias = true;  s.error = null; })
      .addCase(fetchMaterias.fulfilled, (s, a) => {
        s.isLoadingMaterias = false;
        s.Materias = a.payload?.materias ?? a.payload?.Materias ?? a.payload ?? [];
        s.totalItemsMaterias  = a.payload?.totalItems  ?? 0;
        s.totalPagesMaterias  = a.payload?.totalPages  ?? 1;
        s.currentPageMaterias = a.payload?.currentPage ?? 1;
      })
      .addCase(fetchMaterias.rejected, (s, a) => { s.isLoadingMaterias = false; s.error = a.payload?.message || 'Error'; })

      .addCase(buscarMaterias.pending, (s) => { s.isLoadingMaterias = true;  s.error = null; })
      .addCase(buscarMaterias.fulfilled, (s, a) => {
        s.isLoadingMaterias = false;
        s.Materias = a.payload?.materias ?? [];
        s.totalItemsMaterias  = a.payload?.totalItems  ?? 0;
        s.totalPagesMaterias  = a.payload?.totalPages  ?? 1;
        s.currentPageMaterias = a.payload?.currentPage ?? 1;
      })
      .addCase(buscarMaterias.rejected, (s, a) => { s.isLoadingMaterias = false; s.error = a.payload?.message || 'Error'; })

      .addCase(fetchAllMaterias.pending, (s) => { s.isLoadingAllMaterias = true;  s.error = null; })
      .addCase(fetchAllMaterias.fulfilled, (s, a) => { s.isLoadingAllMaterias = false; s.allMaterias = a.payload; })
      .addCase(fetchAllMaterias.rejected,  (s, a) => { s.isLoadingAllMaterias = false; s.error = a.payload?.message || 'Error'; })

      .addCase(fetchMateriaById.pending, (s) => { s.isLoadingMateriaById = true;  s.error = null; })
      .addCase(fetchMateriaById.fulfilled, (s, a) => { s.isLoadingMateriaById = false; s.MateriaSeleccionada = a.payload; })
      .addCase(fetchMateriaById.rejected,  (s, a) => { s.isLoadingMateriaById = false; s.error = a.payload?.message || 'Error'; })

      .addCase(createMateria.pending, (s) => { s.isCreatingMateria = true;  s.error = null; })
      .addCase(createMateria.fulfilled, (s, a) => {
        s.isCreatingMateria = false;
        s.Materias    = [a.payload, ...s.Materias];
        s.allMaterias = [a.payload, ...s.allMaterias];
        s.totalItemsMaterias = (s.totalItemsMaterias || 0) + 1;
        s.MateriaSeleccionada = a.payload;
      })
      .addCase(createMateria.rejected, (s, a) => { s.isCreatingMateria = false; s.error = a.payload?.message || 'Error al crear materia'; })

      .addCase(updateMateria.pending, (s) => { s.isUpdatingMateria = true;  s.error = null; })
      .addCase(updateMateria.fulfilled, (s, a) => {
        s.isUpdatingMateria = false;
        const u = a.payload;
        s.Materias = s.Materias.map(m => m.id_materia === u.id_materia ? u : m);
        s.allMaterias = s.allMaterias.map(m => m.id_materia === u.id_materia ? u : m);
        if (s.MateriaSeleccionada?.id_materia === u.id_materia) s.MateriaSeleccionada = u;
      })
      .addCase(updateMateria.rejected, (s, a) => { s.isUpdatingMateria = false; s.error = a.payload?.message || 'Error al actualizar materia'; })

      .addCase(deleteMateria.pending, (s) => { s.isDeletingMateria = true;  s.error = null; })
      .addCase(deleteMateria.fulfilled, (s, a) => {
        s.isDeletingMateria = false;
        const id = a.payload?.id_materia;
        s.Materias    = s.Materias.filter(m => m.id_materia !== id);
        s.allMaterias = s.allMaterias.filter(m => m.id_materia !== id);
        if (s.MateriaSeleccionada?.id_materia === id) s.MateriaSeleccionada = null;
        s.totalItemsMaterias = Math.max(0, (s.totalItemsMaterias || 1) - 1);
      })
      .addCase(deleteMateria.rejected,  (s, a) => { s.isDeletingMateria = false; s.error = a.payload?.message || 'Error al eliminar materia'; })

      // PREREQUISITOS
      .addCase(fetchPrerequisitosByMateria.pending, (s) => { s.isLoadingPrerequisitos = true;  s.error = null; })
      .addCase(fetchPrerequisitosByMateria.fulfilled, (s, a) => { s.isLoadingPrerequisitos = false; s.Prerequisitos = a.payload; })
      .addCase(fetchPrerequisitosByMateria.rejected, (s, a) => { s.isLoadingPrerequisitos = false; s.error = a.payload?.message || 'Error'; })

      .addCase(fetchPrerequisitoDetalle.pending, (s) => { s.isLoadingPrerequisitoDetalle = true;  s.error = null; })
      .addCase(fetchPrerequisitoDetalle.fulfilled, (s, a) => { s.isLoadingPrerequisitoDetalle = false; s.PrerequisitoDetalle = a.payload; })
      .addCase(fetchPrerequisitoDetalle.rejected, (s, a) => { s.isLoadingPrerequisitoDetalle = false; s.error = a.payload?.message || 'Error'; })

      .addCase(createPrerequisito.pending, (s) => { s.isCreatingPrerequisito = true;  s.error = null; })
      .addCase(createPrerequisito.fulfilled, (s, a) => { s.isCreatingPrerequisito = false; s.Prerequisitos = [...s.Prerequisitos, a.payload]; })
      .addCase(createPrerequisito.rejected, (s, a) => { s.isCreatingPrerequisito = false; s.error = a.payload?.message || 'Error al crear prerequisito'; })

      .addCase(deletePrerequisito.pending, (s) => { s.isDeletingPrerequisito = true;  s.error = null; })
      .addCase(deletePrerequisito.fulfilled, (s, a) => {
        s.isDeletingPrerequisito = false;
        s.Prerequisitos = s.Prerequisitos.filter(p => p.id_materia_prereq !== a.payload?.id);
      })
      .addCase(deletePrerequisito.rejected,  (s, a) => { s.isDeletingPrerequisito = false; s.error = a.payload?.message || 'Error al eliminar prerequisito'; })

      // DOCENTES 
      .addCase(fetchDocentes.pending, (s) => { s.isLoadingDocentes = true;  s.error = null; })
      .addCase(fetchDocentes.fulfilled, (s, a) => {
        s.isLoadingDocentes = false;
        s.Docentes = a.payload?.Docentes ?? a.payload ?? [];
        s.totalItemsDocentes = a.payload?.totalItems  ?? 0;
        s.totalPagesDocentes = a.payload?.totalPages  ?? 1;
        s.currentPageDocentes = a.payload?.currentPage ?? 1;
      })
      .addCase(fetchDocentes.rejected, (s, a) => { s.isLoadingDocentes = false; s.error = a.payload?.message || 'Error'; })

      .addCase(fetchAllDocentes.pending, (s) => { s.isLoadingAllDocentes = true;  s.error = null; })
      .addCase(fetchAllDocentes.fulfilled, (s, a) => { s.isLoadingAllDocentes = false; s.allDocentes = a.payload; })
      .addCase(fetchAllDocentes.rejected, (s, a) => { s.isLoadingAllDocentes = false; s.error = a.payload?.message || 'Error'; })

      .addCase(fetchDocenteById.pending, (s) => { s.isLoadingDocenteById = true;  s.error = null; })
      .addCase(fetchDocenteById.fulfilled, (s, a) => { s.isLoadingDocenteById = false; s.DocenteSeleccionado = a.payload; })
      .addCase(fetchDocenteById.rejected,  (s, a) => { s.isLoadingDocenteById = false; s.error = a.payload?.message || 'Error'; });
  },
});

export const {
  clearError, clearCursoSeleccionado, clearMateriaSeleccionada,
  clearDocenteSeleccionado, clearPrerequisitos, resetCursoForm,
} = CursoSlice.actions;

export const selectCursos = (s) => s?.cursos?.Cursos || [];
export const selectAllCursos = (s) => s?.cursos?.allCursos || [];
export const selectCursoSeleccionado = (s) => s?.cursos?.CursoSeleccionado ?? null;
export const selectTotalItemsCursos = (s) => s?.cursos?.totalItemsCursos ?? 0;
export const selectTotalPagesCursos = (s) => s?.cursos?.totalPagesCursos ?? 1;
export const selectCurrentPageCursos = (s) => s?.cursos?.currentPageCursos ?? 1;

export const selectMaterias = (s) => s?.cursos?.Materias || [];
export const selectAllMaterias = (s) => s?.cursos?.allMaterias || [];
export const selectMateriaSeleccionada = (s) => s?.cursos?.MateriaSeleccionada ?? null;
export const selectTotalItemsMaterias  = (s) => s?.cursos?.totalItemsMaterias ?? 0;
export const selectTotalPagesMaterias  = (s) => s?.cursos?.totalPagesMaterias ?? 1;
export const selectCurrentPageMaterias = (s) => s?.cursos?.currentPageMaterias ?? 1;

export const selectPrerequisitos = (s) => s?.cursos?.Prerequisitos || [];
export const selectPrerequisitoDetalle = (s) => s?.cursos?.PrerequisitoDetalle ?? null;

export const selectDocentes = (s) => s?.cursos?.Docentes || [];
export const selectAllDocentes = (s) => s?.cursos?.allDocentes || [];
export const selectDocenteSeleccionado = (s) => s?.cursos?.DocenteSeleccionado ?? null;
export const selectTotalItemsDocentes  = (s) => s?.cursos?.totalItemsDocentes ?? 0;
export const selectTotalPagesDocentes  = (s) => s?.cursos?.totalPagesDocentes ?? 1;
export const selectCurrentPageDocentes = (s) => s?.cursos?.currentPageDocentes ?? 1;

export const selectIsLoadingCursos = (s) => Boolean(s?.cursos?.isLoadingCursos);
export const selectIsLoadingAllCursos = (s) => Boolean(s?.cursos?.isLoadingAllCursos);
export const selectIsCreatingCurso = (s) => Boolean(s?.cursos?.isCreatingCurso);
export const selectIsUpdatingCurso = (s) => Boolean(s?.cursos?.isUpdatingCurso);
export const selectIsDeletingCurso = (s) => Boolean(s?.cursos?.isDeletingCurso);

export const selectIsLoadingMaterias = (s) => Boolean(s?.cursos?.isLoadingMaterias);
export const selectIsLoadingAllMaterias = (s) => Boolean(s?.cursos?.isLoadingAllMaterias);
export const selectIsCreatingMateria = (s) => Boolean(s?.cursos?.isCreatingMateria);
export const selectIsUpdatingMateria = (s) => Boolean(s?.cursos?.isUpdatingMateria);
export const selectIsDeletingMateria = (s) => Boolean(s?.cursos?.isDeletingMateria);

export const selectIsLoadingPrerequisitos = (s) => Boolean(s?.cursos?.isLoadingPrerequisitos);
export const selectIsCreatingPrerequisito = (s) => Boolean(s?.cursos?.isCreatingPrerequisito);
export const selectIsDeletingPrerequisito = (s) => Boolean(s?.cursos?.isDeletingPrerequisito);

export const selectIsLoadingDocentes = (s) => Boolean(s?.cursos?.isLoadingDocentes);
export const selectIsLoadingAllDocentes = (s) => Boolean(s?.cursos?.isLoadingAllDocentes);

export const selectError = (s) => s?.cursos?.error ?? null;

export const CursoReducer = CursoSlice.reducer;
export default CursoSlice.reducer;