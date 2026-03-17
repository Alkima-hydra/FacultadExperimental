import { createAsyncThunk } from "@reduxjs/toolkit";
import { saldosMovimientosApi } from "../../../lib/api";

export const fetchSaldosByEstudianteId = createAsyncThunk(
    'SaldoMovimientos/fetchSaldosByEstudianteId',
    async (estudianteId, { rejectWithValue }) => {
        try {
            const response = await saldosMovimientosApi.fetchSaldosByEstudianteId(estudianteId);
            console.log("fetchSaldosByEstudianteId response:", response);
            return response || [];
        }
        catch (error) {
            return rejectWithValue(
                error?.response?.data || error?.message || error
            );
        }
    }
);
