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

const normalizarCurso = (curso) => {
  if (!curso) return null;

  return {
    ...curso,
    estado: curso.estado ?? null,
    estado_legible: curso.estado ?? null,
    esActivo: curso.estado === 'ACTIVO',
    esFinalizado: curso.estado === 'FINALIZADO',
    esCancelado: curso.estado === 'CANCELADO',
  };
};

const normalizarCursosArray = (arr = []) => {
  if (!Array.isArray(arr)) return [];
  return arr.map(normalizarCurso).filter(Boolean);
};

// CURSOS

export const fetchCursos = createAsyncThunk(
  'Curso/fetchCursos',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await cursosApi.fetchCursos(filters);

      if (Array.isArray(response)) {
        return normalizarCursosArray(response);
      }

      return {
        ...response,
        cursos: normalizarCursosArray(
          Array.isArray(response?.cursos)
            ? response.cursos
            : Array.isArray(response?.Cursos)
            ? response.Cursos
            : Array.isArray(response?.data)
            ? response.data
            : []
        ),
      };
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
      return normalizarCursosArray(extractArray(resp, 'cursos', 'Cursos', 'items'));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCursoById = createAsyncThunk(
  'Curso/fetchCursoById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await cursosApi.fetchCursoById(id);
      return normalizarCurso(response?.curso || response?.Curso || response);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createCurso = createAsyncThunk(
  'Curso/createCurso',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await cursosApi.createCurso(payload);
      return normalizarCurso(response?.curso || response?.Curso || response);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCurso = createAsyncThunk(
  'Curso/updateCurso',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await cursosApi.updateCurso(id, data);
      return normalizarCurso(response?.curso || response?.Curso || response);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCurso = createAsyncThunk(
  'Curso/deleteCurso',
  async (id, { rejectWithValue }) => {
    try {
      const response = await cursosApi.deleteCurso(id);

      return {
        id_curso: Number(response?.id_curso ?? id),
        ...(response || {}),
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const buscarCursos = createAsyncThunk(
  'Curso/buscarCursos',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await cursosApi.buscarCursos(params);

      return {
        ...response,
        cursos: normalizarCursosArray(
          Array.isArray(response?.cursos)
            ? response.cursos
            : Array.isArray(response?.Cursos)
            ? response.Cursos
            : []
        ),
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const finalizarCurso = createAsyncThunk(
  'Curso/finalizarCurso',
  async (idCurso, { rejectWithValue }) => {
    try {
      const response = await cursosApi.finalizarCurso(idCurso);

      return {
        ...response,
        curso: normalizarCurso(response?.curso || response),
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const cancelarCurso = createAsyncThunk(
  'Curso/cancelarCurso',
  async (idCurso, { rejectWithValue }) => {
    try {
      const response = await cursosApi.cancelarCurso(idCurso);

      return {
        ...response,
        curso: normalizarCurso(response?.curso || response),
      };
    } catch (error) {
      return rejectWithValue(error);
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
      return extractArray(resp, 'materias', 'Materias', 'items');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMateriaById = createAsyncThunk(
  'Curso/fetchMateriaById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await materiasApi.fetchMateriaById(id);
      return response?.materia || response?.Materia || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createMateria = createAsyncThunk(
  'Curso/createMateria',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await materiasApi.createMateria(payload);
      return response?.materia || response?.Materia || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateMateria = createAsyncThunk(
  'Curso/updateMateria',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await materiasApi.updateMateria(id, data);
      return response?.materia || response?.Materia || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteMateria = createAsyncThunk(
  'Curso/deleteMateria',
  async (id, { rejectWithValue }) => {
    try {
      const response = await materiasApi.deleteMateria(id);
      return {
        id_materia: Number(id),
        ...(response || {}),
      };
    } catch (error) {
      return rejectWithValue(error);
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
      return rejectWithValue(error);
    }
  }
);

// PREREQUISITOS

export const fetchPrerequisitosByMateria = createAsyncThunk(
  'Curso/fetchPrerequisitosByMateria',
  async (id_materia, { rejectWithValue }) => {
    try {
      const response = await prerequisitosApi.fetchPrerequisitoById(id_materia);
      return extractArray(response, 'prerequisitos', 'Prerequisitos', 'prereqs', 'items');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchPrerequisitoDetalle = createAsyncThunk(
  'Curso/fetchPrerequisitoDetalle',
  async (id, { rejectWithValue }) => {
    try {
      const response = await prerequisitosApi.fetchPrerequisitoDetalle(id);
      return response?.prerequisito || response?.Prerequisito || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createPrerequisito = createAsyncThunk(
  'Curso/createPrerequisito',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await prerequisitosApi.createPrerequisito(payload);
      return response?.prerequisito || response?.Prerequisito || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deletePrerequisito = createAsyncThunk(
  'Curso/deletePrerequisito',
  async (id, { rejectWithValue }) => {
    try {
      const response = await prerequisitosApi.deletePrerequisito(id);
      return { id: Number(id), ...(response || {}) };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// DOCENTES

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
      return extractArray(resp, 'docentes', 'Docentes', 'items');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchDocenteById = createAsyncThunk(
  'Curso/fetchDocenteById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await DocentesApi.fetchDocenteById(id);
      return response?.docente || response?.Docente || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);