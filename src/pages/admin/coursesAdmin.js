import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiFilter,
  FiChevronLeft, FiChevronRight, FiX, FiBook,
  FiUser, FiDollarSign, FiLayers, FiLoader, FiTag,
  FiChevronDown, FiChevronUp,
} from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import Swal from 'sweetalert2';

import {
  fetchCursos, createCurso, updateCurso, deleteCurso,
  fetchAllMaterias, fetchAllDocentes,
  fetchPrerequisitosByMateria, createPrerequisito, deletePrerequisito,
  createMateria, updateMateria,
} from './slicesCursos/CursosThunk';

import {
  selectCursos, selectTotalPagesCursos, selectCurrentPageCursos,
  selectTotalItemsCursos, selectAllMaterias, selectAllDocentes,
  selectPrerequisitos, selectIsLoadingCursos, selectIsCreatingCurso,
  selectIsUpdatingCurso, selectIsDeletingCurso, selectIsLoadingAllMaterias,
  selectIsLoadingAllDocentes, selectIsLoadingPrerequisitos,
  selectIsCreatingMateria, selectIsUpdatingMateria, selectError,
} from './slicesCursos/CursosSlice';


const PAGE_SIZE = 5;
const PERIODOS  = ['2024-I', '2024-II', '2025-I', '2025-II', '2026-I'];

const emptyCursoForm = {
  materia_id_materia: '',
  docente_id_docente: '',
  periodo:            '',
  cupos:              '',
  precio:             '',
  estado:             true,
};

const emptyMateriaInlineForm = {
  codigo:    '',
  nombre:    '',
  categoria: '',
  estado:    true,
};

const swalTheme = {
  confirmButtonColor: '#704FE6',
  cancelButtonColor:  '#4D5756',
  customClass: { popup: 'it-cadm-swal-popup' },
  didOpen: () => {
    const container = document.querySelector('.swal2-container');
    if (container) container.style.zIndex = '99999';
  },
};

const extractPrereqsArray = (payload) => {
  if (Array.isArray(payload))                return payload;
  if (Array.isArray(payload?.Prerequisitos)) return payload.Prerequisitos;
  if (Array.isArray(payload?.prerequisitos)) return payload.prerequisitos;
  if (Array.isArray(payload?.prereqs))       return payload.prereqs;
  if (Array.isArray(payload?.data))          return payload.data;
  return [];
};

const extractPrereqIds = (payload) =>
  extractPrereqsArray(payload).map(p => String(p.materia_id_materia_prereq));

const buildDocenteLabel = (d) => {
  if (!d) return '—';
  const u = d.usuario;
  if (u) {
    const nombres = u.nombres          || '';
    const ap      = u.apellido_paterno || '';
    const am      = u.apellido_materno || '';
    return `${nombres} ${ap} ${am}`.replace(/\s+/g, ' ').trim();
  }
  return d.nombre_completo || `Docente #${d.id_docente}`;
};

const getCursoMateriaNombre = (c) => c?.materia?.nombre || c?.materia_nombre || '—';
const getCursoMateriaCodigo = (c) => c?.materia?.codigo || c?.materia_codigo || '—';
const getCursoDocenteLabel = (c, allDocentes = []) => {

  if (c?.docente?.usuario) return buildDocenteLabel(c.docente);

  const id = c?.docente_id_docente ?? c?.docente?.id_docente;
  if (id && Array.isArray(allDocentes)) {
    const found = allDocentes.find(d => String(d.id_docente) === String(id));
    if (found) return buildDocenteLabel(found);
  }

  return '—';
};

const getCursoPrereqCodigos = (c) => {
  const lista =
    (Array.isArray(c?.materia?.prerequisitos)   && c.materia.prerequisitos)   ||
    (Array.isArray(c?.materia?.materias_prereq) && c.materia.materias_prereq) ||
    (Array.isArray(c?.prerequisitos_detalle)    && c.prerequisitos_detalle)   ||
    (Array.isArray(c?.materia?.Prerequisitos)   && c.materia.Prerequisitos)   ||
    [];

  return lista
    .map(p =>
      p?.materia_prereq?.codigo ||
      p?.prerequisito?.codigo   ||
      p?.codigo                 ||
      null
    )
    .filter(Boolean);
};


