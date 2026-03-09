import { createAsyncThunk } from '@reduxjs/toolkit';
import { ofertaAcademicaApi, carritoApi } from '../../../lib/api';

const normalizarPrereq = (item) => ({
  id_materia_prereq: item?.id_materia_prereq ?? null,
  materia_id_materia: item?.materia_id_materia ?? null,
  materia_id_materia_prereq: item?.materia_id_materia_prereq ?? null,
  materia_prereq: item?.materia_prereq
    ? {
        id_materia: item.materia_prereq.id_materia ?? null,
        codigo: item.materia_prereq.codigo ?? '',
        nombre: item.materia_prereq.nombre ?? '',
        categoria: item.materia_prereq.categoria ?? '',
        estado: item.materia_prereq.estado ?? null,
      }
    : null,
});

const normalizarCursoOferta = (curso) => ({
  id_curso: curso?.id_curso ?? null,
  periodo: curso?.periodo ?? '',
  cupos: Number(curso?.cupos ?? 0),
  inscritos_actuales: Number(curso?.inscritos_actuales ?? 0),
  cupos_disponibles: Number(curso?.cupos_disponibles ?? 0),
  precio: Number(curso?.precio ?? 0),
  estado: curso?.estado ?? false,
  lecciones: Number(curso?.lecciones ?? 0),
  horas_academicas: Number(curso?.horas_academicas ?? 0),
  hora_inicio: curso?.hora_inicio ?? '',
  hora_fin: curso?.hora_fin ?? '',
  descripcion: curso?.descripcion ?? '',
  aprenderas: curso?.aprenderas ?? '',
  dirigido: curso?.dirigido ?? '',
  contenido: curso?.contenido ?? '',
  dias_de_clases: curso?.dias_de_clases ?? '',

  materia: curso?.materia
    ? {
        id_materia: curso.materia.id_materia ?? null,
        codigo: curso.materia.codigo ?? '',
        nombre: curso.materia.nombre ?? '',
        categoria: curso.materia.categoria ?? '',
        estado: curso.materia.estado ?? null,
      }
    : null,

  docente: curso?.docente
    ? {
        id_docente: curso.docente.id_docente ?? null,
        titulo: curso.docente.titulo ?? '',
        tipo_docente: curso.docente.tipo_docente ?? '',
        estado: curso.docente.estado ?? null,
        usuario: curso.docente.usuario
          ? {
              id_persona: curso.docente.usuario.id_persona ?? null,
              nombres: curso.docente.usuario.nombres ?? '',
              apellido_paterno: curso.docente.usuario.apellido_paterno ?? '',
              apellido_materno: curso.docente.usuario.apellido_materno ?? '',
              mail: curso.docente.usuario.mail ?? '',
            }
          : null,
      }
    : null,

  puede_inscribirse: Boolean(curso?.puede_inscribirse),
  motivo_bloqueo: curso?.motivo_bloqueo ?? null,
  motivos_bloqueo: Array.isArray(curso?.motivos_bloqueo) ? curso.motivos_bloqueo : [],

  ya_aprobada: Boolean(curso?.ya_aprobada),
  reprobada_previamente: Boolean(curso?.reprobada_previamente),
  cursando_actualmente: Boolean(curso?.cursando_actualmente),
  en_carrito_pendiente: Boolean(curso?.en_carrito_pendiente),
  sin_cupos: Boolean(curso?.sin_cupos),
  choque_horario: Boolean(curso?.choque_horario),

  tiene_prerequisitos: Boolean(curso?.tiene_prerequisitos),
  tiene_prerequisitos_pendientes: Boolean(curso?.tiene_prerequisitos_pendientes),
  prerequisitos: Array.isArray(curso?.prerequisitos) ? curso.prerequisitos.map(normalizarPrereq) : [],
  prerequisitos_aprobados: Array.isArray(curso?.prerequisitos_aprobados)
    ? curso.prerequisitos_aprobados.map(normalizarPrereq)
    : [],
  prerequisitos_faltantes: Array.isArray(curso?.prerequisitos_faltantes)
    ? curso.prerequisitos_faltantes.map(normalizarPrereq)
    : [],
});

export const fetchOfertaAcademicaByUsuarioId = createAsyncThunk(
  'ofertaAcademica/fetchOfertaAcademicaByUsuarioId',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue({
          message: 'No se encontró el id del usuario.',
        });
      }

      const res = await ofertaAcademicaApi.fetchOfertaAcademicaByUsuarioId(userId);

      if (!res?.ok) {
        return rejectWithValue({
          message: res?.msg || 'No se pudo cargar la oferta académica.',
        });
      }

      return {
        estudiante: res?.estudiante || null,
        resumen: res?.resumen || null,
        cursos: Array.isArray(res?.cursos) ? res.cursos.map(normalizarCursoOferta) : [],
      };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || 'Error al cargar la oferta académica.',
      });
    }
  }
);

export const addCursoOfertaToCarrito = createAsyncThunk(
  'ofertaAcademica/addCursoOfertaToCarrito',
  async ({ id_usuario, id_curso }, { rejectWithValue }) => {
    try {
      if (!id_usuario || !id_curso) {
        return rejectWithValue({
          message: 'Faltan datos para agregar el curso al carrito.',
        });
      }

      const res = await carritoApi.addItemCarrito({ id_usuario, id_curso });

      if (!res?.ok) {
        return rejectWithValue({
          message: res?.msg || 'No se pudo agregar el curso al carrito.',
        });
      }

      return {
        id_curso,
        message: res?.msg || 'Curso agregado al carrito correctamente.',
        carrito: res?.carrito || null,
      };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || 'Error al agregar el curso al carrito.',
      });
    }
  }
);