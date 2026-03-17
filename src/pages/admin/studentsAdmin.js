import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiUser,
  FiLayers,
} from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';

import {
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
  buscarEstudiantes,
} from './slicesStudents/StudentsThunk';

import {
  selectEstudiantes,
  selectTotalItems,
  selectTotalPages,
  selectIsLoading,
  selectIsSearching,
  selectIsCreating,
  selectIsUpdating,
  selectIsDeleting,
} from './slicesStudents/StudentsSlice';

const MOCK_CARRERAS = [
  { id_carrera: 1, nombre: 'Ingeniería de Sistemas', sigla: 'SIS' },
  { id_carrera: 2, nombre: 'Ingeniería Civil', sigla: 'CIV' },
  { id_carrera: 3, nombre: 'Administración', sigla: 'ADM' },
  { id_carrera: 4, nombre: 'Derecho', sigla: 'DER' },
  { id_carrera: 5, nombre: 'Contaduría Pública', sigla: 'CON' },
];

const buildSemestres = (startYear, endYear) => {
  const out = [];
  for (let y = startYear; y <= endYear; y++) {
    out.push(`1-${y}`);
    out.push(`2-${y}`);
  }
  return out;
};

const sortSemestres = (a, b) => {
  const [sa, ya] = String(a).split('-');
  const [sb, yb] = String(b).split('-');
  const yaN = Number(ya);
  const ybN = Number(yb);
  if (yaN !== ybN) return yaN - ybN;
  return Number(sa) - Number(sb);
};

const PAGE_SIZE = 5;

const emptyForm = {
  carrera_id: '',
  semestre: '',
  nombre: '',
  apellido: '',
  apellido_paterno: '',
  apellido_materno: '',
  ci: '',
  correo: '',
  direccion: '',
  genero: '',
  fecha_nacimiento: '',
  estado: true,
};

const swalTheme = {
  confirmButtonColor: '#704FE6',
  cancelButtonColor: '#4D5756',
  customClass: { popup: 'it-cadm-swal-popup' },
};

