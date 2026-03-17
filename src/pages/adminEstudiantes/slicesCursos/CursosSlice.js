import { createSlice } from '@reduxjs/toolkit';
import {
  fetchInscripcionesByEstudianteId,
  fetchInscritoByMatriculaId,
  enviarCertificadoPorMatricula,
  desinscribirseMismoDia,
} from './CursosThunk';

const initialState = {
  estudiante: null,
  inscritos: [],
  inscritosFiltrados: [],
  meta: null,

  isLoadingInscritos: false,
  isLoadingDetalle: false,
  isSendingCertificate: false,
  isUnenrolling: false,

  error: null,
  certificateError: null,
  certificateSuccess: null,

  filtroEstado: 'todos',
  searchTerm: '',

  inscritoSeleccionado: null,
  modalDetalleOpen: false,
};

const normalizarTexto = (txt = '') =>
  String(txt)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const aplicarFiltros = (state) => {
  let lista = Array.isArray(state.inscritos) ? [...state.inscritos] : [];

  switch (state.filtroEstado) {
    case 'activos':
      lista = lista.filter((item) => item?.curso?.estado === 'ACTIVO');
      break;

    case 'concluidos':
      lista = lista.filter(
        (item) =>
          item?.curso?.estado === 'FINALIZADO' ||
          item?.curso?.estado === 'CANCELADO'
      );
      break;

    case 'aprobados':
      lista = lista.filter((item) => item?.materia_notas?.aprobado === true);
      break;

    case 'reprobados':
      lista = lista.filter((item) => item?.materia_notas?.aprobado === false);
      break;

    case 'pendientes':
      lista = lista.filter((item) => !item?.materia_notas);
      break;

    case 'todos':
    default:
      break;
  }

  const q = normalizarTexto(state.searchTerm);

  if (q) {
    lista = lista.filter((item) => {
      const materia = item?.curso?.materia || {};
      const docenteUsuario = item?.curso?.docente?.usuario || {};

      const nombreMateria = normalizarTexto(materia?.nombre);
      const siglaMateria = normalizarTexto(materia?.codigo);
      const nombreDocente = normalizarTexto(
        `${docenteUsuario?.nombres || ''} ${docenteUsuario?.apellido_paterno || ''} ${docenteUsuario?.apellido_materno || ''}`
      );

      return (
        nombreMateria.includes(q) ||
        siglaMateria.includes(q) ||
        nombreDocente.includes(q)
      );
    });
  }

  state.inscritosFiltrados = lista;
};

const cursosSlice = createSlice({
  name: 'cursosEstudiante',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearCertificateError: (state) => {
      state.certificateError = null;
    },

    clearCertificateSuccess: (state) => {
      state.certificateSuccess = null;
    },

    setFiltroEstado: (state, action) => {
      state.filtroEstado = action.payload;
      aplicarFiltros(state);
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      aplicarFiltros(state);
    },

    clearSearchTerm: (state) => {
      state.searchTerm = '';
      aplicarFiltros(state);
    },

    setInscritoSeleccionado: (state, action) => {
      state.inscritoSeleccionado = action.payload;
      state.modalDetalleOpen = true;
    },

    clearInscritoSeleccionado: (state) => {
      state.inscritoSeleccionado = null;
      state.modalDetalleOpen = false;
    },

    openDetalleModal: (state) => {
      state.modalDetalleOpen = true;
    },

    closeDetalleModal: (state) => {
      state.modalDetalleOpen = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchInscripcionesByEstudianteId.pending, (state) => {
        state.isLoadingInscritos = true;
        state.error = null;
      })
      .addCase(fetchInscripcionesByEstudianteId.fulfilled, (state, action) => {
        state.isLoadingInscritos = false;
        state.estudiante = action.payload?.estudiante || null;
        state.inscritos = action.payload?.inscritos || [];
        state.meta = action.payload?.meta || null;
        aplicarFiltros(state);
      })
      .addCase(fetchInscripcionesByEstudianteId.rejected, (state, action) => {
        state.isLoadingInscritos = false;
        state.error = action.payload || 'Error al cargar los cursos inscritos';
      })

      .addCase(fetchInscritoByMatriculaId.pending, (state) => {
        state.isLoadingDetalle = true;
        state.error = null;
      })
      .addCase(fetchInscritoByMatriculaId.fulfilled, (state, action) => {
        state.isLoadingDetalle = false;
        state.inscritoSeleccionado = action.payload?.inscrito || null;
        state.modalDetalleOpen = true;
      })
      .addCase(fetchInscritoByMatriculaId.rejected, (state, action) => {
        state.isLoadingDetalle = false;
        state.error = action.payload || 'Error al cargar el detalle del curso';
      })

      .addCase(enviarCertificadoPorMatricula.pending, (state) => {
        state.isSendingCertificate = true;
        state.certificateError = null;
        state.certificateSuccess = null;
      })
      .addCase(enviarCertificadoPorMatricula.fulfilled, (state, action) => {
        state.isSendingCertificate = false;
        state.certificateSuccess =
          action.payload?.message || 'Certificado enviado correctamente';
      })
      .addCase(enviarCertificadoPorMatricula.rejected, (state, action) => {
        state.isSendingCertificate = false;
        state.certificateError =
          action.payload || 'No se pudo enviar el certificado';
      })

      .addCase(desinscribirseMismoDia.pending, (state) => {
        state.isUnenrolling = true;
        state.error = null;
      })
      .addCase(desinscribirseMismoDia.fulfilled, (state, action) => {
        state.isUnenrolling = false;

        const idMatricula = Number(action.payload?.id_matricula);

        state.inscritos = (state.inscritos || []).filter(
          (item) => Number(item?.id_matricula) !== idMatricula
        );

        if (
          state.inscritoSeleccionado &&
          Number(state.inscritoSeleccionado?.id_matricula) === idMatricula
        ) {
          state.inscritoSeleccionado = null;
          state.modalDetalleOpen = false;
        }

        state.certificateSuccess =
          action.payload?.msg ||
          'Te desinscribiste correctamente y se generó saldo a tu favor.';

        aplicarFiltros(state);
      })
      .addCase(desinscribirseMismoDia.rejected, (state, action) => {
        state.isUnenrolling = false;
        state.error = action.payload || 'No se pudo realizar la desinscripción';
      });
  },
});