const CoursesAdmin = () => {
  const dispatch = useDispatch();

  const cursos          = useSelector(selectCursos);
  const totalPages      = useSelector(selectTotalPagesCursos);
  const currentPage     = useSelector(selectCurrentPageCursos);
  const totalItems      = useSelector(selectTotalItemsCursos);
  const allMaterias     = useSelector(selectAllMaterias);
  const allDocentes     = useSelector(selectAllDocentes);
  const prerequisitos   = useSelector(selectPrerequisitos);
  const isLoadingCursos = useSelector(selectIsLoadingCursos);
  const isCreating      = useSelector(selectIsCreatingCurso);
  const isUpdating      = useSelector(selectIsUpdatingCurso);
  const isDeleting      = useSelector(selectIsDeletingCurso);
  const isLoadingMat    = useSelector(selectIsLoadingAllMaterias);
  const isLoadingDoc    = useSelector(selectIsLoadingAllDocentes);
  const isLoadingPrereq = useSelector(selectIsLoadingPrerequisitos);
  const isCreatingMat   = useSelector(selectIsCreatingMateria);
  const isUpdatingMat   = useSelector(selectIsUpdatingMateria);
  const reduxError      = useSelector(selectError);

  const [search,     setSearch]     = useState('');
  const [filterPer,  setFilterPer]  = useState('');
  const [filterEst,  setFilterEst]  = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const [showCursoModal,  setShowCursoModal]  = useState(false);
  const [editTarget,      setEditTarget]      = useState(null);
  const [cursoForm,       setCursoForm]       = useState(emptyCursoForm);
  const [cursoErrors,     setCursoErrors]     = useState({});
  const [selectedPrereqs, setSelectedPrereqs] = useState([]);
  const [originalPrereqs, setOriginalPrereqs] = useState([]);

  const [materiaSection,    setMateriaSection]    = useState('none');
  const [materiaInlineForm, setMateriaInlineForm] = useState(emptyMateriaInlineForm);
  const [materiaInlineErrs, setMateriaInlineErrs] = useState({});

  useEffect(() => {
    dispatch(fetchCursos({ page: 1, limit: PAGE_SIZE }));
    dispatch(fetchAllMaterias());
    dispatch(fetchAllDocentes());
  }, [dispatch]);

  useEffect(() => {
    if (reduxError) {
      Swal.fire({ title: 'Error', text: reduxError, icon: 'error', ...swalTheme, showCancelButton: false });
    }
  }, [reduxError]);

  useEffect(() => {
    if (materiaSection === 'edit' && cursoForm.materia_id_materia) {
      const mat = (Array.isArray(allMaterias) ? allMaterias : [])
        .find(m => String(m.id_materia) === String(cursoForm.materia_id_materia));
      if (mat) {
        setMateriaInlineForm({
          codigo:    mat.codigo    || '',
          nombre:    mat.nombre    || '',
          categoria: mat.categoria || '',
          estado:    mat.estado    ?? true,
        });
      }
    }
  }, [materiaSection, cursoForm.materia_id_materia, allMaterias]);

  const handlePageChange = (newPage) => {
    dispatch(fetchCursos({ page: newPage, limit: PAGE_SIZE, search, periodo: filterPer, estado: filterEst }));
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(cursos)) return [];
    const q = search.toLowerCase();
    return cursos.filter(c => {
      const matchSearch = !q ||
        getCursoMateriaNombre(c).toLowerCase().includes(q) ||
        getCursoMateriaCodigo(c).toLowerCase().includes(q) ||
        getCursoDocenteLabel(c, allDocentes).toLowerCase().includes(q);
      const matchPer = filterPer ? c.periodo === filterPer : true;
      const matchEst = filterEst === '' ? true : c.estado === (filterEst === 'activo');
      return matchSearch && matchPer && matchEst;
    });
  }, [cursos, search, filterPer, filterEst]);

  const materiasParaPrereqs = useMemo(() =>
    (Array.isArray(allMaterias) ? allMaterias : []).filter(
      m => String(m.id_materia) !== String(cursoForm.materia_id_materia)
    ),
    [allMaterias, cursoForm.materia_id_materia]
  );

  const materiaSeleccionada = useMemo(() =>
    (Array.isArray(allMaterias) ? allMaterias : [])
      .find(m => String(m.id_materia) === String(cursoForm.materia_id_materia)) || null,
    [allMaterias, cursoForm.materia_id_materia]
  );


  const openCreateCurso = () => {
    setEditTarget(null);
    setCursoForm(emptyCursoForm);
    setCursoErrors({});
    setSelectedPrereqs([]);
    setOriginalPrereqs([]);
    setMateriaSection('none');
    setMateriaInlineForm(emptyMateriaInlineForm);
    setMateriaInlineErrs({});
    setShowCursoModal(true);
  };

  const openEditCurso = (curso) => {
    setEditTarget(curso);
    setCursoForm({
      materia_id_materia: String(curso.materia_id_materia ?? curso.materia?.id_materia ?? ''),
      docente_id_docente: String(curso.docente_id_docente ?? curso.docente?.id_docente ?? ''),
      periodo:  curso.periodo || '',
      cupos:    curso.cupos   || '',
      precio:   curso.precio  || '',
      estado:   curso.estado  ?? true,
    });
    setCursoErrors({});
    setMateriaSection('none');
    setMateriaInlineForm(emptyMateriaInlineForm);
    setMateriaInlineErrs({});

    const matId = curso.materia_id_materia ?? curso.materia?.id_materia;
    if (matId) {
      dispatch(fetchPrerequisitosByMateria(matId)).then((action) => {
        const existentes = extractPrereqIds(action.payload);
        setSelectedPrereqs(existentes);
        setOriginalPrereqs(existentes);
      });
    } else {
      setSelectedPrereqs([]);
      setOriginalPrereqs([]);
    }
    setShowCursoModal(true);
  };

  const closeCursoModal = () => {
    setShowCursoModal(false);
    setMateriaSection('none');
  };

  const handleMateriaChange = (e) => {
    const { value } = e.target;
    setCursoForm(prev => ({ ...prev, materia_id_materia: value }));
    setSelectedPrereqs([]);
    setMateriaSection('none');
    if (cursoErrors.materia_id_materia) setCursoErrors(prev => ({ ...prev, materia_id_materia: '' }));

    if (value) {
      dispatch(fetchPrerequisitosByMateria(value)).then((action) => {
        const existentes = extractPrereqIds(action.payload);
        setSelectedPrereqs(existentes);
        setOriginalPrereqs(existentes);
      });
    }
  };

  const toggleMateriaSection = (mode) => {
    if (materiaSection === mode) { setMateriaSection('none'); return; }
    if (mode === 'edit' && !cursoForm.materia_id_materia) {
      Swal.fire({ title: 'Selecciona una materia', text: 'Primero selecciona una materia del listado para poder editarla.', icon: 'info', ...swalTheme, showCancelButton: false });
      return;
    }
    setMateriaInlineErrs({});
    if (mode === 'create') setMateriaInlineForm(emptyMateriaInlineForm);
    setMateriaSection(mode);
  };

  const handleMateriaInlineChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMateriaInlineForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (materiaInlineErrs[name]) setMateriaInlineErrs(prev => ({ ...prev, [name]: '' }));
  };

  const validateMateriaInline = () => {
    const errs = {};
    if (!materiaInlineForm.codigo.trim())           errs.codigo    = 'Requerido';
    if (materiaInlineForm.codigo.trim().length > 6) errs.codigo    = 'Máx. 6 caracteres';
    if (!materiaInlineForm.nombre.trim())           errs.nombre    = 'Requerido';
    if (!materiaInlineForm.categoria.trim())        errs.categoria = 'Requerido';
    setMateriaInlineErrs(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveMateriaInline = async () => {
    if (!validateMateriaInline()) return;

    if (materiaSection === 'create') {
      const result = await dispatch(createMateria({
        codigo:    materiaInlineForm.codigo.trim().toUpperCase(),
        nombre:    materiaInlineForm.nombre.trim(),
        categoria: materiaInlineForm.categoria.trim(),
        estado:    materiaInlineForm.estado,
      }));
      if (createMateria.rejected.match(result)) {
        Swal.fire({ title: 'Error', text: result.payload?.message || 'No se pudo crear la materia', icon: 'error', ...swalTheme, showCancelButton: false });
        return;
      }
      const nueva = result.payload?.Materia || result.payload?.materia || result.payload;
      await dispatch(fetchAllMaterias());
      if (nueva?.id_materia) {
        setCursoForm(prev => ({ ...prev, materia_id_materia: String(nueva.id_materia) }));
      }
      setMateriaSection('none');
      Swal.fire({ title: '¡Materia creada!', text: `"${materiaInlineForm.nombre}" fue registrada y seleccionada.`, icon: 'success', ...swalTheme, showCancelButton: false });

    } else if (materiaSection === 'edit') {
      const result = await dispatch(updateMateria({
        id:   cursoForm.materia_id_materia,
        data: {
          codigo:    materiaInlineForm.codigo.trim().toUpperCase(),
          nombre:    materiaInlineForm.nombre.trim(),
          categoria: materiaInlineForm.categoria.trim(),
          estado:    materiaInlineForm.estado,
        },
      }));
      if (updateMateria.rejected.match(result)) {
        Swal.fire({ title: 'Error', text: result.payload?.message || 'No se pudo actualizar la materia', icon: 'error', ...swalTheme, showCancelButton: false });
        return;
      }
      await dispatch(fetchAllMaterias());
      setMateriaSection('none');
      Swal.fire({ title: '¡Materia actualizada!', text: `"${materiaInlineForm.nombre}" fue actualizada correctamente.`, icon: 'success', ...swalTheme, showCancelButton: false });
    }
  };

  const togglePrereq = (id_materia) => {
    const sid = String(id_materia);
    setSelectedPrereqs(prev =>
      prev.includes(sid) ? prev.filter(x => x !== sid) : [...prev, sid]
    );
  };

  const handleCursoFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCursoForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (cursoErrors[name]) setCursoErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateCurso = () => {
    const errs = {};
    if (!cursoForm.materia_id_materia)                       errs.materia_id_materia = 'Selecciona una materia';
    if (!cursoForm.docente_id_docente)                       errs.docente_id_docente = 'Selecciona un docente';
    if (!cursoForm.periodo)                                  errs.periodo            = 'Selecciona un período';
    if (!cursoForm.cupos  || Number(cursoForm.cupos)  <= 0)  errs.cupos              = 'Ingresa los cupos (> 0)';
    if (!cursoForm.precio || Number(cursoForm.precio) <= 0)  errs.precio             = 'Ingresa el precio (> 0)';
    setCursoErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const syncPrerequisitos = async (id_materia) => {
    const toAdd    = selectedPrereqs.filter(id => !originalPrereqs.includes(id));
    const toRemove = originalPrereqs.filter(id => !selectedPrereqs.includes(id));
    for (const idPrereq of toAdd) {
      await dispatch(createPrerequisito({
        materia_id_materia:        Number(id_materia),
        materia_id_materia_prereq: Number(idPrereq),
      }));
    }
    for (const idPrereq of toRemove) {
      const prereqList = Array.isArray(prerequisitos) ? prerequisitos : [];
      const rec = prereqList.find(p => String(p.materia_id_materia_prereq) === String(idPrereq));
      if (rec) await dispatch(deletePrerequisito(rec.id_materia_prereq));
    }
  };

  const handleSaveCurso = async () => {
    if (!validateCurso()) return;

    const payload = {
      periodo:            cursoForm.periodo,
      cupos:              Number(cursoForm.cupos),
      precio:             Number(cursoForm.precio),
      estado:             cursoForm.estado,
      materia_id_materia: Number(cursoForm.materia_id_materia),
      docente_id_docente: Number(cursoForm.docente_id_docente),
    };

    if (editTarget) {
      const confirm = await Swal.fire({
        title: '¿Guardar cambios?', text: `Actualizar el curso de ${materiaSeleccionada?.nombre || ''}`,
        icon: 'question', showCancelButton: true,
        confirmButtonText: 'Sí, guardar', cancelButtonText: 'Cancelar', ...swalTheme,
      });
      if (!confirm.isConfirmed) return;

      const result = await dispatch(updateCurso({ id: editTarget.id_curso, data: payload }));
      if (updateCurso.rejected.match(result)) {
        Swal.fire({ title: 'Error', text: result.payload?.message || 'No se pudo actualizar', icon: 'error', ...swalTheme, showCancelButton: false });
        return;
      }
      await syncPrerequisitos(cursoForm.materia_id_materia);
      setShowCursoModal(false);
      Swal.fire({ title: '¡Actualizado!', text: 'El curso fue actualizado.', icon: 'success', ...swalTheme, showCancelButton: false });

    } else {
      const confirm = await Swal.fire({
        title: '¿Crear curso?', text: `Se registrará ${materiaSeleccionada?.nombre || ''} — ${cursoForm.periodo}`,
        icon: 'question', showCancelButton: true,
        confirmButtonText: 'Sí, crear', cancelButtonText: 'Cancelar', ...swalTheme,
      });
      if (!confirm.isConfirmed) return;

      const result = await dispatch(createCurso(payload));
      if (createCurso.rejected.match(result)) {
        Swal.fire({ title: 'Error', text: result.payload?.message || 'No se pudo crear', icon: 'error', ...swalTheme, showCancelButton: false });
        return;
      }
      for (const idPrereq of selectedPrereqs) {
        await dispatch(createPrerequisito({
          materia_id_materia:        Number(cursoForm.materia_id_materia),
          materia_id_materia_prereq: Number(idPrereq),
        }));
      }
      setShowCursoModal(false);
      Swal.fire({ title: '¡Creado!', text: 'El curso fue registrado.', icon: 'success', ...swalTheme, showCancelButton: false });
    }

    dispatch(fetchCursos({ page: currentPage, limit: PAGE_SIZE }));
  };

  const handleDelete = async (curso) => {
    const matNombre = getCursoMateriaNombre(curso);
    const confirm = await Swal.fire({
      title: '¿Eliminar curso?',
      html: `<span style="color:#4D5756">Se eliminará <strong>${matNombre}</strong> (${curso.periodo}). Esta acción no se puede deshacer.</span>`,
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
      ...swalTheme, confirmButtonColor: '#FE543D',
    });
    if (!confirm.isConfirmed) return;

    const result = await dispatch(deleteCurso(curso.id_curso));
    if (deleteCurso.rejected.match(result)) {
      Swal.fire({ title: 'Error', text: result.payload?.message || 'No se pudo eliminar', icon: 'error', ...swalTheme, showCancelButton: false });
      return;
    }
    Swal.fire({ title: 'Eliminado', text: 'El curso fue eliminado.', icon: 'success', ...swalTheme, showCancelButton: false });
    dispatch(fetchCursos({ page: 1, limit: PAGE_SIZE }));
  };

  const handleToggleEstado = async (curso) => {
    const accion = curso.estado ? 'desactivar' : 'activar';
    const confirm = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} curso?`,
      text: `El curso de ${getCursoMateriaNombre(curso)} será ${accion === 'activar' ? 'habilitado' : 'deshabilitado'}.`,
      icon: 'question', showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`, cancelButtonText: 'Cancelar', ...swalTheme,
    });
    if (!confirm.isConfirmed) return;
    await dispatch(updateCurso({ id: curso.id_curso, data: { estado: !curso.estado } }));
    dispatch(fetchCursos({ page: currentPage, limit: PAGE_SIZE }));
  };

  const clearFilters = () => { setFilterPer(''); setFilterEst(''); setSearch(''); };

  const isSavingCurso   = isCreating || isUpdating;
  const isSavingMateria = isCreatingMat || isUpdatingMat;

  return (
    <div className="it-cadm">

      <div className="it-cadm-header">
        <div className="it-cadm-header__left">
          <div>
            <h2 className="it-cadm-header__title">Gestión de Cursos</h2>
            <p className="it-cadm-header__sub">
              {isLoadingCursos ? 'Cargando…' : `${totalItems} curso${totalItems !== 1 ? 's' : ''} en total`}
            </p>
          </div>
        </div>
        <div className="it-cadm-header__actions">
          <button className="it-cadm-btn-create" onClick={openCreateCurso} disabled={isLoadingMat || isLoadingDoc}>
            <FiPlus /> <span>Nuevo curso</span>
          </button>
        </div>
      </div>

      <div className="it-cadm-toolbar">
        <div className="it-cadm-search">
          <FiSearch className="it-cadm-search__icon" />
          <input type="text" className="it-cadm-search__input"
            placeholder="Buscar por materia, código o docente…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="it-cadm-search__clear" onClick={() => setSearch('')}><FiX /></button>}
        </div>
        <button className={`it-cadm-filter-toggle${filterOpen ? ' active' : ''}`} onClick={() => setFilterOpen(o => !o)}>
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
          <button className="it-cadm-filters__clear" onClick={clearFilters}><FiX /> Limpiar</button>
        </div>
      )}

      <div className="it-cadm-table-wrap">
        <div className="it-cadm-table-scroll">
          <table className="it-cadm-table">
            <thead>
              <tr>
                <th>#</th><th>Materia</th><th>Título / Docente</th><th>Período</th>
                <th>Cupos</th><th>Precio</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingCursos ? (
                <tr><td colSpan={9} className="it-cadm-table__empty">
                  <FiLoader className="it-cadm-spin" style={{ fontSize: 28, marginBottom: 8 }} />
                  <p>Cargando cursos…</p>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="it-cadm-table__empty">
                  <FiBook style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }} />
                  <p>No se encontraron cursos</p>
                </td></tr>
              ) : filtered.map((c, idx) => {
                return (
                  <tr key={c.id_curso} className="it-cadm-table__row">
                    <td className="it-cadm-table__num">{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>
                      <div className="it-cadm-table__materia">
                        <span className="it-cadm-table__codigo">{getCursoMateriaCodigo(c)}</span>
                        <span className="it-cadm-table__nombre">{getCursoMateriaNombre(c)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="it-cadm-table__docente">
                        <span className="it-cadm-table__docente-avatar">
                          {getCursoDocenteLabel(c, allDocentes).charAt(0).toUpperCase()}
                        </span>
                        <span>{getCursoDocenteLabel(c, allDocentes)}</span>
                      </div>
                    </td>
                    <td><span className="it-cadm-table__periodo">{c.periodo}</span></td>
                    <td className="it-cadm-table__cupos">{c.cupos}</td>
                    <td className="it-cadm-table__precio">Bs. {Number(c.precio).toFixed(2)}</td>
                    
                    <td>
                      <button
                        className={`it-cadm-badge${c.estado ? ' it-cadm-badge--active' : ' it-cadm-badge--inactive'}`}
                        onClick={() => handleToggleEstado(c)}
                      >
                        {c.estado ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td>
                      <div className="it-cadm-table__actions">
                        <button className="it-cadm-action-btn it-cadm-action-btn--edit" onClick={() => openEditCurso(c)}><FiEdit2 /></button>
                        <button className="it-cadm-action-btn it-cadm-action-btn--delete" onClick={() => handleDelete(c)} disabled={isDeleting}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="it-cadm-pagination">
          <span className="it-cadm-pagination__info">Página {currentPage} de {totalPages}</span>
          <div className="it-cadm-pagination__btns">
            <button className="it-cadm-pagination__btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isLoadingCursos}><FiChevronLeft /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`it-cadm-pagination__btn${n === currentPage ? ' active' : ''}`} onClick={() => handlePageChange(n)} disabled={isLoadingCursos}>{n}</button>
            ))}
            <button className="it-cadm-pagination__btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoadingCursos}><FiChevronRight /></button>
          </div>
        </div>
      </div>

      {showCursoModal && (
        <div className="it-cadm-modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeCursoModal()}>
          <div className="it-cadm-modal">
            <div className="it-cadm-modal__header">
              <div className="it-cadm-modal__header-left">
                <div className="it-cadm-modal__header-icon"><FiBook /></div>
                <h3 className="it-cadm-modal__title">{editTarget ? 'Editar curso' : 'Nuevo curso'}</h3>
              </div>
              <button className="it-cadm-modal__close" onClick={closeCursoModal}><FiX /></button>
            </div>

            <div className="it-cadm-modal__body">

              <div className="it-cadm-field">
                <label className="it-cadm-field__label"><FiLayers /> Materia <span>*</span></label>

                {isLoadingMat ? (
                  <div className="it-cadm-field__loading"><FiLoader className="it-cadm-spin" /> Cargando materias…</div>
                ) : (
                  <select
                    name="materia_id_materia"
                    className={`it-cadm-field__input${cursoErrors.materia_id_materia ? ' error' : ''}`}
                    value={cursoForm.materia_id_materia}
                    onChange={handleMateriaChange}
                  >
                    <option value="">— Seleccionar materia —</option>
                    {(Array.isArray(allMaterias) ? allMaterias : []).map(m => (
                      <option key={m.id_materia} value={m.id_materia}>
                        [{m.codigo}] {m.nombre}
                      </option>
                    ))}
                  </select>
                )}
                {cursoErrors.materia_id_materia && <span className="it-cadm-field__error">{cursoErrors.materia_id_materia}</span>}

                <div className="it-cadm-materia-actions">
                  <button type="button"
                    className={`it-cadm-materia-action-btn${materiaSection === 'create' ? ' active' : ''}`}
                    onClick={() => toggleMateriaSection('create')}
                  >
                    <FiPlus />
                    <span>Nueva materia</span>
                    {materiaSection === 'create' ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {cursoForm.materia_id_materia && (
                    <button type="button"
                      className={`it-cadm-materia-action-btn${materiaSection === 'edit' ? ' active' : ''}`}
                      onClick={() => toggleMateriaSection('edit')}
                    >
                      <FiEdit2 />
                      <span>Editar materia</span>
                      {materiaSection === 'edit' ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  )}
                </div>

                {materiaSection !== 'none' && (
                  <div className="it-cadm-materia-inline">
                    <div className="it-cadm-materia-inline__header">
                      <span className="it-cadm-materia-inline__title">
                        {materiaSection === 'create' ? 'Crear nueva materia' : `Editar: ${materiaSeleccionada?.nombre || ''}`}
                      </span>
                      <span className="it-cadm-materia-inline__hint">Paso opcional</span>
                    </div>

                    <div className="it-cadm-field-row it-cadm-field-row--1-2">
                      <div className="it-cadm-field">
                        <label className="it-cadm-field__label"><FiTag /> Código <span>*</span></label>
                        <input type="text" name="codigo" maxLength={6} placeholder="Ej. MAT001"
                          className={`it-cadm-field__input it-cadm-field__input--upper${materiaInlineErrs.codigo ? ' error' : ''}`}
                          value={materiaInlineForm.codigo} onChange={handleMateriaInlineChange}
                        />
                        {materiaInlineErrs.codigo && <span className="it-cadm-field__error">{materiaInlineErrs.codigo}</span>}
                      </div>
                      <div className="it-cadm-field">
                        <label className="it-cadm-field__label"><FiBook /> Nombre <span>*</span></label>
                        <input type="text" name="nombre" maxLength={100} placeholder="Ej. Matemáticas I"
                          className={`it-cadm-field__input${materiaInlineErrs.nombre ? ' error' : ''}`}
                          value={materiaInlineForm.nombre} onChange={handleMateriaInlineChange}
                        />
                        {materiaInlineErrs.nombre && <span className="it-cadm-field__error">{materiaInlineErrs.nombre}</span>}
                      </div>
                    </div>

                    <div className="it-cadm-field">
                      <label className="it-cadm-field__label"><FiLayers /> Categoría <span>*</span></label>
                      <input type="text" name="categoria" maxLength={100}
                        placeholder="Ej. Ciencias Exactas, Electiva…"
                        className={`it-cadm-field__input${materiaInlineErrs.categoria ? ' error' : ''}`}
                        value={materiaInlineForm.categoria} onChange={handleMateriaInlineChange}
                      />
                      {materiaInlineErrs.categoria && <span className="it-cadm-field__error">{materiaInlineErrs.categoria}</span>}
                    </div>

                    <div className="it-cadm-materia-inline__footer">
                      <label className="it-cadm-toggle" style={{ marginRight: 'auto' }}>
                        <input type="checkbox" name="estado" checked={materiaInlineForm.estado} onChange={handleMateriaInlineChange} />
                        <span className="it-cadm-toggle__track" />
                        <span className="it-cadm-toggle__label">
                          Materia {materiaInlineForm.estado ? 'Activa' : 'Inactiva'}
                        </span>
                      </label>
                      <button type="button" className="it-cadm-modal__btn-cancel"
                        onClick={() => setMateriaSection('none')} disabled={isSavingMateria}>
                        Cancelar
                      </button>
                      <button type="button" className="it-cadm-modal__btn-save it-cadm-modal__btn-save--green"
                        onClick={handleSaveMateriaInline} disabled={isSavingMateria}>
                        {isSavingMateria
                          ? <><FiLoader className="it-cadm-spin" /> Guardando…</>
                          : materiaSection === 'create' ? 'Crear materia' : 'Guardar cambios'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="it-cadm-field">
                <label className="it-cadm-field__label"><FiUser /> Docente <span>*</span></label>
                {isLoadingDoc ? (
                  <div className="it-cadm-field__loading"><FiLoader className="it-cadm-spin" /> Cargando docentes…</div>
                ) : allDocentes.length === 0 ? (
                  <div className="it-cadm-field__empty-notice">No hay docentes registrados.</div>
                ) : (
                  <select
                    name="docente_id_docente"
                    className={`it-cadm-field__input${cursoErrors.docente_id_docente ? ' error' : ''}`}
                    value={cursoForm.docente_id_docente}
                    onChange={handleCursoFormChange}
                  >
                    <option value="">— Seleccionar docente —</option>
                    {(Array.isArray(allDocentes) ? allDocentes : []).map(d => (
                      <option key={d.id_docente} value={d.id_docente}>
                        {buildDocenteLabel(d)}
                      </option>
                    ))}
                  </select>
                )}
                {cursoErrors.docente_id_docente && <span className="it-cadm-field__error">{cursoErrors.docente_id_docente}</span>}
              </div>

              <div className="it-cadm-field">
                <label className="it-cadm-field__label"><MdOutlineSchool /> Período <span>*</span></label>
                <select
                  name="periodo"
                  className={`it-cadm-field__input${cursoErrors.periodo ? ' error' : ''}`}
                  value={cursoForm.periodo}
                  onChange={handleCursoFormChange}
                >
                  <option value="">— Seleccionar período —</option>
                  {PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {cursoErrors.periodo && <span className="it-cadm-field__error">{cursoErrors.periodo}</span>}
              </div>

              <div className="it-cadm-field-row">
                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">Cupos <span>*</span></label>
                  <input type="number" name="cupos" min="1" max="200" placeholder="Ej. 30"
                    className={`it-cadm-field__input${cursoErrors.cupos ? ' error' : ''}`}
                    value={cursoForm.cupos} onChange={handleCursoFormChange}
                  />
                  {cursoErrors.cupos && <span className="it-cadm-field__error">{cursoErrors.cupos}</span>}
                </div>
                <div className="it-cadm-field">
                  <label className="it-cadm-field__label"><FiDollarSign /> Precio (Bs.) <span>*</span></label>
                  <input type="number" name="precio" min="0" step="0.01" placeholder="Ej. 350.00"
                    className={`it-cadm-field__input${cursoErrors.precio ? ' error' : ''}`}
                    value={cursoForm.precio} onChange={handleCursoFormChange}
                  />
                  {cursoErrors.precio && <span className="it-cadm-field__error">{cursoErrors.precio}</span>}
                </div>
              </div>

              <div className="it-cadm-field">
                <label className="it-cadm-field__label">
                  <FiBook /> Pre requisitos
                  <span className="it-cadm-field__label-hint">(asociados a la materia)</span>
                </label>
                {!cursoForm.materia_id_materia ? (
                  <p className="it-cadm-field__hint">Selecciona una materia para ver sus pre requisitos.</p>
                ) : isLoadingPrereq ? (
                  <div className="it-cadm-field__loading"><FiLoader className="it-cadm-spin" /> Cargando pre requisitos…</div>
                ) : materiasParaPrereqs.length === 0 ? (
                  <p className="it-cadm-field__hint">No hay otras materias disponibles como pre requisito.</p>
                ) : (
                  <>
                    <div className="it-cadm-prereq-grid">
                      {materiasParaPrereqs.map((m) => {
                        const selected = selectedPrereqs.includes(String(m.id_materia));
                        return (
                          <button key={m.id_materia} type="button"
                            className={`it-cadm-prereq-chip${selected ? ' selected' : ''}`}
                            onClick={() => togglePrereq(m.id_materia)}
                          >
                            <span className="it-cadm-prereq-chip__code">{m.codigo}</span>
                            <span className="it-cadm-prereq-chip__name">{m.nombre}</span>
                            {selected && <span className="it-cadm-prereq-chip__check">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                    <p className="it-cadm-field__counter">
                      {selectedPrereqs.length} pre requisito{selectedPrereqs.length !== 1 ? 's' : ''} seleccionado{selectedPrereqs.length !== 1 ? 's' : ''}
                    </p>
                  </>
                )}
              </div>

              <div className="it-cadm-field it-cadm-field--check">
                <label className="it-cadm-toggle">
                  <input type="checkbox" name="estado" checked={cursoForm.estado} onChange={handleCursoFormChange} />
                  <span className="it-cadm-toggle__track" />
                  <span className="it-cadm-toggle__label">Curso {cursoForm.estado ? 'Activo' : 'Inactivo'}</span>
                </label>
              </div>
            </div>

            <div className="it-cadm-modal__footer">
              <button className="it-cadm-modal__btn-cancel" onClick={closeCursoModal} disabled={isSavingCurso}>Cancelar</button>
              <button className="it-cadm-modal__btn-save" onClick={handleSaveCurso} disabled={isSavingCurso}>
                {isSavingCurso
                  ? <><FiLoader className="it-cadm-spin" /> Guardando…</>
                  : editTarget ? 'Guardar cambios' : 'Crear curso'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; export default CoursesAdmin;