import { createAsyncThunk } from '@reduxjs/toolkit';
import { DocentesApi } from '../../../lib/api';

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
      const data = resp?.data ?? resp;
      return data?.docentes || data?.items || data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const fetchDocenteById = createAsyncThunk(
  'Docentes/fetchDocenteById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await DocentesApi.fetchDocenteById(id);
      return response.docente || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const createDocente = createAsyncThunk(
  'Docentes/createDocente',
  async (payload, { rejectWithValue }) => {
    try {
      console.log('[DocentesThunk] Creando Docente:', payload);
      const response = await DocentesApi.createDocente(payload);
      console.log('[DocentesThunk] Docente creado:', response);
      return response?.docente || response;
    } catch (error) {
      console.error('[DocentesThunk] Error creando Docente:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const updateDocente = createAsyncThunk(
  'Docentes/updateDocente',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('[DocentesThunk] Actualizando Docente:', id, data);
      const response = await DocentesApi.updateDocente(id, data);
      console.log('[DocentesThunk] Docente actualizado:', response);
      return { id, ...response };
    } catch (error) {
      console.error('[DocentesThunk] Error actualizando Docente:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const deleteDocente = createAsyncThunk(
  'Docentes/deleteDocente',
  async (id, { rejectWithValue }) => {
    try {
      console.log('[DocentesThunk] Eliminando Docente ID:', id);
      const response = await DocentesApi.deleteDocente(id);
      console.log('[DocentesThunk] Docente eliminado:', response);
      return { id, ...response };
    } catch (error) {
      console.error('[DocentesThunk] Error eliminando Docente:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const buscarDocentes = createAsyncThunk(
  'Docentes/buscarDocentes',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('[DocentesThunk] Buscando docentes:', params);
      const response = await DocentesApi.busquedaDocentes(params);
      console.log('[DocentesThunk] Resultado búsqueda:', response);
      return response;
    } catch (error) {
      console.error('[DocentesThunk] Error buscando docentes:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);
