import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiFilter,
  FiChevronLeft, FiChevronRight, FiX, FiBook,
  FiUser, FiDollarSign, FiLayers, FiLoader, FiTag,
  FiChevronDown, FiChevronUp, FiClock, FiInfo,
  FiTarget, FiList,
} from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import Swal from 'sweetalert2';

import {
  fetchCursos, buscarCursos, createCurso, updateCurso, deleteCurso,
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
const PERIODOS  = ['I-2024', 'II-2024', 'I-2025', 'II-2025', 'I-2026'];
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const emptyCursoForm = {
  materia_id_materia: '',
  docente_id_docente: '',
  periodo:            '',
  cupos:              '',
  precio:             '',
  estado:             true,
  lecciones:          '',
  horas_academicas:   '',
  hora_inicio:        '',
  hora_fin:           '',
  descripcion:        '',
  aprenderas:         '',
  dirigido:           '',
  contenido:          '',
  dias_de_clases:     '',
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

const extractPrereqIds = (payload) => {
  const arr = Array.isArray(payload) ? payload
    : Array.isArray(payload?.Prerequisitos) ? payload.Prerequisitos
    : Array.isArray(payload?.prerequisitos) ? payload.prerequisitos
    : Array.isArray(payload?.data)          ? payload.data
    : [];
  return arr.map(p => String(p.materia_id_materia_prereq));
};

const buildDocenteLabel = (d) => {
  if (!d) return '—';
  const u = d.usuario;
  if (u) {
    //const titulo  = d.titulo ? `${d.titulo} ` : '';
    //${titulo}
    return `${u.nombres || ''} ${u.apellido_paterno || ''} ${u.apellido_materno || ''}`.replace(/\s+/g, ' ').trim();
  }
  return d.nombre_completo || `Docente #${d.id_docente}`;
};

const getCursoMateriaNombre = (c) => c?.materia?.nombre || c?.materia_nombre || '—';
const getCursoMateriaCodigo = (c) => c?.materia?.codigo || c?.materia_codigo || '—';
const getCursoDocenteLabel  = (c, allDocentes = []) => {
  if (c?.docente?.usuario) return buildDocenteLabel(c.docente);
  const id = c?.docente_id_docente ?? c?.docente?.id_docente;
  if (id && Array.isArray(allDocentes)) {
    const found = allDocentes.find(d => String(d.id_docente) === String(id));
    if (found) return buildDocenteLabel(found);
  }
  return '—';
};

// Dias
const diasToString = (diasArr) => {
  if (!diasArr || diasArr.length === 0) return '';
  if (diasArr.length === 1) return diasArr[0];
  const last = diasArr[diasArr.length - 1];
  const rest = diasArr.slice(0, -1);
  return `${rest.join(', ')} y ${last}`;
};

const parseDiasString = (str) => {
  if (!str) return [];
  return str.split(/,\s*y\s*|,\s*|\sy\s/).map(d => d.trim()).filter(d => DIAS_SEMANA.includes(d));
};

const SearchableSelect = ({ items = [], displayFn, filterFn, value, onChange, placeholder, error, disabled }) => {
  const [query,    setQuery]    = useState('');
  const [open,     setOpen]     = useState(false);
  const [focused,  setFocused]  = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value) {
      setQuery(displayFn(value));
    } else {
      setQuery('');
    }
  }, [value]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items.slice(0, 8);
    return items.filter(item => filterFn(item, query)).slice(0, 8);
  }, [items, query, filterFn]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
    if (value) onChange(null);
  };

  const handleSelect = (item) => {
    onChange(item);
    setQuery(displayFn(item));
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
    setOpen(false);
  };

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        // Restaura el texto al valor seleccionado si existe
        if (value) setQuery(displayFn(value));
        else setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [value, displayFn]);

  return (
    <div className="it-ss" ref={containerRef}>
      <div className={`it-ss__input-wrap${error ? ' error' : ''}${focused ? ' focused' : ''}`}>
        <FiSearch className="it-ss__icon" />
        <input
          type="text"
          className="it-ss__input"
          placeholder={placeholder}
          value={query}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={() => { setFocused(true); setOpen(true); }}
          onBlur={() => setFocused(false)}
          autoComplete="off"
        />
        {(query || value) && !disabled && (
          <button type="button" className="it-ss__clear" onClick={handleClear} tabIndex={-1}>
            <FiX />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <ul className="it-ss__dropdown">
          {filtered.map((item, i) => (
            <li
              key={i}
              className={`it-ss__option${value && displayFn(value) === displayFn(item) ? ' selected' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(item); }}
            >
              {displayFn(item)}
            </li>
          ))}
        </ul>
      )}

      {open && filtered.length === 0 && query.trim() && (
        <div className="it-ss__empty">Sin resultados para "{query}"</div>
      )}
    </div>
  );
};

const DayPicker = ({ value, onChange, error }) => {
  const selected = parseDiasString(value);

  const toggle = (dia) => {
    const next = selected.includes(dia)
      ? selected.filter(d => d !== dia)
      : [...selected, dia];
    // Mantener el orden de la semana
    const ordered = DIAS_SEMANA.filter(d => next.includes(d));
    onChange(diasToString(ordered));
  };

  return (
    <div className={`it-dp${error ? ' error' : ''}`}>
      <div className="it-dp__days">
        {DIAS_SEMANA.map(dia => (
          <button
            key={dia}
            type="button"
            className={`it-dp__day${selected.includes(dia) ? ' active' : ''}`}
            onClick={() => toggle(dia)}
          >
            {dia.slice(0, 3)}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="it-dp__label">{diasToString(selected)}</p>
      )}
    </div>
  );
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

  const [search, setSearch] = useState('');
  const [filterPer, setFilterPer] = useState('');
  const [filterEst, setFilterEst] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const [showCursoModal, setShowCursoModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [cursoForm, setCursoForm] = useState(emptyCursoForm);
  const [cursoErrors, setCursoErrors] = useState({});

  const [materiaObj, setMateriaObj] = useState(null);
  const [docenteObj, setDocenteObj] = useState(null);
  const [materiaSection,    setMateriaSection]    = useState('none');
  const [materiaInlineForm, setMateriaInlineForm] = useState(emptyMateriaInlineForm);
  const [materiaInlineErrs, setMateriaInlineErrs] = useState({});
  const [selectedPrereqs,   setSelectedPrereqs]   = useState([]);  
  const [originalPrereqs,   setOriginalPrereqs]   = useState([]);
  const [prereqSearch,      setPrereqSearch]       = useState('');

  const searchTimeout = useRef(null);

  useEffect(() => {
    dispatch(fetchAllMaterias());
    dispatch(fetchAllDocentes());
    dispatch(fetchCursos({ page: 1, limit: PAGE_SIZE }));
  }, [dispatch]);

  useEffect(() => {
    if (reduxError) {
      Swal.fire({ title: 'Error', text: reduxError, icon: 'error', ...swalTheme, showCancelButton: false });
    }
  }, [reduxError]);

  useEffect(() => {
    if (materiaSection === 'edit' && materiaObj) {
      setMateriaInlineForm({
        codigo:    materiaObj.codigo    || '',
        nombre:    materiaObj.nombre    || '',
        categoria: materiaObj.categoria || '',
        estado:    materiaObj.estado    ?? true,
      });
    }
  }, [materiaSection, materiaObj]);

  const triggerSearch = useCallback((overrides = {}) => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      const params = {
        page: 1, limit: PAGE_SIZE,
        q:       search,
        periodo: filterPer,
        estado:  filterEst,
        categoria: filterCat,
        ...overrides,
      };
      // Limpiar vacíos
      Object.keys(params).forEach(k => { if (params[k] === '') delete params[k]; });
      dispatch(buscarCursos(params));
    }, 350);
  }, [search, filterPer, filterEst, filterCat, dispatch]);

  useEffect(() => { triggerSearch(); }, [search, filterPer, filterEst, filterCat]); // eslint-disable-line

  const handlePageChange = (newPage) => {
    const params = { page: newPage, limit: PAGE_SIZE };
    if (search)    params.q       = search;
    if (filterPer) params.periodo = filterPer;
    if (filterEst) params.estado  = filterEst;
    if (filterCat) params.categoria = filterCat;
    dispatch(buscarCursos(params));
  };

  const clearFilters = () => {
    setSearch(''); setFilterPer(''); setFilterEst(''); setFilterCat('');
  };

  // Categorías únicas para el filtro
  const categoriasUnicas = useMemo(() => {
    const set = new Set((allMaterias || []).map(m => m.categoria).filter(Boolean));
    return [...set].sort();
  }, [allMaterias]);

  // ── Materias disponibles para prerequisitos (excluye la seleccionada) ───────
  const materiasParaPrereqs = useMemo(() => {
    if (!materiaObj) return [];
    return (allMaterias || []).filter(m => String(m.id_materia) !== String(materiaObj.id_materia));
  }, [allMaterias, materiaObj]);

  const prereqsFiltrados = useMemo(() => {
    const q = prereqSearch.toLowerCase().trim();
    if (!q) return materiasParaPrereqs.slice(0, 20);
    return materiasParaPrereqs.filter(m =>
      m.nombre.toLowerCase().includes(q) || m.codigo.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [materiasParaPrereqs, prereqSearch]);

  // Labels de prerequisitos seleccionados (para las burbujas)
  const prereqsSeleccionadosDetalle = useMemo(() =>
    selectedPrereqs.map(id => (allMaterias || []).find(m => String(m.id_materia) === id)).filter(Boolean),
    [selectedPrereqs, allMaterias]
  );


  const openCreateCurso = () => {
    setEditTarget(null);
    setCursoForm(emptyCursoForm);
    setCursoErrors({});
    setMateriaObj(null);
    setDocenteObj(null);
    setSelectedPrereqs([]);
    setOriginalPrereqs([]);
    setMateriaSection('none');
    setMateriaInlineForm(emptyMateriaInlineForm);
    setMateriaInlineErrs({});
    setPrereqSearch('');
    setShowCursoModal(true);
  };

  const openEditCurso = (curso) => {
    setEditTarget(curso);
    setCursoForm({
      periodo:          curso.periodo       || '',
      cupos:            curso.cupos         || '',
      precio:           curso.precio        || '',
      estado:           curso.estado        ?? true,
      lecciones:        curso.lecciones     || '',
      horas_academicas: curso.horas_academicas || '',
      hora_inicio:      curso.hora_inicio   || '',
      hora_fin:         curso.hora_fin      || '',
      descripcion:      curso.descripcion   || '',
      aprenderas:       curso.aprenderas    || '',
      dirigido:         curso.dirigido      || '',
      contenido:        curso.contenido     || '',
      dias_de_clases:   curso.dias_de_clases || '',
      materia_id_materia: String(curso.materia_id_materia ?? curso.materia?.id_materia ?? ''),
      docente_id_docente: String(curso.docente_id_docente ?? curso.docente?.id_docente ?? ''),
    });
    setCursoErrors({});
    setMateriaSection('none');
    setMateriaInlineForm(emptyMateriaInlineForm);
    setMateriaInlineErrs({});
    setPrereqSearch('');

    // Recuperar objetos completos
    const matId = curso.materia_id_materia ?? curso.materia?.id_materia;
    const mat   = (allMaterias || []).find(m => String(m.id_materia) === String(matId)) || curso.materia || null;
    setMateriaObj(mat);

    const docId = curso.docente_id_docente ?? curso.docente?.id_docente;
    const doc   = (allDocentes || []).find(d => String(d.id_docente) === String(docId)) || curso.docente || null;
    setDocenteObj(doc);

    if (matId) {
      dispatch(fetchPrerequisitosByMateria(matId)).then((action) => {
        const ids = extractPrereqIds(action.payload);
        setSelectedPrereqs(ids);
        setOriginalPrereqs(ids);
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

  const handleMateriaSelect = (mat) => {
    setMateriaObj(mat);
    setCursoForm(prev => ({ ...prev, materia_id_materia: mat ? String(mat.id_materia) : '' }));
    setSelectedPrereqs([]);
    setMateriaSection('none');
    if (cursoErrors.materia_id_materia) setCursoErrors(p => ({ ...p, materia_id_materia: '' }));

    if (mat) {
      dispatch(fetchPrerequisitosByMateria(mat.id_materia)).then((action) => {
        const ids = extractPrereqIds(action.payload);
        setSelectedPrereqs(ids);
        setOriginalPrereqs(ids);
      });
    }
  };

  const toggleMateriaSection = (mode) => {
    if (materiaSection === mode) { setMateriaSection('none'); return; }
    if (mode === 'edit' && !materiaObj) {
      Swal.fire({ title: 'Selecciona una materia', text: 'Primero selecciona una materia para editarla.', icon: 'info', ...swalTheme, showCancelButton: false });
      return;
    }
    setMateriaInlineErrs({});
    if (mode === 'create') setMateriaInlineForm(emptyMateriaInlineForm);
    setMateriaSection(mode);
  };

  const handleMateriaInlineChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMateriaInlineForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (materiaInlineErrs[name]) setMateriaInlineErrs(p => ({ ...p, [name]: '' }));
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
      const nueva = result.payload?.materia || result.payload;
      await dispatch(fetchAllMaterias());
      if (nueva?.id_materia) {
        handleMateriaSelect(nueva);
      }
      setMateriaSection('none');
      Swal.fire({ title: '¡Materia creada!', text: `"${materiaInlineForm.nombre}" fue registrada y seleccionada.`, icon: 'success', ...swalTheme, showCancelButton: false });

    } else if (materiaSection === 'edit') {
      const result = await dispatch(updateMateria({
        id:   materiaObj.id_materia,
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
      const updated = result.payload?.materia || result.payload;
      setMateriaObj(updated);
      await dispatch(fetchAllMaterias());
      setMateriaSection('none');
      Swal.fire({ title: '¡Materia actualizada!', text: `"${materiaInlineForm.nombre}" actualizada correctamente.`, icon: 'success', ...swalTheme, showCancelButton: false });
    }
  };

  const handleDocenteSelect = (doc) => {
    setDocenteObj(doc);
    setCursoForm(p => ({ ...p, docente_id_docente: doc ? String(doc.id_docente) : '' }));
    if (cursoErrors.docente_id_docente) setCursoErrors(p => ({ ...p, docente_id_docente: '' }));
  };

  const togglePrereq = (id_materia) => {
    const sid = String(id_materia);
    setSelectedPrereqs(prev =>
      prev.includes(sid) ? prev.filter(x => x !== sid) : [...prev, sid]
    );
  };

  const handleCursoFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCursoForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (cursoErrors[name]) setCursoErrors(p => ({ ...p, [name]: '' }));
  };

  const handleDiasChange = (diasStr) => {
    setCursoForm(p => ({ ...p, dias_de_clases: diasStr }));
    if (cursoErrors.dias_de_clases) setCursoErrors(p => ({ ...p, dias_de_clases: '' }));
  };

  const validateCurso = () => {
    const errs = {};
    if (!cursoForm.materia_id_materia)                        errs.materia_id_materia = 'Selecciona una materia';
    if (!cursoForm.docente_id_docente)                      errs.docente_id_docente = 'Selecciona un docente';
    if (!cursoForm.periodo)                                    errs.periodo            = 'Selecciona un período';
    if (!cursoForm.cupos  || Number(cursoForm.cupos)   <= 0)  errs.cupos              = 'Cupos > 0';
    if (!cursoForm.precio || Number(cursoForm.precio)  <= 0)  errs.precio             = 'Precio > 0';
    if (!cursoForm.lecciones || Number(cursoForm.lecciones) < 0) errs.lecciones        = 'Requerido';
    if (!cursoForm.horas_academicas || Number(cursoForm.horas_academicas) < 0) errs.horas_academicas = 'Requerido';
    if (!cursoForm.hora_inicio)  errs.hora_inicio  = 'Requerido';
    if (!cursoForm.hora_fin)     errs.hora_fin     = 'Requerido';
    if (!cursoForm.descripcion?.trim())  errs.descripcion  = 'Requerido';
    if (!cursoForm.aprenderas?.trim())   errs.aprenderas   = 'Requerido';
    if (!cursoForm.dirigido?.trim())     errs.dirigido     = 'Requerido';
    if (!cursoForm.contenido?.trim())    errs.contenido    = 'Requerido';
    if (!cursoForm.dias_de_clases?.trim()) errs.dias_de_clases = 'Selecciona al menos un día';
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
      lecciones:          Number(cursoForm.lecciones),
      horas_academicas:   Number(cursoForm.horas_academicas),
      hora_inicio:        cursoForm.hora_inicio,
      hora_fin:           cursoForm.hora_fin,
      descripcion:        cursoForm.descripcion.trim(),
      aprenderas:         cursoForm.aprenderas.trim(),
      dirigido:           cursoForm.dirigido.trim(),
      contenido:          cursoForm.contenido.trim(),
      dias_de_clases:     cursoForm.dias_de_clases.trim(),
    };

    if (editTarget) {
      const confirm = await Swal.fire({
        title: '¿Guardar cambios?', text: `Actualizar curso de ${materiaObj?.nombre || ''}`,
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
        title: '¿Crear curso?', text: `Registrar ${materiaObj?.nombre || ''} — ${cursoForm.periodo}`,
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

    triggerSearch({ page: 1 });
  };

  const handleDelete = async (curso) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar curso?',
      html: `<span style="color:#4D5756">Se eliminará <strong>${getCursoMateriaNombre(curso)}</strong> (${curso.periodo}). Esta acción no se puede deshacer.</span>`,
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
    triggerSearch({ page: 1 });
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
    triggerSearch({ page: currentPage });
  };

  const isSavingCurso   = isCreating || isUpdating;
  const isSavingMateria = isCreatingMat || isUpdatingMat;
  const hasActiveFilters = search || filterPer || filterEst || filterCat;
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
          {hasActiveFilters && <span className="it-cadm-filter-toggle__dot" />}
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
            <label className="it-cadm-filters__label">Categoría</label>
            <select className="it-cadm-filters__select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option value="">Todas</option>
              {categoriasUnicas.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="it-cadm-filters__group">
            <label className="it-cadm-filters__label">Estado</label>
            <select className="it-cadm-filters__select" value={filterEst} onChange={e => setFilterEst(e.target.value)}>
              <option value="">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
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
                <tr><td colSpan={8} className="it-cadm-table__empty">
                  <FiLoader className="it-cadm-spin" style={{ fontSize: 28, marginBottom: 8 }} />
                  <p>Cargando cursos…</p>
                </td></tr>
              ) : cursos.length === 0 ? (
                <tr><td colSpan={8} className="it-cadm-table__empty">
                  <FiBook style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }} />
                  <p>No se encontraron cursos</p>
                </td></tr>
              ) : cursos.map((c, idx) => (
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
              ))}
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
          <div className="it-cadm-modal it-cadm-modal--wide">
            <div className="it-cadm-modal__header">
              <div className="it-cadm-modal__header-left">
                <div className="it-cadm-modal__header-icon"><FiBook /></div>
                <h3 className="it-cadm-modal__title">{editTarget ? 'Editar curso' : 'Nuevo curso'}</h3>
              </div>
              <button className="it-cadm-modal__close" onClick={closeCursoModal}><FiX /></button>
            </div>

            <div className="it-cadm-modal__body">

              <div className="it-cadm-section">
                <div className="it-cadm-section__header">
                  <FiLayers className="it-cadm-section__icon" />
                  <span className="it-cadm-section__title">Materia</span>
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">Buscar materia <span>*</span></label>
                  {isLoadingMat ? (
                    <div className="it-cadm-field__loading"><FiLoader className="it-cadm-spin" /> Cargando materias…</div>
                  ) : (
                    <SearchableSelect
                      items={allMaterias || []}
                      displayFn={(m) => `[${m.codigo}] ${m.nombre}`}
                      filterFn={(m, q) => m.nombre.toLowerCase().includes(q.toLowerCase()) || m.codigo.toLowerCase().includes(q.toLowerCase()) || m.categoria?.toLowerCase().includes(q.toLowerCase())}
                      value={materiaObj}
                      onChange={handleMateriaSelect}
                      placeholder="Escribe para buscar por nombre, código o categoría…"
                      error={!!cursoErrors.materia_id_materia}
                    />
                  )}
                  {cursoErrors.materia_id_materia && <span className="it-cadm-field__error">{cursoErrors.materia_id_materia}</span>}

                  <div className="it-cadm-materia-actions">
                    <button type="button"
                      className={`it-cadm-materia-action-btn${materiaSection === 'create' ? ' active' : ''}`}
                      onClick={() => toggleMateriaSection('create')}
                    >
                      <FiPlus /><span>Nueva materia</span>
                      {materiaSection === 'create' ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    {materiaObj && (
                      <button type="button"
                        className={`it-cadm-materia-action-btn${materiaSection === 'edit' ? ' active' : ''}`}
                        onClick={() => toggleMateriaSection('edit')}
                      >
                        <FiEdit2 /><span>Editar materia</span>
                        {materiaSection === 'edit' ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    )}
                  </div>

                  {materiaSection !== 'none' && (
                    <div className="it-cadm-materia-inline">
                      <div className="it-cadm-materia-inline__header">
                        <span className="it-cadm-materia-inline__title">
                          {materiaSection === 'create' ? 'Crear nueva materia' : `Editar: ${materiaObj?.nombre || ''}`}
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
                        <input type="text" name="categoria" maxLength={100} placeholder="Ej. Ciencias Exactas"
                          className={`it-cadm-field__input${materiaInlineErrs.categoria ? ' error' : ''}`}
                          value={materiaInlineForm.categoria} onChange={handleMateriaInlineChange}
                        />
                        {materiaInlineErrs.categoria && <span className="it-cadm-field__error">{materiaInlineErrs.categoria}</span>}
                      </div>

                      {materiaSection !== 'none' && (
                        <div className="it-cadm-field">
                          <label className="it-cadm-field__label">
                            <FiBook /> Pre requisitos
                            <span className="it-cadm-field__label-hint">(de esta materia)</span>
                          </label>

                          {materiasParaPrereqs.length > 0 && (
                            <div className="it-cadm-prereq-search">
                              <FiSearch className="it-cadm-prereq-search__icon" />
                              <input type="text" className="it-cadm-prereq-search__input"
                                placeholder="Buscar materia pre requisito…"
                                value={prereqSearch}
                                onChange={e => setPrereqSearch(e.target.value)}
                              />
                              {prereqSearch && (
                                <button className="it-cadm-prereq-search__clear" onClick={() => setPrereqSearch('')} type="button"><FiX /></button>
                              )}
                            </div>
                          )}

                          {!materiaObj && !cursoForm.materia_id_materia ? (
                            <p className="it-cadm-field__hint">Selecciona una materia para gestionar pre requisitos.</p>
                          ) : isLoadingPrereq ? (
                            <div className="it-cadm-field__loading"><FiLoader className="it-cadm-spin" /> Cargando…</div>
                          ) : prereqsFiltrados.length === 0 && prereqSearch ? (
                            <p className="it-cadm-field__hint">Sin resultados para "{prereqSearch}"</p>
                          ) : prereqsFiltrados.length === 0 ? (
                            <p className="it-cadm-field__hint">No hay otras materias disponibles.</p>
                          ) : (
                            <div className="it-cadm-prereq-list">
                              {prereqsFiltrados.map(m => (
                                <button key={m.id_materia} type="button"
                                  className={`it-cadm-prereq-item${selectedPrereqs.includes(String(m.id_materia)) ? ' selected' : ''}`}
                                  onClick={() => togglePrereq(m.id_materia)}
                                >
                                  <span className="it-cadm-prereq-item__code">{m.codigo}</span>
                                  <span className="it-cadm-prereq-item__name">{m.nombre}</span>
                                  {selectedPrereqs.includes(String(m.id_materia)) && <FiX className="it-cadm-prereq-item__remove" />}
                                </button>
                              ))}
                            </div>
                          )}

                          {prereqsSeleccionadosDetalle.length > 0 && (
                            <div className="it-cadm-prereq-chips">
                              <span className="it-cadm-prereq-chips__label">Seleccionados:</span>
                              <div className="it-cadm-prereq-chips__list">
                                {prereqsSeleccionadosDetalle.map(m => (
                                  <button key={m.id_materia} type="button"
                                    className="it-cadm-prereq-chip it-cadm-prereq-chip--selected"
                                    onClick={() => togglePrereq(m.id_materia)}
                                    title="Clic para quitar"
                                  >
                                    <span className="it-cadm-prereq-chip__code">{m.codigo}</span>
                                    <span className="it-cadm-prereq-chip__name">{m.nombre}</span>
                                    <FiX className="it-cadm-prereq-chip__x" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

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
              </div>

              <div className="it-cadm-section">
                <div className="it-cadm-section__header">
                  <FiUser className="it-cadm-section__icon" />
                  <span className="it-cadm-section__title">Docente</span>
                </div>
                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">Buscar docente <span>*</span></label>
                  {isLoadingDoc ? (
                    <div className="it-cadm-field__loading"><FiLoader className="it-cadm-spin" /> Cargando docentes…</div>
                  ) : (
                    <SearchableSelect
                      items={allDocentes || []}
                      displayFn={buildDocenteLabel}
                      filterFn={(d, q) => {
                        const label = buildDocenteLabel(d).toLowerCase();
                        return label.includes(q.toLowerCase());
                      }}
                      value={docenteObj}
                      onChange={handleDocenteSelect}
                      placeholder="Escribe nombre, apellido o título del docente…"
                      error={!!cursoErrors.docente_id_docente}
                    />
                  )}
                  {cursoErrors.docente_id_docente && <span className="it-cadm-field__error">{cursoErrors.docente_id_docente}</span>}
                </div>
              </div>

              <div className="it-cadm-section">
                <div className="it-cadm-section__header">
                  <MdOutlineSchool className="it-cadm-section__icon" />
                  <span className="it-cadm-section__title">Datos del curso</span>
                </div>

                <div className="it-cadm-field-row it-cadm-field-row--3">
                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label">Período <span>*</span></label>
                    <select name="periodo"
                      className={`it-cadm-field__input${cursoErrors.periodo ? ' error' : ''}`}
                      value={cursoForm.periodo} onChange={handleCursoFormChange}
                    >
                      <option value="">— Período —</option>
                      {PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {cursoErrors.periodo && <span className="it-cadm-field__error">{cursoErrors.periodo}</span>}
                  </div>
                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label">Cupos <span>*</span></label>
                    <input type="number" name="cupos" min="1" max="500" placeholder="Ej. 30"
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

                <div className="it-cadm-field-row">
                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label"><FiList /> Lecciones <span>*</span></label>
                    <input type="number" name="lecciones" min="0" placeholder="Ej. 20"
                      className={`it-cadm-field__input${cursoErrors.lecciones ? ' error' : ''}`}
                      value={cursoForm.lecciones} onChange={handleCursoFormChange}
                    />
                    {cursoErrors.lecciones && <span className="it-cadm-field__error">{cursoErrors.lecciones}</span>}
                  </div>
                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label"><FiBook /> Horas académicas <span>*</span></label>
                    <input type="number" name="horas_academicas" min="0" placeholder="Ej. 40"
                      className={`it-cadm-field__input${cursoErrors.horas_academicas ? ' error' : ''}`}
                      value={cursoForm.horas_academicas} onChange={handleCursoFormChange}
                    />
                    {cursoErrors.horas_academicas && <span className="it-cadm-field__error">{cursoErrors.horas_academicas}</span>}
                  </div>
                </div>

                <div className="it-cadm-field-row">
                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label"><FiClock /> Hora inicio <span>*</span></label>
                    <input type="time" name="hora_inicio"
                      className={`it-cadm-field__input${cursoErrors.hora_inicio ? ' error' : ''}`}
                      value={cursoForm.hora_inicio} onChange={handleCursoFormChange}
                    />
                    {cursoErrors.hora_inicio && <span className="it-cadm-field__error">{cursoErrors.hora_inicio}</span>}
                  </div>
                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label"><FiClock /> Hora fin <span>*</span></label>
                    <input type="time" name="hora_fin"
                      className={`it-cadm-field__input${cursoErrors.hora_fin ? ' error' : ''}`}
                      value={cursoForm.hora_fin} onChange={handleCursoFormChange}
                    />
                    {cursoErrors.hora_fin && <span className="it-cadm-field__error">{cursoErrors.hora_fin}</span>}
                  </div>
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">Días de clases <span>*</span></label>
                  <DayPicker
                    value={cursoForm.dias_de_clases}
                    onChange={handleDiasChange}
                    error={!!cursoErrors.dias_de_clases}
                  />
                  {cursoErrors.dias_de_clases && <span className="it-cadm-field__error">{cursoErrors.dias_de_clases}</span>}
                </div>
              </div>

              <div className="it-cadm-section">
                <div className="it-cadm-section__header">
                  <FiInfo className="it-cadm-section__icon" />
                  <span className="it-cadm-section__title">Información del curso</span>
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">Descripción <span>*</span></label>
                  <textarea name="descripcion" rows={3} placeholder="Descripción general del curso…"
                    className={`it-cadm-field__textarea${cursoErrors.descripcion ? ' error' : ''}`}
                    value={cursoForm.descripcion} onChange={handleCursoFormChange}
                  />
                  {cursoErrors.descripcion && <span className="it-cadm-field__error">{cursoErrors.descripcion}</span>}
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label"><FiTarget /> ¿Qué aprenderás? <span>*</span></label>
                  <textarea name="aprenderas" rows={3} placeholder="Objetivos de aprendizaje…"
                    className={`it-cadm-field__textarea${cursoErrors.aprenderas ? ' error' : ''}`}
                    value={cursoForm.aprenderas} onChange={handleCursoFormChange}
                  />
                  {cursoErrors.aprenderas && <span className="it-cadm-field__error">{cursoErrors.aprenderas}</span>}
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label"><FiUser /> ¿A quién va dirigido? <span>*</span></label>
                  <textarea name="dirigido" rows={2} placeholder="Perfil del estudiante…"
                    className={`it-cadm-field__textarea${cursoErrors.dirigido ? ' error' : ''}`}
                    value={cursoForm.dirigido} onChange={handleCursoFormChange}
                  />
                  {cursoErrors.dirigido && <span className="it-cadm-field__error">{cursoErrors.dirigido}</span>}
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label"><FiList /> Contenido / Temario <span>*</span></label>
                  <textarea name="contenido" rows={4} placeholder="Unidades, temas, módulos…"
                    className={`it-cadm-field__textarea${cursoErrors.contenido ? ' error' : ''}`}
                    value={cursoForm.contenido} onChange={handleCursoFormChange}
                  />
                  {cursoErrors.contenido && <span className="it-cadm-field__error">{cursoErrors.contenido}</span>}
                </div>
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