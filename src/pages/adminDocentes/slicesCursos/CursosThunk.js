import { createAsyncThunk } from '@reduxjs/toolkit';
import { cursosApi } from '../../../lib/api';

export const fetchCursosByDocenteId = createAsyncThunk(
    'Cursos/fetchCursosByDocenteId',
    async (docenteId, { rejectWithValue }) => {
        try {
            const response = await cursosApi.fetchCursosByDocenteId(docenteId);
            return response;
        }
        catch (error) {
            return rejectWithValue(error?.response?.data || error.message || error);
        }
    }
);

export const fetchCursosWithInscritosByDocenteId = createAsyncThunk(
    'Cursos/fetchCursosWithInscritosByDocenteId',
    async (docenteId, { rejectWithValue }) => {
        try {
            const response = await cursosApi.fetchCursosWithInscritosByDocenteId(docenteId);
            return response;
        }
        catch (error) {
            return rejectWithValue(error?.response?.data || error.message || error);
        }
    }
);

export const eliminarCurso = createAsyncThunk(
    'Cursos/eliminarCurso',
    async (cursoId, { rejectWithValue }) => {
        try {
            const response = await cursosApi.deleteCurso(cursoId);
            return response;
        }
        catch (error) {
            return rejectWithValue(error?.response?.data || error.message || error);
        }
    }
);

