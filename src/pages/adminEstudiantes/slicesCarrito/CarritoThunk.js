import { createAsyncThunk } from '@reduxjs/toolkit';
import { carritoApi } from '../../../lib/api';

const normalizarCurso = (curso) => {
  if (!curso) return null;

  return {
    id_curso: curso.id_curso ?? null,
    periodo: curso.periodo ?? '',
    cupos: Number(curso.cupos ?? 0),
    cupos_max: Number(curso.cupos_max ?? 0),
    precio: Number(curso.precio ?? 0),
    estado: curso.estado ?? null,
    lecciones: Number(curso.lecciones ?? 0),
    horas_academicas: Number(curso.horas_academicas ?? 0),
    hora_inicio: curso.hora_inicio ?? '',
    hora_fin: curso.hora_fin ?? '',
    descripcion: curso.descripcion ?? '',
    aprenderas: curso.aprenderas ?? '',
    dirigido: curso.dirigido ?? '',
    contenido: curso.contenido ?? '',
    dias_de_clases: curso.dias_de_clases ?? '',
  };
};

const normalizarMateria = (materia) => {
  if (!materia) return null;

  return {
    id_materia: materia.id_materia ?? null,
    codigo: materia.codigo ?? '',
    nombre: materia.nombre ?? '',
    estado: materia.estado ?? null,
    categoria: materia.categoria ?? '',
  };
};

const normalizarDocente = (docente) => {
  if (!docente) return null;

  return {
    id_docente: docente.id_docente ?? null,
    titulo: docente.titulo ?? '',
    tipo_docente: docente.tipo_docente ?? '',
    estado: docente.estado ?? null,
  };
};

const normalizarUsuarioDocente = (usuario) => {
  if (!usuario) return null;

  return {
    id_persona: usuario.id_persona ?? null,
    nombres: usuario.nombres ?? '',
    apellido_paterno: usuario.apellido_paterno ?? '',
    apellido_materno: usuario.apellido_materno ?? '',
    nombre_completo: usuario.nombre_completo
      ? usuario.nombre_completo
      : [usuario.nombres, usuario.apellido_paterno, usuario.apellido_materno]
          .filter(Boolean)
          .join(' '),
    mail: usuario.mail ?? '',
  };
};

const normalizarCarrito = (payload) => {
  const carrito = payload?.carrito ?? payload;

  if (!carrito) return null;

  return {
    id_compra_total: carrito.id_compra_total ?? null,
    estudiante_id_estudiante: carrito.estudiante_id_estudiante ?? null,
    subtotal_cursos: Number(carrito.subtotal_cursos ?? 0),
    saldo_usado: Number(carrito.saldo_usado ?? 0),
    total: Number(carrito.total ?? 0),
    total_pagado_externo: Number(carrito.total_pagado_externo ?? 0),
    saldo_disponible: Number(carrito.saldo_disponible ?? 0),
    moneda: carrito.moneda || 'BOB',
    estado: carrito.estado || 'PENDIENTE',
    creado_en: carrito.creado_en || null,
    cantidad_items: Number(carrito.cantidad_items ?? 0),
    items: Array.isArray(carrito.items)
      ? carrito.items.map((item) => ({
          id_compra_curso: item.id_compra_curso ?? null,
          compra_total_id_compra_total: item.compra_total_id_compra_total ?? null,
          curso_id_curso: item.curso_id_curso ?? null,
          precio_item: Number(item.precio_item ?? 0),
          curso: normalizarCurso(item.curso),
          materia: normalizarMateria(item.materia),
          docente: normalizarDocente(item.docente),
          usuario_docente: normalizarUsuarioDocente(item.usuario_docente),
        }))
      : [],
  };
};

export const fetchCarritoByUsuarioId = createAsyncThunk(
  'carrito/fetchCarritoByUsuarioId',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue({
          message: 'No se encontró el id del usuario.',
        });
      }

      const res = await carritoApi.fetchCarritoByUsuarioId(userId);

      if (!res?.ok) {
        return rejectWithValue({
          message: res?.msg || 'No se pudo cargar el carrito.',
        });
      }

      return normalizarCarrito(res);
    } catch (error) {
      return rejectWithValue({
        message: error?.message || 'Error al cargar el carrito.',
      });
    }
  }
);

export const addItemCarrito = createAsyncThunk(
  'carrito/addItemCarrito',
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
        carrito: normalizarCarrito(res),
        message: res?.msg || 'Curso agregado correctamente al carrito.',
      };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || 'Error al agregar el curso al carrito.',
      });
    }
  }
);

export const removeItemCarrito = createAsyncThunk(
  'carrito/removeItemCarrito',
  async (idCompraCurso, { rejectWithValue }) => {
    try {
      if (!idCompraCurso) {
        return rejectWithValue({
          message: 'No se encontró el item a eliminar.',
        });
      }

      const res = await carritoApi.removeItemCarrito(idCompraCurso);

      if (!res?.ok) {
        return rejectWithValue({
          message: res?.msg || 'No se pudo eliminar el item del carrito.',
        });
      }

      return {
        id_compra_curso: Number(idCompraCurso),
        carrito: normalizarCarrito(res?.carrito),
        message: res?.msg || 'Item eliminado correctamente.',
      };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || 'Error al eliminar el item.',
      });
    }
  }
);

export const cancelarCarrito = createAsyncThunk(
  'carrito/cancelarCarrito',
  async (idCompraTotal, { rejectWithValue }) => {
    try {
      if (!idCompraTotal) {
        return rejectWithValue({
          message: 'No se encontró el carrito a cancelar.',
        });
      }

      const res = await carritoApi.cancelarCarrito(idCompraTotal);

      if (!res?.ok) {
        return rejectWithValue({
          message: res?.msg || 'No se pudo cancelar el carrito.',
        });
      }

      return {
        id_compra_total: Number(idCompraTotal),
        message: res?.msg || 'Carrito cancelado correctamente.',
      };
    } catch (error) {
      return rejectWithValue({
        message: error?.message || 'Error al cancelar el carrito.',
      });
    }
  }
);