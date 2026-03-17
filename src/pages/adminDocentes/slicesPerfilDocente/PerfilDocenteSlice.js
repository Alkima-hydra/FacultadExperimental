import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPerfilDocente,
  changePasswordDocente,
} from './PerfilDocenteThunk';

const initialState = {
  perfil: null,
  loading: false,
  error: null,
  success: null,

  passwordForm: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  changingPassword: false,
};

const perfilDocenteSlice = createSlice({
  name: 'perfilDocente',
  initialState,
  reducers: {
    updatePasswordField: (state, action) => {
      const { name, value } = action.payload;
      state.passwordForm[name] = value;
    },

    resetPasswordForm: (state) => {
      state.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
    },

    clearPerfilDocenteError: (state) => {
      state.error = null;
    },

    clearPerfilDocenteSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerfilDocente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerfilDocente.fulfilled, (state, action) => {
        state.loading = false;
        state.perfil = action.payload;
      })
      .addCase(fetchPerfilDocente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'No se pudo cargar el perfil del docente';
      })

      .addCase(changePasswordDocente.pending, (state) => {
        state.changingPassword = true;
        state.error = null;
        state.success = null;
      })
      .addCase(changePasswordDocente.fulfilled, (state, action) => {
        state.changingPassword = false;
        state.success = action.payload || 'Contraseña actualizada correctamente';
        state.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        };
      })
      .addCase(changePasswordDocente.rejected, (state, action) => {
        state.changingPassword = false;
        state.error = action.payload || 'No se pudo cambiar la contraseña';
      });
  },
});

export const {
  updatePasswordField,
  resetPasswordForm,
  clearPerfilDocenteError,
  clearPerfilDocenteSuccess,
} = perfilDocenteSlice.actions;

export default perfilDocenteSlice.reducer;

/* selectors */
export const selectPerfilDocente = (state) => state.perfilDocente?.perfil;
export const selectPerfilDocenteLoading = (state) => state.perfilDocente?.loading;
export const selectPerfilDocenteError = (state) => state.perfilDocente?.error;
export const selectPerfilDocenteSuccess = (state) => state.perfilDocente?.success;
export const selectPasswordFormDocente = (state) => state.perfilDocente?.passwordForm;
export const selectPerfilDocenteChangingPassword = (state) =>
  state.perfilDocente?.changingPassword;