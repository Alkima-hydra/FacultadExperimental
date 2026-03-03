import { createAsyncThunk } from '@reduxjs/toolkit';
import { inscritosEstudianteApi } from '../../../lib/api';

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


export const fetchInscripcionesByEstudianteId = createAsyncThunk(
  'Curso/fetchInscripcionesByEstudianteId',
  async (estudianteId, { rejectWithValue }) => {
    try {
      const response = await inscritosEstudianteApi.fetchInscripcionesByEstudianteId(estudianteId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
