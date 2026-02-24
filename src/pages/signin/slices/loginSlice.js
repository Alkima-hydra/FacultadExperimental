import { createSlice } from '@reduxjs/toolkit';

// Nota: no importamos thunks aquí para evitar dependencias circulares.
// En extraReducers usamos los action types por string.

const initialState = {
  user: {
    uid: '',
    name: '',
    rol: '',
    email: '',
    token: null,
  },
  isLoading: false,
  error: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout(state) {
      state.user = { uid: '', name: '', email: '', rol: '', token: null };
      state.isLoading = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('login/loginUser/pending', (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase('login/loginUser/fulfilled', (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase('login/loginUser/rejected', (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          'No se pudo iniciar sesión.';
      });
  },
});

export const { logout, clearError } = loginSlice.actions;
export default loginSlice.reducer;