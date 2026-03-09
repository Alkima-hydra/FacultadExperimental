import { createSlice } from "@reduxjs/toolkit";
import { fetchAllCursosByDocenteId, eliminarCurso, fetchCursosWithInscritosByDocenteId } from "./CursosThunk";

const initialState = {
    cursos: [],
    totalItemsCursos: 0,
    totalPagesCursos: 1,
    selectIsLoadingCursos: false,
    errorCursos: null,
    error: null,
    CursoSeleccionado: null,
};

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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCursosByDocenteId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCursosByDocenteId.fulfilled, (state, action) => {
                state.loading = false;
                state.cursos = action.payload.cursos || [];
                state.totalItemsCursos = action.payload.totalItems || 0;
                state.totalPagesCursos = action.payload.totalPages || 1;
            })
            .addCase(fetchAllCursosByDocenteId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al cargar los cursos';
            })

            .addCase(eliminarCurso.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(eliminarCurso.fulfilled, (state, action) => {
                state.loading = false;
                // Eliminar el curso del estado
                state.cursos = state.cursos.filter(curso => curso.id !== action.payload.id);
                state.totalItemsCursos -= 1; // Reducir el conteo total de cursos
            })
            .addCase(eliminarCurso.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al eliminar el curso';
            })
            .addCase(fetchCursosWithInscritosByDocenteId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCursosWithInscritosByDocenteId.fulfilled, (state, action) => {
                state.loading = false;
                state.cursos = action.payload.cursos || [];
                state.totalItemsCursos = action.payload.totalItems || 0;
                state.totalPagesCursos = action.payload.totalPages || 1;
            })
            .addCase(fetchCursosWithInscritosByDocenteId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al cargar los cursos con inscritos';
            });

    },
});

export const { clearCursosState } = CursosSlice.actions;

export const selectCursosState = (state) => state.Cursos;
export const loadingCursos = (state) => state.Cursos.loading;
export const errorCursos = (state) => state.Cursos.error;
export const selectCursos = (state) => state.Cursos.cursos;
export const selectTotalItemsCursos = (state) => state.Cursos.totalItemsCursos;
export const selectTotalPagesCursos = (state) => state.Cursos.totalPagesCursos;
export const selectCursoSeleccionado = (state) => state.Cursos.CursoSeleccionado;


export default CursosSlice.reducer;

