import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiFilter, FiChevronLeft, FiChevronRight, FiX, FiBook, FiUser, FiLayers } from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import Swal from 'sweetalert2';

const MOCK_CARRERAS = [
  { id_carrera: 1, nombre: 'Ingeniería de Sistemas',  sigla: 'SIS' },
  { id_carrera: 2, nombre: 'Ingeniería Civil',        sigla: 'CIV' },
  { id_carrera: 3, nombre: 'Administración',          sigla: 'ADM' },
  { id_carrera: 4, nombre: 'Derecho',                 sigla: 'DER' },
  { id_carrera: 5, nombre: 'Contaduría Pública',      sigla: 'CON' },
];

const SEMESTRES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const INITIAL_STUDENTS = [
  { id_estudiante: 1, carrera_id: 1, carrera_nombre: 'Ingeniería de Sistemas',  carrera_sigla: 'SIS', nombre: 'María Fernanda', apellido: 'Quispe',     ci: 9876543, correo: 'maria.quispe@ucb.edu.bo',  telefono: 76543210, estado: true  },
  { id_estudiante: 2, carrera_id: 2, carrera_nombre: 'Ingeniería Civil',        carrera_sigla: 'CIV', nombre: 'José Luis',      apellido: 'Rojas',      ci: 8123456, correo: 'jose.rojas@ucb.edu.bo',    telefono: 71234567, estado: true  },
  { id_estudiante: 3, carrera_id: 1, carrera_nombre: 'Ingeniería de Sistemas',  carrera_sigla: 'SIS', nombre: 'Andrea',         apellido: 'Mamani',     ci: 7456123, correo: 'andrea.mamani@ucb.edu.bo', telefono: 70112233, estado: false },
  { id_estudiante: 4, carrera_id: 4, carrera_nombre: 'Derecho',                 carrera_sigla: 'DER', nombre: 'Carlos',         apellido: 'Torrez',     ci: 6543210, correo: 'carlos.torrez@ucb.edu.bo', telefono: 78990011, estado: true  },
  { id_estudiante: 5, carrera_id: 3, carrera_nombre: 'Administración',          carrera_sigla: 'ADM', nombre: 'Valeria',        apellido: 'Flores',     ci: 9321456, correo: 'valeria.flores@ucb.edu.bo', telefono: 77665544, estado: true  },
  { id_estudiante: 6, carrera_id: 5, carrera_nombre: 'Contaduría Pública',      carrera_sigla: 'CON', nombre: 'Diego',          apellido: 'Vargas',     ci: 7012345, correo: 'diego.vargas@ucb.edu.bo',  telefono: 69001122, estado: true  },
  { id_estudiante: 7, carrera_id: 2, carrera_nombre: 'Ingeniería Civil',        carrera_sigla: 'CIV', nombre: 'Lucía',          apellido: 'Paredes',    ci: 8899776, correo: 'lucia.paredes@ucb.edu.bo', telefono: 72223344, estado: false },
];

const PAGE_SIZE = 5;

const emptyForm = {
  carrera_id:  '',
  semestre:    '',
  nombre:      '',
  apellido:    '',
  ci:          '',
  correo:      '',
  telefono:    '',
  estado:      true,
};


const swalTheme = {
  confirmButtonColor: '#704FE6',
  cancelButtonColor:  '#4D5756',
  customClass: { popup: 'it-cadm-swal-popup' },
};

function StudentsAdmin() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [search, setSearch] = useState('');
  const [filterPer, setFilterPer] = useState('');
  const [filterEst, setFilterEst] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

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
    setShowModal(true);
  };

  const openEdit = (estudiante) => {
    setEditTarget(estudiante);
    setForm({
      carrera_id: estudiante.carrera_id,
      semestre: estudiante.semestre || '',
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      ci: estudiante.ci,
      correo: estudiante.correo,
      telefono: estudiante.telefono,
      estado: estudiante.estado,
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
    if (!form.apellido) errs.apellido = 'Ingresa el apellido';
    if (!form.ci || Number(form.ci) <= 0) errs.ci = 'Ingresa el CI (> 0)';
    if (!form.correo) errs.correo = 'Ingresa el correo';
    if (!form.telefono || Number(form.telefono) <= 0) errs.telefono = 'Ingresa el teléfono (> 0)';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
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
      }).then(res => {
        if (res.isConfirmed) {
          setStudents(prev =>
            prev.map(s =>
              s.id_estudiante === editTarget.id_estudiante
                ? {
                    ...s,
                    carrera_id: Number(form.carrera_id),
                    carrera_nombre: carrera?.nombre || '',
                    carrera_sigla: carrera?.sigla || '',
                    semestre: form.semestre,
                    nombre: form.nombre,
                    apellido: form.apellido,
                    ci: Number(form.ci),
                    correo: form.correo,
                    telefono: Number(form.telefono),
                    estado: form.estado,
                  }
                : s
            )
          );
          setShowModal(false);
          Swal.fire({ title: '¡Actualizado!', text: 'El estudiante fue actualizado.', icon: 'success', ...swalTheme, showCancelButton: false });
        }
      });
    } else {
      Swal.fire({
        title: '¿Crear estudiante?',
        text: `Se registrará ${form.nombre} ${form.apellido} en ${carrera?.nombre || ''}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar',
        ...swalTheme,
      }).then(res => {
        if (res.isConfirmed) {
          const newId =
            students.length > 0
              ? Math.max(...students.map(s => s.id_estudiante)) + 1
              : 1;
          setStudents(prev => [
            ...prev,
            {
              id_estudiante: newId,
              carrera_id: Number(form.carrera_id),
              carrera_nombre: carrera?.nombre || '',
              carrera_sigla: carrera?.sigla || '',
              semestre: form.semestre,
              nombre: form.nombre,
              apellido: form.apellido,
              ci: Number(form.ci),
              correo: form.correo,
              telefono: Number(form.telefono),
              estado: form.estado,
            },
          ]);
          setShowModal(false);
          Swal.fire({ title: '¡Creado!', text: 'El estudiante fue registrado.', icon: 'success', ...swalTheme, showCancelButton: false });
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
    <div className="it-cadm">
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
              {paginated.length === 0 ? (
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
                  <td className="it-cadm-table__precio">Tel. {c.telefono}</td>
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
                  {SEMESTRES.map(s => (
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
                </div>
              </div>

              <div className="it-cadm-field-row">
                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">
                    CI <span>*</span>
                  </label>
                  <input
                    type="number"
                    name="ci"
                    min="1"
                    placeholder="Ej. 8461662"
                    className={`it-cadm-field__input${formErrors.ci ? ' error' : ''}`}
                    value={form.ci}
                    onChange={handleFormChange}
                  />
                  {formErrors.ci && <span className="it-cadm-field__error">{formErrors.ci}</span>}
                </div>
                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">
                    Teléfono <span>*</span>
                  </label>
                  <input
                    type="number"
                    name="telefono"
                    min="1"
                    placeholder="Ej. 67019557"
                    className={`it-cadm-field__input${formErrors.telefono ? ' error' : ''}`}
                    value={form.telefono}
                    onChange={handleFormChange}
                  />
                  {formErrors.telefono && <span className="it-cadm-field__error">{formErrors.telefono}</span>}
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
              <button className="it-cadm-modal__btn-save" onClick={handleSave}>
                {editTarget ? 'Guardar cambios' : 'Crear estudiante'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default StudentsAdmin;