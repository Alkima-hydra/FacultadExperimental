import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiFilter, FiChevronLeft, FiChevronRight, FiX, FiBook, FiUser, FiLayers, FiEye, FiEyeOff, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import { ClipLoader } from "react-spinners";
import Swal from 'sweetalert2';

//para consumo
import {
  fetchEstudiantes,
  fetchAllEstudiantes,
  fetchEstudianteById,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
} from './slicesStudents/StudentsThunk'

import {
  selectIsLoading,
  selectEstudiantes,
  selectAllEstudiantes,
  selectEstudianteseleccionado,
  selectIsCreating,
  selectIsUpdating,
  selectIsDeleting
} from './slicesStudents/StudentsSlice';


// datos iniciales de prueba - en producción, estos vendrían de la API
const MOCK_CARRERAS = [
  { id_carrera: 1, nombre: 'Ingeniería de Sistemas',  sigla: 'SIS' },
  { id_carrera: 2, nombre: 'Ingeniería Civil',        sigla: 'CIV' },
  { id_carrera: 3, nombre: 'Administración',          sigla: 'ADM' },
  { id_carrera: 4, nombre: 'Derecho',                 sigla: 'DER' },
  { id_carrera: 5, nombre: 'Contaduría Pública',      sigla: 'CON' },
];

// CAMBIO: antes teníamos una lista fija de semestres (2024-2026).
// La API puede devolver semestres de otros años (ej: "2023-1" -> UI "1-2023"),
// por eso generamos opciones dinámicamente.
const buildSemestres = (startYear, endYear) => {
  const out = [];
  for (let y = startYear; y <= endYear; y++) {
    out.push(`1-${y}`);
    out.push(`2-${y}`);
  }
  return out;
};

// CAMBIO: helper para ordenar semestres tipo "1-2023" por año y semestre
const sortSemestres = (a, b) => {
  const [sa, ya] = String(a).split('-');
  const [sb, yb] = String(b).split('-');
  const yaN = Number(ya);
  const ybN = Number(yb);
  if (yaN !== ybN) return yaN - ybN;
  return Number(sa) - Number(sb);
};

const INITIAL_STUDENTS_FALLBACK = [
  { id_estudiante: 1, carrera_id: 1, carrera_nombre: 'Ingeniería de Sistemas',  carrera_sigla: 'SIS', semestre: '2-2026', nombre: 'María Fernanda', apellido: 'Quispe',     ci: 9876543, correo: 'maria.quispe@ucb.edu.bo',  direccion: '---', estado: true  }, // CAMBIO: placeholder de dirección (antes teléfono)
  { id_estudiante: 2, carrera_id: 2, carrera_nombre: 'Ingeniería Civil',        carrera_sigla: 'CIV', semestre: '1-2026', nombre: 'José Luis',      apellido: 'Rojas',      ci: 8123456, correo: 'jose.rojas@ucb.edu.bo',    direccion: '---', estado: true  },
  { id_estudiante: 3, carrera_id: 1, carrera_nombre: 'Ingeniería de Sistemas',  carrera_sigla: 'SIS', semestre: '2-2025', nombre: 'Andrea',         apellido: 'Mamani',     ci: 7456123, correo: 'andrea.mamani@ucb.edu.bo', direccion: '---', estado: false },
  { id_estudiante: 4, carrera_id: 4, carrera_nombre: 'Derecho',                 carrera_sigla: 'DER', semestre: '1-2025', nombre: 'Carlos',         apellido: 'Torrez',     ci: 6543210, correo: 'carlos.torrez@ucb.edu.bo', direccion: '---', estado: true  },
  { id_estudiante: 5, carrera_id: 3, carrera_nombre: 'Administración',          carrera_sigla: 'ADM', semestre: '2-2024', nombre: 'Valeria',        apellido: 'Flores',     ci: 9321456, correo: 'valeria.flores@ucb.edu.bo', direccion: '---', estado: true  },
  { id_estudiante: 6, carrera_id: 5, carrera_nombre: 'Contaduría Pública',      carrera_sigla: 'CON', semestre: '1-2024', nombre: 'Diego',          apellido: 'Vargas',     ci: 7012345, correo: 'diego.vargas@ucb.edu.bo',  direccion: '---', estado: true  },
  { id_estudiante: 7, carrera_id: 2, carrera_nombre: 'Ingeniería Civil',        carrera_sigla: 'CIV', semestre: '2-2026', nombre: 'Lucía',          apellido: 'Paredes',    ci: 8899776, correo: 'lucia.paredes@ucb.edu.bo', direccion: '---', estado: false },
];

