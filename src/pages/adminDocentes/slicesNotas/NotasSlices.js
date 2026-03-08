import { createSlice } from "@reduxjs/toolkit";
import { fetchNotasByCursoId, registrarNota, actualizarNotasDeUnCurso } from "./NotasThunk";

const initialState = {
    notas: [],
    totalItemsNotas: 0,
    totalPagesNotas: 1,
    selectIsLoadingNotas: false,
    errorNotas: null,
    error: null,
    notasActualizadas: false,
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
                state.notas.push(action.payload); // Agrega la nueva nota al estado
            })
            .addCase(registrarNota.rejected, (state, action) => {
                state.error = action.payload || 'Error al registrar la nota';
            })
            .addCase(actualizarNotasDeUnCurso.pending, (state) => {
                state.error = null;
                state.notasActualizadas = false;
            })
            .addCase(actualizarNotasDeUnCurso.fulfilled, (state, action) => {
                state.notasActualizadas = true;
                // Aquí podrías actualizar la lista de notas con las nuevas notas si lo deseas, o simplemente recargar las notas del curso
            })
            .addCase(actualizarNotasDeUnCurso.rejected, (state, action) => {
                state.error = action.payload || 'Error al actualizar las notas';
                state.notasActualizadas = false;
            });
    },
});

export const { clearNotasState } = NotasSlice.actions;

export const selectNotasState = (state) => state.Notas;
export const loadingNotas = (state) => state.Notas.loading;
export const errorNotas = (state) => state.Notas.error;
export const notasList = (state) => state.Notas.notas;
export const totalItemsNotas = (state) => state.Notas.totalItemsNotas;
export const totalPagesNotas = (state) => state.Notas.totalPagesNotas;
export const notasActualizadas = (state) => state.Notas.notasActualizadas;


export default NotasSlice.reducer;
