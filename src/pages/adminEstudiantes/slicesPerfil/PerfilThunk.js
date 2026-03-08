import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/api';

const normalizarPerfil = (json) => {
  const u = json?.usuario || {};
  const e = json?.estudiante || null;

  const fullName = [u.nombres, u.apellido_paterno, u.apellido_materno]
    .filter(Boolean)
    .join(' ')
    .trim();

  return {
    id_persona: u.id_persona ?? '',
    nombres: u.nombres ?? '',
    apellido_paterno: u.apellido_paterno ?? '',
    apellido_materno: u.apellido_materno ?? '',
    nombreCompleto: fullName || '—',
    mail: u.mail ?? '',
    ci: u.ci ?? '',
    genero: u.genero ?? '',
    fecha_nacimiento: u.fecha_nacimiento ?? '',
    estado_usuario: u.estado ?? true,

    id_estudiante: e?.id_estudiante ?? '',
    carrera: e?.carrera ?? '',
    semestre_ingreso: e?.semestre_ingreso ?? '',
    direccion: e?.direccion ?? '',
    estado_estudiante: e?.estado ?? null,
  };
};

export const fetchPerfil = createAsyncThunk(
  'perfil/fetchPerfil',
  async ({ userId }, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue({ message: 'No hay sesión activa.' });
      }

      const res = await api.get(`/usuarios/perfil/${userId}`);
      const json = res.data;

      if (!json?.ok) {
        return rejectWithValue({
          message: json?.msg || 'No se pudo cargar el perfil.',
        });
      }

      return normalizarPerfil(json);
    } catch (error) {
      return rejectWithValue({
        message: error?.message || 'Error al cargar el perfil.',
      });
    }
  }
);

export const updatePerfilEditable = createAsyncThunk(
  'perfil/updatePerfilEditable',
  async ({ idEstudiante, direccion, fecha_nacimiento }, { rejectWithValue }) => {
    try {
      if (!idEstudiante) {
        return rejectWithValue({ message: 'Faltan datos para actualizar.' });
      }

      const res = await api.put(`/estudiantes/${idEstudiante}`, {
        direccion,
        fecha_nacimiento,
      });

      const json = res.data;

      if (!json?.ok) {
        return rejectWithValue({
          message: json?.msg || 'No se pudo actualizar la información.',
        });
      }

      return {
        direccion,
        fecha_nacimiento,
      };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || 'Error al actualizar la información.',
      });
    }
  }
);

export const changePasswordPerfil = createAsyncThunk(
  'perfil/changePasswordPerfil',
  async ({ idEstudiante, newPassword }, { rejectWithValue }) => {
    try {
      if (!idEstudiante) {
        return rejectWithValue({
          message: 'Faltan datos para actualizar la contraseña.',
        });
      }

      const res = await api.put(`/estudiantes/${idEstudiante}`, {
        password: newPassword,
      });

      const json = res.data;

      if (!json?.ok) {
        return rejectWithValue({
          message: json?.msg || 'No se pudo cambiar la contraseña.',
        });
      }

      return { ok: true };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || 'Error al cambiar la contraseña.',
      });
    }
  }
);