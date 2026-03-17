import { createAsyncThunk } from '@reduxjs/toolkit';
import { cursosApi } from '../../../lib/api';

const getErrorMessage = (error) => {
  if (!error) return 'Ocurrió un error inesperado';

  if (typeof error === 'string') return error;

  return (
    error.message ||
    error.msg ||
    error.data?.message ||
    error.data?.msg ||
    error.response?.data?.message ||
    error.response?.data?.msg ||
    'Ocurrió un error inesperado'
  );
};

export const fetchAllCursosByDocenteId = createAsyncThunk(
  'cursosDocente/fetchAllCursosByDocenteId',
  async (docenteId, { rejectWithValue }) => {
    try {
      const response = await cursosApi.fetchAllCursosByDocenteId(docenteId);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchCursosWithInscritosByDocenteId = createAsyncThunk(
  'cursosDocente/fetchCursosWithInscritosByDocenteId',
  async (docenteId, { rejectWithValue }) => {
    try {
      const response = await cursosApi.fetchCursosWithInscritosByDocenteId(docenteId);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const finalizarCurso = createAsyncThunk(
  'cursosDocente/finalizarCurso',
  async (cursoId, { rejectWithValue }) => {
    try {
      const response = await cursosApi.finalizarCurso(cursoId);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const cancelarCurso = createAsyncThunk(
  'cursosDocente/cancelarCurso',
  async (cursoId, { rejectWithValue }) => {
    try {
      const response = await cursosApi.cancelarCurso(cursoId);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const eliminarCurso = createAsyncThunk(
  'cursosDocente/eliminarCurso',
  async (cursoId, { rejectWithValue }) => {
    try {
      const response = await cursosApi.deleteCurso(cursoId);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);