import { createAsyncThunk } from '@reduxjs/toolkit';
import { estudiantesApi } from '../../../lib/api';

const extractArray = (resp, ...keys) => {
  if (Array.isArray(resp)) return resp;
  const data = resp?.data ?? resp;
  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  if (data && typeof data === 'object') {
    for (const val of Object.values(data)) {
      if (Array.isArray(val)) return val;
    }
  }

  return [];
};

export const fetchEstudiantes = createAsyncThunk(
  'Estudiantes/fetchEstudiantes',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await estudiantesApi.fetchEstudiantes(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllEstudiantes = createAsyncThunk(
  'Estudiantes/fetchAllEstudiantes',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await estudiantesApi.fetchAllEstudiantes();
      return extractArray(resp, 'Estudiantes', 'estudiantes', 'items');
    } catch (error) {
      return rejectWithValue(error?.data || error?.message || error);
    }
  }
);

export const fetchEstudianteById = createAsyncThunk(
  'Estudiantes/fetchEstudianteById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await estudiantesApi.fetchEstudianteById(id);
      return response?.Estudiante || response?.estudiante || response;
    } catch (error) {
      return rejectWithValue(error?.data || error?.message || error);
    }
  }
);

export const createEstudiante = createAsyncThunk(
  'Estudiantes/createEstudiante',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await estudiantesApi.createEstudiante(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error?.data || error?.message || error);
    }
  }
);

export const updateEstudiante = createAsyncThunk(
  'Estudiantes/updateEstudiante',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await estudiantesApi.updateEstudiante(id, data);
      const estudianteActualizado =
        response?.Estudiante || response?.estudiante || response;

      return {
        id,
        ...response,
        estudiante: estudianteActualizado,
      };
    } catch (error) {
      return rejectWithValue(error?.data || error?.message || error);
    }
  }
);

export const deleteEstudiante = createAsyncThunk(
  'Estudiantes/deleteEstudiante',
  async (id, { rejectWithValue }) => {
    try {
      const response = await estudiantesApi.deleteEstudiante(id);
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(error?.data || error?.message || error);
    }
  }
);

export const buscarEstudiantes = createAsyncThunk(
  'Estudiantes/buscarEstudiantes',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await estudiantesApi.busquedaEstudiantes(params);
      return response;
    } catch (error) {
      return rejectWithValue(error?.data || error?.message || error);
    }
  }
);