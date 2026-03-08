import { createAsyncThunk } from "@reduxjs/toolkit"
import { ofertaAcademicaApi } from "../../../lib/api"

export const fetchOfertaAcademicaThunk = createAsyncThunk(
  "ofertaAcademica/fetchOfertaAcademica",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await ofertaAcademicaApi.fetchOfertaAcademica(params)
      return data?.cursos || data?.data || data || []
    } catch (error) {
      return rejectWithValue(error.message || "Error al cargar la oferta académica")
    }
  }
)

export const addCursoToCarritoThunk = createAsyncThunk(
  "ofertaAcademica/addCursoToCarrito",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await ofertaAcademicaApi.addCursoToCarrito(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.message || "Error al agregar el curso al carrito")
    }
  }
)