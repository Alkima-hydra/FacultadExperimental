import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiFilter, FiChevronLeft, FiChevronRight, FiX, FiBook, FiUser, FiLayers, FiEye, FiEyeOff, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import { ClipLoader } from "react-spinners";
import Swal from 'sweetalert2';

//para consumo
import {
  fetchDocentes,
  fetchAllDocentes,
  fetchDocenteById,
  createDocente,
  updateDocente,
  deleteDocente,
} from './slicesDocentes/DocentesThunk'

import {
  selectIsLoading,
  selectIsUpdating,
} from './slicesDocentes/DocentesSlice';



const PAGE_SIZE = 5;

const emptyForm = {
  titulo: '',
  tipo_docente: '',

  // UI (nombre/apellidos)
  nombre: '',
  // Para edición se mantiene este campo (apellido combinado)
  apellido: '',

  // Para creación: apellidos separados (persona)
  apellido_paterno: '',
  apellido_materno: '',

  ci: '',
  correo: '',

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

function DocentesAdmin() {
  const dispatch = useDispatch();

  // Redux state (API)
  const isLoading = useSelector(selectIsLoading);

  // Puede venir como array o como objeto { ok, docentes: [...] } según cómo lo guarde el slice.
  // Además, el slice puede estar montado con distintas keys en el rootReducer (Docente/docente/docentes/Docentes).
  const rawAllDocentes = useSelector((state) =>
    state?.Docente?.allDocentes ??
    state?.Docente?.Docentes ??
    state?.docente?.allDocentes ??
    state?.docente?.Docentes ??
    state?.docentes?.allDocentes ??
    state?.docentes?.Docentes ??
    state?.Docentes?.allDocentes ??
    state?.Docentes?.Docentes ??
    null
  );

  const rawDocentes = useSelector((state) =>
    state?.Docente?.Docenteseleccionado ??
    state?.docente?.Docenteseleccionado ??
    state?.docentes?.Docenteseleccionado ??
    state?.Docentes?.Docenteseleccionado ??
    null
  );

  const isUpdating = useSelector(selectIsUpdating);

  // Bloqueo de pantalla mientras carga la lista desde la API
  const isBlocking = Boolean(isLoading);

  // Local state (UI)
  // Mientras conectamos todo el CRUD, usamos un fallback vacío.
  // Apenas llega data real desde la API (Redux), reemplazamos este arreglo.
  const [Docentes, setDocentes] = useState([]);
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

  // Mapper: API -> UI (docentes)
  const mapApiDocenteToUi = (d) => {
    const usuario = d?.usuario || {};
    const apellidoP = usuario?.apellido_paterno || '';
    const apellidoM = usuario?.apellido_materno || '';
    const apellido = `${apellidoP} ${apellidoM}`.trim();

    return {
      id_docente: d?.id_docente,
      titulo: String(d?.titulo || '').trim(),
      tipo_docente: String(d?.tipo_docente || '').trim(),
      usuarios_id_persona: d?.usuarios_id_persona,
      usuario,
      nombre: String(usuario?.nombres || '').trim(),
      apellido,
      ci: usuario?.ci ? String(usuario.ci) : '',
      correo: String(usuario?.mail || '').trim(),
      estado: Boolean(usuario?.estado),
    };
  };

  // Mapper: UI(form) -> API payload (docentes)
  const mapUiFormToApiUpdate = (current, formState) => {
    const apellidoTxt = String(formState?.apellido || '').trim();
    const partes = apellidoTxt.split(' ').filter(Boolean);
    const apellido_paterno = partes[0] || '';
    const apellido_materno = partes.slice(1).join(' ') || '';

    return {
      id_docente: current?.id_docente,
      titulo: String(formState?.titulo || '').trim(),
      tipo_docente: String(formState?.tipo_docente || '').trim(),
        nombres: String(formState?.nombre || '').trim(),
        apellido_paterno,
        apellido_materno,
        ci: String(formState?.ci || '').trim(),
        mail: String(formState?.correo || '').trim(),
        estado: Boolean(formState?.estado),
      
    };
  };

  // 1) Al montar, pedimos la lista completa
  useEffect(() => {
    dispatch(fetchAllDocentes());
  }, [dispatch]);

  // 2) Cuando llegue la data del store, la pasamos a nuestro formato UI
  useEffect(() => {
    const list =
      (Array.isArray(rawAllDocentes) ? rawAllDocentes : null) ||
      (Array.isArray(rawAllDocentes?.docentes) ? rawAllDocentes.docentes : null) ||
      // a veces el thunk guarda { ok, docentes: [...] } dentro de otra propiedad
      (Array.isArray(rawAllDocentes?.data?.docentes) ? rawAllDocentes.data.docentes : null) ||
      (Array.isArray(rawDocentes) ? rawDocentes : null) ||
      (Array.isArray(rawDocentes?.docentes) ? rawDocentes.docentes : null) ||
      (Array.isArray(rawDocentes?.data?.docentes) ? rawDocentes.data.docentes : null) ||
      null;

    if (list) {
      setDocentes(list.map(mapApiDocenteToUi));
    } else {
      setDocentes([]);
    }
  }, [rawAllDocentes, rawDocentes]);

  const filtered = Docentes.filter(d => {
    const q = search.toLowerCase();
    const matchSearch =
      (d.nombre && d.nombre.toLowerCase().includes(q)) ||
      (d.apellido && d.apellido.toLowerCase().includes(q)) ||
      (d.ci && String(d.ci).includes(q)) ||
      (d.correo && d.correo.toLowerCase().includes(q)) ||
      (d.titulo && d.titulo.toLowerCase().includes(q)) ||
      (d.tipo_docente && d.tipo_docente.toLowerCase().includes(q));

    const matchTipo = filterPer ? String(d.tipo_docente) === String(filterPer) : true;
    const matchEst = filterEst === '' ? true : d.estado === (filterEst === 'activo');
    return matchSearch && matchTipo && matchEst;
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

  const openEdit = (docente) => {
    setEditTarget(docente);
    const u = docente?.usuario || {};
    setForm({
      titulo: docente.titulo || '',
      tipo_docente: docente.tipo_docente || '',
      nombre: docente.nombre,
      apellido: docente.apellido,

      // campos de creación (no se muestran en edición)
      apellido_paterno: u.apellido_paterno || '',
      apellido_materno: u.apellido_materno || '',
      genero: u.genero || '',
      fecha_nacimiento: u.fecha_nacimiento || '',
      password: '',

      ci: docente.ci,
      correo: docente.correo,
      estado: docente.estado,
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
    if (!form.titulo) errs.titulo = 'Ingresa el título';
    if (!form.tipo_docente) errs.tipo_docente = 'Selecciona el tipo de docente';
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

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Mapper: UI(form) -> API payload (CREATE)
  const mapUiFormToApiCreate = (formState) => {
    return {
      titulo: String(formState?.titulo || '').trim(),
      tipo_docente: String(formState?.tipo_docente || '').trim(),
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

    if (editTarget) {
      Swal.fire({
        title: '¿Guardar cambios?',
        text: `Actualizar al docente ${form.nombre} ${form.apellido}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar',
        ...swalTheme,
      }).then(async res => {
        if (res.isConfirmed) {
          try {
            const apiPayload = mapUiFormToApiUpdate(editTarget, form);
            const action = await dispatch(
              updateDocente({
                id_docente: editTarget.id_docente,
                data: apiPayload,
              })
            );
            if (updateDocente.fulfilled && updateDocente.fulfilled.match(action)) {
              setShowModal(false);
              // recargar desde API para evitar inconsistencias
              dispatch(fetchAllDocentes());
              Swal.fire({
                title: '¡Actualizado!',
                text: 'El docente fue actualizado.',
                icon: 'success',
                ...swalTheme,
                showCancelButton: false,
              });
            } else {
              const msg =
                action?.payload?.message ||
                action?.error?.message ||
                'No se pudo actualizar el docente.';
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
              text: e?.message || 'No se pudo actualizar el docente.',
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
        title: '¿Crear docente?',
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
            text: 'Registrando al docente',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
            ...swalTheme,
          });

          const action = await dispatch(createDocente(apiPayload));

          if (createDocente.fulfilled && createDocente.fulfilled.match(action)) {
            dispatch(fetchAllDocentes());
            Swal.fire({
              title: '¡Creado!',
              text: 'El docente fue registrado.',
              icon: 'success',
              ...swalTheme,
              showCancelButton: false,
            });
          } else {
            const msg =
              action?.payload?.message ||
              action?.error?.message ||
              'No se pudo crear el docente.';
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
            text: e?.message || 'No se pudo crear el docente.',
            icon: 'error',
            ...swalTheme,
            showCancelButton: false,
          });
        }
      });
    }
  };

  const handleDelete = (docente) => {
    Swal.fire({
      title: '¿Eliminar docente?',
      html: `<span style="color:#4D5756">Se eliminará <strong>${docente.nombre} ${docente.apellido}</strong>. Esta acción no se puede deshacer.</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      ...swalTheme,
      confirmButtonColor: '#FE543D',
    }).then(res => {
      if (res.isConfirmed) {
        setDocentes(prev => prev.filter(s => s.id_docente !== docente.id_docente));
        Swal.fire({ title: 'Eliminado', text: 'El docente fue eliminado.', icon: 'success', ...swalTheme, showCancelButton: false });
      }
    });
  };

  const handleToggleEstado = (docente) => {
    const accion = docente.estado ? 'desactivar' : 'activar';
    Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} docente?`,
      text: `El docente ${docente.nombre} ${docente.apellido} será ${accion === 'activar' ? 'habilitado' : 'deshabilitado'}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
      ...swalTheme,
    }).then(res => {
      if (res.isConfirmed) {
        setDocentes(prev =>
          prev.map(s => s.id_docente === docente.id_docente ? { ...s, estado: !s.estado } : s)
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
            <h2 className="it-cadm-header__title">Gestión de Docentes</h2>
            <p className="it-cadm-header__sub">
              {filtered.length} docente{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button className="it-cadm-btn-create" onClick={openCreate}>
          <FiPlus /> <span>Nuevo docente</span>
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
            <label className="it-cadm-filters__label">Tipo de docente</label>
            <select className="it-cadm-filters__select" value={filterPer} onChange={e => setFilterPer(e.target.value)}>
              <option value="">Todos</option>
              {Array.from(new Set(Docentes.map(d => d?.tipo_docente).filter(Boolean)))
                .sort()
                .map(t => (
                  <option key={t} value={t}>{t}</option>
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
                <th>Docente</th>
                <th>Título</th>
                <th>Tipo</th>
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
                    <p style={{ marginTop: 10 }}>Cargando docentes…</p>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="it-cadm-table__empty">
                    <FiUser style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }} />
                    <p>No se encontraron docentes</p>
                  </td>
                </tr>
              ) : paginated.map((c, idx) => (
                <tr key={c.id_docente} className="it-cadm-table__row">
                  <td className="it-cadm-table__num">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td>
                    <div className="it-cadm-table__materia">
                      <span className="it-cadm-table__nombre">{c.nombre} {c.apellido}</span>
                    </div>
                  </td>
                  <td>
                    <span>{c.titulo}</span>
                  </td>
                  <td>
                    <span className="it-cadm-table__periodo">{c.tipo_docente}</span>
                  </td>
                  <td className="it-cadm-table__cupos">{c.ci}</td>
                  <td className="it-cadm-table__precio">{c.correo}</td>
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
                  {editTarget ? 'Editar docente' : 'Nuevo docente'}
                </h3>
              </div>
              <button className="it-cadm-modal__close" onClick={closeModal}>
                <FiX />
              </button>
            </div>

            <div className="it-cadm-modal__body">
              <div className="it-cadm-field">
                <label className="it-cadm-field__label">
                  <FiBook /> Título <span>*</span>
                </label>
                <input
                  type="text"
                  name="titulo"
                  placeholder="Ej. Ingeniero en Sistemas"
                  className={`it-cadm-field__input${formErrors.titulo ? ' error' : ''}`}
                  value={form.titulo}
                  onChange={handleFormChange}
                />
                {formErrors.titulo && <span className="it-cadm-field__error">{formErrors.titulo}</span>}
              </div>

              <div className="it-cadm-field">
                <label className="it-cadm-field__label">
                  <FiLayers /> Tipo de docente <span>*</span>
                </label>
                <select
                  name="tipo_docente"
                  className={`it-cadm-field__input${formErrors.tipo_docente ? ' error' : ''}`}
                  value={form.tipo_docente}
                  onChange={handleFormChange}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Tiempo Completo">Tiempo Completo</option>
                  <option value="Tiempo Parcial">Tiempo Parcial</option>
                  <option value="Invitado">Invitado</option>
                </select>
                {formErrors.tipo_docente && <span className="it-cadm-field__error">{formErrors.tipo_docente}</span>}
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

              <div className="it-cadm-field">
                <label className="it-cadm-field__label">
                  CI <span>*</span>
                </label>
                <input
                  type="text"
                  name="ci"
                  placeholder="Ej. 12345"
                  className={`it-cadm-field__input${formErrors.ci ? ' error' : ''}`}
                  value={form.ci}
                  onChange={handleFormChange}
                />
                {formErrors.ci && <span className="it-cadm-field__error">{formErrors.ci}</span>}
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

                    {formErrors.password && <span className="it-cadm-field__error">{formErrors.password}</span>}
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
                    Docente {form.estado ? 'Activo' : 'Inactivo'}
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
                {isUpdating ? 'Actualizando…' : editTarget ? 'Guardar cambios' : 'Crear docente'}
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
              Cargando docentes…
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
export default DocentesAdmin;