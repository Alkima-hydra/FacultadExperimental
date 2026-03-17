import { createAsyncThunk } from "@reduxjs/toolkit";
import { pagoApi } from "../../../lib/api";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export const fetchPagos = createAsyncThunk(
  'Pagos/fetchPagos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await pagoApi.fetchPagos();
      console.log("fetchPagos response:", response);
      return response?.data || response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || error
      );
    }
  }
);

