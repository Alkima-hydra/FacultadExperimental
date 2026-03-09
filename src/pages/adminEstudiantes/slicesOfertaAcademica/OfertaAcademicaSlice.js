import { createSlice } from '@reduxjs/toolkit';
import {
  fetchOfertaAcademicaByUsuarioId,
  addCursoOfertaToCarrito,
} from './OfertaAcademicaThunk';

const initialState = {
  estudiante: null,
  resumen: null,
  cursos: [],
  cursosFiltrados: [],

  isLoading: false,
  isAdding: false,
  error: null,
  successMessage: null,

  search: '',
  filtroEstado: 'todos',
  filtroDisponibilidad: 'todos',
  filtroCategoria: 'todas',
  filtroPeriodo: 'todos',
  filtroPrerequisitos: 'todos',

  cursoSeleccionado: null,
  modalDetalleOpen: false,
};

const normalize = (txt = '') =>
  String(txt)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const getDocenteNombre = (curso) => {
  const u = curso?.docente?.usuario;
  if (!u) return '';
  return [u.nombres, u.apellido_paterno, u.apellido_materno].filter(Boolean).join(' ');
};

const aplicarFiltros = (state) => {
  let lista = Array.isArray(state.cursos) ? [...state.cursos] : [];

  switch (state.filtroEstado) {
    case 'disponibles':
      lista = lista.filter((c) => c?.puede_inscribirse);
      break;
    case 'bloqueados':
      lista = lista.filter((c) => !c?.puede_inscribirse);
      break;
    case 'aprobadas':
      lista = lista.filter((c) => c?.ya_aprobada);
      break;
    case 'cursando':
      lista = lista.filter((c) => c?.cursando_actualmente);
      break;
    case 'carrito':
      lista = lista.filter((c) => c?.en_carrito_pendiente);
      break;
    case 'reprobadas':
      lista = lista.filter((c) => c?.reprobada_previamente);
      break;
    case 'choque':
      lista = lista.filter((c) => c?.choque_horario);
      break;
    default:
      break;
  }

  switch (state.filtroDisponibilidad) {
    case 'con-cupos':
      lista = lista.filter((c) => !c?.sin_cupos);
      break;
    case 'sin-cupos':
      lista = lista.filter((c) => c?.sin_cupos);
      break;
    default:
      break;
  }

  if (state.filtroCategoria !== 'todas') {
    lista = lista.filter(
      (c) => normalize(c?.materia?.categoria) === normalize(state.filtroCategoria)
    );
  }

  if (state.filtroPeriodo !== 'todos') {
    lista = lista.filter((c) => String(c?.periodo || '') === String(state.filtroPeriodo));
  }

  switch (state.filtroPrerequisitos) {
    case 'con-prerequisitos':
      lista = lista.filter((c) => c?.tiene_prerequisitos);
      break;
    case 'sin-prerequisitos':
      lista = lista.filter((c) => !c?.tiene_prerequisitos);
      break;
    case 'prerequisitos-pendientes':
      lista = lista.filter((c) => c?.tiene_prerequisitos_pendientes);
      break;
    case 'prerequisitos-completos':
      lista = lista.filter((c) => c?.tiene_prerequisitos && !c?.tiene_prerequisitos_pendientes);
      break;
    default:
      break;
  }

  const q = normalize(state.search);
  if (q) {
    lista = lista.filter((c) => {
      const nombreMateria = normalize(c?.materia?.nombre);
      const codigoMateria = normalize(c?.materia?.codigo);
      const categoria = normalize(c?.materia?.categoria);
      const periodo = normalize(c?.periodo);
      const docente = normalize(getDocenteNombre(c));
      const motivos = normalize((c?.motivos_bloqueo || []).join(' '));
      const prereqs = normalize(
        (c?.prerequisitos || [])
          .map((p) => `${p?.materia_prereq?.codigo || ''} ${p?.materia_prereq?.nombre || ''}`)
          .join(' ')
      );

      return (
        nombreMateria.includes(q) ||
        codigoMateria.includes(q) ||
        categoria.includes(q) ||
        periodo.includes(q) ||
        docente.includes(q) ||
        motivos.includes(q) ||
        prereqs.includes(q)
      );
    });
  }

  state.cursosFiltrados = lista;
};

