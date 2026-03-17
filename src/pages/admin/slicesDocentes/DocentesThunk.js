import { createAsyncThunk } from '@reduxjs/toolkit';
import { DocentesApi } from '../../../lib/api';

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

export const fetchDocentes = createAsyncThunk(
  'Docentes/fetchDocentes',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await DocentesApi.fetchDocentes(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllDocentes = createAsyncThunk(
  'Docentes/fetchAllDocentes',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await DocentesApi.fetchAllDocentes();
      return extractArray(resp, 'docentes', 'Docentes', 'items');
    } catch (error) {
      return rejectWithValue(error?.data || error?.message || error);
    }
  }
);

export const fetchDocenteById = createAsyncThunk(
  'Docentes/fetchDocenteById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await DocentesApi.fetchDocenteById(id);
      return response?.Docente || response?.docente || response;
    } catch (error) {
      return rejectWithValue(error?.data || error?.message || error);
    }
  }
);

export const createDocente = createAsyncThunk(
  'Docentes/createDocente',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await DocentesApi.createDocente(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error?.data || error?.message || error);
    }
  }
);

export const updateDocente = createAsyncThunk(
  'Docentes/updateDocente',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await DocentesApi.updateDocente(id, data);
      const docenteActualizado =
        response?.Docente || response?.docente || response;

      return {
        id,
        ...response,
        docente: docenteActualizado,
      };
    } catch (error) {
      return rejectWithValue(error?.data || error?.message || error);
    }
  }
);

export const deleteDocente = createAsyncThunk(
  'Docentes/deleteDocente',
  async (id, { rejectWithValue }) => {
    try {
      const response = await DocentesApi.deleteDocente(id);
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(error?.data || error?.message || error);
    }
  }
);

export const buscarDocentes = createAsyncThunk(
  'Docentes/buscarDocentes',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await DocentesApi.busquedaDocentes(params);
      return response;
    } catch (error) {
      return rejectWithValue(error?.data || error?.message || error);
    }
  }
);