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
      const response = await cursosApi.fetchCursos(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllCursos = createAsyncThunk(
  'Curso/fetchAllCursos',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await cursosApi.fetchAllCursos();
      return extractArray(resp, 'Cursos', 'cursos', 'items');
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
      const response = await cursosApi.createCurso(payload);
      return response?.Curso || response?.curso || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const updateCurso = createAsyncThunk(
  'Curso/updateCurso',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await cursosApi.updateCurso(id, data);
      return response?.Curso || response?.curso || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const deleteCurso = createAsyncThunk(
  'Curso/deleteCurso',
  async (id, { rejectWithValue }) => {
    try {
      const response = await cursosApi.deleteCurso(id);
      return response?.Curso || response?.curso || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const buscarCursos = createAsyncThunk(
  'Curso/buscarCursos',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await cursosApi.buscarCursos(params);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

// MATERIAS

export const fetchMaterias = createAsyncThunk(
  'Curso/fetchMaterias',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await materiasApi.fetchMaterias(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllMaterias = createAsyncThunk(
  'Curso/fetchAllMaterias',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await materiasApi.fetchAllMaterias();
      const result = extractArray(resp, 'Materias', 'materias', 'items');
      return result;
    } catch (error) {
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
      const response = await materiasApi.createMateria(payload);
      return response?.Materia || response?.materia || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const updateMateria = createAsyncThunk(
  'Curso/updateMateria',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await materiasApi.updateMateria(id, data);
      return response?.Materia || response?.materia || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const deleteMateria = createAsyncThunk(
  'Curso/deleteMateria',
  async (id, { rejectWithValue }) => {
    try {
      const response = await materiasApi.deleteMateria(id);
      return response?.Materia || response?.materia || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const buscarMaterias = createAsyncThunk(
  'Curso/buscarMaterias',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await materiasApi.buscarMaterias(params);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const fetchPrerequisitosByMateria = createAsyncThunk(
  'Curso/fetchPrerequisitosByMateria',
  async (id_materia, { rejectWithValue }) => {
    try {
      const response = await prerequisitosApi.fetchPrerequisitoById(id_materia);
      const result = extractArray(response, 'Prerequisitos', 'prerequisitos', 'prereqs', 'items');
      return result;
    } catch (error) {
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
      const response = await prerequisitosApi.createPrerequisito(payload);
      return response?.Prerequisito || response?.prerequisito || response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);

export const deletePrerequisito = createAsyncThunk(
  'Curso/deletePrerequisito',
  async (id, { rejectWithValue }) => {
    try {
      const response = await prerequisitosApi.deletePrerequisito(id);
      return { id, ...(response || {}) };
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message || error);
    }
  }
);


export const fetchDocentes = createAsyncThunk(
  'Curso/fetchDocentes',
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
  'Curso/fetchAllDocentes',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await DocentesApi.fetchAllDocentes();
      const result = extractArray(resp, 'docentes', 'Docentes', 'items');
      return result;
    } catch (error) {
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