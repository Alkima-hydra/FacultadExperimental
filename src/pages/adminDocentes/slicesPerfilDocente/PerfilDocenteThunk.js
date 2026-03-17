import { createAsyncThunk } from '@reduxjs/toolkit';
import { perfilDocenteApi } from '../../../lib/api';

const getErrorMessage = (error, fallback) => {
  return (
    error?.message ||
    error?.msg ||
    error?.data?.msg ||
    error?.data?.message ||
    fallback
  );
};

export const fetchPerfilDocente = createAsyncThunk(
  'perfilDocente/fetchPerfilDocente',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await perfilDocenteApi.fetchPerfilDocenteByUserId(userId);

      if (!response?.ok) {
        return rejectWithValue(response?.msg || 'No se pudo cargar el perfil del docente');
      }

      const usuario = response?.usuario || {};
      const docente = response?.docente || null;

      if (!docente) {
        return rejectWithValue('Este perfil no corresponde a un docente');
      }

      return {
        id_persona: usuario?.id_persona ?? '',
        nombres: usuario?.nombres ?? '',
        apellido_paterno: usuario?.apellido_paterno ?? '',
        apellido_materno: usuario?.apellido_materno ?? '',
        mail: usuario?.mail ?? '',
        ci: usuario?.ci ?? '',
        genero: usuario?.genero ?? '',
        fecha_nacimiento: usuario?.fecha_nacimiento ?? '',
        estado_usuario: Boolean(usuario?.estado),
        id_docente: docente?.id_docente ?? '',
        titulo: docente?.titulo ?? '',
        tipo_docente: docente?.tipo_docente ?? '',
        estado_docente: docente?.estado ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Error al cargar el perfil del docente')
      );
    }
  }
);

export const changePasswordDocente = createAsyncThunk(
  'perfilDocente/changePasswordDocente',
  async ({ userId, currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await perfilDocenteApi.changePasswordDocente(userId, {
        currentPassword,
        newPassword,
      });

      if (!response?.ok) {
        return rejectWithValue(response?.msg || 'No se pudo cambiar la contraseña');
      }

      return response?.msg || 'Contraseña actualizada correctamente';
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Error al cambiar la contraseña')
      );
    }
  }
);