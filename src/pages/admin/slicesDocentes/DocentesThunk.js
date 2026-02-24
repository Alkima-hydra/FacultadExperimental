import { createAsyncThunk } from '@reduxjs/toolkit';
import { DocentesApi } from '../../../lib/api';
export const fetchDocentes = createAsyncThunk(
  'Docentes/fetchDocentes',
  async (filters = {}, { rejectWithValue }) => {
    try {
      console.log('[DocentesThunk] Enviando filtros:', filters);
      const response = await DocentesApi.fetchDocentes(filters);
      console.log('[DocentesThunk] Respuesta del servidor:', response);
      console.log('[DocentesThunk] Docentes obtenidas:', response.Docentes || response);
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
      return data?.Docentes || data?.items || data;
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
      return response.Docente || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const createDocente = createAsyncThunk(
  'Docentes/createDocente',
  async (payload, { rejectWithValue }) => {
    try {
      console.log('[DocentesThunk] Creando Docente:', payload)
      const response = await DocentesApi.createDocente(payload)
      console.log('[DocentesThunk] Docente creada:', response)
      return response?.Docente || response
    } catch (error) {
      console.error('[DocentesThunk] Error creando Docente:', error)
      return rejectWithValue(error?.response?.data || error.message || error)
    }
  }

)
export const updateDocente = createAsyncThunk(
  'Docentes/updateDocente',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('[DocentesThunk] Actualizando Docente:', id, data);
      const response = await DocentesApi.updateDocente(id, data);
      console.log('[DocentesThunk] Docente actualizada:', response);
      return response?.Docente || response;
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
      console.log('[DocentesThunk] Eliminando Docente ID:', id)
      const response = await DocentesApi.deleteDocente(id)
      console.log('[DocentesThunk] Docente eliminada:', response)
      return response?.Docente || response
    } catch (error) {
      console.error('[DocentesThunk] Error eliminando Docente:', error)
      return rejectWithValue(error?.response?.data || error.message || error)
    }
  }
);  
