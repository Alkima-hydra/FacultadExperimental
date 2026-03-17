import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllCursosByDocenteId,
  fetchCursosWithInscritosByDocenteId,
  finalizarCurso,
  cancelarCurso,
  eliminarCurso,
} from './CursosThunk';

const initialState = {
  cursos: [],
  totalItemsCursos: 0,
  totalPagesCursos: 1,
  loading: false,
  error: null,
  cursoSeleccionado: null,
};

const getCursoId = (curso) => Number(curso?.id_curso ?? curso?.id ?? 0);

const actualizarCursoEnLista = (state, cursoActualizado) => {
  const idCurso = getCursoId(cursoActualizado);
  if (!idCurso) return;

  state.cursos = state.cursos.map((curso) =>
    getCursoId(curso) === idCurso
      ? { ...curso, ...cursoActualizado }
      : curso
  );
};

const CursosSlice = createSlice({
  name: 'cursosDocente',
  initialState,
  reducers: {
    clearCursosState: (state) => {
      state.cursos = [];
      state.totalItemsCursos = 0;
      state.totalPagesCursos = 1;
      state.loading = false;
      state.error = null;
      state.cursoSeleccionado = null;
    },
    setCursoSeleccionado: (state, action) => {
      state.cursoSeleccionado = action.payload || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCursosByDocenteId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCursosByDocenteId.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cursos = action.payload?.cursos || [];
        state.totalItemsCursos = action.payload?.totalItems || 0;
        state.totalPagesCursos = action.payload?.totalPages || 1;
      })
      .addCase(fetchAllCursosByDocenteId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al cargar los cursos';
      })

      .addCase(fetchCursosWithInscritosByDocenteId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCursosWithInscritosByDocenteId.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cursos = action.payload?.cursos || [];
        state.totalItemsCursos =
          action.payload?.totalItems ||
          action.payload?.cursos?.length ||
          0;
        state.totalPagesCursos = action.payload?.totalPages || 1;
      })
      .addCase(fetchCursosWithInscritosByDocenteId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al cargar los cursos con inscritos';
      })

      .addCase(finalizarCurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalizarCurso.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const cursoActualizado = action.payload?.curso;
        if (cursoActualizado) {
          actualizarCursoEnLista(state, cursoActualizado);
        }
      })
      .addCase(finalizarCurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al finalizar el curso';
      })

      .addCase(cancelarCurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelarCurso.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const cursoActualizado = action.payload?.curso;
        if (cursoActualizado) {
          actualizarCursoEnLista(state, cursoActualizado);
        }
      })
      .addCase(cancelarCurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al cancelar el curso';
      })

      .addCase(eliminarCurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarCurso.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const idCurso = Number(action.payload?.id_curso ?? action.payload?.id ?? 0);
        if (idCurso) {
          state.cursos = state.cursos.filter(
            (curso) => getCursoId(curso) !== idCurso
          );
          state.totalItemsCursos = Math.max(0, state.totalItemsCursos - 1);
        }
      })
      .addCase(eliminarCurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al eliminar el curso';
      });
  },
});

export const {
  clearCursosState,
  setCursoSeleccionado,
} = CursosSlice.actions;

export const selectCursosState = (state) => state.cursosDocente || initialState;
export const selectCursos = (state) => state.cursosDocente?.cursos || [];
export const loadingCursos = (state) => Boolean(state.cursosDocente?.loading);
export const errorCursos = (state) => state.cursosDocente?.error || null;
export const selectLoadingCursos = (state) => Boolean(state.cursosDocente?.loading);
export const selectErrorCursos = (state) => state.cursosDocente?.error || null;
export const selectTotalItemsCursos = (state) => state.cursosDocente?.totalItemsCursos || 0;
export const selectTotalPagesCursos = (state) => state.cursosDocente?.totalPagesCursos || 1;
export const selectCursoSeleccionado = (state) => state.cursosDocente?.cursoSeleccionado || null;

export default CursosSlice.reducer;