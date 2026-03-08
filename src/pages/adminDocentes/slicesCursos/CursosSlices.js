import { createSlice } from "@reduxjs/toolkit";
import { fetchCursosByDocenteId } from "./CursosThunk";

const initialState = {
    cursos: [],
    totalItemsCursos: 0,
    totalPagesCursos: 1,
    selectIsLoadingCursos: false,
    errorCursos: null,
    error: null,
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
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCursosByDocenteId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCursosByDocenteId.fulfilled, (state, action) => {
                state.loading = false;
                state.cursos = action.payload.cursos || [];
                state.totalItemsCursos = action.payload.totalItems || 0;
                state.totalPagesCursos = action.payload.totalPages || 1;
            })
            .addCase(fetchCursosByDocenteId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al cargar los cursos';
            })
    },
});

export const { clearCursosState } = CursosSlice.actions;

export const selectCursosState = (state) => state.Cursos;
export const loadingCursos = (state) => state.Cursos.loading;
export const errorCursos = (state) => state.Cursos.error;

export default CursosSlice.reducer;

