import axios from 'axios';
import { store } from '../store/index';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/',
});

const METODO_TRANSFERENCIA = 'TRANSFERENCIA';

const normalizarMetodoPago = (metodo) => {
  const valor = String(metodo || '').trim().toUpperCase();

  if (valor === 'TRANSFERENCIA') return METODO_TRANSFERENCIA;

  return valor;
};

// request interceptor
api.interceptors.request.use((config) => {
  const state = store.getState();
  const user = state?.login?.user;

  if (user?.token) {
    if (user.expiresAt && Date.now() > user.expiresAt) {
      store.dispatch({ type: 'login/logout' });
      return Promise.reject({
        message: 'Sesión expirada',
        status: 401,
      });
    }

    config.headers['x-token'] = user.token;
  }

  return config;
});

// response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const errorData = {
        message:
          error.response.data?.msg ||
          error.response.data?.message ||
          'Error en la petición',
        status: error.response.status,
        data: error.response.data,
      };

      if (error.response.status === 401) {
        store.dispatch({ type: 'login/logout' });
      }

      return Promise.reject(errorData);
    }

    if (error.request) {
      return Promise.reject({
        message: 'No se pudo conectar con el servidor',
        status: 0,
      });
    }

    return Promise.reject({
      message: error.message || 'Error desconocido',
      status: 0,
    });
  }
);

const handleError = (error) => {
  throw error?.data || error || { message: 'Error desconocido' };
};

export const loginApi = {
  login: (credentials) =>
    api.post('/usuarios/', credentials).then((res) => res.data).catch(handleError),
};

export const estudiantesApi = {
  fetchEstudiantes: (params = {}) =>
    api.get('/estudiantes/', { params }).then((res) => res.data).catch(handleError),

  fetchAllEstudiantes: () =>
    api.get('/estudiantes/').then((res) => res.data).catch(handleError),

  fetchEstudianteById: (id) =>
    api.get(`/estudiantes/${id}`).then((res) => res.data).catch(handleError),

  createEstudiante: (data) =>
    api.post('/cuenta-estudiante', data).then((res) => res.data).catch(handleError),

  updateEstudiante: (id, data) =>
    api.put(`/estudiantes/${id}`, data).then((res) => res.data).catch(handleError),

  deleteEstudiante: (id) =>
    api.patch(`/estudiantes/${id}`).then((res) => res.data).catch(handleError),

  busquedaEstudiantes: (params = {}) =>
    api.get('/busqueda/estudiantes', { params }).then((res) => res.data).catch(handleError),
};

export const DocentesApi = {
  fetchDocentes: (params = {}) =>
    api.get('/docentes/', { params }).then((res) => res.data).catch(handleError),

  fetchAllDocentes: () =>
    api.get('/docentes/').then((res) => res.data).catch(handleError),

  fetchDocenteById: (id) =>
    api.get(`/docentes/${id}`).then((res) => res.data).catch(handleError),

  createDocente: (data) =>
    api.post('/cuenta-docente', data).then((res) => res.data).catch(handleError),

  updateDocente: (id, data) =>
    api.put(`/docentes/${id}`, data).then((res) => res.data).catch(handleError),

  deleteDocente: (id) =>
    api.patch(`/docentes/${id}`).then((res) => res.data).catch(handleError),

  busquedaDocentes: (params = {}) =>
    api.get('/busqueda/docentes', { params }).then((res) => res.data).catch(handleError),
};

export const passwordApi = {
  solicitar: (email) =>
    api.post('/password/solicitar', { email }).then((res) => res.data).catch(handleError),

  validar: (token) =>
    api.get('/password/validar', { params: { token } }).then((res) => res.data).catch(handleError),

  cambiar: (token, newPassword) =>
    api.post('/password/cambiar', { token, newPassword }).then((res) => res.data).catch(handleError),
};