function StudentsAdmin() {
  const dispatch = useDispatch();

  const estudiantesApi = useSelector(selectEstudiantes);
  const totalItems = useSelector(selectTotalItems);
  const totalPages = useSelector(selectTotalPages);
  const isLoading = useSelector(selectIsLoading);
  const isSearching = useSelector(selectIsSearching);
  const isCreating = useSelector(selectIsCreating);
  const isUpdating = useSelector(selectIsUpdating);
  const isDeleting = useSelector(selectIsDeleting);

  const isBlocking = Boolean(isLoading);
  const isBusy = isSearching || isLoading;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterPer, setFilterPer] = useState('');
  const [filterEst, setFilterEst] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  const semestreOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const base = buildSemestres(currentYear - 6, currentYear + 1);
    const extras = new Set(estudiantesApi.map((s) => s?.semestre).filter(Boolean));
    if (form?.semestre) extras.add(form.semestre);
    return Array.from(new Set([...base, ...extras])).sort(sortSemestres);
  }, [estudiantesApi, form?.semestre]);

  const mapApiEstudianteToUi = (e) => {
    const usuario = e?.usuario || {};
    const apellidoP = usuario?.apellido_paterno || '';
    const apellidoM = usuario?.apellido_materno || '';
    const apellido = `${apellidoP} ${apellidoM}`.trim();

    const semestreIngreso = String(e?.semestre_ingreso || '').trim();
    const semestreUi = semestreIngreso.includes('-')
      ? (() => {
          const [anio, sem] = semestreIngreso.split('-');
          return `${sem}-${anio}`;
        })()
      : semestreIngreso;

    const carreraNombre = e?.carrera || '';
    const carreraMatch = MOCK_CARRERAS.find(
      (c) => String(c?.nombre || '').toLowerCase() === String(carreraNombre || '').toLowerCase()
    );

    const carreraSigla = carreraNombre
      ? carreraNombre
          .split(' ')
          .filter(Boolean)
          .slice(0, 3)
          .map((w) => w[0]?.toUpperCase() || '')
          .join('')
      : '';

    return {
      id_estudiante: e?.id_estudiante,
      usuarios_id_persona: e?.usuarios_id_persona,
      usuario,
      carrera_id: carreraMatch?.id_carrera ?? '',
      carrera_nombre: carreraNombre,
      carrera_sigla: carreraSigla,
      semestre: semestreUi,
      nombre: usuario?.nombres || '',
      apellido,
      ci: usuario?.ci || '',
      correo: usuario?.mail || '',
      direccion: e?.direccion || '',
      estado: Boolean(e?.estado),
    };
  };

  const students = useMemo(() => estudiantesApi.map(mapApiEstudianteToUi), [estudiantesApi]);

  const cargarEstudiantes = (params = {}) => {
    dispatch(
      buscarEstudiantes({
        page: params.page ?? page,
        limit: PAGE_SIZE,
        ...(params.q !== undefined && params.q !== '' && { q: params.q }),
        ...(params.carrera !== undefined && params.carrera !== '' && { carrera: params.carrera }),
        ...(params.estado !== undefined && params.estado !== '' && { estado: params.estado }),
      })
    );
  };

  useEffect(() => {
    cargarEstudiantes({ page: 1 });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const carreraNombre = filterPer
        ? MOCK_CARRERAS.find((c) => String(c.id_carrera) === String(filterPer))?.nombre
        : undefined;

      cargarEstudiantes({
        page,
        q: search || undefined,
        carrera: carreraNombre,
        estado: filterEst !== '' ? (filterEst === 'activo' ? 'true' : 'false') : undefined,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [search, filterPer, filterEst, page]);

  useEffect(() => {
    setPage(1);
  }, [search, filterPer, filterEst]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (estudiante) => {
    const u = estudiante?.usuario || {};

    setEditTarget(estudiante);
    setForm({
      carrera_id: estudiante.carrera_id,
      semestre: estudiante.semestre || '',
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      apellido_paterno: u.apellido_paterno || '',
      apellido_materno: u.apellido_materno || '',
      genero: u.genero || '',
      fecha_nacimiento: u.fecha_nacimiento || '',
      ci: estudiante.ci,
      correo: estudiante.correo,
      direccion: estudiante.direccion || '',
      estado: Boolean(estudiante.estado),
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const validate = () => {
    const errs = {};

    if (!form.carrera_id) errs.carrera_id = 'Selecciona una carrera';
    if (!form.semestre) errs.semestre = 'Selecciona un semestre';
    if (!form.nombre) errs.nombre = 'Ingresa el nombre';

    if (editTarget) {
      if (!form.apellido) errs.apellido = 'Ingresa el apellido';
    } else {
      if (!form.apellido_paterno) errs.apellido_paterno = 'Ingresa el apellido paterno';
      if (!form.apellido_materno) errs.apellido_materno = 'Ingresa el apellido materno';
      if (!form.genero) errs.genero = 'Selecciona el género';
      if (!form.fecha_nacimiento) errs.fecha_nacimiento = 'Ingresa la fecha de nacimiento';
    }

    if (!form.ci || String(form.ci).trim().length === 0) errs.ci = 'Ingresa el CI';
    if (!form.correo) errs.correo = 'Ingresa el correo';
    if (!form.direccion) errs.direccion = 'Ingresa la dirección';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const mapUiFormToApiUpdate = (current, formState) => {
    const apellidoTxt = String(formState?.apellido || '').trim();
    const partes = apellidoTxt.split(' ').filter(Boolean);
    const apellido_paterno = partes[0] || '';
    const apellido_materno = partes.slice(1).join(' ') || '';

    const semestreUi = String(formState?.semestre || '').trim();
    const semestre_ingreso = semestreUi.includes('-')
      ? (() => {
          const [sem, anio] = semestreUi.split('-');
          return `${anio}-${sem}`;
        })()
      : semestreUi;

    return {
      carrera:
        MOCK_CARRERAS.find((c) => String(c.id_carrera) === String(formState?.carrera_id))
          ?.nombre || '',
      semestre_ingreso,
      direccion: String(formState?.direccion || '').trim(),
      estado: Boolean(formState?.estado),
      nombres: String(formState?.nombre || '').trim(),
      apellido_paterno,
      apellido_materno,
      ci: String(formState?.ci || '').trim(),
      mail: String(formState?.correo || '').trim(),
    };
  };

  const mapUiFormToApiCreate = (formState) => {
    const semestreUi = String(formState?.semestre || '').trim();
    const semestre_ingreso = semestreUi.includes('-')
      ? (() => {
          const [sem, anio] = semestreUi.split('-');
          return `${anio}-${sem}`;
        })()
      : semestreUi;

    return {
      carrera:
        MOCK_CARRERAS.find((c) => String(c.id_carrera) === String(formState?.carrera_id))
          ?.nombre || '',
      semestre_ingreso,
      direccion: String(formState?.direccion || '').trim(),
      nombres: String(formState?.nombre || '').trim(),
      apellido_paterno: String(formState?.apellido_paterno || '').trim(),
      apellido_materno: String(formState?.apellido_materno || '').trim(),
      ci: String(formState?.ci || '').trim(),
      mail: String(formState?.correo || '').trim(),
      genero: String(formState?.genero || '').trim(),
      fecha_nacimiento: String(formState?.fecha_nacimiento || '').trim(),
      estado: Boolean(formState?.estado),
      admin: false,
    };
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editTarget) {
      Swal.fire({
        title: '¿Guardar cambios?',
        text: `Actualizar al estudiante ${form.nombre} ${form.apellido}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar',
        ...swalTheme,
      }).then(async (res) => {
        if (res.isConfirmed) {
          try {
            const apiPayload = mapUiFormToApiUpdate(editTarget, form);
            const action = await dispatch(
              updateEstudiante({
                id: editTarget.id_estudiante,
                data: apiPayload,
              })
            );

            if (updateEstudiante.fulfilled.match(action)) {
              setShowModal(false);
              cargarEstudiantes({ page });
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
                action?.payload?.msg ||
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
      setShowModal(false);

      Swal.fire({
        title: '¿Crear cuenta del estudiante?',
        text: `Se registrará ${form.nombre} ${form.apellido_paterno} ${form.apellido_materno}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar',
        ...swalTheme,
      }).then(async (res) => {
        if (!res.isConfirmed) {
          setShowModal(true);
          return;
        }

        try {
          const apiPayload = mapUiFormToApiCreate(form);

          Swal.fire({
            title: 'Creando…',
            text: 'Registrando al estudiante y enviando credenciales',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
            ...swalTheme,
          });

          const action = await dispatch(createEstudiante(apiPayload));

          if (createEstudiante.fulfilled.match(action)) {
            cargarEstudiantes({ page: 1 });
            Swal.fire({
              title: 'Cuenta creada',
              text: 'La cuenta del estudiante fue creada y las credenciales fueron enviadas al correo.',
              icon: 'success',
              ...swalTheme,
              showCancelButton: false,
            });
          } else {
            const msg =
              action?.payload?.message ||
              action?.payload?.msg ||
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
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const action = await dispatch(deleteEstudiante(estudiante.id_estudiante));

          if (deleteEstudiante.fulfilled.match(action)) {
            const nuevaPagina = students.length === 1 && page > 1 ? page - 1 : page;
            if (nuevaPagina !== page) setPage(nuevaPagina);
            cargarEstudiantes({ page: nuevaPagina });

            Swal.fire({
              title: 'Eliminado',
              text: 'El estudiante fue eliminado.',
              icon: 'success',
              ...swalTheme,
              showCancelButton: false,
            });
          } else {
            const msg =
              action?.payload?.message ||
              action?.payload?.msg ||
              action?.error?.message ||
              'No se pudo eliminar el estudiante.';

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
            text: e?.message || 'No se pudo eliminar el estudiante.',
            icon: 'error',
            ...swalTheme,
            showCancelButton: false,
          });
        }
      }
    });
  };

  const handleToggleEstado = (estudiante) => {
    const accion = estudiante.estado ? 'desactivar' : 'activar';

    Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} estudiante?`,
      text: `El estudiante ${estudiante.nombre} ${estudiante.apellido} será ${
        accion === 'activar' ? 'habilitado' : 'deshabilitado'
      }.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
      ...swalTheme,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const action = await dispatch(
            updateEstudiante({
              id: estudiante.id_estudiante,
              data: { estado: !estudiante.estado },
            })
          );

          if (updateEstudiante.fulfilled.match(action)) {
            cargarEstudiantes({ page });
          }
        } catch (e) {
          console.error('[StudentsAdmin] Error cambiando estado:', e);
        }
      }
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const clearFilters = () => {
    setFilterPer('');
    setFilterEst('');
    setSearch('');
  };

  return (
    <div className="it-cadm" style={{ position: 'relative' }}>
      <style>{`
        .it-cadm {
          padding: 14px 18px 20px;
          background: transparent;
        }

        .it-cadm-shell {
          background: #ffffff;
          border: 1px solid #e7edf5;
          border-radius: 22px;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
          overflow: hidden;
        }

        .it-cadm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          border-bottom: 1px solid #eef2f7;
          background: #ffffff;
        }

        .it-cadm-header__sub {
          margin: 0;
          font-size: 14px;
          color: #667085;
          font-weight: 700;
        }

        .it-cadm-btn-create {
          border: none;
          background: linear-gradient(135deg, #7c5cff 0%, #6d5dfd 100%);
          color: #fff;
          border-radius: 16px;
          padding: 13px 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 14px 26px rgba(109, 93, 253, 0.22);
          flex-shrink: 0;
        }

        .it-cadm-toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 16px 20px;
          background: #ffffff;
        }

        .it-cadm-search {
          position: relative;
          flex: 1;
        }

        .it-cadm-search__icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #7b8794;
          font-size: 17px;
        }

        .it-cadm-search__input {
          width: 100%;
          height: 48px;
          border: 1px solid #dfe6f0;
          border-radius: 14px;
          padding: 0 42px 0 42px;
          font-size: 14px;
          font-weight: 600;
          color: #24364b;
          outline: none;
          background: #fbfcfe;
        }

        .it-cadm-search__input:focus {
          border-color: #8f7bff;
          box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.10);
          background: #fff;
        }

        .it-cadm-search__clear {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #7b8794;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .it-cadm-filter-toggle {
          height: 48px;
          border: 1px solid #dfe6f0;
          background: #fbfcfe;
          color: #24364b;
          border-radius: 14px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          position: relative;
        }

        .it-cadm-filter-toggle.active {
          border-color: #8f7bff;
          background: #f7f4ff;
          color: #5b48dc;
        }

        .it-cadm-filter-toggle__dot {
          width: 8px;
          height: 8px;
          background: #7c5cff;
          border-radius: 50%;
        }

        .it-cadm-filters {
          display: flex;
          gap: 14px;
          align-items: end;
          flex-wrap: wrap;
          padding: 0 20px 18px;
          background: #ffffff;
          border-bottom: 1px solid #eef2f7;
        }

        .it-cadm-filters__group {
          min-width: 220px;
          flex: 1;
        }

        .it-cadm-filters__label {
          display: block;
          margin-bottom: 7px;
          font-size: 12px;
          font-weight: 800;
          color: #5f6b7a;
        }

        .it-cadm-filters__select {
          width: 100%;
          height: 44px;
          border: 1px solid #dfe6f0;
          border-radius: 12px;
          padding: 0 12px;
          background: #fbfcfe;
          font-size: 14px;
          font-weight: 600;
          color: #24364b;
          outline: none;
        }

        .it-cadm-filters__clear {
          height: 44px;
          border: 1px solid #e5e7eb;
          background: #fff;
          color: #4d5756;
          border-radius: 12px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-weight: 800;
          cursor: pointer;
        }

        .it-cadm-table-wrap {
          background: #ffffff;
        }

        .it-cadm-table-scroll {
          overflow-x: auto;
        }

        .it-cadm-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 980px;
        }

        .it-cadm-table thead th {
          text-align: left;
          font-size: 12px;
          letter-spacing: .04em;
          text-transform: uppercase;
          color: #5f6b7a;
          font-weight: 900;
          background: #f8fafc;
          padding: 16px 18px;
          border-top: 1px solid #eef2f7;
          border-bottom: 1px solid #eef2f7;
        }

        .it-cadm-table tbody td {
          padding: 16px 18px;
          border-bottom: 1px solid #eef2f7;
          vertical-align: middle;
          font-size: 14px;
          color: #1f2937;
          font-weight: 600;
        }

        .it-cadm-table__row:hover {
          background: #fbfcff;
        }

        .it-cadm-table__num {
          font-weight: 800;
          color: #475467;
          width: 56px;
        }

        .it-cadm-table__materia {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .it-cadm-table__codigo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: fit-content;
          min-width: 34px;
          height: 34px;
          padding: 0 10px;
          border-radius: 10px;
          background: #f1edff;
          color: #6b4ff7;
          font-weight: 900;
          font-size: 12px;
        }

        .it-cadm-table__nombre {
          font-size: 14px;
          font-weight: 800;
          color: #14253d;
          line-height: 1.35;
        }

        .it-cadm-table__docente {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .it-cadm-table__docente-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #34d399 0%, #2dd4bf 100%);
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .it-cadm-table__periodo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          border-radius: 999px;
          background: #f2f4f7;
          color: #344054;
          font-size: 13px;
          font-weight: 800;
        }

        .it-cadm-table__cupos,
        .it-cadm-table__precio {
          color: #10233f;
          font-weight: 800;
        }

        .it-cadm-badge {
          border: none;
          border-radius: 999px;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
        }

        .it-cadm-badge--active {
          background: #e7f8f0;
          color: #16a36d;
        }

        .it-cadm-badge--inactive {
          background: #fef0f0;
          color: #e24b4b;
        }

        .it-cadm-table__actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .it-cadm-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid #e4e7ec;
          background: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 15px;
        }

        .it-cadm-action-btn--edit {
          color: #7c5cff;
        }

        .it-cadm-action-btn--delete {
          color: #fe543d;
        }

        .it-cadm-action-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .it-cadm-table__empty {
          text-align: center;
          padding: 42px 20px !important;
          color: #6b7280 !important;
          font-weight: 700;
        }

        .it-cadm-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 16px 20px 18px;
          background: #ffffff;
        }

        .it-cadm-pagination__info {
          font-size: 13px;
          color: #667085;
          font-weight: 700;
        }

        .it-cadm-pagination__btns {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .it-cadm-pagination__btn {
          min-width: 36px;
          height: 36px;
          border: 1px solid #dfe6f0;
          background: #ffffff;
          color: #344054;
          border-radius: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .it-cadm-pagination__btn.active {
          background: #7c5cff;
          color: #ffffff;
          border-color: #7c5cff;
        }

        .it-cadm-pagination__btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .it-cadm-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.34);
          backdrop-filter: blur(3px);
          z-index: 9998;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .it-cadm-modal {
          width: 100%;
          max-width: 760px;
          max-height: calc(100vh - 40px);
          overflow: auto;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
          border: 1px solid #e6ebf2;
        }

        .it-cadm-modal__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 20px 22px 16px;
          border-bottom: 1px solid #eef2f7;
        }

        .it-cadm-modal__header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .it-cadm-modal__header-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: #f1edff;
          color: #6b4ff7;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .it-cadm-modal__title {
          margin: 0;
          font-size: 20px;
          font-weight: 900;
          color: #10233f;
        }

        .it-cadm-modal__close {
          width: 38px;
          height: 38px;
          border: 1px solid #e5e7eb;
          background: #fff;
          color: #667085;
          border-radius: 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .it-cadm-modal__body {
          padding: 18px 22px 6px;
          display: grid;
          gap: 16px;
        }

        .it-cadm-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .it-cadm-field-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .it-cadm-field__label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          color: #475467;
        }

        .it-cadm-field__label span {
          color: #ef4444;
        }

        .it-cadm-field__input {
          width: 100%;
          min-height: 46px;
          border: 1px solid #dfe6f0;
          border-radius: 13px;
          padding: 0 14px;
          background: #fbfcfe;
          color: #1f2937;
          font-size: 14px;
          font-weight: 600;
          outline: none;
        }

        .it-cadm-field__input:focus {
          border-color: #8f7bff;
          box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.10);
          background: #fff;
        }

        .it-cadm-field__input.error {
          border-color: #ef4444;
          background: #fff8f8;
        }

        .it-cadm-field__error {
          font-size: 12px;
          color: #ef4444;
          font-weight: 700;
        }

        .it-cadm-field--check {
          padding-top: 6px;
        }

        .it-cadm-toggle {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .it-cadm-toggle input {
          display: none;
        }

        .it-cadm-toggle__track {
          width: 48px;
          height: 28px;
          border-radius: 999px;
          background: #d0d5dd;
          position: relative;
          transition: all .2s ease;
        }

        .it-cadm-toggle__track::after {
          content: "";
          position: absolute;
          top: 3px;
          left: 4px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          transition: all .2s ease;
          box-shadow: 0 2px 6px rgba(15,23,42,0.18);
        }

        .it-cadm-toggle input:checked + .it-cadm-toggle__track {
          background: #7c5cff;
        }

        .it-cadm-toggle input:checked + .it-cadm-toggle__track::after {
          left: 22px;
        }

        .it-cadm-toggle__label {
          font-size: 14px;
          font-weight: 800;
          color: #344054;
        }

        .it-cadm-modal__footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 18px 22px 22px;
          border-top: 1px solid #eef2f7;
          margin-top: 10px;
        }

        .it-cadm-modal__btn-cancel,
        .it-cadm-modal__btn-save {
          min-width: 140px;
          height: 46px;
          border-radius: 13px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          border: none;
        }

        .it-cadm-modal__btn-cancel {
          background: #f4f6f8;
          color: #475467;
        }

        .it-cadm-modal__btn-save {
          background: linear-gradient(135deg, #7c5cff 0%, #6d5dfd 100%);
          color: #ffffff;
          box-shadow: 0 14px 26px rgba(109, 93, 253, 0.20);
        }

        .it-cadm-modal__btn-save:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        @media (max-width: 900px) {
          .it-cadm {
            padding: 12px;
          }

          .it-cadm-header,
          .it-cadm-toolbar,
          .it-cadm-filters,
          .it-cadm-pagination {
            padding-left: 14px;
            padding-right: 14px;
          }

          .it-cadm-header {
            flex-direction: column;
            align-items: stretch;
          }

          .it-cadm-btn-create {
            width: 100%;
          }

          .it-cadm-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .it-cadm-filter-toggle {
            width: 100%;
            justify-content: center;
          }

          .it-cadm-field-row {
            grid-template-columns: 1fr;
          }

          .it-cadm-pagination {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div
        style={
          isBlocking
            ? { filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' }
            : undefined
        }
        aria-hidden={isBlocking}
      >
        <div className="it-cadm-shell">
          <div className="it-cadm-header">
            <p className="it-cadm-header__sub">
              {totalItems} estudiante{totalItems !== 1 ? 's' : ''} encontrado
              {totalItems !== 1 ? 's' : ''}
            </p>

            <button className="it-cadm-btn-create" onClick={openCreate}>
              <FiPlus />
              <span>Nuevo estudiante</span>
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
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="it-cadm-search__clear" onClick={() => setSearch('')}>
                  <FiX />
                </button>
              )}
            </div>

            <button
              className={`it-cadm-filter-toggle${filterOpen ? ' active' : ''}`}
              onClick={() => setFilterOpen((o) => !o)}
            >
              <FiFilter />
              <span>Filtros</span>
              {(filterPer || filterEst !== '') && (
                <span className="it-cadm-filter-toggle__dot" />
              )}
            </button>
          </div>

          {filterOpen && (
            <div className="it-cadm-filters">
              <div className="it-cadm-filters__group">
                <label className="it-cadm-filters__label">Carrera</label>
                <select
                  className="it-cadm-filters__select"
                  value={filterPer}
                  onChange={(e) => setFilterPer(e.target.value)}
                >
                  <option value="">Todas</option>
                  {MOCK_CARRERAS.map((c) => (
                    <option key={c.id_carrera} value={c.id_carrera}>
                      [{c.sigla}] {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="it-cadm-filters__group">
                <label className="it-cadm-filters__label">Estado</label>
                <select
                  className="it-cadm-filters__select"
                  value={filterEst}
                  onChange={(e) => setFilterEst(e.target.value)}
                >
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
                  {isBusy ? (
                    <tr>
                      <td colSpan={8} className="it-cadm-table__empty">
                        <ClipLoader size={28} />
                        <p style={{ marginTop: 10 }}>Cargando estudiantes…</p>
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="it-cadm-table__empty">
                        <FiUser style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }} />
                        <p>No se encontraron estudiantes</p>
                      </td>
                    </tr>
                  ) : (
                    students.map((c, idx) => (
                      <tr key={c.id_estudiante} className="it-cadm-table__row">
                        <td className="it-cadm-table__num">
                          {(page - 1) * PAGE_SIZE + idx + 1}
                        </td>

                        <td>
                          <div className="it-cadm-table__materia">
                            <span className="it-cadm-table__codigo">{c.carrera_sigla}</span>
                            <span className="it-cadm-table__nombre">
                              {c.nombre} {c.apellido}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="it-cadm-table__docente">
                            <span className="it-cadm-table__docente-avatar">
                              {c.carrera_nombre?.charAt(0)}
                            </span>
                            <span>{c.carrera_nombre}</span>
                          </div>
                        </td>

                        <td>
                          <span className="it-cadm-table__periodo">{c.semestre || ''}</span>
                        </td>

                        <td className="it-cadm-table__cupos">{c.ci}</td>
                        <td className="it-cadm-table__precio">{c.correo}</td>

                        <td>
                          <button
                            className={`it-cadm-badge${
                              c.estado ? ' it-cadm-badge--active' : ' it-cadm-badge--inactive'
                            }`}
                            onClick={() => handleToggleEstado(c)}
                            title="Click para cambiar estado"
                          >
                            {c.estado ? 'Activo' : 'Inactivo'}
                          </button>
                        </td>

                        <td>
                          <div className="it-cadm-table__actions">
                            <button
                              className="it-cadm-action-btn it-cadm-action-btn--edit"
                              onClick={() => openEdit(c)}
                              title="Editar"
                            >
                              <FiEdit2 />
                            </button>

                            <button
                              className="it-cadm-action-btn it-cadm-action-btn--delete"
                              onClick={() => handleDelete(c)}
                              title="Eliminar"
                              disabled={isDeleting}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <FiChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
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
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div
            className="it-cadm-modal-backdrop"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="it-cadm-modal">
              <div className="it-cadm-modal__header">
                <div className="it-cadm-modal__header-left">
                  <div className="it-cadm-modal__header-icon">
                    <FiUser />
                  </div>
                  <h3 className="it-cadm-modal__title">
                    {editTarget ? 'Editar estudiante' : 'Nueva cuenta de estudiante'}
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
                    {MOCK_CARRERAS.map((c) => (
                      <option key={c.id_carrera} value={c.id_carrera}>
                        [{c.sigla}] {c.nombre}
                      </option>
                    ))}
                  </select>
                  {formErrors.carrera_id && (
                    <span className="it-cadm-field__error">{formErrors.carrera_id}</span>
                  )}
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
                    {semestreOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {formErrors.semestre && (
                    <span className="it-cadm-field__error">{formErrors.semestre}</span>
                  )}
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
                      {formErrors.nombre && (
                        <span className="it-cadm-field__error">{formErrors.nombre}</span>
                      )}
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
                        {formErrors.apellido && (
                          <span className="it-cadm-field__error">{formErrors.apellido}</span>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="it-cadm-field">
                          <input
                            type="text"
                            name="apellido_paterno"
                            placeholder="Apellido paterno"
                            className={`it-cadm-field__input${
                              formErrors.apellido_paterno ? ' error' : ''
                            }`}
                            value={form.apellido_paterno}
                            onChange={handleFormChange}
                          />
                          {formErrors.apellido_paterno && (
                            <span className="it-cadm-field__error">
                              {formErrors.apellido_paterno}
                            </span>
                          )}
                        </div>

                        <div className="it-cadm-field">
                          <input
                            type="text"
                            name="apellido_materno"
                            placeholder="Apellido materno"
                            className={`it-cadm-field__input${
                              formErrors.apellido_materno ? ' error' : ''
                            }`}
                            value={form.apellido_materno}
                            onChange={handleFormChange}
                          />
                          {formErrors.apellido_materno && (
                            <span className="it-cadm-field__error">
                              {formErrors.apellido_materno}
                            </span>
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
                        const cleaned = v.replace(/[^a-zA-Z0-9.\-\/\s]/g, '');
                        setForm((prev) => ({ ...prev, ci: cleaned }));
                        if (formErrors.ci) {
                          setFormErrors((prev) => ({ ...prev, ci: '' }));
                        }
                      }}
                    />
                    {formErrors.ci && (
                      <span className="it-cadm-field__error">{formErrors.ci}</span>
                    )}
                  </div>

                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label">
                      Dirección <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      placeholder="Ej. Zona Sur"
                      className={`it-cadm-field__input${
                        formErrors.direccion ? ' error' : ''
                      }`}
                      value={form.direccion}
                      onChange={handleFormChange}
                    />
                    {formErrors.direccion && (
                      <span className="it-cadm-field__error">{formErrors.direccion}</span>
                    )}
                  </div>
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">
                    Correo <span>*</span>
                  </label>
                  <input
                    type="email"
                    name="correo"
                    placeholder="Ej. correo@ucb.edu.bo"
                    className={`it-cadm-field__input${formErrors.correo ? ' error' : ''}`}
                    value={form.correo}
                    onChange={handleFormChange}
                  />
                  {formErrors.correo && (
                    <span className="it-cadm-field__error">{formErrors.correo}</span>
                  )}
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
                        {formErrors.genero && (
                          <span className="it-cadm-field__error">{formErrors.genero}</span>
                        )}
                      </div>

                      <div className="it-cadm-field">
                        <label className="it-cadm-field__label">
                          Fecha de nacimiento <span>*</span>
                        </label>
                        <input
                          type="date"
                          name="fecha_nacimiento"
                          className={`it-cadm-field__input${
                            formErrors.fecha_nacimiento ? ' error' : ''
                          }`}
                          value={form.fecha_nacimiento}
                          onChange={handleFormChange}
                        />
                        {formErrors.fecha_nacimiento && (
                          <span className="it-cadm-field__error">
                            {formErrors.fecha_nacimiento}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 2,
                        padding: '14px 16px',
                        background: '#f7f8fc',
                        border: '1px solid #e6ebf3',
                        borderRadius: 14,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: '#475467',
                          lineHeight: 1.6,
                          fontWeight: 700,
                        }}
                      >
                        La contraseña no se ingresa manualmente. Se generará automáticamente
                        con el formato <strong>GatoBCI.</strong> y será enviada al correo del
                        estudiante.
                      </p>
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
                  disabled={isUpdating || isCreating}
                  title={isUpdating ? 'Actualizando…' : isCreating ? 'Creando…' : undefined}
                >
                  {isUpdating
                    ? 'Actualizando…'
                    : isCreating
                    ? 'Creando…'
                    : editTarget
                    ? 'Guardar cambios'
                    : 'Crear cuenta'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
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