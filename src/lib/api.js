import axios from 'axios';
import { store } from '../store/index';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/',
});

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      const errorData = {
        message: error.response.data?.msg || error.response.data?.message || 'Error en la petición',
        status: error.response.status,
        data: error.response.data,
      };
      return Promise.reject(errorData);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      return Promise.reject({
        message: 'No se pudo conectar con el servidor',
        status: 0,
      });
    } else {
      // Error al configurar la petición
      return Promise.reject({
        message: error.message || 'Error desconocido',
        status: 0,
      });
    }
  }
);

// manejo de errores
const handleError = (error) => {
  throw error.response?.data || { message: error.message };
};

export const loginApi = {
  login: (credentials) =>
    api.post('/usuarios/', credentials).then((res) => res.data).catch(handleError),
};

// pa colocar el header
api.interceptors.request.use((config) => {
  const { user } = store.getState().login;

  if (user?.token) {
    // 1. ¿El token expiró?
    if (user.expiresAt && Date.now() > user.expiresAt) {
      store.dispatch({ type: 'login/logout' });
      return Promise.reject({
        message: 'Sesión expirada',
        status: 401
      });
    }

    // 2. Token válido → lo enviamos
    config.headers['x-token'] = user.token;
  }

  return config;
});
// para manejar el error 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.status === 401) {
      store.dispatch({ type: 'login/logout' });
    }
    return Promise.reject(error);
  }
);

// apis para usuarios, estudiantes

export const personasApi = {
  fetchEstudiantes: (params = {}) =>
    api.get('/estudiantes/', { params }).then((res) => res.data).catch(handleError),

  fetchAllEstudiantes: () =>
    api.get('/estudiantes/all').then((res) => res.data).catch(handleError),

  fetchEstudianteById: (id) =>
    api.get(`/estudiantes/${id}`).then((res) => res.data).catch(handleError),

  createEstudiante: (data) =>
    api.post('/estudiantes/new', data).then((res) => res.data).catch(handleError),

  updateEstudiante: (id, data) =>
    api.put(`/estudiantes/${id}`, data).then((res) => res.data).catch(handleError),

  deleteEstudiante: (id) =>
    api.patch(`/estudiantes/${id}`).then((res) => res.data).catch(handleError),
};

export const passwordApi = {
  solicitar: (email) => api.post('/password/solicitar', { email }),
  validar: (token) => api.get('/password/validar', { params: { token } }),
  cambiar: (token, newPassword) => api.post('/password/cambiar', { token, newPassword }),
};