export const cursosApi = {
  fetchCursos: (params = {}) =>
    api.get('/curso', { params }).then((res) => res.data).catch(handleError),

  fetchAllCursos: (params = {}) =>
    api.get('/curso/all', { params }).then((res) => res.data).catch(handleError),

  fetchCursoById: (id) =>
    api.get(`/curso/${id}`).then((res) => res.data).catch(handleError),

  createCurso: (data) =>
    api.post('/curso/new', data).then((res) => res.data).catch(handleError),

  updateCurso: (id, data) =>
    api.put(`/curso/${id}`, data).then((res) => res.data).catch(handleError),

  deleteCurso: (id) =>
    api.patch(`/curso/${id}`).then((res) => res.data).catch(handleError),

  buscarCursos: (params = {}) =>
    api.get('/busqueda/cursos', { params }).then((res) => res.data).catch(handleError),

  fetchCursosByDocenteId: (docenteId, params = {}) =>
    api.get(`/curso/docente/${docenteId}`, { params }).then((res) => res.data).catch(handleError),

  fetchAllCursosByDocenteId: (docenteId) =>
    api.get(`/curso/docente/${docenteId}?all=1`).then((res) => res.data).catch(handleError),

  fetchCursosWithInscritosByDocenteId: (docenteId) =>
    api.get(`/curso/docente/${docenteId}/inscritos`).then((res) => res.data).catch(handleError),

  finalizarCurso: (idCurso) =>
    api.patch(`/curso/finalizar/${idCurso}`).then((res) => res.data).catch(handleError),

  cancelarCurso: (idCurso) =>
    api.patch(`/curso/cancelar/${idCurso}`).then((res) => res.data).catch(handleError),
};

export const materiasApi = {
  fetchMaterias: (params = {}) =>
    api.get('/materia', { params }).then((res) => res.data).catch(handleError),

  fetchAllMaterias: () =>
    api.get('/materia/all').then((res) => res.data).catch(handleError),

  fetchMateriaById: (id) =>
    api.get(`/materia/${id}`).then((res) => res.data).catch(handleError),

  createMateria: (data) =>
    api.post('/materia/new', data).then((res) => res.data).catch(handleError),

  updateMateria: (id, data) =>
    api.put(`/materia/${id}`, data).then((res) => res.data).catch(handleError),

  deleteMateria: (id) =>
    api.patch(`/materia/${id}`).then((res) => res.data).catch(handleError),

  buscarMaterias: (params = {}) =>
    api.get('/busqueda/materias', { params }).then((res) => res.data).catch(handleError),
};

export const prerequisitosApi = {
  fetchPrerequisitoById: (id) =>
    api.get(`/materia-prereq/${id}`).then((res) => res.data).catch(handleError),

  fetchPrerequisitoDetalle: (id) =>
    api.get(`/materia-prereq/detalle/${id}`).then((res) => res.data).catch(handleError),

  createPrerequisito: (data) =>
    api.post('/materia-prereq/new', data).then((res) => res.data).catch(handleError),

  deletePrerequisito: (id) =>
    api.delete(`/materia-prereq/${id}`).then((res) => res.data).catch(handleError),
};

export const inscritosEstudianteApi = {
  fetchInscripcionesByEstudianteId: (estudianteId, params = {}) =>
    api
      .get(`/inscritos/estudiante/${estudianteId}`, { params })
      .then((res) => res.data)
      .catch(handleError),

  fetchInscritoByMatriculaId: (matriculaId) =>
    api.get(`/inscritos/matricula/${matriculaId}`).then((res) => res.data).catch(handleError),

  fetchInscritosByCursoId: (cursoId, params = {}) =>
    api.get(`/inscritos/curso/${cursoId}`, { params }).then((res) => res.data).catch(handleError),

  fetchCursosInscritosByUsuarioId: (userId) =>
    api.get(`/inscritos/usuario/${userId}/cursos`).then((res) => res.data).catch(handleError),

  desinscribirseMismoDia: (idMatricula) =>
    api.delete(`/inscritos/desinscribirse/${idMatricula}`).then((res) => res.data).catch(handleError),
};

