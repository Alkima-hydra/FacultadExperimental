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

