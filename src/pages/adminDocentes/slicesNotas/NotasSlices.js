import { createSlice } from "@reduxjs/toolkit";
import { fetchNotasByCursoId, registrarNota } from "./NotasThunk";

const initialState = {
    notas: [],
    totalItemsNotas: 0,
    totalPagesNotas: 1,
    selectIsLoadingNotas: false,
    errorNotas: null,
    error: null,
};

const NotasSlice = createSlice({
    name: "Notas",
    initialState,
    reducers: {
        clearNotasState: (state) => {
            state.notas = [];
            state.totalItemsNotas = 0;
            state.totalPagesNotas = 1;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotasByCursoId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotasByCursoId.fulfilled, (state, action) => {
                state.loading = false;
                state.notas = action.payload.notas || [];
                state.totalItemsNotas = action.payload.totalItems || 0;
                state.totalPagesNotas = action.payload.totalPages || 1;
            })
            .addCase(fetchNotasByCursoId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error al cargar las notas';
            })
            .addCase(registrarNota.pending, (state) => {
                state.error = null;
            })
            .addCase(registrarNota.fulfilled, (state, action) => {
                // Aquí podrías agregar la nota recién registrada a     la lista de notas si lo deseas, o simplemente recargar las notas del curso
            })
            .addCase(registrarNota.rejected, (state, action) => {
                state.error = action.payload || 'Error al registrar la nota';
            })
    },
});

export const { clearNotasState } = NotasSlice.actions;

export const selectNotasState = (state) => state.Notas;
export const loadingNotas = (state) => state.Notas.loading;
export const errorNotas = (state) => state.Notas.error;

export default NotasSlice.reducer;