export const notasDocenteApi = {
  fetchNotasByCursoId: (cursoId) =>
    api.get(`/materia-notas/docente/curso/${cursoId}`).then((res) => res.data).catch(handleError),

  registrarNota: (cursoId, data) =>
    api.post(`/materia-notas/docente/curso/${cursoId}/registrar`, data).then((res) => res.data).catch(handleError),

  actualizarNotasDeUnCurso: (cursoId, data) =>
    api.put(`/materia-notas/docente/curso/${cursoId}/actualizar`, data).then((res) => res.data).catch(handleError),
};

export const carritoApi = {
  fetchCarritoByUsuarioId: (userId) =>
    api.get(`/carrito/usuario/${userId}`).then((res) => res.data).catch(handleError),

  addItemCarrito: (data) =>
    api.post('/carrito/add', data).then((res) => res.data).catch(handleError),

  removeItemCarrito: (idCompraCurso) =>
    api.delete(`/carrito/item/${idCompraCurso}`).then((res) => res.data).catch(handleError),

  cancelarCarrito: (idCompraTotal) =>
    api.patch(`/carrito/cancelar/${idCompraTotal}`).then((res) => res.data).catch(handleError),
};

export const ofertaAcademicaApi = {
  fetchOfertaAcademicaByUsuarioId: (userId) =>
    api.get(`/oferta-academica/usuario/${userId}`).then((res) => res.data).catch(handleError),
};

export const perfilApi = {
  fetchPerfilByUserId: (userId) =>
    api.get(`/usuarios/perfil/${userId}`).then((res) => res.data).catch(handleError),
};

export const pagoApi = {
  fetchPagos: () =>
    api.get('/pago').then((res) => res.data).catch(handleError),

  fetchPagoById: (id) =>
    api.get(`/pago/${id}`).then((res) => res.data).catch(handleError),

  createPago: (data) =>
    api
      .post('/pago/new', {
        ...data,
        metodo: normalizarMetodoPago(data?.metodo),
      })
      .then((res) => res.data)
      .catch(handleError),

  confirmarPagoPorCompraTotal: (idCompraTotal, data) =>
    api
      .put(`/pago/confirmar/compra-total/${idCompraTotal}`, data)
      .then((res) => res.data)
      .catch(handleError),
};

export const qrApi = {
  generarQR: (data) =>
    api.post('/qr/generar', data).then((res) => res.data).catch(handleError),

  verificarPagoQR: (data) =>
    api.post('/qr/verificar', data).then((res) => res.data).catch(handleError),
};

export const certificadosApi = {
  enviarCertificadoPorMatricula: (idMatricula) =>
    api
      .post('/certificados/enviar', { id_matricula: idMatricula })
      .then((res) => res.data)
      .catch(handleError),
};

export const comprobantesApi = {
  enviarComprobantePorPago: (idPago) =>
    api
      .post('/comprobantes/enviar', { id_pago: idPago })
      .then((res) => res.data)
      .catch(handleError),

  enviarComprobantePorCompraTotal: (idCompraTotal) =>
    api
      .post('/comprobantes/enviar', { id_compra_total: idCompraTotal })
      .then((res) => res.data)
      .catch(handleError),
};
export const perfilDocenteApi = {
  fetchPerfilDocenteByUserId: (userId) =>
    api.get(`/usuarios/perfil/${userId}`).then((res) => res.data).catch(handleError),

  changePasswordDocente: (userId, data) =>
    api.put(`/usuarios/${userId}/password`, data)
      .then((res) => res.data)
      .catch(handleError),
};
export const perfilEstudianteApi = {
  fetchPerfilEstudianteByUserId: (userId) =>
    api.get(`/usuarios/perfil/${userId}`).then((res) => res.data).catch(handleError),

  changePasswordEstudiante: (userId, data) =>
    api.put(`/usuarios/${userId}/password`, data)
      .then((res) => res.data)
      .catch(handleError),
};
export default api;