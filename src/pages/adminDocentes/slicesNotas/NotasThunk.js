import { createAsyncThunk } from '@reduxjs/toolkit';
import { notasDocenteApi } from '../../../lib/api';

const getErrorMessage = (error) => {
  return (
    error?.message ||
    error?.msg ||
    error?.data?.message ||
    error?.data?.msg ||
    error?.response?.data?.message ||
    error?.response?.data?.msg ||
    'Ocurrió un error inesperado'
  );
};

export const fetchNotasByCursoId = createAsyncThunk(
  'notasDocente/fetchNotasByCursoId',
  async (cursoId, { rejectWithValue }) => {
    try {
      const response = await notasDocenteApi.fetchNotasByCursoId(cursoId);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const registrarNota = createAsyncThunk(
  'notasDocente/registrarNota',
  async ({ cursoId, data }, { rejectWithValue }) => {
    try {
      const response = await notasDocenteApi.registrarNota(cursoId, data);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const actualizarNotasDeUnCurso = createAsyncThunk(
  'notasDocente/actualizarNotasDeUnCurso',
  async ({ cursoId, data }, { rejectWithValue }) => {
    try {
      const response = await notasDocenteApi.actualizarNotasDeUnCurso(cursoId, data);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);