import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiFilter, FiChevronLeft, FiChevronRight, FiX, FiBook, FiUser, FiDollarSign, FiLayers } from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import Swal from 'sweetalert2';

const MOCK_MATERIAS = [
  { id_materia: 1, nombre: 'Matemáticas I',   codigo: 'MAT001' },
  { id_materia: 2, nombre: 'Física General',  codigo: 'FIS001' },
  { id_materia: 3, nombre: 'Programación I',  codigo: 'INF001' },
  { id_materia: 4, nombre: 'Cálculo II',      codigo: 'MAT002' },
  { id_materia: 5, nombre: 'Base de Datos',   codigo: 'INF002' },
];

const MOCK_DOCENTES = [
  { id_docente: 1, nombre: 'Dr. Carlos Mendoza' },
  { id_docente: 2, nombre: 'Mg. Laura Vargas'    },
  { id_docente: 3, nombre: 'Lic. Pedro Soliz'    },
  { id_docente: 4, nombre: 'Dr. Ana Torres'      },
];

const PERIODOS = ['2024-I', '2024-II', '2025-I', '2025-II', '2026-I'];

const INITIAL_COURSES = [
  {
    id_curso: 1,
    materia_id: 1,
    materia_nombre: 'Matemáticas I',
    materia_codigo: 'MAT001',
    docente_id: 1,
    docente_nombre: 'Dr. Carlos Mendoza',
    periodo: '2025-I',
    cupos: 30,
    precio: 350.0,
    estado: true,
    prerequisitos: [],
    prerequisitos_detalle: [],
  },
  {
    id_curso: 2,
    materia_id: 2,
    materia_nombre: 'Física General',
    materia_codigo: 'FIS001',
    docente_id: 2,
    docente_nombre: 'Mg. Laura Vargas',
    periodo: '2025-I',
    cupos: 25,
    precio: 300.0,
    estado: true,
    prerequisitos: [1],
    prerequisitos_detalle: [
      { id_materia: 1, codigo: 'MAT001', nombre: 'Matemáticas I' }
    ],
  },
  {
    id_curso: 3,
    materia_id: 3,
    materia_nombre: 'Programación I',
    materia_codigo: 'INF001',
    docente_id: 3,
    docente_nombre: 'Lic. Pedro Soliz',
    periodo: '2025-II',
    cupos: 40,
    precio: 400.0,
    estado: true,
    prerequisitos: [],
    prerequisitos_detalle: [],
  },
  {
    id_curso: 4,
    materia_id: 4,
    materia_nombre: 'Cálculo II',
    materia_codigo: 'MAT002',
    docente_id: 1,
    docente_nombre: 'Dr. Carlos Mendoza',
    periodo: '2024-II',
    cupos: 35,
    precio: 350.0,
    estado: false,
    prerequisitos: [1, 2],
    prerequisitos_detalle: [
      { id_materia: 1, codigo: 'MAT001', nombre: 'Matemáticas I' },
      { id_materia: 2, codigo: 'FIS001', nombre: 'Física General' },
    ],
  },
  {
    id_curso: 5,
    materia_id: 5,
    materia_nombre: 'Base de Datos',
    materia_codigo: 'INF002',
    docente_id: 4,
    docente_nombre: 'Dr. Ana Torres',
    periodo: '2025-II',
    cupos: 30,
    precio: 420.0,
    estado: true,
    prerequisitos: [3],
    prerequisitos_detalle: [
      { id_materia: 3, codigo: 'INF001', nombre: 'Programación I' }
    ],
  },
  {
    id_curso: 6,
    materia_id: 1,
    materia_nombre: 'Matemáticas I',
    materia_codigo: 'MAT001',
    docente_id: 2,
    docente_nombre: 'Mg. Laura Vargas',
    periodo: '2026-I',
    cupos: 28,
    precio: 350.0,
    estado: true,
    prerequisitos: [],
    prerequisitos_detalle: [],
  },
  {
    id_curso: 7,
    materia_id: 3,
    materia_nombre: 'Programación I',
    materia_codigo: 'INF001',
    docente_id: 4,
    docente_nombre: 'Dr. Ana Torres',
    periodo: '2026-I',
    cupos: 40,
    precio: 400.0,
    estado: false,
    prerequisitos: [1],
    prerequisitos_detalle: [
      { id_materia: 1, codigo: 'MAT001', nombre: 'Matemáticas I' }
    ],
  },
];

