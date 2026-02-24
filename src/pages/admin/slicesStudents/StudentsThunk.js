import { createAsyncThunk } from '@reduxjs/toolkit';
import { estudiantesApi } from '../../../lib/api';
export const fetchEstudiantes = createAsyncThunk(
  'Estudiantes/fetchEstudiantes',
  async (filters = {}, { rejectWithValue }) => {
    try {
      console.log('[EstudiantesThunk] Enviando filtros:', filters);
      const response = await estudiantesApi.fetchEstudiantes(filters);
      console.log('[EstudiantesThunk] Respuesta del servidor:', response);
      console.log('[EstudiantesThunk] Estudiantes obtenidas:', response.Estudiantes || response);
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
      const data = resp?.data ?? resp;
      return data?.Estudiantes || data?.items || data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const fetchEstudianteById = createAsyncThunk(
  'Estudiantes/fetchEstudianteById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await estudiantesApi.fetchEstudianteById(id);
      return response.Estudiante || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const createEstudiante = createAsyncThunk(
  'Estudiantes/createEstudiante',
  async (payload, { rejectWithValue }) => {
    try {
      console.log('[EstudiantesThunk] Creando Estudiante:', payload)
      const response = await estudiantesApi.createEstudiante(payload)
      console.log('[EstudiantesThunk] Estudiante creada:', response)
      return response?.Estudiante || response
    } catch (error) {
      console.error('[EstudiantesThunk] Error creando Estudiante:', error)
      return rejectWithValue(error?.response?.data || error.message || error)
    }
  }

)
export const updateEstudiante = createAsyncThunk(
  'Estudiantes/updateEstudiante',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('[EstudiantesThunk] Actualizando Estudiante:', id, data);
      const response = await estudiantesApi.updateEstudiante(id, data);
      console.log('[EstudiantesThunk] Estudiante actualizada:', response);
      return response?.Estudiante || response;
    } catch (error) {
      console.error('[EstudiantesThunk] Error actualizando Estudiante:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const deleteEstudiante = createAsyncThunk(
  'Estudiantes/deleteEstudiante',
  async (id, { rejectWithValue }) => {
    try {
      console.log('[EstudiantesThunk] Eliminando Estudiante ID:', id)
      const response = await estudiantesApi.deleteEstudiante(id)
      console.log('[EstudiantesThunk] Estudiante eliminada:', response)
      return response?.Estudiante || response
    } catch (error) {
      console.error('[EstudiantesThunk] Error eliminando Estudiante:', error)
      return rejectWithValue(error?.response?.data || error.message || error)
    }
  }
);  
