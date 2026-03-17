import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllCursosByDocenteId,
  fetchCursosWithInscritosByDocenteId,
  eliminarCurso,
  finalizarCurso,
  cancelarCurso,
} from "./CursosThunk";

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

const initialState = {
  cursos: [],
  totalItemsCursos: 0,
  totalPagesCursos: 1,
  loading: false,
  error: null,
  CursoSeleccionado: null,
};

const extraerCursos = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.cursos)) return payload.cursos;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getCursoId = (curso) => curso?.id_curso ?? curso?.id ?? null;

const CursosSlice = createSlice({
  name: "Cursos",
  initialState,
  reducers: {
    clearCursosState: (state) => {
      state.cursos = [];
      state.totalItemsCursos = 0;
      state.totalPagesCursos = 1;
      state.loading = false;
      state.error = null;
      state.CursoSeleccionado = null;
    },
    setCursoSeleccionado: (state, action) => {
      state.CursoSeleccionado = action.payload || null;
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
        const cursos = extraerCursos(action.payload);
        state.cursos = cursos;
        state.totalItemsCursos = action.payload?.totalItems || cursos.length || 0;
        state.totalPagesCursos = action.payload?.totalPages || 1;
      })
      .addCase(fetchAllCursosByDocenteId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al cargar los cursos";
      })

      .addCase(fetchCursosWithInscritosByDocenteId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCursosWithInscritosByDocenteId.fulfilled, (state, action) => {
        state.loading = false;
        const cursos = extraerCursos(action.payload);
        state.cursos = cursos;
        state.totalItemsCursos = action.payload?.totalItems || cursos.length || 0;
        state.totalPagesCursos = action.payload?.totalPages || 1;
      })
      .addCase(fetchCursosWithInscritosByDocenteId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al cargar los cursos con inscritos";
      })

      .addCase(eliminarCurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarCurso.fulfilled, (state, action) => {
        state.loading = false;
        const idEliminado =
          action.payload?.id_curso ??
          action.payload?.id ??
          Number(action.meta.arg);

        state.cursos = state.cursos.filter(
          (curso) => Number(getCursoId(curso)) !== Number(idEliminado)
        );
        state.totalItemsCursos = Math.max(0, state.totalItemsCursos - 1);
      })
      .addCase(eliminarCurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al eliminar el curso";
      })

      .addCase(finalizarCurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalizarCurso.fulfilled, (state, action) => {
        state.loading = false;

        const cursoActualizado = action.payload?.curso || null;
        const idCurso =
          cursoActualizado?.id_curso ??
          cursoActualizado?.id ??
          Number(action.meta.arg);

        state.cursos = state.cursos.map((curso) =>
          Number(getCursoId(curso)) === Number(idCurso)
            ? {
                ...curso,
                ...cursoActualizado,
                estado: "FINALIZADO",
              }
            : curso
        );
      })
      .addCase(finalizarCurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al finalizar el curso";
      })

      .addCase(cancelarCurso.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelarCurso.fulfilled, (state, action) => {
        state.loading = false;

        const cursoActualizado = action.payload?.curso || null;
        const idCurso =
          cursoActualizado?.id_curso ??
          cursoActualizado?.id ??
          Number(action.meta.arg);

        state.cursos = state.cursos.map((curso) =>
          Number(getCursoId(curso)) === Number(idCurso)
            ? {
                ...curso,
                ...cursoActualizado,
                estado: "CANCELADO",
              }
            : curso
        );
      })
      .addCase(cancelarCurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al cancelar el curso";
      });
  },
});

export const { clearCursosState, setCursoSeleccionado } = CursosSlice.actions;

export const selectCursosState = (state) => state.Cursos || EMPTY_OBJECT;
export const selectCursos = (state) => state.Cursos?.cursos || EMPTY_ARRAY;
export const selectLoadingCursos = (state) => state.Cursos?.loading ?? false;
export const selectErrorCursos = (state) => state.Cursos?.error ?? null;
export const selectTotalItemsCursos = (state) => state.Cursos?.totalItemsCursos ?? 0;
export const selectTotalPagesCursos = (state) => state.Cursos?.totalPagesCursos ?? 1;
export const selectCursoSeleccionado = (state) => state.Cursos?.CursoSeleccionado ?? null;

export default CursosSlice.reducer;