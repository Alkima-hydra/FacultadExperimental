import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPerfil,
  updatePerfilEditable,
  changePasswordPerfil,
} from './PerfilThunk';

const initialState = {
  perfil: null,

  editForm: {
    direccion: '',
    fecha_nacimiento: '',
  },

  passwordForm: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },

  isLoading: false,
  isSavingProfile: false,
  isChangingPassword: false,

  error: null,
  successMessage: null,
};

const PerfilSlice = createSlice({
  name: 'perfil',
  initialState,
  reducers: {
    clearPerfilError(state) {
      state.error = null;
    },

    clearPerfilSuccess(state) {
      state.successMessage = null;
    },

    clearPerfil(state) {
      state.perfil = null;
      state.editForm = {
        direccion: '',
        fecha_nacimiento: '',
      };
      state.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      state.isLoading = false;
      state.isSavingProfile = false;
      state.isChangingPassword = false;
      state.error = null;
      state.successMessage = null;
    },

    setEditField(state, action) {
      const { name, value } = action.payload;
      state.editForm[name] = value;
    },

    resetEditForm(state) {
      state.editForm = {
        direccion: state.perfil?.direccion ?? '',
        fecha_nacimiento: state.perfil?.fecha_nacimiento ?? '',
      };
    },

    updatePasswordField(state, action) {
      const { name, value } = action.payload;
      state.passwordForm[name] = value;
    },

    resetPasswordForm(state) {
      state.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerfil.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchPerfil.fulfilled, (state, action) => {
        state.isLoading = false;
        state.perfil = action.payload;
        state.editForm = {
          direccion: action.payload?.direccion ?? '',
          fecha_nacimiento: action.payload?.fecha_nacimiento ?? '',
        };
      })
      .addCase(fetchPerfil.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Error al cargar el perfil.';
      })

      .addCase(updatePerfilEditable.pending, (state) => {
        state.isSavingProfile = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updatePerfilEditable.fulfilled, (state, action) => {
        state.isSavingProfile = false;

        if (state.perfil) {
          state.perfil.direccion = action.payload.direccion;
          state.perfil.fecha_nacimiento = action.payload.fecha_nacimiento;
        }

        state.editForm = {
          direccion: action.payload.direccion,
          fecha_nacimiento: action.payload.fecha_nacimiento,
        };

        state.successMessage = 'Perfil actualizado correctamente.';
      })
      .addCase(updatePerfilEditable.rejected, (state, action) => {
        state.isSavingProfile = false;
        state.error = action.payload?.message || 'Error al actualizar el perfil.';
      })

      .addCase(changePasswordPerfil.pending, (state) => {
        state.isChangingPassword = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePasswordPerfil.fulfilled, (state) => {
        state.isChangingPassword = false;
        state.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        };
        state.successMessage = 'Contraseña actualizada correctamente.';
      })
      .addCase(changePasswordPerfil.rejected, (state, action) => {
        state.isChangingPassword = false;
        state.error = action.payload?.message || 'Error al cambiar la contraseña.';
      });
  },
});

export const {
  clearPerfilError,
  clearPerfilSuccess,
  clearPerfil,
  setEditField,
  resetEditForm,
  updatePasswordField,
  resetPasswordForm,
} = PerfilSlice.actions;

export const selectPerfil = (state) => state?.perfil?.perfil ?? null;
export const selectPerfilLoading = (state) => Boolean(state?.perfil?.isLoading);
export const selectPerfilError = (state) => state?.perfil?.error ?? null;
export const selectPerfilSuccess = (state) => state?.perfil?.successMessage ?? null;

export const selectEditForm = (state) =>
  state?.perfil?.editForm ?? { direccion: '', fecha_nacimiento: '' };

export const selectPerfilSavingProfile = (state) =>
  Boolean(state?.perfil?.isSavingProfile);

export const selectPasswordForm = (state) =>
  state?.perfil?.passwordForm ?? {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

export const selectPerfilChangingPassword = (state) =>
  Boolean(state?.perfil?.isChangingPassword);

export const PerfilReducer = PerfilSlice.reducer;
export default PerfilSlice.reducer;