const OfertaAcademicaSlice = createSlice({
  name: 'ofertaAcademica',
  initialState,
  reducers: {
    clearOfertaError(state) {
      state.error = null;
    },
    clearOfertaSuccess(state) {
      state.successMessage = null;
    },
    clearOfertaAcademica(state) {
      state.estudiante = null;
      state.resumen = null;
      state.cursos = [];
      state.cursosFiltrados = [];
      state.isLoading = false;
      state.isAdding = false;
      state.error = null;
      state.successMessage = null;
      state.search = '';
      state.filtroEstado = 'todos';
      state.filtroDisponibilidad = 'todos';
      state.filtroCategoria = 'todas';
      state.filtroPeriodo = 'todos';
      state.filtroPrerequisitos = 'todos';
      state.cursoSeleccionado = null;
      state.modalDetalleOpen = false;
    },

    setOfertaSearch(state, action) {
      state.search = action.payload ?? '';
      aplicarFiltros(state);
    },
    setOfertaFiltroEstado(state, action) {
      state.filtroEstado = action.payload ?? 'todos';
      aplicarFiltros(state);
    },
    setOfertaFiltroDisponibilidad(state, action) {
      state.filtroDisponibilidad = action.payload ?? 'todos';
      aplicarFiltros(state);
    },
    setOfertaFiltroCategoria(state, action) {
      state.filtroCategoria = action.payload ?? 'todas';
      aplicarFiltros(state);
    },
    setOfertaFiltroPeriodo(state, action) {
      state.filtroPeriodo = action.payload ?? 'todos';
      aplicarFiltros(state);
    },
    setOfertaFiltroPrerequisitos(state, action) {
      state.filtroPrerequisitos = action.payload ?? 'todos';
      aplicarFiltros(state);
    },

    clearOfertaFiltros(state) {
      state.search = '';
      state.filtroEstado = 'todos';
      state.filtroDisponibilidad = 'todos';
      state.filtroCategoria = 'todas';
      state.filtroPeriodo = 'todos';
      state.filtroPrerequisitos = 'todos';
      aplicarFiltros(state);
    },

    openOfertaDetalle(state, action) {
      state.cursoSeleccionado = action.payload || null;
      state.modalDetalleOpen = true;
    },
    closeOfertaDetalle(state) {
      state.modalDetalleOpen = false;
      state.cursoSeleccionado = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfertaAcademicaByUsuarioId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOfertaAcademicaByUsuarioId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.estudiante = action.payload?.estudiante || null;
        state.resumen = action.payload?.resumen || null;
        state.cursos = action.payload?.cursos || [];
        aplicarFiltros(state);
      })
      .addCase(fetchOfertaAcademicaByUsuarioId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Error al cargar la oferta académica.';
      })

      .addCase(addCursoOfertaToCarrito.pending, (state) => {
        state.isAdding = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addCursoOfertaToCarrito.fulfilled, (state, action) => {
        state.isAdding = false;
        state.successMessage =
          action.payload?.message || 'Curso agregado al carrito correctamente.';
      })
      .addCase(addCursoOfertaToCarrito.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.payload?.message || 'Error al agregar el curso al carrito.';
      });
  },
});

export const {
  clearOfertaError,
  clearOfertaSuccess,
  clearOfertaAcademica,
  setOfertaSearch,
  setOfertaFiltroEstado,
  setOfertaFiltroDisponibilidad,
  setOfertaFiltroCategoria,
  setOfertaFiltroPeriodo,
  setOfertaFiltroPrerequisitos,
  clearOfertaFiltros,
  openOfertaDetalle,
  closeOfertaDetalle,
} = OfertaAcademicaSlice.actions;

export const selectOfertaEstudiante = (state) => state?.ofertaAcademica?.estudiante ?? null;
export const selectOfertaResumen = (state) => state?.ofertaAcademica?.resumen ?? null;
export const selectOfertaCursos = (state) => state?.ofertaAcademica?.cursos ?? [];
export const selectOfertaCursosFiltrados = (state) => state?.ofertaAcademica?.cursosFiltrados ?? [];

export const selectOfertaLoading = (state) => Boolean(state?.ofertaAcademica?.isLoading);
export const selectOfertaAdding = (state) => Boolean(state?.ofertaAcademica?.isAdding);
export const selectOfertaError = (state) => state?.ofertaAcademica?.error ?? null;
export const selectOfertaSuccess = (state) => state?.ofertaAcademica?.successMessage ?? null;

export const selectOfertaSearch = (state) => state?.ofertaAcademica?.search ?? '';
export const selectOfertaFiltroEstado = (state) => state?.ofertaAcademica?.filtroEstado ?? 'todos';
export const selectOfertaFiltroDisponibilidad = (state) =>
  state?.ofertaAcademica?.filtroDisponibilidad ?? 'todos';
export const selectOfertaFiltroCategoria = (state) =>
  state?.ofertaAcademica?.filtroCategoria ?? 'todas';
export const selectOfertaFiltroPeriodo = (state) => state?.ofertaAcademica?.filtroPeriodo ?? 'todos';
export const selectOfertaFiltroPrerequisitos = (state) =>
  state?.ofertaAcademica?.filtroPrerequisitos ?? 'todos';

export const selectOfertaCursoSeleccionado = (state) =>
  state?.ofertaAcademica?.cursoSeleccionado ?? null;
export const selectOfertaModalOpen = (state) =>
  Boolean(state?.ofertaAcademica?.modalDetalleOpen);

export default OfertaAcademicaSlice.reducer;