const PAGE_SIZE = 5;

const emptyForm = {
  carrera: '',
  semestre_ingreso: '',

  // UI (nombre/apellidos)
  nombre: '',
  // Para edición se mantiene este campo (apellido combinado)
  apellido: '',

  // Para creación: apellidos separados (persona)
  apellido_paterno: '',
  apellido_materno: '',

  ci: '',
  correo: '',
  direccion: '', // CAMBIO: en vez de teléfono, usamos dirección (así viene en el GET)

  // Persona/usuario (solo creación)
  genero: '',
  fecha_nacimiento: '', // YYYY-MM-DD
  password: '',

  estado: true,
};


const swalTheme = {
  confirmButtonColor: '#704FE6',
  cancelButtonColor:  '#4D5756',
  customClass: { popup: 'it-cadm-swal-popup' },
};

function StudentsAdmin() {
  const dispatch = useDispatch();

  // Redux state (API)
  const isLoading = useSelector(selectIsLoading);

  // Puede venir como array o como objeto { ok, estudiantes: [...] } según cómo lo guarde el slice
  const rawAllEstudiantes = useSelector(selectAllEstudiantes);
  const rawEstudiantes = useSelector(selectEstudiantes);

  const isUpdating = useSelector(selectIsUpdating);

  // Bloqueo de pantalla mientras carga la lista desde la API
  const isBlocking = Boolean(isLoading);

  // Local state (UI)
  // Mientras conectamos todo el CRUD, usamos un fallback estático.
  // Apenas llega data real desde la API (Redux), reemplazamos este arreglo.
  const [students, setStudents] = useState(INITIAL_STUDENTS_FALLBACK);
  const [search, setSearch] = useState('');
  const [filterPer, setFilterPer] = useState('');
  const [filterEst, setFilterEst] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // CAMBIO: opciones de semestre dinámicas para que el <select> muestre el valor real del estudiante
  const semestreOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const base = buildSemestres(currentYear - 6, currentYear + 1);

    const extras = new Set(
      students
        .map((s) => s?.semestre)
        .filter(Boolean)
    );

    // CAMBIO: si estamos editando y el semestre no está en la lista, lo incluimos igual
    if (form?.semestre) extras.add(form.semestre);

    const merged = Array.from(new Set([...base, ...extras]));
    return merged.sort(sortSemestres);
  }, [students, form?.semestre]);

  // Mapper: API -> UI
  const mapApiEstudianteToUi = (e) => {
    const usuario = e?.usuario || {};
    const apellidoP = usuario?.apellido_paterno || '';
    const apellidoM = usuario?.apellido_materno || '';
    const apellido = `${apellidoP} ${apellidoM}`.trim();

    // "semestre_ingreso" viene como "2023-1" y en UI se usa "1-2023" (semestre-año)
    const semestreIngreso = String(e?.semestre_ingreso || '').trim();
    const semestreUi = semestreIngreso.includes('-')
      ? (() => {
          const [anio, sem] = semestreIngreso.split('-');
          return `${sem}-${anio}`;
        })()
      : semestreIngreso;

    const carreraNombre = e?.carrera || '';
    // CAMBIO: La API devuelve `carrera` como texto. Para que el <select> funcione,
    // convertimos ese texto a un `carrera_id` de nuestro mock.
    const carreraMatch = MOCK_CARRERAS.find(
      (c) => String(c?.nombre || '').toLowerCase() === String(carreraNombre || '').toLowerCase()
    );
    const carreraSigla = carreraNombre
      ? carreraNombre
          .split(' ')
          .filter(Boolean)
          .slice(0, 3)
          .map(w => w[0]?.toUpperCase() || '')
          .join('')
      : '';

    return {
      id_estudiante: e?.id_estudiante,
      carrera_id: carreraMatch?.id_carrera ?? '', // CAMBIO: id derivado para que el select muestre bien
      carrera_nombre: carreraNombre,
      carrera_sigla: carreraSigla,
      semestre: semestreUi,
      nombre: usuario?.nombres || '',
      apellido,
      ci: usuario?.ci ? Number(usuario.ci) : '',
      correo: usuario?.mail || '',
      direccion: e?.direccion || '', // CAMBIO: guardamos dirección para editarla
      estado: Boolean(usuario?.estado),
    };
  };

  // Mapper: UI(form) -> API payload
  const mapUiFormToApiUpdate = (current, formState) => {
    const apellidoTxt = String(formState?.apellido || '').trim();
    const partes = apellidoTxt.split(' ').filter(Boolean);
    const apellido_paterno = partes[0] || '';
    const apellido_materno = partes.slice(1).join(' ') || '';

    // UI usa "1-2026" y API usa "2026-1"
    const semestreUi = String(formState?.semestre || '').trim();
    const semestre_ingreso = semestreUi.includes('-')
      ? (() => {
          const [sem, anio] = semestreUi.split('-');
          return `${anio}-${sem}`;
        })()
      : semestreUi;

    return {
      id_estudiante: current?.id_estudiante,
      carrera_id: Number(formState?.carrera_id),
      semestre_ingreso,
      // CAMBIO: ahora dirección se edita desde el formulario
      direccion: String(formState?.direccion || '').trim(),
      // si tu backend necesita vincular a persona/usuario
      usuarios_id_persona: current?.usuarios_id_persona ?? undefined,
      usuario: {
        id_persona: current?.usuario?.id_persona ?? current?.usuarios_id_persona ?? undefined,
        nombres: String(formState?.nombre || '').trim(),
        apellido_paterno,
        apellido_materno,
        ci: String(formState?.ci || '').trim(),
        mail: String(formState?.correo || '').trim(),
        // telefono: String(formState?.telefono || '').trim(), // CAMBIO: ya no usamos teléfono en el form
        estado: Boolean(formState?.estado),
      },
    };
  };

  // 1) Al montar, pedimos la lista completa
  useEffect(() => {
    dispatch(fetchAllEstudiantes());
  }, [dispatch]);

  // 2) Cuando llegue la data del store, la pasamos a nuestro formato UI
  useEffect(() => {
    // Normalizamos la respuesta del store:
    // - si es array -> lo usamos tal cual
    // - si es objeto { ok, estudiantes } -> usamos estudiantes
    // - si el slice usa otra propiedad -> también probamos rawEstudiantes
    const apiList =
      (Array.isArray(rawAllEstudiantes) ? rawAllEstudiantes : null) ||
      (Array.isArray(rawAllEstudiantes?.estudiantes) ? rawAllEstudiantes.estudiantes : null) ||
      (Array.isArray(rawEstudiantes) ? rawEstudiantes : null) ||
      (Array.isArray(rawEstudiantes?.estudiantes) ? rawEstudiantes.estudiantes : null) ||
      null;

    if (apiList && apiList.length > 0) {
      setStudents(apiList.map(mapApiEstudianteToUi));
    }
    // Nota: si apiList viene vacío, dejamos el fallback estático para no mostrar tabla vacía
  }, [rawAllEstudiantes, rawEstudiantes]);

  const filtered = students.filter(c => {
    const q = search.toLowerCase();
    const matchSearch =
      (c.nombre && c.nombre.toLowerCase().includes(q)) ||
      (c.apellido && c.apellido.toLowerCase().includes(q)) ||
      (c.ci && String(c.ci).includes(q)) ||
      (c.correo && c.correo.toLowerCase().includes(q)) ||
      (c.carrera_nombre && c.carrera_nombre.toLowerCase().includes(q));
    const matchPer = filterPer ? String(c.carrera_id) === String(filterPer) : true;
    const matchEst = filterEst === '' ? true : c.estado === (filterEst === 'activo');
    return matchSearch && matchPer && matchEst;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, filterPer, filterEst]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowPassword(false);
    setShowModal(true);
  };

  const openEdit = (estudiante) => {
    setEditTarget(estudiante);
    const u = estudiante?.usuario || {};
    setForm({
      carrera_id: estudiante.carrera_id,
      semestre: estudiante.semestre || '',
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,

      // campos de creación (no se muestran en edición, pero los dejamos vacíos/según API)
      apellido_paterno: u.apellido_paterno || '',
      apellido_materno: u.apellido_materno || '',
      genero: u.genero || '',
      fecha_nacimiento: u.fecha_nacimiento || '',
      password: '',

      ci: estudiante.ci,
      correo: estudiante.correo,
      direccion: estudiante.direccion || '',
      estado: estudiante.estado,
    });
    setFormErrors({});
    setShowPassword(false);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const validatePasswordBasic = (pwd) => {
    const p = String(pwd || '');
    if (p.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(p)) return 'La contraseña debe incluir al menos 1 mayúscula';
    if (!/[a-z]/.test(p)) return 'La contraseña debe incluir al menos 1 minúscula';
    if (!/\d/.test(p)) return 'La contraseña debe incluir al menos 1 número';
    return '';
  };

  const getPasswordChecks = (pwd) => {
    const p = String(pwd || '');
    return {
      minLen: p.length >= 8,
      hasUpper: /[A-Z]/.test(p),
      hasLower: /[a-z]/.test(p),
      hasNumber: /\d/.test(p),
    };
  };

  const validate = () => {
    const errs = {};

    if (!form.carrera_id) errs.carrera_id = 'Selecciona una carrera';
    if (!form.semestre) errs.semestre = 'Selecciona un semestre';
    if (!form.nombre) errs.nombre = 'Ingresa el nombre';

    // Edición: apellido combinado
    if (editTarget) {
      if (!form.apellido) errs.apellido = 'Ingresa el apellido';
    } else {
      // Creación: apellidos separados + datos persona
      if (!form.apellido_paterno) errs.apellido_paterno = 'Ingresa el apellido paterno';
      if (!form.apellido_materno) errs.apellido_materno = 'Ingresa el apellido materno';
      if (!form.genero) errs.genero = 'Selecciona el género';
      if (!form.fecha_nacimiento) errs.fecha_nacimiento = 'Ingresa la fecha de nacimiento';
      if (!form.password) {
        errs.password = 'Ingresa una contraseña';
      } else {
        const pwdErr = validatePasswordBasic(form.password);
        if (pwdErr) errs.password = pwdErr;
      }
    }

    if (!form.ci || String(form.ci).trim().length === 0) errs.ci = 'Ingresa el CI';
    if (!form.correo) errs.correo = 'Ingresa el correo';
    if (!form.direccion) errs.direccion = 'Ingresa la dirección';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Mapper: UI(form) -> API payload (CREATE)
  const mapUiFormToApiCreate = (formState) => {
    // UI usa "1-2026" y API usa "2026-1"
    const semestreUi = String(formState?.semestre || '').trim();
    const semestre_ingreso = semestreUi.includes('-')
      ? (() => {
          const [sem, anio] = semestreUi.split('-');
          return `${anio}-${sem}`;
        })()
      : semestreUi;

    return {
      carrera: MOCK_CARRERAS.find(c => String(c.id_carrera) === String(formState?.carrera_id))?.nombre || '',
      semestre_ingreso,
      direccion: String(formState?.direccion || '').trim(),
      // datos de usuario para la creación directa mediante la api
        nombres: String(formState?.nombre || '').trim(),
        apellido_paterno: String(formState?.apellido_paterno || '').trim(),
        apellido_materno: String(formState?.apellido_materno || '').trim(),
        ci: String(formState?.ci || '').trim(),
        mail: String(formState?.correo || '').trim(),
        genero: String(formState?.genero || '').trim(),
        fecha_nacimiento: String(formState?.fecha_nacimiento || '').trim(),
        password: String(formState?.password || '').trim(),
        estado: Boolean(formState?.estado),
        admin: false,
    };
  };

  const handleSave = () => {
    if (!validate()) return;

    const carrera = MOCK_CARRERAS.find(x => x.id_carrera === Number(form.carrera_id));
    if (editTarget) {
      Swal.fire({
        title: '¿Guardar cambios?',
        text: `Actualizar al estudiante ${form.nombre} ${form.apellido}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar',
        ...swalTheme,
      }).then(async res => {
        if (res.isConfirmed) {
          try {
            const apiPayload = mapUiFormToApiUpdate(editTarget, form);

            // Nota: asumimos que el thunk recibe un objeto con { id_estudiante, data }
            const action = await dispatch(
              updateEstudiante({
                id_estudiante: editTarget.id_estudiante,
                data: apiPayload,
              })
            );

            if (updateEstudiante.fulfilled && updateEstudiante.fulfilled.match(action)) {
              setShowModal(false);
              // recargar desde API para evitar inconsistencias
              dispatch(fetchAllEstudiantes());
              Swal.fire({
                title: '¡Actualizado!',
                text: 'El estudiante fue actualizado.',
                icon: 'success',
                ...swalTheme,
                showCancelButton: false,
              });
            } else {
              const msg =
                action?.payload?.message ||
                action?.error?.message ||
                'No se pudo actualizar el estudiante.';
              Swal.fire({
                title: 'Error',
                text: msg,
                icon: 'error',
                ...swalTheme,
                showCancelButton: false,
              });
            }
          } catch (e) {
            Swal.fire({
              title: 'Error',
              text: e?.message || 'No se pudo actualizar el estudiante.',
              icon: 'error',
              ...swalTheme,
              showCancelButton: false,
            });
          }
        }
      });
    } else {
      // Cerrar el modal ANTES de mostrar el Swal, para que no quede abierto detrás
      setShowModal(false);

      Swal.fire({
        title: '¿Crear estudiante?',
        text: `Se registrará ${form.nombre} ${form.apellido_paterno} ${form.apellido_materno}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar',
        ...swalTheme,
      }).then(async (res) => {
        // Si canceló, reabrimos el modal con los mismos datos
        if (!res.isConfirmed) {
          setShowModal(true);
          return;
        }

        try {
          const apiPayload = mapUiFormToApiCreate(form);

          // Mostrar loading mientras se crea
          Swal.fire({
            title: 'Creando…',
            text: 'Registrando al estudiante',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
            ...swalTheme,
          });

          const action = await dispatch(createEstudiante(apiPayload));

          if (createEstudiante.fulfilled && createEstudiante.fulfilled.match(action)) {
            dispatch(fetchAllEstudiantes());
            Swal.fire({
              title: '¡Creado!',
              text: 'El estudiante fue registrado.',
              icon: 'success',
              ...swalTheme,
              showCancelButton: false,
            });
          } else {
            const msg =
              action?.payload?.message ||
              action?.error?.message ||
              'No se pudo crear el estudiante.';
            Swal.fire({
              title: 'Error',
              text: msg,
              icon: 'error',
              ...swalTheme,
              showCancelButton: false,
            });
          }
        } catch (e) {
          Swal.fire({
            title: 'Error',
            text: e?.message || 'No se pudo crear el estudiante.',
            icon: 'error',
            ...swalTheme,
            showCancelButton: false,
          });
        }
      });
    }
  };

  const handleDelete = (estudiante) => {
    Swal.fire({
      title: '¿Eliminar estudiante?',
      html: `<span style="color:#4D5756">Se eliminará <strong>${estudiante.nombre} ${estudiante.apellido}</strong> (${estudiante.carrera_sigla}). Esta acción no se puede deshacer.</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      ...swalTheme,
      confirmButtonColor: '#FE543D',
    }).then(res => {
      if (res.isConfirmed) {
        setStudents(prev => prev.filter(s => s.id_estudiante !== estudiante.id_estudiante));
        Swal.fire({ title: 'Eliminado', text: 'El estudiante fue eliminado.', icon: 'success', ...swalTheme, showCancelButton: false });
      }
    });
  };

  const handleToggleEstado = (estudiante) => {
    const accion = estudiante.estado ? 'desactivar' : 'activar';
    Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} estudiante?`,
      text: `El estudiante ${estudiante.nombre} ${estudiante.apellido} será ${accion === 'activar' ? 'habilitado' : 'deshabilitado'}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
      ...swalTheme,
    }).then(res => {
      if (res.isConfirmed) {
        setStudents(prev =>
          prev.map(s => s.id_estudiante === estudiante.id_estudiante ? { ...s, estado: !s.estado } : s)
        );
      }
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const clearFilters = () => { setFilterPer(''); setFilterEst(''); setSearch(''); };

  return (
    <div className="it-cadm" style={{ position: 'relative' }}>
      {/* Contenido */}
      <div
        style={
          isBlocking
            ? { filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' }
            : undefined
        }
        aria-hidden={isBlocking}
      >
      <div className="it-cadm-header">
        <div className="it-cadm-header__left">
          <div>
            <h2 className="it-cadm-header__title">Gestión de Estudiantes</h2>
            <p className="it-cadm-header__sub">
              {filtered.length} estudiante{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button className="it-cadm-btn-create" onClick={openCreate}>
          <FiPlus /> <span>Nuevo estudiante</span>
        </button>
      </div>

      <div className="it-cadm-toolbar">
        <div className="it-cadm-search">
          <FiSearch className="it-cadm-search__icon" />
          <input
            type="text"
            className="it-cadm-search__input"
            placeholder="Buscar por nombre, CI o correo…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="it-cadm-search__clear" onClick={() => setSearch('')}><FiX /></button>
          )}
        </div>

        <button
          className={`it-cadm-filter-toggle${filterOpen ? ' active' : ''}`}
          onClick={() => setFilterOpen(o => !o)}
        >
          <FiFilter /> <span>Filtros</span>
          {(filterPer || filterEst !== '') && <span className="it-cadm-filter-toggle__dot" />}
        </button>
      </div>

      {filterOpen && (
        <div className="it-cadm-filters">
          <div className="it-cadm-filters__group">
            <label className="it-cadm-filters__label">Carrera</label>
            <select className="it-cadm-filters__select" value={filterPer} onChange={e => setFilterPer(e.target.value)}>
              <option value="">Todas</option>
              {MOCK_CARRERAS.map(c => (
                <option key={c.id_carrera} value={c.id_carrera}>
                  [{c.sigla}] {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="it-cadm-filters__group">
            <label className="it-cadm-filters__label">Estado</label>
            <select className="it-cadm-filters__select" value={filterEst} onChange={e => setFilterEst(e.target.value)}>
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <button className="it-cadm-filters__clear" onClick={clearFilters}>
            <FiX /> Limpiar
          </button>
        </div>
      )}

      <div className="it-cadm-table-wrap">
        <div className="it-cadm-table-scroll">
          <table className="it-cadm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Estudiante</th>
                <th>Carrera</th>
                <th>Semestre</th>
                <th>CI</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="it-cadm-table__empty">
                    <ClipLoader size={28} />
                    <p style={{ marginTop: 10 }}>Cargando estudiantes…</p>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="it-cadm-table__empty">
                    <FiUser style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }} />
                    <p>No se encontraron estudiantes</p>
                  </td>
                </tr>
              ) : paginated.map((c, idx) => (
                <tr key={c.id_estudiante} className="it-cadm-table__row">
                  <td className="it-cadm-table__num">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td>
                    <div className="it-cadm-table__materia">
                      <span className="it-cadm-table__codigo">{c.carrera_sigla}</span>
                      <span className="it-cadm-table__nombre">{c.nombre} {c.apellido}</span>
                    </div>
                  </td>
                  <td>
                    <div className="it-cadm-table__docente">
                      <span className="it-cadm-table__docente-avatar">
                        {c.nombre?.charAt(0)}
                      </span>
                      <span>{c.correo}</span>
                    </div>
                  </td>
                  <td><span className="it-cadm-table__periodo">{c.semestre || ''}</span></td>
                  <td className="it-cadm-table__cupos">{c.ci}</td>
                  <td className="it-cadm-table__precio"> {c.correo}</td>
                  <td>
                    <button
                      className={`it-cadm-badge${c.estado ? ' it-cadm-badge--active' : ' it-cadm-badge--inactive'}`}
                      onClick={() => handleToggleEstado(c)}
                      title="Click para cambiar estado"
                    >
                      {c.estado ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td>
                    <div className="it-cadm-table__actions">
                      <button className="it-cadm-action-btn it-cadm-action-btn--edit" onClick={() => openEdit(c)} title="Editar">
                        <FiEdit2 />
                      </button>
                      <button className="it-cadm-action-btn it-cadm-action-btn--delete" onClick={() => handleDelete(c)} title="Eliminar">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="it-cadm-pagination">
          <span className="it-cadm-pagination__info">
            Página {page} de {totalPages}
          </span>
          <div className="it-cadm-pagination__btns">
            <button
              className="it-cadm-pagination__btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <FiChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`it-cadm-pagination__btn${n === page ? ' active' : ''}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="it-cadm-pagination__btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="it-cadm-modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="it-cadm-modal">
            <div className="it-cadm-modal__header">
              <div className="it-cadm-modal__header-left">
                <div className="it-cadm-modal__header-icon">
                  <FiUser />
                </div>
                <h3 className="it-cadm-modal__title">
                  {editTarget ? 'Editar estudiante' : 'Nuevo estudiante'}
                </h3>
              </div>
              <button className="it-cadm-modal__close" onClick={closeModal}>
                <FiX />
              </button>
            </div>

            <div className="it-cadm-modal__body">
              <div className="it-cadm-field">
                <label className="it-cadm-field__label">
                  <FiLayers /> Carrera <span>*</span>
                </label>
                <select
                  name="carrera_id"
                  className={`it-cadm-field__input${formErrors.carrera_id ? ' error' : ''}`}
                  value={form.carrera_id}
                  onChange={handleFormChange}
                >
                  <option value="">Seleccionar carrera</option>
                  {MOCK_CARRERAS.map(c => (
                    <option key={c.id_carrera} value={c.id_carrera}>
                      [{c.sigla}] {c.nombre}
                    </option>
                  ))}
                </select>
                {formErrors.carrera_id && <span className="it-cadm-field__error">{formErrors.carrera_id}</span>}
              </div>

              <div className="it-cadm-field">
                <label className="it-cadm-field__label">
                  <MdOutlineSchool /> Semestre <span>*</span>
                </label>
                <select
                  name="semestre"
                  className={`it-cadm-field__input${formErrors.semestre ? ' error' : ''}`}
                  value={form.semestre}
                  onChange={handleFormChange}
                >
                  <option value="">Seleccionar semestre</option>
                  {/* CAMBIO: opciones de semestre dinámicas */}
                  {semestreOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {formErrors.semestre && <span className="it-cadm-field__error">{formErrors.semestre}</span>}
              </div>

              <div className="it-cadm-field">
                <label className="it-cadm-field__label">
                  <FiUser /> Nombre y apellido <span>*</span>
                </label>
                <div className="it-cadm-field-row">
                  <div className="it-cadm-field">
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Ej. María"
                      className={`it-cadm-field__input${formErrors.nombre ? ' error' : ''}`}
                      value={form.nombre}
                      onChange={handleFormChange}
                    />
                    {formErrors.nombre && <span className="it-cadm-field__error">{formErrors.nombre}</span>}
                  </div>
                  {editTarget ? (
                    <div className="it-cadm-field">
                      <input
                        type="text"
                        name="apellido"
                        placeholder="Ej. Quispe"
                        className={`it-cadm-field__input${formErrors.apellido ? ' error' : ''}`}
                        value={form.apellido}
                        onChange={handleFormChange}
                      />
                      {formErrors.apellido && <span className="it-cadm-field__error">{formErrors.apellido}</span>}
                    </div>
                  ) : (
                    <>
                      <div className="it-cadm-field">
                        <input
                          type="text"
                          name="apellido_paterno"
                          placeholder="Apellido paterno"
                          className={`it-cadm-field__input${formErrors.apellido_paterno ? ' error' : ''}`}
                          value={form.apellido_paterno}
                          onChange={handleFormChange}
                        />
                        {formErrors.apellido_paterno && (
                          <span className="it-cadm-field__error">{formErrors.apellido_paterno}</span>
                        )}
                      </div>
                      <div className="it-cadm-field">
                        <input
                          type="text"
                          name="apellido_materno"
                          placeholder="Apellido materno"
                          className={`it-cadm-field__input${formErrors.apellido_materno ? ' error' : ''}`}
                          value={form.apellido_materno}
                          onChange={handleFormChange}
                        />
                        {formErrors.apellido_materno && (
                          <span className="it-cadm-field__error">{formErrors.apellido_materno}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="it-cadm-field-row">
                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">
                    CI <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="ci"
                    placeholder="Ej. 8461662 / 8461662LP"
                    autoComplete="off"
                    className={`it-cadm-field__input${formErrors.ci ? ' error' : ''}`}
                    value={form.ci}
                    onChange={(e) => {
                      const v = e.target.value;
                      // Permitimos letras/números y algunos separadores comunes (.-/ y espacios)
                      const cleaned = v.replace(/[^a-zA-Z0-9.\-\/\s]/g, '');
                      setForm((prev) => ({ ...prev, ci: cleaned }));
                      if (formErrors.ci) setFormErrors((prev) => ({ ...prev, ci: '' }));
                    }}
                  />
                  {formErrors.ci && <span className="it-cadm-field__error">{formErrors.ci}</span>}
                </div>
                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">
                    Dirección <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    placeholder="Ej. Sur"
                    className={`it-cadm-field__input${formErrors.direccion ? ' error' : ''}`}
                    value={form.direccion}
                    onChange={handleFormChange}
                  />
                  {formErrors.direccion && <span className="it-cadm-field__error">{formErrors.direccion}</span>}
                </div>
              </div>

              <div className="it-cadm-field">
                <label className="it-cadm-field__label">
                  <FiSearch /> Correo <span>*</span>
                </label>
                <input
                  type="email"
                  name="correo"
                  placeholder="Ej. correo@ucb.edu.bo"
                  className={`it-cadm-field__input${formErrors.correo ? ' error' : ''}`}
                  value={form.correo}
                  onChange={handleFormChange}
                />
                {formErrors.correo && <span className="it-cadm-field__error">{formErrors.correo}</span>}
              </div>

              {!editTarget && (
                <>
                  <div className="it-cadm-field-row">
                    <div className="it-cadm-field">
                      <label className="it-cadm-field__label">
                        Género <span>*</span>
                      </label>
                      <select
                        name="genero"
                        className={`it-cadm-field__input${formErrors.genero ? ' error' : ''}`}
                        value={form.genero}
                        onChange={handleFormChange}
                      >
                        <option value="">Seleccionar</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Otro">Otro</option>
                      </select>
                      {formErrors.genero && <span className="it-cadm-field__error">{formErrors.genero}</span>}
                    </div>

                    <div className="it-cadm-field">
                      <label className="it-cadm-field__label">
                        Fecha de nacimiento <span>*</span>
                      </label>
                      <input
                        type="date"
                        name="fecha_nacimiento"
                        className={`it-cadm-field__input${formErrors.fecha_nacimiento ? ' error' : ''}`}
                        value={form.fecha_nacimiento}
                        onChange={handleFormChange}
                      />
                      {formErrors.fecha_nacimiento && (
                        <span className="it-cadm-field__error">{formErrors.fecha_nacimiento}</span>
                      )}
                    </div>
                  </div>

                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label">
                      Contraseña <span>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="••••••••"
                        className={`it-cadm-field__input${formErrors.password ? ' error' : ''}`}
                        value={form.password}
                        onChange={handleFormChange}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.75,
                        }}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {(() => {
                      const checks = getPasswordChecks(form.password);
                      const Item = ({ ok, text }) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, opacity: ok ? 0.9 : 0.7 }}>
                          {ok ? <FiCheckCircle /> : <FiXCircle />}
                          <span>{text}</span>
                        </div>
                      );

                      return (
                        <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
                          <Item ok={checks.minLen} text="Mínimo 8 caracteres" />
                          <Item ok={checks.hasUpper} text="Al menos 1 mayúscula" />
                          <Item ok={checks.hasLower} text="Al menos 1 minúscula" />
                          <Item ok={checks.hasNumber} text="Al menos 1 número" />
                        </div>
                      );
                    })()}

                    {formErrors.password && (
                      <span className="it-cadm-field__error">{formErrors.password}</span>
                    )}
                  </div>
                </>
              )}

              <div className="it-cadm-field it-cadm-field--check">
                <label className="it-cadm-toggle">
                  <input
                    type="checkbox"
                    name="estado"
                    checked={form.estado}
                    onChange={handleFormChange}
                  />
                  <span className="it-cadm-toggle__track" />
                  <span className="it-cadm-toggle__label">
                    Estudiante {form.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </label>
              </div>
            </div>

            <div className="it-cadm-modal__footer">
              <button className="it-cadm-modal__btn-cancel" onClick={closeModal}>
                Cancelar
              </button>
              <button
                className="it-cadm-modal__btn-save"
                onClick={handleSave}
                disabled={isUpdating}
                title={isUpdating ? 'Actualizando…' : undefined}
              >
                {isUpdating ? 'Actualizando…' : editTarget ? 'Guardar cambios' : 'Crear estudiante'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Overlay bloqueante */}
      {isBlocking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <ClipLoader size={44} />
            <p style={{ margin: 0, color: '#4D5756', fontWeight: 600 }}>
              Cargando estudiantes…
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
export default StudentsAdmin;