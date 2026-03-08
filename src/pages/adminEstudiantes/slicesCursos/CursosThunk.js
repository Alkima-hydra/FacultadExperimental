import { createAsyncThunk } from '@reduxjs/toolkit';
import { inscritosEstudianteApi } from '../../../lib/api';

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