export const {
  clearError,
  clearCertificateError,
  clearCertificateSuccess,
  setFiltroEstado,
  setSearchTerm,
  clearSearchTerm,
  setInscritoSeleccionado,
  clearInscritoSeleccionado,
  openDetalleModal,
  closeDetalleModal,
} = cursosSlice.actions;

export const selectEstudianteCursos = (state) =>
  state.cursosEstudiante?.estudiante || null;

export const selectInscritos = (state) =>
  state.cursosEstudiante?.inscritos || [];

export const selectInscritosFiltrados = (state) =>
  state.cursosEstudiante?.inscritosFiltrados || [];

export const selectMetaInscritos = (state) =>
  state.cursosEstudiante?.meta || null;

export const selectIsLoadingInscritos = (state) =>
  state.cursosEstudiante?.isLoadingInscritos || false;

export const selectIsLoadingDetalle = (state) =>
  state.cursosEstudiante?.isLoadingDetalle || false;

export const selectIsSendingCertificate = (state) =>
  state.cursosEstudiante?.isSendingCertificate || false;

export const selectIsUnenrolling = (state) =>
  state.cursosEstudiante?.isUnenrolling || false;

export const selectError = (state) =>
  state.cursosEstudiante?.error || null;

export const selectCertificateError = (state) =>
  state.cursosEstudiante?.certificateError || null;

export const selectCertificateSuccess = (state) =>
  state.cursosEstudiante?.certificateSuccess || null;

export const selectFiltroEstado = (state) =>
  state.cursosEstudiante?.filtroEstado || 'todos';

export const selectSearchTermCursos = (state) =>
  state.cursosEstudiante?.searchTerm || '';

export const selectInscritoSeleccionado = (state) =>
  state.cursosEstudiante?.inscritoSeleccionado || null;

export const selectModalDetalleOpen = (state) =>
  state.cursosEstudiante?.modalDetalleOpen || false;

export const selectCantidadInscritos = (state) =>
  state.cursosEstudiante?.inscritos?.length || 0;

export const selectCantidadActivos = (state) =>
  (state.cursosEstudiante?.inscritos || []).filter(
    (item) => item?.curso?.estado === 'ACTIVO'
  ).length;

export const selectCantidadConcluidos = (state) =>
  (state.cursosEstudiante?.inscritos || []).filter(
    (item) =>
      item?.curso?.estado === 'FINALIZADO' ||
      item?.curso?.estado === 'CANCELADO'
  ).length;

export const selectCantidadAprobados = (state) =>
  (state.cursosEstudiante?.inscritos || []).filter(
    (item) => item?.materia_notas?.aprobado === true
  ).length;

export const selectCantidadReprobados = (state) =>
  (state.cursosEstudiante?.inscritos || []).filter(
    (item) => item?.materia_notas?.aprobado === false
  ).length;

export const selectCantidadPendientesNota = (state) =>
  (state.cursosEstudiante?.inscritos || []).filter(
    (item) => !item?.materia_notas
  ).length;

export default cursosSlice.reducer;