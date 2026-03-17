import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNotasByCursoId,
  registrarNota,
  actualizarNotasDeUnCurso,
} from './NotasThunk';

const EMPTY_ARRAY = [];

const initialState = {
  curso: null,
  notas: [],
  totalItemsNotas: 0,
  totalPagesNotas: 1,
  loading: false,
  error: null,
  successMessage: null,
  notasActualizadas: false,
};

const normalizarPayloadNotas = (payload) => {
  if (!payload) {
    return {
      curso: null,
      notas: [],
      totalItems: 0,
      totalPages: 1,
    };
  }

  const curso =
    payload?.curso ||
    payload?.data?.curso ||
    null;

  const notas =
    payload?.estudiantes ||
    payload?.notas ||
    payload?.notasPorEstudiante ||
    payload?.data?.estudiantes ||
    payload?.data?.notas ||
    payload?.data?.notasPorEstudiante ||
    [];

  const notasNormalizadas = Array.isArray(notas) ? notas : [];

  return {
    curso,
    notas: notasNormalizadas,
    totalItems: notasNormalizadas.length,
    totalPages: 1,
  };
};

const setNotasStateFromPayload = (state, payload) => {
  const data = normalizarPayloadNotas(payload);

  state.curso = data.curso;
  state.notas = data.notas;
  state.totalItemsNotas = data.totalItems;
  state.totalPagesNotas = data.totalPages;
};

const NotasSlice = createSlice({
  name: 'notasDocente',
  initialState,
  reducers: {
    clearNotasState: (state) => {
      state.curso = null;
      state.notas = [];
      state.totalItemsNotas = 0;
      state.totalPagesNotas = 1;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.notasActualizadas = false;
    },

    clearNotasError: (state) => {
      state.error = null;
    },

    clearNotasSuccess: (state) => {
      state.successMessage = null;
      state.notasActualizadas = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchNotasByCursoId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchNotasByCursoId.fulfilled, (state, action) => {
        state.loading = false;
        setNotasStateFromPayload(state, action.payload);
      })
      .addCase(fetchNotasByCursoId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al cargar las notas';
      })

      // REGISTRAR
      .addCase(registrarNota.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
        state.notasActualizadas = false;
      })
      .addCase(registrarNota.fulfilled, (state, action) => {
        state.loading = false;
        state.notasActualizadas = true;
        state.successMessage =
          action.payload?.msg ||
          action.payload?.message ||
          'Nota registrada correctamente';

        const payload = action.payload || {};

        if (
          payload?.curso ||
          payload?.estudiantes ||
          payload?.notas ||
          payload?.notasPorEstudiante ||
          payload?.data?.curso ||
          payload?.data?.estudiantes
        ) {
          setNotasStateFromPayload(state, payload);
        }
      })
      .addCase(registrarNota.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al registrar la nota';
        state.notasActualizadas = false;
      })

      // ACTUALIZAR
      .addCase(actualizarNotasDeUnCurso.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
        state.notasActualizadas = false;
      })
      .addCase(actualizarNotasDeUnCurso.fulfilled, (state, action) => {
        state.loading = false;
        state.notasActualizadas = true;
        state.successMessage =
          action.payload?.msg ||
          action.payload?.message ||
          'Notas actualizadas correctamente';

        const payload = action.payload || {};

        if (
          payload?.curso ||
          payload?.estudiantes ||
          payload?.notas ||
          payload?.notasPorEstudiante ||
          payload?.data?.curso ||
          payload?.data?.estudiantes
        ) {
          setNotasStateFromPayload(state, payload);
        }
      })
      .addCase(actualizarNotasDeUnCurso.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al actualizar las notas';
        state.notasActualizadas = false;
      });
  },
});

export const {
  clearNotasState,
  clearNotasError,
  clearNotasSuccess,
} = NotasSlice.actions;

// SELECTORS
export const selectNotasState = (state) => state?.notasDocente ?? initialState;
export const selectLoadingNotas = (state) => state?.notasDocente?.loading ?? false;
export const selectErrorNotas = (state) => state?.notasDocente?.error ?? null;
export const selectNotas = (state) => state?.notasDocente?.notas ?? EMPTY_ARRAY;
export const selectCursoNotas = (state) => state?.notasDocente?.curso ?? null;
export const selectTotalItemsNotas = (state) => state?.notasDocente?.totalItemsNotas ?? 0;
export const selectTotalPagesNotas = (state) => state?.notasDocente?.totalPagesNotas ?? 1;
export const selectNotasActualizadas = (state) => state?.notasDocente?.notasActualizadas ?? false;
export const selectNotasSuccess = (state) => state?.notasDocente?.successMessage ?? null;

export default NotasSlice.reducer;