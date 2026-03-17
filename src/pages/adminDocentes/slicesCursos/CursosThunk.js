import { createAsyncThunk } from "@reduxjs/toolkit";
import { cursosApi } from "../../../lib/api";

const extractErrorMessage = (error) => {
  if (!error) return "Ocurrió un error inesperado";
  if (typeof error === "string") return error;

  return (
    error.message ||
    error.msg ||
    error.data?.message ||
    error.data?.msg ||
    "Ocurrió un error inesperado"
  );
};

export const fetchAllCursosByDocenteId = createAsyncThunk(
  "Cursos/fetchAllCursosByDocenteId",
  async (docenteId, { rejectWithValue }) => {
    try {
      const response = await cursosApi.fetchAllCursosByDocenteId(docenteId);
      return response;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchCursosWithInscritosByDocenteId = createAsyncThunk(
  "Cursos/fetchCursosWithInscritosByDocenteId",
  async (docenteId, { rejectWithValue }) => {
    try {
      const response = await cursosApi.fetchCursosWithInscritosByDocenteId(docenteId);
      return response;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const eliminarCurso = createAsyncThunk(
  "Cursos/eliminarCurso",
  async (cursoId, { rejectWithValue }) => {
    try {
      const response = await cursosApi.deleteCurso(cursoId);
      return response;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const finalizarCurso = createAsyncThunk(
  "Cursos/finalizarCurso",
  async (cursoId, { rejectWithValue }) => {
    try {
      const response = await cursosApi.finalizarCurso(cursoId);
      return response;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const cancelarCurso = createAsyncThunk(
  "Cursos/cancelarCurso",
  async (cursoId, { rejectWithValue }) => {
    try {
      const response = await cursosApi.cancelarCurso(cursoId);
      return response;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);