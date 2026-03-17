import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  FiBook,
  FiUser,
  FiDollarSign,
  FiLayers,
  FiLoader,
  FiTag,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiInfo,
  FiTarget,
  FiList,
  FiCheckCircle,
  FiAlertTriangle,
} from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import Swal from 'sweetalert2';

import {
  buscarCursos,
  createCurso,
  updateCurso,
  deleteCurso,
  fetchAllMaterias,
  fetchAllDocentes,
  fetchPrerequisitosByMateria,
  createPrerequisito,
  deletePrerequisito,
  createMateria,
  updateMateria,
  finalizarCurso,
  cancelarCurso,
} from './slicesCursos/CursosThunk';

import {
  selectCursos,
  selectTotalPagesCursos,
  selectCurrentPageCursos,
  selectTotalItemsCursos,
  selectAllMaterias,
  selectAllDocentes,
  selectPrerequisitos,
  selectIsLoadingCursos,
  selectIsCreatingCurso,
  selectIsUpdatingCurso,
  selectIsDeletingCurso,
  selectIsLoadingAllMaterias,
  selectIsLoadingAllDocentes,
  selectIsLoadingPrerequisitos,
  selectIsCreatingMateria,
  selectIsUpdatingMateria,
  selectIsFinalizandoCurso,
  selectIsCancelandoCurso,
  selectError,
} from './slicesCursos/CursosSlice';

const PAGE_SIZE = 5;
const LIMITE_CANCELACION = 8;

const generarPeriodosRegistrar = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const startYear = currentYear;
  const endYear = currentYear + 2;

  const periodos = [];

  for (let year = startYear; year <= endYear; year++) {
    if (!(year === currentYear && currentMonth >= 8)) {
      periodos.push(`I-${year}`);
    }
    periodos.push(`II-${year}`);
  }

  return periodos;
};

const generarPeriodosFiltros = () => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 2;
  const endYear = currentYear + 2;

  const periodos = [];

  for (let year = startYear; year <= endYear; year++) {
    periodos.push(`I-${year}`);
    periodos.push(`II-${year}`);
  }

  return periodos;
};

const PERIODOS = generarPeriodosRegistrar();
const PERIODOS_FILTROS = generarPeriodosFiltros();
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const emptyCursoForm = {
  materia_id_materia: '',
  docente_id_docente: '',
  periodo: '',
  cupos: '',
  precio: '',
  lecciones: '',
  horas_academicas: '',
  hora_inicio: '',
  hora_fin: '',
  descripcion: '',
  aprenderas: '',
  dirigido: '',
  contenido: '',
  dias_de_clases: '',
};

const emptyMateriaInlineForm = {
  codigo: '',
  nombre: '',
  categoria: '',
  estado: true,
};

const swalTheme = {
  confirmButtonColor: '#704FE6',
  cancelButtonColor: '#4D5756',
  customClass: { popup: 'it-cadm-swal-popup' },
  didOpen: () => {
    const container = document.querySelector('.swal2-container');
    if (container) container.style.zIndex = '99999';
  },
};

const extractPrereqIds = (payload) => {
  const arr = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.Prerequisitos)
    ? payload.Prerequisitos
    : Array.isArray(payload?.prerequisitos)
    ? payload.prerequisitos
    : Array.isArray(payload?.data)
    ? payload.data
    : [];

  return arr.map((p) => String(p.materia_id_materia_prereq));
};

const buildDocenteLabel = (d) => {
  if (!d) return '—';
  const u = d.usuario;
  if (u) {
    return `${u.nombres || ''} ${u.apellido_paterno || ''} ${u.apellido_materno || ''}`
      .replace(/\s+/g, ' ')
      .trim();
  }
  return d.nombre_completo || `Docente #${d.id_docente}`;
};

const getCursoMateriaNombre = (c) => c?.materia?.nombre || c?.materia_nombre || '—';
const getCursoMateriaCodigo = (c) => c?.materia?.codigo || c?.materia_codigo || '—';

const getCursoDocenteLabel = (c, allDocentes = []) => {
  if (c?.docente?.usuario) return buildDocenteLabel(c.docente);
  const id = c?.docente_id_docente ?? c?.docente?.id_docente;
  if (id && Array.isArray(allDocentes)) {
    const found = allDocentes.find((d) => String(d.id_docente) === String(id));
    if (found) return buildDocenteLabel(found);
  }
  return '—';
};

const getInscritosActuales = (curso) => {
  if (curso?.inscritos_actuales !== undefined && curso?.inscritos_actuales !== null) {
    return Number(curso.inscritos_actuales) || 0;
  }

  if (curso?.cupos_max !== undefined && curso?.cupos !== undefined) {
    return Math.max(0, Number(curso.cupos_max) - Number(curso.cupos));
  }

  if (Array.isArray(curso?.inscritos)) {
    return curso.inscritos.length;
  }

  return 0;
};

const getEstadoCursoMeta = (curso) => {
  switch (curso?.estado) {
    case 'FINALIZADO':
      return {
        label: 'Finalizado',
        className: '',
        style: {
          background: '#fef3f2',
          color: '#b42318',
          border: '1px solid #fecdca',
        },
      };
    case 'CANCELADO':
      return {
        label: 'Cancelado',
        className: '',
        style: {
          background: '#fff1f3',
          color: '#c01048',
          border: '1px solid #fbcfe8',
        },
      };
    case 'ACTIVO':
    default:
      return null;
  }
};

const diasToString = (diasArr) => {
  if (!diasArr || diasArr.length === 0) return '';
  if (diasArr.length === 1) return diasArr[0];
  const last = diasArr[diasArr.length - 1];
  const rest = diasArr.slice(0, -1);
  return `${rest.join(', ')} y ${last}`;
};

const parseDiasString = (str) => {
  if (!str) return [];
  return str
    .split(/,\s*y\s*|,\s*|\sy\s/)
    .map((d) => d.trim())
    .filter((d) => DIAS_SEMANA.includes(d));
};

