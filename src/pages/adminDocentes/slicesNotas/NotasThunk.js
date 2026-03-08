import { createAsyncThunk } from '@reduxjs/toolkit';
import { notasDocenteApi } from '../../../lib/api';

export const fetchNotasByCursoId = createAsyncThunk(
    'Notas/fetchNotasByCursoId',
    async (cursoId, { rejectWithValue }) => {
        try {
            const response = await notasDocenteApi.fetchNotasByCursoId(cursoId);
            return response;
        }
        catch (error) {
            return rejectWithValue(error?.response?.data || error.message || error);
        }
    }
);

export const registrarNota = createAsyncThunk(
    'Notas/registrarNota',
    async ({ cursoId, data }, { rejectWithValue }) => {
        try {
            const response = await notasDocenteApi.registrarNota(cursoId, data);
            return response;
        }
        catch (error) {
            return rejectWithValue(error?.response?.data || error.message || error);
        }
    }
);
