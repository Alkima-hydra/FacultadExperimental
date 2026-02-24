import { createAsyncThunk } from '@reduxjs/toolkit';
import { cursosApi, materiasApi, prerequisitosApi, DocentesApi } from '../../../lib/api';

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


export const fetchCursos = createAsyncThunk(
  'Curso/fetchCursos',
  async (filters = {}, { rejectWithValue }) => {
    try {
      console.log('[CursoThunk] fetchCursos — filtros:', filters);
      const response = await cursosApi.fetchCursos(filters);
      console.log('[CursoThunk] fetchCursos — respuesta raw:', response);
      return response;
    } catch (error) {
      console.error('[CursoThunk] fetchCursos — error:', error);
      return rejectWithValue(error);
    }
  }
);

export const fetchAllCursos = createAsyncThunk(
  'Curso/fetchAllCursos',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await cursosApi.fetchAllCursos();
      const result = extractArray(resp, 'Cursos', 'cursos', 'items');
      console.log('[CursoThunk] fetchAllCursos —', result.length, 'items');
      return result;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const fetchCursoById = createAsyncThunk(
  'Curso/fetchCursoById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await cursosApi.fetchCursoById(id);
      return response?.Curso || response?.curso || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const createCurso = createAsyncThunk(
  'Curso/createCurso',
  async (payload, { rejectWithValue }) => {
    try {
      console.log('[CursoThunk] createCurso — payload:', payload);
      const response = await cursosApi.createCurso(payload);
      console.log('[CursoThunk] createCurso — respuesta:', response);
      return response?.Curso || response?.curso || response;
    } catch (error) {
      console.error('[CursoThunk] createCurso — error:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const updateCurso = createAsyncThunk(
  'Curso/updateCurso',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('[CursoThunk] updateCurso — id:', id, 'data:', data);
      const response = await cursosApi.updateCurso(id, data);
      console.log('[CursoThunk] updateCurso — respuesta:', response);
      return response?.Curso || response?.curso || response;
    } catch (error) {
      console.error('[CursoThunk] updateCurso — error:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const deleteCurso = createAsyncThunk(
  'Curso/deleteCurso',
  async (id, { rejectWithValue }) => {
    try {
      console.log('[CursoThunk] deleteCurso — id:', id);
      const response = await cursosApi.deleteCurso(id);
      console.log('[CursoThunk] deleteCurso — respuesta:', response);
      return response?.Curso || response?.curso || response;
    } catch (error) {
      console.error('[CursoThunk] deleteCurso — error:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);


export const fetchMaterias = createAsyncThunk(
  'Curso/fetchMaterias',
  async (filters = {}, { rejectWithValue }) => {
    try {
      console.log('[CursoThunk] fetchMaterias — filtros:', filters);
      const response = await materiasApi.fetchMaterias(filters);
      console.log('[CursoThunk] fetchMaterias — respuesta raw:', response);
      return response;
    } catch (error) {
      console.error('[CursoThunk] fetchMaterias — error:', error);
      return rejectWithValue(error);
    }
  }
);

export const fetchAllMaterias = createAsyncThunk(
  'Curso/fetchAllMaterias',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[CursoThunk] fetchAllMaterias — iniciando');
      const resp = await materiasApi.fetchAllMaterias();
      console.log('[CursoThunk] fetchAllMaterias — respuesta raw:', resp);
      // Formato confirmado: array directo o { Materias:[...] } | { materias:[...] }
      const result = extractArray(resp, 'Materias', 'materias', 'items');
      console.log('[CursoThunk] fetchAllMaterias — extraídas:', result.length, result);
      return result;
    } catch (error) {
      console.error('[CursoThunk] fetchAllMaterias — error:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const fetchMateriaById = createAsyncThunk(
  'Curso/fetchMateriaById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await materiasApi.fetchMateriaById(id);
      return response?.Materia || response?.materia || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const createMateria = createAsyncThunk(
  'Curso/createMateria',
  async (payload, { rejectWithValue }) => {
    try {
      // payload: { codigo, nombre, estado, categoria }
      console.log('[CursoThunk] createMateria — payload:', payload);
      const response = await materiasApi.createMateria(payload);
      console.log('[CursoThunk] createMateria — respuesta:', response);
      return response?.Materia || response?.materia || response;
    } catch (error) {
      console.error('[CursoThunk] createMateria — error:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const updateMateria = createAsyncThunk(
  'Curso/updateMateria',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('[CursoThunk] updateMateria — id:', id, 'data:', data);
      const response = await materiasApi.updateMateria(id, data);
      console.log('[CursoThunk] updateMateria — respuesta:', response);
      return response?.Materia || response?.materia || response;
    } catch (error) {
      console.error('[CursoThunk] updateMateria — error:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const deleteMateria = createAsyncThunk(
  'Curso/deleteMateria',
  async (id, { rejectWithValue }) => {
    try {
      console.log('[CursoThunk] deleteMateria — id:', id);
      const response = await materiasApi.deleteMateria(id);
      console.log('[CursoThunk] deleteMateria — respuesta:', response);
      return response?.Materia || response?.materia || response;
    } catch (error) {
      console.error('[CursoThunk] deleteMateria — error:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const fetchPrerequisitosByMateria = createAsyncThunk(
  'Curso/fetchPrerequisitosByMateria',
  async (id_materia, { rejectWithValue }) => {
    try {
      console.log('[CursoThunk] fetchPrerequisitosByMateria — id_materia:', id_materia);
      const response = await prerequisitosApi.fetchPrerequisitoById(id_materia);
      console.log('[CursoThunk] fetchPrerequisitosByMateria — respuesta raw:', response);
      const result = extractArray(response, 'Prerequisitos', 'prerequisitos', 'prereqs', 'items');
      console.log('[CursoThunk] fetchPrerequisitosByMateria — extraídos:', result.length, result);
      return result;
    } catch (error) {
      console.error('[CursoThunk] fetchPrerequisitosByMateria — error:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const fetchPrerequisitoDetalle = createAsyncThunk(
  'Curso/fetchPrerequisitoDetalle',
  async (id, { rejectWithValue }) => {
    try {
      const response = await prerequisitosApi.fetchPrerequisitoDetalle(id);
      return response?.Prerequisito || response?.prerequisito || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const createPrerequisito = createAsyncThunk(
  'Curso/createPrerequisito',
  async (payload, { rejectWithValue }) => {
    try {
      // payload: { materia_id_materia, materia_id_materia_prereq }
      console.log('[CursoThunk] createPrerequisito — payload:', payload);
      const response = await prerequisitosApi.createPrerequisito(payload);
      console.log('[CursoThunk] createPrerequisito — respuesta:', response);
      return response?.Prerequisito || response?.prerequisito || response;
    } catch (error) {
      console.error('[CursoThunk] createPrerequisito — error:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const deletePrerequisito = createAsyncThunk(
  'Curso/deletePrerequisito',
  async (id, { rejectWithValue }) => {
    try {
      console.log('[CursoThunk] deletePrerequisito — id:', id);
      const response = await prerequisitosApi.deletePrerequisito(id);
      console.log('[CursoThunk] deletePrerequisito — respuesta:', response);
      return { id, ...(response || {}) };
    } catch (error) {
      console.error('[CursoThunk] deletePrerequisito — error:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);


export const fetchDocentes = createAsyncThunk(
  'Curso/fetchDocentes',
  async (filters = {}, { rejectWithValue }) => {
    try {
      console.log('[CursoThunk] fetchDocentes — filtros:', filters);
      const response = await DocentesApi.fetchDocentes(filters);
      console.log('[CursoThunk] fetchDocentes — respuesta raw:', response);
      return response;
    } catch (error) {
      console.error('[CursoThunk] fetchDocentes — error:', error);
      return rejectWithValue(error);
    }
  }
);

export const fetchAllDocentes = createAsyncThunk(
  'Curso/fetchAllDocentes',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[CursoThunk] fetchAllDocentes — iniciando');
      const resp = await DocentesApi.fetchAllDocentes();
      console.log('[CursoThunk] fetchAllDocentes — respuesta raw:', resp);
      // Formato confirmado: { ok: true, docentes: [...] }
      const result = extractArray(resp, 'docentes', 'Docentes', 'items');
      console.log('[CursoThunk] fetchAllDocentes — extraídos:', result.length, result);
      return result;
    } catch (error) {
      console.error('[CursoThunk] fetchAllDocentes — error:', error);
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const fetchDocenteById = createAsyncThunk(
  'Curso/fetchDocenteById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await DocentesApi.fetchDocenteById(id);
      return response?.Docente || response?.docente || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);