const SearchableSelect = ({
  items = [],
  displayFn,
  filterFn,
  value,
  onChange,
  placeholder,
  error,
  disabled,
}) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value) setQuery(displayFn(value));
    else setQuery('');
  }, [value, displayFn]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items.slice(0, 8);
    return items.filter((item) => filterFn(item, query)).slice(0, 8);
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

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
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
          onFocus={() => {
            setFocused(true);
            setOpen(true);
          }}
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
              className={`it-ss__option${
                value && displayFn(value) === displayFn(item) ? ' selected' : ''
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(item);
              }}
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

const DayPicker = ({ value, onChange, error, disabled }) => {
  const selected = parseDiasString(value);

  const toggle = (dia) => {
    if (disabled) return;

    const next = selected.includes(dia)
      ? selected.filter((d) => d !== dia)
      : [...selected, dia];

    const ordered = DIAS_SEMANA.filter((d) => next.includes(d));
    onChange(diasToString(ordered));
  };

  return (
    <div className={`it-dp${error ? ' error' : ''}${disabled ? ' disabled' : ''}`}>
      <div className="it-dp__days">
        {DIAS_SEMANA.map((dia) => (
          <button
            key={dia}
            type="button"
            className={`it-dp__day${selected.includes(dia) ? ' active' : ''}`}
            onClick={() => toggle(dia)}
            disabled={disabled}
          >
            {dia.slice(0, 3)}
          </button>
        ))}
      </div>
      {selected.length > 0 && <p className="it-dp__label">{diasToString(selected)}</p>}
    </div>
  );
};

const CoursesAdmin = () => {
  const dispatch = useDispatch();

  const cursos = useSelector(selectCursos);
  const totalPages = useSelector(selectTotalPagesCursos);
  const currentPage = useSelector(selectCurrentPageCursos);
  const totalItems = useSelector(selectTotalItemsCursos);
  const allMaterias = useSelector(selectAllMaterias);
  const allDocentes = useSelector(selectAllDocentes);
  const prerequisitos = useSelector(selectPrerequisitos);
  const isLoadingCursos = useSelector(selectIsLoadingCursos);
  const isCreating = useSelector(selectIsCreatingCurso);
  const isUpdating = useSelector(selectIsUpdatingCurso);
  const isDeleting = useSelector(selectIsDeletingCurso);
  const isLoadingMat = useSelector(selectIsLoadingAllMaterias);
  const isLoadingDoc = useSelector(selectIsLoadingAllDocentes);
  const isLoadingPrereq = useSelector(selectIsLoadingPrerequisitos);
  const isCreatingMat = useSelector(selectIsCreatingMateria);
  const isUpdatingMat = useSelector(selectIsUpdatingMateria);
  const isFinalizando = useSelector(selectIsFinalizandoCurso);
  const isCancelando = useSelector(selectIsCancelandoCurso);
  const reduxError = useSelector(selectError);

  const [search, setSearch] = useState('');
  const [filterPer, setFilterPer] = useState('');
  const [filterEstadoCurso, setFilterEstadoCurso] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const [showCursoModal, setShowCursoModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [cursoForm, setCursoForm] = useState(emptyCursoForm);
  const [cursoErrors, setCursoErrors] = useState({});

  const [materiaObj, setMateriaObj] = useState(null);
  const [docenteObj, setDocenteObj] = useState(null);
  const [materiaSection, setMateriaSection] = useState('none');
  const [materiaInlineForm, setMateriaInlineForm] = useState(emptyMateriaInlineForm);
  const [materiaInlineErrs, setMateriaInlineErrs] = useState({});
  const [selectedPrereqs, setSelectedPrereqs] = useState([]);
  const [originalPrereqs, setOriginalPrereqs] = useState([]);
  const [prereqSearch, setPrereqSearch] = useState('');

  const searchTimeout = useRef(null);

  useEffect(() => {
    dispatch(fetchAllMaterias());
    dispatch(fetchAllDocentes());
    dispatch(buscarCursos({ page: 1, limit: PAGE_SIZE }));
  }, [dispatch]);

  useEffect(() => {
    if (reduxError) {
      Swal.fire({
        title: 'Error',
        text: reduxError,
        icon: 'error',
        ...swalTheme,
        showCancelButton: false,
      });
    }
  }, [reduxError]);

  useEffect(() => {
    if (materiaSection === 'edit' && materiaObj) {
      setMateriaInlineForm({
        codigo: materiaObj.codigo || '',
        nombre: materiaObj.nombre || '',
        categoria: materiaObj.categoria || '',
        estado: materiaObj.estado ?? true,
      });
    }
  }, [materiaSection, materiaObj]);

  const triggerSearch = useCallback(
    (overrides = {}) => {
      clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        const params = {
          page: 1,
          limit: PAGE_SIZE,
          q: search,
          periodo: filterPer,
          estado: filterEstadoCurso,
          categoria: filterCat,
          ...overrides,
        };

        Object.keys(params).forEach((k) => {
          if (params[k] === '') delete params[k];
        });

        dispatch(buscarCursos(params));
      }, 350);
    },
    [search, filterPer, filterEstadoCurso, filterCat, dispatch]
  );

  useEffect(() => {
    triggerSearch();
  }, [search, filterPer, filterEstadoCurso, filterCat, triggerSearch]);

  const handlePageChange = (newPage) => {
    const params = { page: newPage, limit: PAGE_SIZE };
    if (search) params.q = search;
    if (filterPer) params.periodo = filterPer;
    if (filterEstadoCurso) params.estado = filterEstadoCurso;
    if (filterCat) params.categoria = filterCat;
    dispatch(buscarCursos(params));
  };

  const clearFilters = () => {
    setSearch('');
    setFilterPer('');
    setFilterEstadoCurso('');
    setFilterCat('');
  };

  const categoriasUnicas = useMemo(() => {
    const set = new Set((allMaterias || []).map((m) => m.categoria).filter(Boolean));
    return [...set].sort();
  }, [allMaterias]);

  const materiasParaPrereqs = useMemo(() => {
    if (!materiaObj) return [];
    return (allMaterias || []).filter(
      (m) => String(m.id_materia) !== String(materiaObj.id_materia)
    );
  }, [allMaterias, materiaObj]);

  const prereqsFiltrados = useMemo(() => {
    const q = prereqSearch.toLowerCase().trim();
    if (!q) return materiasParaPrereqs.slice(0, 20);
    return materiasParaPrereqs
      .filter((m) => m.nombre.toLowerCase().includes(q) || m.codigo.toLowerCase().includes(q))
      .slice(0, 20);
  }, [materiasParaPrereqs, prereqSearch]);

  const prereqsSeleccionadosDetalle = useMemo(
    () =>
      selectedPrereqs
        .map((id) => (allMaterias || []).find((m) => String(m.id_materia) === id))
        .filter(Boolean),
    [selectedPrereqs, allMaterias]
  );

  const cursoEditable = !editTarget || editTarget?.estado === 'ACTIVO';
  const inscritosEditTarget = editTarget ? getInscritosActuales(editTarget) : 0;
  const mostrarBotonCancelarEnModal =
    editTarget?.estado === 'ACTIVO' && inscritosEditTarget <= LIMITE_CANCELACION;

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
      periodo: curso.periodo || '',
      cupos: curso.cupos_max ?? curso.cupos ?? '',
      precio: curso.precio || '',
      lecciones: curso.lecciones || '',
      horas_academicas: curso.horas_academicas || '',
      hora_inicio: curso.hora_inicio || '',
      hora_fin: curso.hora_fin || '',
      descripcion: curso.descripcion || '',
      aprenderas: curso.aprenderas || '',
      dirigido: curso.dirigido || '',
      contenido: curso.contenido || '',
      dias_de_clases: curso.dias_de_clases || '',
      materia_id_materia: String(curso.materia_id_materia ?? curso.materia?.id_materia ?? ''),
      docente_id_docente: String(curso.docente_id_docente ?? curso.docente?.id_docente ?? ''),
    });

    setCursoErrors({});
    setMateriaSection('none');
    setMateriaInlineForm(emptyMateriaInlineForm);
    setMateriaInlineErrs({});
    setPrereqSearch('');

    const matId = curso.materia_id_materia ?? curso.materia?.id_materia;
    const mat =
      (allMaterias || []).find((m) => String(m.id_materia) === String(matId)) ||
      curso.materia ||
      null;
    setMateriaObj(mat);

    const docId = curso.docente_id_docente ?? curso.docente?.id_docente;
    const doc =
      (allDocentes || []).find((d) => String(d.id_docente) === String(docId)) ||
      curso.docente ||
      null;
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
    setEditTarget(null);
  };

  const handleMateriaSelect = (mat) => {
    setMateriaObj(mat);
    setCursoForm((prev) => ({
      ...prev,
      materia_id_materia: mat ? String(mat.id_materia) : '',
    }));
    setSelectedPrereqs([]);
    setMateriaSection('none');

    if (cursoErrors.materia_id_materia) {
      setCursoErrors((p) => ({ ...p, materia_id_materia: '' }));
    }

    if (mat) {
      dispatch(fetchPrerequisitosByMateria(mat.id_materia)).then((action) => {
        const ids = extractPrereqIds(action.payload);
        setSelectedPrereqs(ids);
        setOriginalPrereqs(ids);
      });
    }
  };

  const toggleMateriaSection = (mode) => {
    if (materiaSection === mode) {
      setMateriaSection('none');
      return;
    }

    if (mode === 'edit' && !materiaObj) {
      Swal.fire({
        title: 'Selecciona una materia',
        text: 'Primero selecciona una materia para editarla.',
        icon: 'info',
        ...swalTheme,
        showCancelButton: false,
      });
      return;
    }

    setMateriaInlineErrs({});
    if (mode === 'create') setMateriaInlineForm(emptyMateriaInlineForm);
    setMateriaSection(mode);
  };

  const handleMateriaInlineChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMateriaInlineForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (materiaInlineErrs[name]) {
      setMateriaInlineErrs((p) => ({ ...p, [name]: '' }));
    }
  };

  const validateMateriaInline = () => {
    const errs = {};
    if (!materiaInlineForm.codigo.trim()) errs.codigo = 'Requerido';
    if (materiaInlineForm.codigo.trim().length > 6) errs.codigo = 'Máx. 6 caracteres';
    if (!materiaInlineForm.nombre.trim()) errs.nombre = 'Requerido';
    if (!materiaInlineForm.categoria.trim()) errs.categoria = 'Requerido';
    setMateriaInlineErrs(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveMateriaInline = async () => {
    if (!validateMateriaInline()) return;

    if (materiaSection === 'create') {
      const result = await dispatch(
        createMateria({
          codigo: materiaInlineForm.codigo.trim().toUpperCase(),
          nombre: materiaInlineForm.nombre.trim(),
          categoria: materiaInlineForm.categoria.trim(),
          estado: materiaInlineForm.estado,
        })
      );

      if (createMateria.rejected.match(result)) {
        Swal.fire({
          title: 'Error',
          text: result.payload?.message || result.payload?.msg || 'No se pudo crear la materia',
          icon: 'error',
          ...swalTheme,
          showCancelButton: false,
        });
        return;
      }

      const nueva = result.payload?.materia || result.payload;
      await dispatch(fetchAllMaterias());

      if (nueva?.id_materia) handleMateriaSelect(nueva);

      setMateriaSection('none');
      Swal.fire({
        title: '¡Materia creada!',
        text: `"${materiaInlineForm.nombre}" fue registrada y seleccionada.`,
        icon: 'success',
        ...swalTheme,
        showCancelButton: false,
      });
    } else if (materiaSection === 'edit') {
      const result = await dispatch(
        updateMateria({
          id: materiaObj.id_materia,
          data: {
            codigo: materiaInlineForm.codigo.trim().toUpperCase(),
            nombre: materiaInlineForm.nombre.trim(),
            categoria: materiaInlineForm.categoria.trim(),
            estado: materiaInlineForm.estado,
          },
        })
      );

      if (updateMateria.rejected.match(result)) {
        Swal.fire({
          title: 'Error',
          text: result.payload?.message || result.payload?.msg || 'No se pudo actualizar la materia',
          icon: 'error',
          ...swalTheme,
          showCancelButton: false,
        });
        return;
      }

      const updated = result.payload?.materia || result.payload;
      setMateriaObj(updated);
      await dispatch(fetchAllMaterias());
      setMateriaSection('none');

      Swal.fire({
        title: '¡Materia actualizada!',
        text: `"${materiaInlineForm.nombre}" actualizada correctamente.`,
        icon: 'success',
        ...swalTheme,
        showCancelButton: false,
      });
    }
  };

  const handleDocenteSelect = (doc) => {
    setDocenteObj(doc);
    setCursoForm((p) => ({
      ...p,
      docente_id_docente: doc ? String(doc.id_docente) : '',
    }));
    if (cursoErrors.docente_id_docente) {
      setCursoErrors((p) => ({ ...p, docente_id_docente: '' }));
    }
  };

  const togglePrereq = (id_materia) => {
    if (!cursoEditable) return;

    const sid = String(id_materia);
    setSelectedPrereqs((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  };

  const handleCursoFormChange = (e) => {
    const { name, value } = e.target;
    setCursoForm((p) => ({ ...p, [name]: value }));
    if (cursoErrors[name]) {
      setCursoErrors((p) => ({ ...p, [name]: '' }));
    }
  };

  const handleDiasChange = (diasStr) => {
    setCursoForm((p) => ({ ...p, dias_de_clases: diasStr }));
    if (cursoErrors.dias_de_clases) {
      setCursoErrors((p) => ({ ...p, dias_de_clases: '' }));
    }
  };

  const validateCurso = () => {
    const errs = {};
    if (!cursoForm.materia_id_materia) errs.materia_id_materia = 'Selecciona una materia';
    if (!cursoForm.docente_id_docente) errs.docente_id_docente = 'Selecciona un docente';
    if (!cursoForm.periodo) errs.periodo = 'Selecciona un período';
    if (!cursoForm.cupos || Number(cursoForm.cupos) <= 0) errs.cupos = 'Cupos > 0';
    if (!cursoForm.precio || Number(cursoForm.precio) <= 0) errs.precio = 'Precio > 0';
    if (cursoForm.lecciones === '' || Number(cursoForm.lecciones) < 0) errs.lecciones = 'Requerido';
    if (cursoForm.horas_academicas === '' || Number(cursoForm.horas_academicas) < 0) {
      errs.horas_academicas = 'Requerido';
    }
    if (!cursoForm.hora_inicio) errs.hora_inicio = 'Requerido';
    if (!cursoForm.hora_fin) errs.hora_fin = 'Requerido';
    if (!cursoForm.descripcion?.trim()) errs.descripcion = 'Requerido';
    if (!cursoForm.aprenderas?.trim()) errs.aprenderas = 'Requerido';
    if (!cursoForm.dirigido?.trim()) errs.dirigido = 'Requerido';
    if (!cursoForm.contenido?.trim()) errs.contenido = 'Requerido';
    if (!cursoForm.dias_de_clases?.trim()) errs.dias_de_clases = 'Selecciona al menos un día';

    setCursoErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const syncPrerequisitos = async (id_materia) => {
    const toAdd = selectedPrereqs.filter((id) => !originalPrereqs.includes(id));
    const toRemove = originalPrereqs.filter((id) => !selectedPrereqs.includes(id));

    for (const idPrereq of toAdd) {
      await dispatch(
        createPrerequisito({
          materia_id_materia: Number(id_materia),
          materia_id_materia_prereq: Number(idPrereq),
        })
      );
    }

    for (const idPrereq of toRemove) {
      const prereqList = Array.isArray(prerequisitos) ? prerequisitos : [];
      const rec = prereqList.find(
        (p) => String(p.materia_id_materia_prereq) === String(idPrereq)
      );
      if (rec) await dispatch(deletePrerequisito(rec.id_materia_prereq));
    }
  };

  const handleSaveCurso = async () => {
    if (!validateCurso()) return;

    const payload = {
      periodo: cursoForm.periodo,
      cupos: Number(cursoForm.cupos),
      precio: Number(cursoForm.precio),
      estado: 'ACTIVO',
      materia_id_materia: Number(cursoForm.materia_id_materia),
      docente_id_docente: Number(cursoForm.docente_id_docente),
      lecciones: Number(cursoForm.lecciones),
      horas_academicas: Number(cursoForm.horas_academicas),
      hora_inicio: cursoForm.hora_inicio,
      hora_fin: cursoForm.hora_fin,
      descripcion: cursoForm.descripcion.trim(),
      aprenderas: cursoForm.aprenderas.trim(),
      dirigido: cursoForm.dirigido.trim(),
      contenido: cursoForm.contenido.trim(),
      dias_de_clases: cursoForm.dias_de_clases.trim(),
    };

    if (editTarget) {
      const confirm = await Swal.fire({
        title: '¿Guardar cambios?',
        text: `Actualizar curso de ${materiaObj?.nombre || ''}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar',
        ...swalTheme,
      });

      if (!confirm.isConfirmed) return;

      const result = await dispatch(updateCurso({ id: editTarget.id_curso, data: payload }));

      if (updateCurso.rejected.match(result)) {
        Swal.fire({
          title: 'Error',
          text:
            typeof result.payload === 'string'
              ? result.payload
              : result.payload?.msg || result.payload?.message || 'No se pudo actualizar',
          icon: 'error',
          ...swalTheme,
          showCancelButton: false,
        });
        return;
      }

      await syncPrerequisitos(cursoForm.materia_id_materia);
      setShowCursoModal(false);

      Swal.fire({
        title: '¡Actualizado!',
        text: 'El curso fue actualizado.',
        icon: 'success',
        ...swalTheme,
        showCancelButton: false,
      });
    } else {
      const confirm = await Swal.fire({
        title: '¿Crear curso?',
        text: `Registrar ${materiaObj?.nombre || ''} — ${cursoForm.periodo}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar',
        ...swalTheme,
      });

      if (!confirm.isConfirmed) return;

      const result = await dispatch(createCurso(payload));

      if (createCurso.rejected.match(result)) {
        Swal.fire({
          title: 'Error',
          text:
            typeof result.payload === 'string'
              ? result.payload
              : result.payload?.msg || result.payload?.message || 'No se pudo crear',
          icon: 'error',
          ...swalTheme,
          showCancelButton: false,
        });
        return;
      }

      for (const idPrereq of selectedPrereqs) {
        await dispatch(
          createPrerequisito({
            materia_id_materia: Number(cursoForm.materia_id_materia),
            materia_id_materia_prereq: Number(idPrereq),
          })
        );
      }

      setShowCursoModal(false);

      Swal.fire({
        title: '¡Creado!',
        text: 'El curso fue registrado.',
        icon: 'success',
        ...swalTheme,
        showCancelButton: false,
      });
    }

    triggerSearch({ page: 1 });
  };

  const handleDelete = async (curso) => {
    const inscritosActuales = getInscritosActuales(curso);

    if (inscritosActuales > 0) {
      Swal.fire({
        title: 'No se puede eliminar',
        html: `
          <div style="text-align:left; color:#4D5756; line-height:1.6;">
            <p>Este curso tiene <strong>${inscritosActuales}</strong> estudiante(s) inscrito(s).</p>
            <p>Si necesitas devolverles el dinero como <strong>saldo</strong>, debes usar la opción <strong>Cancelar curso</strong>.</p>
          </div>
        `,
        icon: 'warning',
        ...swalTheme,
        showCancelButton: false,
      });
      return;
    }

    const confirm = await Swal.fire({
      title: '¿Eliminar curso?',
      html: `
        <div style="text-align:left; color:#4D5756; line-height:1.6;">
          <p>Se eliminará <strong>${getCursoMateriaNombre(curso)}</strong> (${curso.periodo}).</p>
          <p>Esta acción es técnica y no genera devolución de saldo.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      ...swalTheme,
      confirmButtonColor: '#FE543D',
    });

    if (!confirm.isConfirmed) return;

    const result = await dispatch(deleteCurso(curso.id_curso));
    if (deleteCurso.rejected.match(result)) {
      Swal.fire({
        title: 'Error',
        text: result.payload?.message || result.payload?.msg || 'No se pudo eliminar',
        icon: 'error',
        ...swalTheme,
        showCancelButton: false,
      });
      return;
    }

    Swal.fire({
      title: 'Eliminado',
      text: 'El curso fue eliminado.',
      icon: 'success',
      ...swalTheme,
      showCancelButton: false,
    });

    if (showCursoModal) closeCursoModal();
    triggerSearch({ page: 1 });
  };

  const handleFinalizarCurso = async (curso) => {
    if (curso?.estado === 'FINALIZADO') return;

    const confirm = await Swal.fire({
      title: '¿Finalizar curso?',
      html: `
        <div style="text-align:left; color:#4D5756; line-height:1.6;">
          <p>El curso <strong>${getCursoMateriaNombre(curso)}</strong> se marcará como <strong>FINALIZADO</strong>.</p>
          <p>Esto significa que el curso ya concluyó normalmente.</p>
          <p style="margin-bottom:0;">No se generará devolución como saldo.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar',
      ...swalTheme,
    });

    if (!confirm.isConfirmed) return;

    const result = await dispatch(finalizarCurso(curso.id_curso));

    if (finalizarCurso.rejected.match(result)) {
      Swal.fire({
        title: 'Error',
        text:
          result.payload?.msg ||
          result.payload?.message ||
          'No se pudo finalizar el curso',
        icon: 'error',
        ...swalTheme,
        showCancelButton: false,
      });
      return;
    }

    Swal.fire({
      title: 'Curso finalizado',
      text: 'El curso fue finalizado correctamente.',
      icon: 'success',
      ...swalTheme,
      showCancelButton: false,
    });

    if (showCursoModal) closeCursoModal();
    triggerSearch({ page: currentPage });
  };

  const handleCancelarCurso = async (curso) => {
    const inscritosActuales = getInscritosActuales(curso);

    if (inscritosActuales > LIMITE_CANCELACION) {
      Swal.fire({
        title: 'No disponible',
        html: `
          <div style="text-align:left; color:#4D5756; line-height:1.6;">
            <p>Solo se puede cancelar un curso cuando tiene <strong>${LIMITE_CANCELACION} o menos</strong> inscritos.</p>
            <p><strong>Inscritos actuales:</strong> ${inscritosActuales}</p>
          </div>
        `,
        icon: 'info',
        ...swalTheme,
        showCancelButton: false,
      });
      return;
    }

    const advertencia = await Swal.fire({
      title: 'Advertencia importante',
      html: `
        <div style="text-align:left; color:#4D5756; line-height:1.6;">
          <p>Vas a <strong>cancelar</strong> el curso <strong>${getCursoMateriaNombre(curso)}</strong>.</p>
          <p><strong>Inscritos actuales:</strong> ${inscritosActuales}</p>
          <p>Si continúas, a los estudiantes inscritos <strong>se les devolverá el dinero como saldo a favor</strong>.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Entiendo, continuar',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#FE543D',
      ...swalTheme,
    });

    if (!advertencia.isConfirmed) return;

    const confirm = await Swal.fire({
      title: '¿Cancelar curso?',
      html: `
        <div style="text-align:left; color:#4D5756; line-height:1.6;">
          <p>Se cancelará el curso <strong>${getCursoMateriaNombre(curso)}</strong>.</p>
          <p>El sistema lo marcará como <strong>CANCELADO</strong>.</p>
          <p>Los estudiantes inscritos recibirán el monto pagado como <strong>saldo</strong>.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar curso',
      cancelButtonText: 'No',
      confirmButtonColor: '#FE543D',
      ...swalTheme,
    });

    if (!confirm.isConfirmed) return;

    const result = await dispatch(cancelarCurso(curso.id_curso));

    if (cancelarCurso.rejected.match(result)) {
      Swal.fire({
        title: 'Error',
        text:
          result.payload?.msg ||
          result.payload?.message ||
          'No se pudo cancelar el curso',
        icon: 'error',
        ...swalTheme,
        showCancelButton: false,
      });
      return;
    }

    const payload = result.payload || {};
    const totalAfectados = payload?.total_afectados ?? 0;
    const totalSaldo = payload?.total_saldo_generado ?? 0;

    Swal.fire({
      title: 'Curso cancelado',
      html: `
        <div style="text-align:left; color:#4D5756; line-height:1.6;">
          <p>El curso fue cancelado correctamente.</p>
          <p><strong>Estudiantes afectados:</strong> ${totalAfectados}</p>
          <p><strong>Saldo total devuelto:</strong> Bs. ${Number(totalSaldo || 0).toFixed(2)}</p>
        </div>
      `,
      icon: 'success',
      ...swalTheme,
      showCancelButton: false,
    });

    if (showCursoModal) closeCursoModal();
    triggerSearch({ page: currentPage });
  };

  const isSavingCurso = isCreating || isUpdating;
  const isSavingMateria = isCreatingMat || isUpdatingMat;
  const hasActiveFilters = search || filterPer || filterEstadoCurso || filterCat;

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

        .it-cadm-header__left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
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

        .it-cadm-btn-create:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          min-width: 1100px;
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
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

        .it-cadm-table__actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .it-cadm-table__estado-cell {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

        .it-cadm-state-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
          padding: 0 20px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 900;
          border: 1px solid #abefc6;
          background: #ecfdf3;
          color: #027a48;
          cursor: pointer;
          white-space: nowrap;
        }

        .it-cadm-state-btn:disabled {
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

        .it-cadm-modal--wide {
          max-width: 1080px;
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
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

        .it-cadm-modal__btn-save--green {
          background: linear-gradient(135deg, #12b76a 0%, #039855 100%);
          box-shadow: 0 14px 26px rgba(18, 183, 106, 0.18);
        }

        .it-cadm-modal__btn-save:disabled,
        .it-cadm-modal__btn-cancel:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .it-cadm-section {
          border: 1px solid #eaecf0;
          border-radius: 16px;
          padding: 16px;
          background: #fff;
        }

        .it-cadm-section__header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .it-cadm-section__icon {
          color: #7c5cff;
          font-size: 18px;
        }

        .it-cadm-section__title {
          font-size: 15px;
          font-weight: 900;
          color: #10233f;
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

        .it-cadm-field-row--3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .it-cadm-field-row--1-2 {
          grid-template-columns: 220px 1fr;
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

        .it-cadm-field__label-hint {
          color: #98a2b3 !important;
          font-size: 12px;
          font-weight: 700;
        }

        .it-cadm-field__input,
        .it-cadm-field__textarea {
          width: 100%;
          border: 1px solid #dfe6f0;
          border-radius: 13px;
          padding: 0 14px;
          background: #fbfcfe;
          color: #1f2937;
          font-size: 14px;
          font-weight: 600;
          outline: none;
          box-sizing: border-box;
        }

        .it-cadm-field__input {
          min-height: 46px;
        }

        .it-cadm-field__textarea {
          min-height: 110px;
          padding-top: 12px;
          padding-bottom: 12px;
          resize: vertical;
        }

        .it-cadm-field__input:focus,
        .it-cadm-field__textarea:focus {
          border-color: #8f7bff;
          box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.10);
          background: #fff;
        }

        .it-cadm-field__input.error,
        .it-cadm-field__textarea.error {
          border-color: #ef4444;
          background: #fff8f8;
        }

        .it-cadm-field__error {
          font-size: 12px;
          color: #ef4444;
          font-weight: 700;
        }

        .it-cadm-field__hint {
          margin: 0;
          font-size: 12px;
          color: #667085;
          font-weight: 600;
        }

        .it-cadm-field__loading {
          min-height: 46px;
          border: 1px dashed #d0d5dd;
          border-radius: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 14px;
          color: #667085;
          font-size: 14px;
          font-weight: 700;
          background: #fbfcfe;
        }

        .it-cadm-field__input--upper {
          text-transform: uppercase;
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

        .it-cadm-materia-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .it-cadm-materia-action-btn {
          height: 40px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid #dfe6f0;
          background: #fff;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          color: #344054;
          cursor: pointer;
        }

        .it-cadm-materia-action-btn.active {
          border-color: #8f7bff;
          background: #f7f4ff;
          color: #5b48dc;
        }

        .it-cadm-materia-inline {
          margin-top: 14px;
          border: 1px solid #e4e7ec;
          border-radius: 16px;
          padding: 16px;
          background: #fafbff;
          display: grid;
          gap: 14px;
        }

        .it-cadm-materia-inline__header {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .it-cadm-materia-inline__title {
          font-size: 14px;
          font-weight: 900;
          color: #10233f;
        }

        .it-cadm-materia-inline__hint {
          font-size: 12px;
          color: #667085;
          font-weight: 700;
        }

        .it-cadm-materia-inline__footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .it-cadm-prereq-search {
          position: relative;
        }

        .it-cadm-prereq-search__icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #98a2b3;
        }

        .it-cadm-prereq-search__input {
          width: 100%;
          height: 44px;
          border: 1px solid #dfe6f0;
          border-radius: 12px;
          padding: 0 40px 0 38px;
          background: #fff;
          font-size: 14px;
          font-weight: 600;
          outline: none;
        }

        .it-cadm-prereq-search__clear {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          cursor: pointer;
          color: #98a2b3;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .it-cadm-prereq-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .it-cadm-prereq-item {
          min-height: 40px;
          padding: 8px 12px;
          border: 1px solid #dfe6f0;
          border-radius: 12px;
          background: #fff;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          color: #344054;
        }

        .it-cadm-prereq-item.selected {
          border-color: #8f7bff;
          background: #f5f3ff;
          color: #5b48dc;
        }

        .it-cadm-prereq-item__code {
          font-weight: 900;
        }

        .it-cadm-prereq-item__remove {
          font-size: 14px;
        }

        .it-cadm-prereq-chips {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .it-cadm-prereq-chips__label {
          font-size: 12px;
          color: #667085;
          font-weight: 800;
        }

        .it-cadm-prereq-chips__list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .it-cadm-prereq-chip {
          border: none;
          border-radius: 999px;
          padding: 8px 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .it-cadm-prereq-chip--selected {
          background: #ede9fe;
          color: #5b48dc;
        }

        .it-cadm-prereq-chip__code {
          font-weight: 900;
        }

        .it-ss {
          position: relative;
        }

        .it-ss__input-wrap {
          position: relative;
        }

        .it-ss__input-wrap.error .it-ss__input {
          border-color: #ef4444;
          background: #fff8f8;
        }

        .it-ss__input-wrap.focused .it-ss__input {
          border-color: #8f7bff;
          box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.10);
          background: #fff;
        }

        .it-ss__icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #98a2b3;
          z-index: 1;
        }

        .it-ss__input {
          width: 100%;
          height: 46px;
          border: 1px solid #dfe6f0;
          border-radius: 13px;
          padding: 0 42px 0 42px;
          background: #fbfcfe;
          color: #1f2937;
          font-size: 14px;
          font-weight: 600;
          outline: none;
          box-sizing: border-box;
        }

        .it-ss__clear {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #98a2b3;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .it-ss__dropdown {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(100% + 6px);
          background: #fff;
          border: 1px solid #e4e7ec;
          border-radius: 14px;
          box-shadow: 0 20px 32px rgba(15, 23, 42, 0.10);
          padding: 6px;
          margin: 0;
          list-style: none;
          z-index: 40;
          max-height: 260px;
          overflow: auto;
        }

        .it-ss__option {
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          color: #344054;
        }

        .it-ss__option:hover,
        .it-ss__option.selected {
          background: #f5f3ff;
          color: #5b48dc;
        }

        .it-ss__empty {
          margin-top: 6px;
          font-size: 12px;
          color: #667085;
          font-weight: 700;
          padding: 10px 2px 0;
        }

        .it-dp {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .it-dp__days {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .it-dp__day {
          min-width: 52px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid #dfe6f0;
          background: #fff;
          color: #344054;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .it-dp__day.active {
          background: #f5f3ff;
          border-color: #8f7bff;
          color: #5b48dc;
        }

        .it-dp__label {
          margin: 0;
          font-size: 12px;
          color: #667085;
          font-weight: 700;
        }

        .it-dp.disabled .it-dp__day {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .it-cadm-spin {
          animation: it-cadm-spin 1s linear infinite;
        }

        @keyframes it-cadm-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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

          .it-cadm-field-row,
          .it-cadm-field-row--3,
          .it-cadm-field-row--1-2 {
            grid-template-columns: 1fr;
          }

          .it-cadm-pagination {
            flex-direction: column;
            align-items: flex-start;
          }

          .it-cadm-table {
            min-width: 980px;
          }
        }
      `}</style>

      <div className="it-cadm-shell">
        <div className="it-cadm-header">
          <div className="it-cadm-header__left">
            <p className="it-cadm-header__sub">
              {isLoadingCursos ? 'Cargando…' : `${totalItems} curso${totalItems !== 1 ? 's' : ''} en total`}
            </p>
          </div>

          <div className="it-cadm-header__actions">
            <button
              className="it-cadm-btn-create"
              onClick={openCreateCurso}
              disabled={isLoadingMat || isLoadingDoc}
            >
              <FiPlus /> <span>Nuevo curso</span>
            </button>
          </div>
        </div>

        <div className="it-cadm-toolbar">
          <div className="it-cadm-search">
            <FiSearch className="it-cadm-search__icon" />
            <input
              type="text"
              className="it-cadm-search__input"
              placeholder="Buscar por materia, código o docente…"
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
            <FiFilter /> <span>Filtros</span>
            {hasActiveFilters && <span className="it-cadm-filter-toggle__dot" />}
          </button>
        </div>

        {filterOpen && (
          <div className="it-cadm-filters">
            <div className="it-cadm-filters__group">
              <label className="it-cadm-filters__label">Período</label>
              <select
                className="it-cadm-filters__select"
                value={filterPer}
                onChange={(e) => setFilterPer(e.target.value)}
              >
                <option value="">Todos</option>
                {PERIODOS_FILTROS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="it-cadm-filters__group">
              <label className="it-cadm-filters__label">Categoría</label>
              <select
                className="it-cadm-filters__select"
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
              >
                <option value="">Todas</option>
                {categoriasUnicas.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="it-cadm-filters__group">
              <label className="it-cadm-filters__label">Estado del curso</label>
              <select
                className="it-cadm-filters__select"
                value={filterEstadoCurso}
                onChange={(e) => setFilterEstadoCurso(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="ACTIVO">Activo</option>
                <option value="FINALIZADO">Finalizado</option>
                <option value="CANCELADO">Cancelado</option>
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
                  <th>Título / Docente</th>
                  <th>Período</th>
                  <th>Cupos</th>
                  <th>Precio</th>
                  <th>Estado del curso</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {isLoadingCursos ? (
                  <tr>
                    <td colSpan={8} className="it-cadm-table__empty">
                      <FiLoader className="it-cadm-spin" style={{ fontSize: 28, marginBottom: 8 }} />
                      <p>Cargando cursos…</p>
                    </td>
                  </tr>
                ) : cursos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="it-cadm-table__empty">
                      <FiBook style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }} />
                      <p>No se encontraron cursos</p>
                    </td>
                  </tr>
                ) : (
                  cursos.map((c, idx) => {
                    const inscritosActuales = getInscritosActuales(c);
                    const estadoMeta = getEstadoCursoMeta(c);

                    return (
                      <tr key={c.id_curso} className="it-cadm-table__row">
                        <td className="it-cadm-table__num">
                          {(currentPage - 1) * PAGE_SIZE + idx + 1}
                        </td>

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

                        <td>
                          <span className="it-cadm-table__periodo">{c.periodo}</span>
                          <div style={{ marginTop: 6, fontSize: 12, color: '#667085' }}>
                            Inscritos: {inscritosActuales}
                          </div>
                        </td>

                        <td className="it-cadm-table__cupos">
                          {c.cupos} / {c.cupos_max ?? c.cupos}
                        </td>

                        <td className="it-cadm-table__precio">
                          Bs. {Number(c.precio).toFixed(2)}
                        </td>

                        <td>
                          <div className="it-cadm-table__estado-cell">
                            {c?.estado === 'ACTIVO' ? (
                              <button
                                className="it-cadm-state-btn"
                                onClick={() => handleFinalizarCurso(c)}
                                disabled={isFinalizando || isCancelando || isDeleting}
                                title="Finalizar curso"
                              >
                                <FiCheckCircle />
                                Finalizar
                              </button>
                            ) : estadoMeta ? (
                              <span
                                className="it-cadm-badge"
                                style={estadoMeta.style}
                              >
                                {estadoMeta.label}
                              </span>
                            ) : null}
                          </div>
                        </td>

                        <td>
                          <div className="it-cadm-table__actions">
                            <button
                              className="it-cadm-action-btn it-cadm-action-btn--edit"
                              onClick={() => openEditCurso(c)}
                              title="Editar"
                            >
                              <FiEdit2 />
                            </button>

                            <button
                              className="it-cadm-action-btn it-cadm-action-btn--delete"
                              onClick={() => handleDelete(c)}
                              disabled={isDeleting || isCancelando || isFinalizando}
                              title="Eliminar"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="it-cadm-pagination">
            <span className="it-cadm-pagination__info">
              Página {currentPage} de {totalPages}
            </span>
            <div className="it-cadm-pagination__btns">
              <button
                className="it-cadm-pagination__btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoadingCursos}
              >
                <FiChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`it-cadm-pagination__btn${n === currentPage ? ' active' : ''}`}
                  onClick={() => handlePageChange(n)}
                  disabled={isLoadingCursos}
                >
                  {n}
                </button>
              ))}

              <button
                className="it-cadm-pagination__btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoadingCursos}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCursoModal && (
        <div
          className="it-cadm-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && closeCursoModal()}
        >
          <div className="it-cadm-modal it-cadm-modal--wide">
            <div className="it-cadm-modal__header">
              <div className="it-cadm-modal__header-left">
                <div className="it-cadm-modal__header-icon">
                  <FiBook />
                </div>
                <h3 className="it-cadm-modal__title">
                  {editTarget ? 'Editar curso' : 'Nuevo curso'}
                </h3>
              </div>
              <button className="it-cadm-modal__close" onClick={closeCursoModal}>
                <FiX />
              </button>
            </div>

            <div className="it-cadm-modal__body">
              {editTarget && (
                <div
                  style={{
                    marginBottom: 18,
                    padding: '14px 16px',
                    borderRadius: 14,
                    border: '1px solid #eaecf0',
                    background: '#f9fafb',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#667085', marginBottom: 4 }}>
                        Estado actual del curso
                      </div>
                      <div style={{ fontWeight: 700, color: '#101828' }}>
                        {editTarget.estado || 'ACTIVO'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 13, color: '#667085', marginBottom: 4 }}>
                        Estudiantes inscritos
                      </div>
                      <div style={{ fontWeight: 700, color: '#101828' }}>
                        {getInscritosActuales(editTarget)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="it-cadm-section">
                <div className="it-cadm-section__header">
                  <FiLayers className="it-cadm-section__icon" />
                  <span className="it-cadm-section__title">Materia</span>
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">
                    Buscar materia <span>*</span>
                  </label>

                  {isLoadingMat ? (
                    <div className="it-cadm-field__loading">
                      <FiLoader className="it-cadm-spin" /> Cargando materias…
                    </div>
                  ) : (
                    <SearchableSelect
                      items={allMaterias || []}
                      displayFn={(m) => `[${m.codigo}] ${m.nombre}`}
                      filterFn={(m, q) =>
                        m.nombre.toLowerCase().includes(q.toLowerCase()) ||
                        m.codigo.toLowerCase().includes(q.toLowerCase()) ||
                        m.categoria?.toLowerCase().includes(q.toLowerCase())
                      }
                      value={materiaObj}
                      onChange={handleMateriaSelect}
                      placeholder="Escribe para buscar por nombre, código o categoría…"
                      error={!!cursoErrors.materia_id_materia}
                      disabled={!cursoEditable}
                    />
                  )}

                  {cursoErrors.materia_id_materia && (
                    <span className="it-cadm-field__error">{cursoErrors.materia_id_materia}</span>
                  )}

                  <div className="it-cadm-materia-actions">
                    <button
                      type="button"
                      className={`it-cadm-materia-action-btn${
                        materiaSection === 'create' ? ' active' : ''
                      }`}
                      onClick={() => toggleMateriaSection('create')}
                      disabled={!cursoEditable}
                    >
                      <FiPlus />
                      <span>Nueva materia</span>
                      {materiaSection === 'create' ? <FiChevronUp /> : <FiChevronDown />}
                    </button>

                    {materiaObj && (
                      <button
                        type="button"
                        className={`it-cadm-materia-action-btn${
                          materiaSection === 'edit' ? ' active' : ''
                        }`}
                        onClick={() => toggleMateriaSection('edit')}
                        disabled={!cursoEditable}
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
                          {materiaSection === 'create'
                            ? 'Crear nueva materia'
                            : `Editar: ${materiaObj?.nombre || ''}`}
                        </span>
                        <span className="it-cadm-materia-inline__hint">Paso opcional</span>
                      </div>

                      <div className="it-cadm-field-row it-cadm-field-row--1-2">
                        <div className="it-cadm-field">
                          <label className="it-cadm-field__label">
                            <FiTag /> Código <span>*</span>
                          </label>
                          <input
                            type="text"
                            name="codigo"
                            maxLength={6}
                            placeholder="Ej. MAT001"
                            className={`it-cadm-field__input it-cadm-field__input--upper${
                              materiaInlineErrs.codigo ? ' error' : ''
                            }`}
                            value={materiaInlineForm.codigo}
                            onChange={handleMateriaInlineChange}
                            disabled={!cursoEditable}
                          />
                          {materiaInlineErrs.codigo && (
                            <span className="it-cadm-field__error">{materiaInlineErrs.codigo}</span>
                          )}
                        </div>

                        <div className="it-cadm-field">
                          <label className="it-cadm-field__label">
                            <FiBook /> Nombre <span>*</span>
                          </label>
                          <input
                            type="text"
                            name="nombre"
                            maxLength={100}
                            placeholder="Ej. Matemáticas I"
                            className={`it-cadm-field__input${
                              materiaInlineErrs.nombre ? ' error' : ''
                            }`}
                            value={materiaInlineForm.nombre}
                            onChange={handleMateriaInlineChange}
                            disabled={!cursoEditable}
                          />
                          {materiaInlineErrs.nombre && (
                            <span className="it-cadm-field__error">{materiaInlineErrs.nombre}</span>
                          )}
                        </div>
                      </div>

                      <div className="it-cadm-field">
                        <label className="it-cadm-field__label">
                          <FiLayers /> Categoría <span>*</span>
                        </label>
                        <input
                          type="text"
                          name="categoria"
                          maxLength={100}
                          placeholder="Ej. Ciencias Exactas"
                          className={`it-cadm-field__input${
                            materiaInlineErrs.categoria ? ' error' : ''
                          }`}
                          value={materiaInlineForm.categoria}
                          onChange={handleMateriaInlineChange}
                          disabled={!cursoEditable}
                        />
                        {materiaInlineErrs.categoria && (
                          <span className="it-cadm-field__error">
                            {materiaInlineErrs.categoria}
                          </span>
                        )}
                      </div>

                      <div className="it-cadm-field">
                        <label className="it-cadm-field__label">
                          <FiBook /> Pre requisitos
                          <span className="it-cadm-field__label-hint">(de esta materia)</span>
                        </label>

                        {materiasParaPrereqs.length > 0 && (
                          <div className="it-cadm-prereq-search">
                            <FiSearch className="it-cadm-prereq-search__icon" />
                            <input
                              type="text"
                              className="it-cadm-prereq-search__input"
                              placeholder="Buscar materia pre requisito…"
                              value={prereqSearch}
                              onChange={(e) => setPrereqSearch(e.target.value)}
                              disabled={!cursoEditable}
                            />
                            {prereqSearch && (
                              <button
                                className="it-cadm-prereq-search__clear"
                                onClick={() => setPrereqSearch('')}
                                type="button"
                                disabled={!cursoEditable}
                              >
                                <FiX />
                              </button>
                            )}
                          </div>
                        )}

                        {!materiaObj && !cursoForm.materia_id_materia ? (
                          <p className="it-cadm-field__hint">
                            Selecciona una materia para gestionar pre requisitos.
                          </p>
                        ) : isLoadingPrereq ? (
                          <div className="it-cadm-field__loading">
                            <FiLoader className="it-cadm-spin" /> Cargando…
                          </div>
                        ) : prereqsFiltrados.length === 0 && prereqSearch ? (
                          <p className="it-cadm-field__hint">
                            Sin resultados para "{prereqSearch}"
                          </p>
                        ) : prereqsFiltrados.length === 0 ? (
                          <p className="it-cadm-field__hint">
                            No hay otras materias disponibles.
                          </p>
                        ) : (
                          <div className="it-cadm-prereq-list">
                            {prereqsFiltrados.map((m) => (
                              <button
                                key={m.id_materia}
                                type="button"
                                className={`it-cadm-prereq-item${
                                  selectedPrereqs.includes(String(m.id_materia))
                                    ? ' selected'
                                    : ''
                                }`}
                                onClick={() => togglePrereq(m.id_materia)}
                                disabled={!cursoEditable}
                              >
                                <span className="it-cadm-prereq-item__code">{m.codigo}</span>
                                <span className="it-cadm-prereq-item__name">{m.nombre}</span>
                                {selectedPrereqs.includes(String(m.id_materia)) && (
                                  <FiX className="it-cadm-prereq-item__remove" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}

                        {prereqsSeleccionadosDetalle.length > 0 && (
                          <div className="it-cadm-prereq-chips">
                            <span className="it-cadm-prereq-chips__label">Seleccionados:</span>
                            <div className="it-cadm-prereq-chips__list">
                              {prereqsSeleccionadosDetalle.map((m) => (
                                <button
                                  key={m.id_materia}
                                  type="button"
                                  className="it-cadm-prereq-chip it-cadm-prereq-chip--selected"
                                  onClick={() => togglePrereq(m.id_materia)}
                                  title="Clic para quitar"
                                  disabled={!cursoEditable}
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

                      <div className="it-cadm-materia-inline__footer">
                        <label className="it-cadm-toggle" style={{ marginRight: 'auto' }}>
                          <input
                            type="checkbox"
                            name="estado"
                            checked={materiaInlineForm.estado}
                            onChange={handleMateriaInlineChange}
                            disabled={!cursoEditable}
                          />
                          <span className="it-cadm-toggle__track" />
                          <span className="it-cadm-toggle__label">
                            Materia {materiaInlineForm.estado ? 'Activa' : 'Inactiva'}
                          </span>
                        </label>

                        <button
                          type="button"
                          className="it-cadm-modal__btn-cancel"
                          onClick={() => setMateriaSection('none')}
                          disabled={isSavingMateria}
                        >
                          Cancelar
                        </button>

                        <button
                          type="button"
                          className="it-cadm-modal__btn-save it-cadm-modal__btn-save--green"
                          onClick={handleSaveMateriaInline}
                          disabled={isSavingMateria || !cursoEditable}
                        >
                          {isSavingMateria ? (
                            <>
                              <FiLoader className="it-cadm-spin" /> Guardando…
                            </>
                          ) : materiaSection === 'create' ? (
                            'Crear materia'
                          ) : (
                            'Guardar cambios'
                          )}
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
                  <label className="it-cadm-field__label">
                    Buscar docente <span>*</span>
                  </label>
                  {isLoadingDoc ? (
                    <div className="it-cadm-field__loading">
                      <FiLoader className="it-cadm-spin" /> Cargando docentes…
                    </div>
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
                      disabled={!cursoEditable}
                    />
                  )}
                  {cursoErrors.docente_id_docente && (
                    <span className="it-cadm-field__error">{cursoErrors.docente_id_docente}</span>
                  )}
                </div>
              </div>

              <div className="it-cadm-section">
                <div className="it-cadm-section__header">
                  <MdOutlineSchool className="it-cadm-section__icon" />
                  <span className="it-cadm-section__title">Datos del curso</span>
                </div>

                <div className="it-cadm-field-row it-cadm-field-row--3">
                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label">
                      Período <span>*</span>
                    </label>
                    <select
                      name="periodo"
                      className={`it-cadm-field__input${cursoErrors.periodo ? ' error' : ''}`}
                      value={cursoForm.periodo}
                      onChange={handleCursoFormChange}
                      disabled={!cursoEditable}
                    >
                      <option value="">— Período —</option>
                      {PERIODOS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    {cursoErrors.periodo && (
                      <span className="it-cadm-field__error">{cursoErrors.periodo}</span>
                    )}
                  </div>

                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label">
                      Cupos máximos <span>*</span>
                    </label>
                    <input
                      type="number"
                      name="cupos"
                      min="1"
                      max="500"
                      placeholder="Ej. 30"
                      className={`it-cadm-field__input${cursoErrors.cupos ? ' error' : ''}`}
                      value={cursoForm.cupos}
                      onChange={handleCursoFormChange}
                      disabled={!cursoEditable}
                    />
                    {cursoErrors.cupos && (
                      <span className="it-cadm-field__error">{cursoErrors.cupos}</span>
                    )}
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
                      className={`it-cadm-field__input${cursoErrors.precio ? ' error' : ''}`}
                      value={cursoForm.precio}
                      onChange={handleCursoFormChange}
                      disabled={!cursoEditable}
                    />
                    {cursoErrors.precio && (
                      <span className="it-cadm-field__error">{cursoErrors.precio}</span>
                    )}
                  </div>
                </div>

                <div className="it-cadm-field-row">
                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label">
                      <FiList /> Lecciones <span>*</span>
                    </label>
                    <input
                      type="number"
                      name="lecciones"
                      min="0"
                      placeholder="Ej. 20"
                      className={`it-cadm-field__input${cursoErrors.lecciones ? ' error' : ''}`}
                      value={cursoForm.lecciones}
                      onChange={handleCursoFormChange}
                      disabled={!cursoEditable}
                    />
                    {cursoErrors.lecciones && (
                      <span className="it-cadm-field__error">{cursoErrors.lecciones}</span>
                    )}
                  </div>

                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label">
                      <FiBook /> Horas académicas <span>*</span>
                    </label>
                    <input
                      type="number"
                      name="horas_academicas"
                      min="0"
                      placeholder="Ej. 40"
                      className={`it-cadm-field__input${
                        cursoErrors.horas_academicas ? ' error' : ''
                      }`}
                      value={cursoForm.horas_academicas}
                      onChange={handleCursoFormChange}
                      disabled={!cursoEditable}
                    />
                    {cursoErrors.horas_academicas && (
                      <span className="it-cadm-field__error">
                        {cursoErrors.horas_academicas}
                      </span>
                    )}
                  </div>
                </div>

                <div className="it-cadm-field-row">
                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label">
                      <FiClock /> Hora inicio <span>*</span>
                    </label>
                    <input
                      type="time"
                      name="hora_inicio"
                      className={`it-cadm-field__input${
                        cursoErrors.hora_inicio ? ' error' : ''
                      }`}
                      value={cursoForm.hora_inicio}
                      onChange={handleCursoFormChange}
                      disabled={!cursoEditable}
                    />
                    {cursoErrors.hora_inicio && (
                      <span className="it-cadm-field__error">{cursoErrors.hora_inicio}</span>
                    )}
                  </div>

                  <div className="it-cadm-field">
                    <label className="it-cadm-field__label">
                      <FiClock /> Hora fin <span>*</span>
                    </label>
                    <input
                      type="time"
                      name="hora_fin"
                      className={`it-cadm-field__input${cursoErrors.hora_fin ? ' error' : ''}`}
                      value={cursoForm.hora_fin}
                      onChange={handleCursoFormChange}
                      disabled={!cursoEditable}
                    />
                    {cursoErrors.hora_fin && (
                      <span className="it-cadm-field__error">{cursoErrors.hora_fin}</span>
                    )}
                  </div>
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">
                    Días de clases <span>*</span>
                  </label>
                  <DayPicker
                    value={cursoForm.dias_de_clases}
                    onChange={handleDiasChange}
                    error={!!cursoErrors.dias_de_clases}
                    disabled={!cursoEditable}
                  />
                  {cursoErrors.dias_de_clases && (
                    <span className="it-cadm-field__error">{cursoErrors.dias_de_clases}</span>
                  )}
                </div>
              </div>

              <div className="it-cadm-section">
                <div className="it-cadm-section__header">
                  <FiInfo className="it-cadm-section__icon" />
                  <span className="it-cadm-section__title">Información del curso</span>
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">
                    Descripción <span>*</span>
                  </label>
                  <textarea
                    name="descripcion"
                    rows={3}
                    placeholder="Descripción general del curso…"
                    className={`it-cadm-field__textarea${
                      cursoErrors.descripcion ? ' error' : ''
                    }`}
                    value={cursoForm.descripcion}
                    onChange={handleCursoFormChange}
                    disabled={!cursoEditable}
                  />
                  {cursoErrors.descripcion && (
                    <span className="it-cadm-field__error">{cursoErrors.descripcion}</span>
                  )}
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">
                    <FiTarget /> ¿Qué aprenderás? <span>*</span>
                  </label>
                  <textarea
                    name="aprenderas"
                    rows={3}
                    placeholder="Objetivos de aprendizaje…"
                    className={`it-cadm-field__textarea${
                      cursoErrors.aprenderas ? ' error' : ''
                    }`}
                    value={cursoForm.aprenderas}
                    onChange={handleCursoFormChange}
                    disabled={!cursoEditable}
                  />
                  {cursoErrors.aprenderas && (
                    <span className="it-cadm-field__error">{cursoErrors.aprenderas}</span>
                  )}
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">
                    <FiUser /> ¿A quién va dirigido? <span>*</span>
                  </label>
                  <textarea
                    name="dirigido"
                    rows={2}
                    placeholder="Perfil del estudiante…"
                    className={`it-cadm-field__textarea${cursoErrors.dirigido ? ' error' : ''}`}
                    value={cursoForm.dirigido}
                    onChange={handleCursoFormChange}
                    disabled={!cursoEditable}
                  />
                  {cursoErrors.dirigido && (
                    <span className="it-cadm-field__error">{cursoErrors.dirigido}</span>
                  )}
                </div>

                <div className="it-cadm-field">
                  <label className="it-cadm-field__label">
                    <FiList /> Contenido / Temario <span>*</span>
                  </label>
                  <textarea
                    name="contenido"
                    rows={4}
                    placeholder="Unidades, temas, módulos…"
                    className={`it-cadm-field__textarea${
                      cursoErrors.contenido ? ' error' : ''
                    }`}
                    value={cursoForm.contenido}
                    onChange={handleCursoFormChange}
                    disabled={!cursoEditable}
                  />
                  {cursoErrors.contenido && (
                    <span className="it-cadm-field__error">{cursoErrors.contenido}</span>
                  )}
                </div>
              </div>
            </div>

            <div
              className="it-cadm-modal__footer"
              style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}
            >
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {editTarget?.estado === 'ACTIVO' && (
                  <>
                    {mostrarBotonCancelarEnModal && (
                      <button
                        type="button"
                        className="it-cadm-modal__btn-cancel"
                        onClick={() => handleCancelarCurso(editTarget)}
                        disabled={isCancelando || isFinalizando || isSavingCurso}
                        style={{
                          background: '#fff1f3',
                          color: '#c01048',
                          border: '1px solid #fbcfe8',
                        }}
                      >
                        {isCancelando ? (
                          <>
                            <FiLoader className="it-cadm-spin" /> Cancelando…
                          </>
                        ) : (
                          <>
                            <FiAlertTriangle style={{ marginRight: 6 }} />
                            Cancelar curso
                          </>
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="it-cadm-modal__btn-cancel"
                  onClick={closeCursoModal}
                  disabled={isSavingCurso}
                >
                  Cerrar
                </button>

                <button
                  className="it-cadm-modal__btn-save"
                  onClick={handleSaveCurso}
                  disabled={isSavingCurso || !cursoEditable}
                >
                  {isSavingCurso ? (
                    <>
                      <FiLoader className="it-cadm-spin" /> Guardando…
                    </>
                  ) : editTarget ? (
                    'Guardar cambios'
                  ) : (
                    'Crear curso'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesAdmin;