import { createSlice } from "@reduxjs/toolkit"
import {
  fetchOfertaAcademicaThunk,
  addCursoToCarritoThunk,
} from "./OfertaAcademicaThunk"

const initialState = {
  items: [],
  loading: false,
  error: null,
  addLoading: false,
  addError: null,
  addSuccess: false,
}

const ofertaAcademicaSlice = createSlice({
  name: "ofertaAcademica",
  initialState,
  reducers: {
    clearOfertaAcademicaState: (state) => {
      state.error = null
      state.addError = null
      state.addSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfertaAcademicaThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOfertaAcademicaThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchOfertaAcademicaThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al cargar oferta académica"
      })

      .addCase(addCursoToCarritoThunk.pending, (state) => {
        state.addLoading = true
        state.addError = null
        state.addSuccess = false
      })
      .addCase(addCursoToCarritoThunk.fulfilled, (state) => {
        state.addLoading = false
        state.addSuccess = true
      })
      .addCase(addCursoToCarritoThunk.rejected, (state, action) => {
        state.addLoading = false
        state.addError = action.payload || "Error al agregar curso al carrito"
      })
  },
})

export const { clearOfertaAcademicaState } = ofertaAcademicaSlice.actions

export const selectOfertaAcademica = (state) => state.ofertaAcademica.items
export const selectOfertaAcademicaLoading = (state) => state.ofertaAcademica.loading
export const selectOfertaAcademicaError = (state) => state.ofertaAcademica.error
export const selectOfertaAcademicaAddLoading = (state) => state.ofertaAcademica.addLoading
export const selectOfertaAcademicaAddError = (state) => state.ofertaAcademica.addError
export const selectOfertaAcademicaAddSuccess = (state) => state.ofertaAcademica.addSuccess

export default ofertaAcademicaSlice.reducer