const PAGE_SIZE = 5;

const emptyForm = {
  materia_id:  '',
  docente_id:  '',
  periodo:     '',
  cupos:       '',
  precio:      '',
  prerequisitos: [],
  estado:      true,
};


const swalTheme = {
  confirmButtonColor: '#704FE6',
  cancelButtonColor:  '#4D5756',
  customClass: { popup: 'it-cadm-swal-popup' },
};

const CoursesAdmin = () => {
  const [courses,     setCourses]     = useState(INITIAL_COURSES);
  const [search,      setSearch]      = useState('');
  const [filterPer,   setFilterPer]   = useState('');
  const [filterEst,   setFilterEst]   = useState('');
  const [page,        setPage]        = useState(1);
  const [showModal,   setShowModal]   = useState(false);
  const [editTarget,  setEditTarget]  = useState(null); // null =crear nuevo, objeto curso =editar, maybe conflicto?
  const [form,        setForm]        = useState(emptyForm);
  const [formErrors,  setFormErrors]  = useState({});
  const [filterOpen,  setFilterOpen]  = useState(false);

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    const matchSearch =
      c.materia_nombre.toLowerCase().includes(q) ||
      c.materia_codigo.toLowerCase().includes(q) ||
      c.docente_nombre.toLowerCase().includes(q);
    const matchPer = filterPer ? c.periodo === filterPer : true;
    const matchEst = filterEst === '' ? true : c.estado === (filterEst === 'activo');
    return matchSearch && matchPer && matchEst;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, filterPer, filterEst]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (curso) => {
    setEditTarget(curso);
    setForm({
      materia_id: curso.materia_id,
      docente_id: curso.docente_id,
      periodo:    curso.periodo,
      cupos:      curso.cupos,
      precio:     curso.precio,
      prerequisitos: (() => {
        const det =
          asArray(curso.prerequisitos_detalle).length ? asArray(curso.prerequisitos_detalle) :
          asArray(curso.prerequisitosDetalle).length ? asArray(curso.prerequisitosDetalle) :
          [];

        if (det.length > 0) {
          return det
            .map(p => p?.id_materia ?? p?.materia_id ?? p?.id ?? null)
            .filter(Boolean)
            .map(String);
        }

        const ids =
          asArray(curso.prerequisitos).length ? asArray(curso.prerequisitos) :
          asArray(curso.pre_requisitos).length ? asArray(curso.pre_requisitos) :
          asArray(curso.prerequisitos_ids).length ? asArray(curso.prerequisitos_ids) :
          [];

        return ids.filter(Boolean).map(String);
      })(),
      estado:     curso.estado,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const asArray = (v) => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') {
      try {
        const parsed = JSON.parse(v);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const togglePrerequisito = (id) => {
    setForm(prev => {
      const current = Array.isArray(prev.prerequisitos) ? prev.prerequisitos.map(String) : [];
      const sid = String(id);
      const next = current.includes(sid)
        ? current.filter(x => x !== sid)
        : [...current, sid];
      return { ...prev, prerequisitos: next };
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.materia_id) errs.materia_id = 'Selecciona una materia';
    if (!form.docente_id) errs.docente_id = 'Selecciona un docente';
    if (!form.periodo)    errs.periodo    = 'Selecciona un período';
    if (!form.cupos || form.cupos <= 0)  errs.cupos  = 'Ingresa los cupos (> 0)';
    if (!form.precio || form.precio <= 0) errs.precio = 'Ingresa el precio (> 0)';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const materia = MOCK_MATERIAS.find(m => m.id_materia === Number(form.materia_id));
    const docente = MOCK_DOCENTES.find(d => d.id_docente === Number(form.docente_id));
    const prerequisitosIds = (Array.isArray(form.prerequisitos) ? form.prerequisitos : []).map(Number);
    const prerequisitos_detalle = (Array.isArray(form.prerequisitos) ? form.prerequisitos : []).map(id => {
      const m = MOCK_MATERIAS.find(x => x.id_materia === Number(id));
      return m ? { id_materia: m.id_materia, codigo: m.codigo, nombre: m.nombre } : null;
    }).filter(Boolean);

    if (editTarget) {
      Swal.fire({
        title: '¿Guardar cambios?',
        text: `Actualizar el curso de ${materia.nombre}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText:  'Cancelar',
        ...swalTheme,
      }).then(res => {
        if (res.isConfirmed) {
          setCourses(prev => prev.map(c =>
            c.id_curso === editTarget.id_curso
              ? {
                  ...c,
                  ...form,
                  materia_id: Number(form.materia_id),
                  docente_id: Number(form.docente_id),
                  cupos: Number(form.cupos),
                  precio: Number(form.precio),
                  materia_nombre: materia.nombre,
                  materia_codigo: materia.codigo,
                  docente_nombre: docente.nombre,
                  prerequisitos: prerequisitosIds,
                  prerequisitos_detalle: prerequisitos_detalle,
                }
              : c
          ));
          setShowModal(false);
          Swal.fire({ title: '¡Actualizado!', text: 'El curso fue actualizado.', icon: 'success', ...swalTheme, showCancelButton: false });
        }
      });
    } else {
      Swal.fire({
        title: '¿Crear curso?',
        text: `Se registrará ${materia.nombre} - ${form.periodo}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText:  'Cancelar',
        ...swalTheme,
      }).then(res => {
        if (res.isConfirmed) {
          const newId = Math.max(...courses.map(c => c.id_curso)) + 1;
          setCourses(prev => [...prev, {
            id_curso:       newId,
            materia_id:     Number(form.materia_id),
            materia_nombre: materia.nombre,
            materia_codigo: materia.codigo,
            docente_id:     Number(form.docente_id),
            docente_nombre: docente.nombre,
            periodo:        form.periodo,
            cupos:          Number(form.cupos),
            precio:         Number(form.precio),
            prerequisitos:  prerequisitosIds,
            prerequisitos_detalle: prerequisitos_detalle,
            estado:         form.estado,
          }]);
          setShowModal(false);
          Swal.fire({ title: '¡Creado!', text: 'El curso fue registrado.', icon: 'success', ...swalTheme, showCancelButton: false });
        }
      });
    }
  };

  // ── Eliminar ─────────────────────────────────────────────────────────────────
  const handleDelete = (curso) => {
    Swal.fire({
      title: '¿Eliminar curso?',
      html:  `<span style="color:#4D5756">Se eliminará <strong>${curso.materia_nombre}</strong> (${curso.periodo}). Esta acción no se puede deshacer.</span>`,
      icon:  'warning',
      showCancelButton:  true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText:  'Cancelar',
      ...swalTheme,
      confirmButtonColor: '#FE543D',
    }).then(res => {
      if (res.isConfirmed) {
        setCourses(prev => prev.filter(c => c.id_curso !== curso.id_curso));
        Swal.fire({ title: 'Eliminado', text: 'El curso fue eliminado.', icon: 'success', ...swalTheme, showCancelButton: false });
      }
    });
  };

  // ── Toggle estado ─────────────────────────────────────────────────────────────
  const handleToggleEstado = (curso) => {
    const accion = curso.estado ? 'desactivar' : 'activar';
    Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} curso?`,
      text:  `El curso de ${curso.materia_nombre} será ${accion === 'activar' ? 'habilitado' : 'deshabilitado'}.`,
      icon:  'question',
      showCancelButton:  true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText:  'Cancelar',
      ...swalTheme,
    }).then(res => {
      if (res.isConfirmed) {
        setCourses(prev => prev.map(c => c.id_curso === curso.id_curso ? { ...c, estado: !c.estado } : c));
      }
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'prerequisitos') {
      const selected = Array.from(e.target.selectedOptions).map(o => o.value);
      setForm(prev => ({ ...prev, prerequisitos: selected }));
      if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const clearFilters = () => { setFilterPer(''); setFilterEst(''); setSearch(''); };

  return (
    <div className="it-cadm">

      <div className="it-cadm-header">
        <div className="it-cadm-header__left">
          <div>
            <h2 className="it-cadm-header__title">Gestión de Cursos</h2>
            <p className="it-cadm-header__sub">{filtered.length} curso{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button className="it-cadm-btn-create" onClick={openCreate}>
          <FiPlus /> <span>Nuevo curso</span>
        </button>
      </div>

      <div className="it-cadm-toolbar">
        <div className="it-cadm-search">
          <FiSearch className="it-cadm-search__icon" />
          <input
            type="text"
            className="it-cadm-search__input"
            placeholder="Buscar por materia, código o docente…"
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
            <label className="it-cadm-filters__label">Período</label>
            <select className="it-cadm-filters__select" value={filterPer} onChange={e => setFilterPer(e.target.value)}>
              <option value="">Todos</option>
              {PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}
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
                <th>Materia</th>
                <th>Docente</th>
                <th>Período</th>
                <th>Cupos</th>
                <th>Precio</th>
                <th>Pre requisitos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="it-cadm-table__empty">
                    <FiBook style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }} />
                    <p>No se encontraron cursos</p>
                  </td>
                </tr>
              ) : paginated.map((c, idx) => {
                  // Get prerequisite codes (robust)
                  let prereqCodes = [];

                  // 1) Prefer detail array if present
                  const detalle =
                    (Array.isArray(c.prerequisitos_detalle) && c.prerequisitos_detalle) ||
                    (Array.isArray(c.prerequisitosDetalle) && c.prerequisitosDetalle) ||
                    (Array.isArray(c.prerequisitos_detalles) && c.prerequisitos_detalles) ||
                    [];

                  if (detalle.length > 0) {
                    prereqCodes = detalle
                      .map(p => p?.codigo ?? p?.materia_codigo ?? p?.sigla ?? p?.code ?? null)
                      .filter(Boolean)
                      .map(String);
                  } else {
                    // 2) Else map ids to MOCK_MATERIAS
                    const ids =
                      (Array.isArray(c.prerequisitos) && c.prerequisitos) ||
                      (Array.isArray(c.pre_requisitos) && c.pre_requisitos) ||
                      (Array.isArray(c.prerequisito_ids) && c.prerequisito_ids) ||
                      [];

                    if (ids.length > 0) {
                      prereqCodes = ids
                        .map(id => {
                          const m = MOCK_MATERIAS.find(x => x.id_materia === Number(id));
                          return m ? m.codigo : null;
                        })
                        .filter(Boolean)
                        .map(String);
                    }
                  }
                  return (
                    <tr key={c.id_curso} className="it-cadm-table__row">
                      <td className="it-cadm-table__num">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td>
                        <div className="it-cadm-table__materia">
                          <span className="it-cadm-table__codigo">{c.materia_codigo}</span>
                          <span className="it-cadm-table__nombre">{c.materia_nombre}</span>
                        </div>
                      </td>
                      <td>
                        <div className="it-cadm-table__docente">
                          <span className="it-cadm-table__docente-avatar">
                            {c.docente_nombre.charAt(0)}
                          </span>
                          <span>{c.docente_nombre}</span>
                        </div>
                      </td>
                      <td><span className="it-cadm-table__periodo">{c.periodo}</span></td>
                      <td className="it-cadm-table__cupos">{c.cupos}</td>
                      <td className="it-cadm-table__precio">Bs. {c.precio.toFixed(2)}</td>
                      <td>
                        {prereqCodes.length === 0 ? (
                          <span>&mdash;</span>
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {prereqCodes.map(code => (
                              <span key={code} className="it-cadm-badge it-cadm-badge--code">{code}</span>
                            ))}
                          </div>
                        )}
                      </td>
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
                  );
                })}
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
                  <FiBook />
                </div>
                <h3 className="it-cadm-modal__title">
                  {editTarget ? 'Editar curso' : 'Nuevo curso'}
                </h3>
              </div>
              <button className="it-cadm-modal__close" onClick={closeModal}>
                <FiX />
              </button>
            </div>

            <div className="it-cadm-modal__body">

              <div className="it-cadm-field">
                <label className="it-cadm-field__label">
                  <FiLayers /> Materia <span>*</span>
                </label>
                <select
                  name="materia_id"
                  className={`it-cadm-field__input${formErrors.materia_id ? ' error' : ''}`}
                  value={form.materia_id}
                  onChange={handleFormChange}
                >
                  <option value="">Seleccionar materia</option>
                  {MOCK_MATERIAS.map(m => (
                    <option key={m.id_materia} value={m.id_materia}>
                      [{m.codigo}] {m.nombre}
                    </option>
                  ))}
                </select>
                {formErrors.materia_id && <span className="it-cadm-field__error">{formErrors.materia_id}</span>}
              </div>

              <div className="it-cadm-field">
                <label className="it-cadm-field__label">
                  <FiUser /> Docente <span>*</span>
                </label>
                <select
                  name="docente_id"
                  className={`it-cadm-field__input${formErrors.docente_id ? ' error' : ''}`}
                  value={form.docente_id}
                  onChange={handleFormChange}
                >
                  <option value="">Seleccionar docente</option>
                  {MOCK_DOCENTES.map(d => (
                    <option key={d.id_docente} value={d.id_docente}>{d.nombre}</option>
                  ))}
                </select>
                {formErrors.docente_id && <span className="it-cadm-field__error">{formErrors.docente_id}</span>}
              </div>

              {/* Prerequisitos field */}
              <div className="it-cadm-field">
                <label className="it-cadm-field__label">
                  <FiBook /> Pre requisitos (materias)
                </label>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {MOCK_MATERIAS.map((m) => {
                    const selected = asArray(form.prerequisitos)
                      .map(String)
                      .includes(String(m.id_materia));

                    return (
                      <button
                        key={m.id_materia}
                        type="button"
                        className={`it-cadm-badge${selected ? ' it-cadm-badge--active' : ' it-cadm-badge--inactive'}`}
                        onClick={() => togglePrerequisito(m.id_materia)}
                        title={selected ? 'Quitar pre requisito' : 'Agregar pre requisito'}
                      >
                        [{m.codigo}] {m.nombre}
                      </button>
                    );
                  })}
                </div>

                <p style={{ marginTop: 8, color: '#4D5756', fontSize: 12, opacity: 0.85 }}>
                  Seleccionadas: {Array.isArray(form.prerequisitos) ? form.prerequisitos.length : 0}
                </p>
              </div>

              <div className="it-cadm-field">
                <label className="it-cadm-field__label">
                  <MdOutlineSchool /> Período <span>*</span>
                </label>
                <select
                  name="periodo"
                  className={`it-cadm-field__input${formErrors.periodo ? ' error' : ''}`}
                  value={form.periodo}
                  onChange={handleFormChange}
                >
                  <option value="">Seleccionar período</option>
                  {PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {formErrors.periodo && <span className="it-cadm-field__error">{formErrors.periodo}</span>}
              </div>

              <div className="it-cadm-field-row">
                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">
                    Cupos <span>*</span>
                  </label>
                  <input
                    type="number"
                    name="cupos"
                    min="1"
                    max="200"
                    placeholder="Ej. 30"
                    className={`it-cadm-field__input${formErrors.cupos ? ' error' : ''}`}
                    value={form.cupos}
                    onChange={handleFormChange}
                  />
                  {formErrors.cupos && <span className="it-cadm-field__error">{formErrors.cupos}</span>}
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">
                    <FiDollarSign /> Precio (Bs.) <span>*</span>
                  </label>
                  <input
                    type="number"
                    name="precio"
                    min="0"
                    step="0.01"
                    placeholder="Ej. 350.00"
                    className={`it-cadm-field__input${formErrors.precio ? ' error' : ''}`}
                    value={form.precio}
                    onChange={handleFormChange}
                  />
                  {formErrors.precio && <span className="it-cadm-field__error">{formErrors.precio}</span>}
                </div>
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
                    Curso {form.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </label>
              </div>
            </div>

            <div className="it-cadm-modal__footer">
              <button className="it-cadm-modal__btn-cancel" onClick={closeModal}>
                Cancelar
              </button>
              <button className="it-cadm-modal__btn-save" onClick={handleSave}>
                {editTarget ? 'Guardar cambios' : 'Crear curso'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; export default CoursesAdmin;