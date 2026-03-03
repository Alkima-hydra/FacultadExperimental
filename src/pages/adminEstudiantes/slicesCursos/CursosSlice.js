import { createSlice } from '@reduxjs/toolkit';
import { fetchInscripcionesByEstudianteId } from './CursosThunk';

const initialState = {
  // ── Inscripciones / Inscritos (matrículas)
  Inscritos: [],

  // Datos del estudiante (si el backend lo devuelve)
  Estudiante: null,

  // Meta paginación (si viene en la respuesta)
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,

  // Loading / error
  isLoadingInscritos: false,
  error: null,
};

const CursoSlice = createSlice({
  name: 'Inscritos',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearInscritos(state) {
      state.Inscritos = [];
      state.Estudiante = null;
      state.page = 1;
      state.limit = 10;
      state.total = 0;
      state.totalPages = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInscripcionesByEstudianteId.pending, (s) => {
        s.isLoadingInscritos = true;
        s.error = null;
      })
      .addCase(fetchInscripcionesByEstudianteId.fulfilled, (s, a) => {
        s.isLoadingInscritos = false;
        const p = a.payload;

        // Estructura esperada:
        // { ok, estudiante, meta: { page, limit, total, totalPages }, inscritos: [...] }
        s.Inscritos = Array.isArray(p?.inscritos)
          ? p.inscritos
          : Array.isArray(p?.Inscritos)
            ? p.Inscritos
            : [];

        s.Estudiante = p?.estudiante ?? null;

        const m = p?.meta || {};
        s.page = Number(m?.page ?? p?.page ?? 1);
        s.limit = Number(m?.limit ?? p?.limit ?? 10);
        s.total = Number(m?.total ?? p?.totalItems ?? s.Inscritos.length ?? 0);
        s.totalPages = Number(m?.totalPages ?? p?.totalPages ?? 1);
      })
      .addCase(fetchInscripcionesByEstudianteId.rejected, (s, a) => {
        s.isLoadingInscritos = false;
        s.error = a.payload?.message || a.error?.message || 'Error al cargar inscritos';
      });
  },
});

export const { clearError, clearInscritos } = CursoSlice.actions;

// Selectors (mantengo el slice colgado en state.cursos)
export const selectInscritos = (s) => s?.cursos?.Inscritos || [];
export const selectEstudianteInscritos = (s) => s?.cursos?.Estudiante ?? null;

export const selectInscritosMeta = (s) => ({
  page: s?.cursos?.page ?? 1,
  limit: s?.cursos?.limit ?? 10,
  total: s?.cursos?.total ?? 0,
  totalPages: s?.cursos?.totalPages ?? 1,
});

export const selectIsLoadingInscritos = (s) => Boolean(s?.cursos?.isLoadingInscritos);
export const selectError = (s) => s?.cursos?.error ?? null;

export const CursoReducer = CursoSlice.reducer;
export default CursoSlice.reducer;