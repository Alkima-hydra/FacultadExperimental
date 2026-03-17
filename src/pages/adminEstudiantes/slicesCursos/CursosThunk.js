import { createAsyncThunk } from '@reduxjs/toolkit';
import { inscritosEstudianteApi, certificadosApi } from '../../../lib/api';

export const fetchInscripcionesByEstudianteId = createAsyncThunk(
  'cursosEstudiante/fetchInscripcionesByEstudianteId',
  async ({ id_estudiante, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const data = await inscritosEstudianteApi.fetchInscripcionesByEstudianteId(
        id_estudiante,
        { page, limit }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error?.message || 'No se pudieron cargar los cursos inscritos'
      );
    }
  }
);

export const fetchInscritoByMatriculaId = createAsyncThunk(
  'cursosEstudiante/fetchInscritoByMatriculaId',
  async (id_matricula, { rejectWithValue }) => {
    try {
      const data = await inscritosEstudianteApi.fetchInscritoByMatriculaId(id_matricula);
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.message || 'No se pudo cargar el detalle del curso'
      );
    }
  }
);

export const enviarCertificadoPorMatricula = createAsyncThunk(
  'cursosEstudiante/enviarCertificadoPorMatricula',
  async (id_matricula, { rejectWithValue }) => {
    try {
      const data = await certificadosApi.enviarCertificadoPorMatricula(id_matricula);
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.message || 'No se pudo enviar el certificado'
      );
    }
  }
);

export const desinscribirseMismoDia = createAsyncThunk(
  'cursosEstudiante/desinscribirseMismoDia',
  async (id_matricula, { rejectWithValue }) => {
    try {
      const data = await inscritosEstudianteApi.desinscribirseMismoDia(id_matricula);
      return {
        ...data,
        id_matricula,
      };
    } catch (error) {
      return rejectWithValue(
        error?.message || 'No se pudo realizar la desinscripción'
      );
    }
  }
);