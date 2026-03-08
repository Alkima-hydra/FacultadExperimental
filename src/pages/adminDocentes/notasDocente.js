import React, { useEffect, useMemo, useState } from 'react';
import {
    FiSearch, FiChevronDown, FiSave, FiUser,
    FiCheckCircle, FiAlertCircle, FiAward, FiBook, FiEdit3
} from 'react-icons/fi';
import Swal from 'sweetalert2';

// para consumo
import { fetchCursosByDocenteId } from './slicesCursos/CursosThunk';
import { fetchNotasByCursoId, registrarNota } from './slicesNotas/NotasThunk';
import { selectCursosState } from './slicesCursos/CursosSlices';
import { selectNotasState } from './slicesNotas/NotasSlices';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUserId,
  selectToken,
  selectIsAuthenticated,
} from "../signin/slices/loginSelectors";

//consumo 
const getAuthFromLocalStorage = () => {
    const possibleKeys = [
        'auth',
        'user',
        'usuario',
        'login',
        'authUser',
        'userData',
        'persist:root',
    ];

    for (const key of possibleKeys) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;

        try {
            const parsed = JSON.parse(raw);

            if (parsed?.id && parsed?.token) {
                return parsed;
            }

            if (key === 'persist:root') {
                const loginRaw = parsed?.login;
                if (loginRaw) {
                    const loginParsed = JSON.parse(loginRaw);
                    if (loginParsed?.id && loginParsed?.token) {
                        return loginParsed;
                    }
                }
            }
        } catch (error) {
            console.warn(`No se pudo leer la key ${key} del localStorage`, error);
        }
    }

    return null;
};

const mapCursoFromApi = (curso) => ({
    id: curso?.id_curso ?? curso?.id,
    title: curso?.materia?.nombre || curso?.nombre_materia || curso?.title || 'Curso sin nombre',
    category: curso?.categoria || curso?.materia?.categoria || 'Materia',
    raw: curso,
});

const mapNotaToStudent = (item) => {
    const estudiante = item?.estudiante || item?.usuario || item?.raw?.estudiante || {};
    const nombreCompleto = [
        estudiante?.nombres,
        estudiante?.apellido_paterno,
        estudiante?.apellido_materno,
    ].filter(Boolean).join(' ');

    return {
        id: item?.id_matricula ?? item?.inscritos_id_matricula ?? item?.id,
        name: nombreCompleto || item?.name || 'Estudiante sin nombre',
        avatar: `https://i.pravatar.cc/40?u=${estudiante?.mail || item?.id_matricula || item?.id || Math.random()}`,
        nota: item?.nota_final ?? item?.nota ?? null,
        aprobado: item?.aprobado ?? null,
        raw: item,
    };
};

const getCursosArray = (state) => {
    if (Array.isArray(state)) return state;
    if (Array.isArray(state?.cursos)) return state.cursos;
    if (Array.isArray(state?.data)) return state.data;
    if (Array.isArray(state?.items)) return state.items;
    if (Array.isArray(state?.payload)) return state.payload;
    if (Array.isArray(state?.rows)) return state.rows;
    if (Array.isArray(state?.data?.cursos)) return state.data.cursos;
    if (Array.isArray(state?.payload?.cursos)) return state.payload.cursos;
    return [];
};

const getNotasArray = (state) => {
    if (Array.isArray(state)) return state;
    if (Array.isArray(state?.notasPorEstudiante)) return state.notasPorEstudiante;
    if (Array.isArray(state?.estudiantes)) return state.estudiantes;
    if (Array.isArray(state?.notas)) return state.notas;
    if (Array.isArray(state?.data)) return state.data;
    if (Array.isArray(state?.payload)) return state.payload;
    if (Array.isArray(state?.data?.estudiantes)) return state.data.estudiantes;
    if (Array.isArray(state?.payload?.estudiantes)) return state.payload.estudiantes;
    if (Array.isArray(state?.data?.notasPorEstudiante)) return state.data.notasPorEstudiante;
    if (Array.isArray(state?.payload?.notasPorEstudiante)) return state.payload.notasPorEstudiante;
    return [];
};

const unwrapThunkPayload = (value) => {
    if (!value) return null;
    if (value.payload) return value.payload;
    return value;
};

/* ─── Mock data ─────────────────────────────────────────────── */
const COURSES = [
    {
        id: 1,
        title: 'Estadística, Ciencia De Datos Y Análisis De Negocios',
        category: 'Ciencia de Datos',
        students: [
            { id: 101, name: 'María González',   avatar: 'https://i.pravatar.cc/40?img=10', nota: null },
            { id: 102, name: 'Carlos Mamani',    avatar: 'https://i.pravatar.cc/40?img=11', nota: 85  },
            { id: 103, name: 'Lucía Flores',     avatar: 'https://i.pravatar.cc/40?img=12', nota: 72  },
            { id: 104, name: 'Andrés Quispe',    avatar: 'https://i.pravatar.cc/40?img=13', nota: null },
            { id: 105, name: 'Valentina Cruz',   avatar: 'https://i.pravatar.cc/40?img=14', nota: 91  },
            { id: 106, name: 'Diego Rojas',      avatar: 'https://i.pravatar.cc/40?img=15', nota: 55  },
        ],
    },
    {
        id: 2,
        title: 'Adobe Illustrator Para Diseño Gráfico (De Cero A Pro)',
        category: 'Diseño',
        students: [
            { id: 201, name: 'Sofía Vargas',     avatar: 'https://i.pravatar.cc/40?img=20', nota: null },
            { id: 202, name: 'Mateo Condori',    avatar: 'https://i.pravatar.cc/40?img=21', nota: 78  },
            { id: 203, name: 'Isabella Pérez',   avatar: 'https://i.pravatar.cc/40?img=22', nota: null },
            { id: 204, name: 'Sebastián Ávila',  avatar: 'https://i.pravatar.cc/40?img=23', nota: 63  },
        ],
    },
    {
        id: 3,
        title: 'SEO Desde Cero: Posiciona Tu Negocio En Google',
        category: 'Marketing Digital',
        students: [
            { id: 301, name: 'Camila Torres',    avatar: 'https://i.pravatar.cc/40?img=30', nota: 88  },
            { id: 302, name: 'Nicolás Huanca',   avatar: 'https://i.pravatar.cc/40?img=31', nota: 95  },
            { id: 303, name: 'Valeria Mendoza',  avatar: 'https://i.pravatar.cc/40?img=32', nota: 71  },
            { id: 304, name: 'Emilio Cárdenas',  avatar: 'https://i.pravatar.cc/40?img=33', nota: 49  },
            { id: 305, name: 'Paula Salinas',    avatar: 'https://i.pravatar.cc/40?img=34', nota: null },
        ],
    },
];

/* ─── Helpers ───────────────────────────────────────────────── */
const getGrade = (nota) => {
    if (nota === null) return { label: 'Sin nota', color: '#9FA8C7', bg: '#F3F4F8' };
    if (nota >= 90)    return { label: 'Excelente', color: '#16A34A', bg: '#F0FDF4' };
    if (nota >= 75)    return { label: 'Bueno',     color: '#2563EB', bg: '#EFF6FF' };
    if (nota >= 60)    return { label: 'Regular',   color: '#D97706', bg: '#FFFBEB' };
    return                    { label: 'Reprobado', color: '#DC2626', bg: '#FEF2F2' };
};

const NotaBar = ({ nota }) => {
    if (nota === null) return null;
    const color = nota >= 75 ? '#22C55E' : nota >= 60 ? '#F59E0B' : '#EF4444';
    return (
        <div className="dn-bar-track">
            <div className="dn-bar-fill" style={{ width: `${nota}%`, background: color }} />
        </div>
    );
};

/* ─── Student Row ───────────────────────────────────────────── */
const StudentRow = ({ student, draft, onChange, onSave, saving }) => {
    const grade      = getGrade(student.nota);
    const isDirty    = draft !== '' && Number(draft) !== student.nota;
    const inputValid = draft === '' || (Number(draft) >= 0 && Number(draft) <= 100);

    return (
        <tr className="dn-row">
            <td className="dn-td dn-td--student">
                <div className="dn-student-info">
                    <span className="dn-student-name">{student.name}</span>
                </div>
            </td>
            <td className="dn-td dn-td--current">
                {student.nota !== null
                    ? <span className="dn-nota-display">{student.nota}<span className="dn-nota-max">/100</span></span>
                    : <span className="dn-no-nota">—</span>
                }
                <NotaBar nota={student.nota} />
            </td>
            <td className="dn-td dn-td--badge">
                <span className="dn-grade-badge" style={{ color: grade.color, background: grade.bg }}>
                    {student.nota !== null
                        ? (grade.label === 'Reprobado' ? <FiAlertCircle size={11} /> : <FiCheckCircle size={11} />)
                        : null
                    }
                    {grade.label}
                </span>
            </td>
            <td className="dn-td dn-td--input">
                <div className="dn-input-wrap">
                    <input
                        className={`dn-input${!inputValid ? ' dn-input--error' : ''}`}
                        type="number"
                        min="0" max="100"
                        placeholder={student.nota !== null ? `${student.nota}` : 'Ej: 85'}
                        value={draft}
                        onChange={e => onChange(e.target.value)}
                    />
                    {!inputValid && <span className="dn-input-hint">0 – 100</span>}
                </div>
            </td>
            <td className="dn-td dn-td--action">
                <button
                    className={`dn-save-btn${isDirty && inputValid ? ' dn-save-btn--active' : ''}`}
                    disabled={!isDirty || !inputValid || saving}
                    onClick={() => onSave(student.id, Number(draft))}
                >
                    <FiSave size={13} />
                    {saving ? 'Guardando…' : 'Guardar'}
                </button>
            </td>
        </tr>
    );
};

/* ─── Main ──────────────────────────────────────────────────── */
const DocenteNotas = () => {
    const dispatch = useDispatch();
    const cursosState = useSelector(selectCursosState);
    const notasState = useSelector(selectNotasState);
    const userIdFromStore = useSelector(selectUserId);
    const tokenFromStore = useSelector(selectToken);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const localAuth = useMemo(() => getAuthFromLocalStorage(), []);
    const docenteId = userIdFromStore || localAuth?.id;
    const token = tokenFromStore || localAuth?.token;

    const [selectedId, setSelectedId] = useState(null);
    const [drafts, setDrafts] = useState({});
    const [saving, setSaving] = useState(null);
    const [search, setSearch] = useState('');
    const [ddOpen, setDdOpen] = useState(false);
    const [coursesData, setCoursesData] = useState([]);
    const [notesData, setNotesData] = useState([]);
    const [loadingCursos, setLoadingCursos] = useState(false);
    const [errorCursos, setErrorCursos] = useState('');
    const [loadingNotas, setLoadingNotas] = useState(false);
    const [errorNotas, setErrorNotas] = useState('');

    const cursosApi = coursesData.length > 0 ? coursesData : getCursosArray(cursosState);
    const courses = cursosApi.map(mapCursoFromApi);

    useEffect(() => {
        const cargarCursos = async () => {
            if (!docenteId) {
                setCoursesData([]);
                setErrorCursos('No se encontró el docente en la sesión.');
                return;
            }

            try {
                setLoadingCursos(true);
                setErrorCursos('');

                const action = await dispatch(fetchCursosByDocenteId(docenteId));
                const payload = unwrapThunkPayload(action);
                const cursosDesdeThunk = getCursosArray(payload);
                const cursosDesdeState = getCursosArray(cursosState);
                const cursosFinales = cursosDesdeThunk.length > 0 ? cursosDesdeThunk : cursosDesdeState;

                console.log('payload cursos thunk:', payload);
                console.log('cursosState selector:', cursosState);
                console.log('cursosFinales:', cursosFinales);

                setCoursesData(cursosFinales);

                if (cursosFinales.length === 0) {
                    setErrorCursos('La API respondió, pero no se encontraron cursos para mostrar en el selector.');
                }
            } catch (error) {
                console.error('Error al cargar cursos del docente:', error);
                setCoursesData([]);
                setErrorCursos('No se pudieron cargar los cursos del docente.');
            } finally {
                setLoadingCursos(false);
            }
        };

        cargarCursos();
    }, [dispatch, docenteId]);

    useEffect(() => {
        if (courses.length > 0) {
            if (!selectedId || !courses.some(c => c.id === selectedId)) {
                setSelectedId(courses[0].id);
            }
        } else {
            setSelectedId(null);
        }
    }, [courses, selectedId]);

    useEffect(() => {
        const cargarNotas = async () => {
            if (!selectedId) {
                setNotesData([]);
                return;
            }

            try {
                setLoadingNotas(true);
                setErrorNotas('');

                const action = await dispatch(fetchNotasByCursoId(selectedId));
                const payload = unwrapThunkPayload(action);
                const notasDesdeThunk = getNotasArray(payload);
                const notasDesdeState = getNotasArray(notasState);
                const notasFinales = notasDesdeThunk.length > 0 ? notasDesdeThunk : notasDesdeState;

                console.log('payload notas thunk:', payload);
                console.log('notasState selector:', notasState);
                console.log('notasFinales:', notasFinales);

                setNotesData(notasFinales);

                if (notasFinales.length === 0) {
                    setErrorNotas('La API respondió, pero no se encontraron estudiantes para este curso.');
                }
            } catch (error) {
                console.error('Error al cargar notas:', error);
                setNotesData([]);
                setErrorNotas('No se pudieron cargar las notas del curso.');
            } finally {
                setLoadingNotas(false);
            }
        };

        cargarNotas();
    }, [dispatch, selectedId]);

    const notasApi = notesData.length > 0 ? notesData : getNotasArray(notasState);
    const students = notasApi.map(mapNotaToStudent);

    const course = (() => {
        const found = courses.find(c => c.id === selectedId) || {
            id: null,
            title: 'Sin curso',
            category: 'Materia',
        };

        return {
            ...found,
            students,
        };
    })();

    const filtered = course.students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const calificados = course.students.filter(s => s.nota !== null).length;
    const promedio = course.students.filter(s => s.nota !== null).length
        ? Math.round(
            course.students.filter(s => s.nota !== null).reduce((a, s) => a + s.nota, 0) /
            course.students.filter(s => s.nota !== null).length
        )
        : null;

    const aprobados = course.students.filter(s => s.nota !== null && s.nota >= 51).length;
    const reprobados = course.students.filter(s => s.nota !== null && s.nota < 51).length;

    const handleChange = (studentId, val) => {
        setDrafts(d => ({ ...d, [studentId]: val }));
    };

    const guardarNotaThunk = async (idMatricula, notaFinal) => {
        const payloadRegistro = {
            cursoId: Number(selectedId),
            data: {
                notas: [
                {
                    id_matricula: Number(idMatricula),
                    nota_final: Number(notaFinal),
                },
            ],
            }
        };

        console.log('payload registrarNota:', payloadRegistro);

        const action = await dispatch(registrarNota(payloadRegistro));

        if (action?.meta?.requestStatus === 'rejected') {
            throw new Error(action?.payload?.msg || action?.error?.message || 'No se pudo guardar la nota');
        }

        return action;
    };

    const handleSave = async (studentId, nota) => {
        const student = course.students.find(s => s.id === studentId);
        setSaving(studentId);

        try {
            await guardarNotaThunk(studentId, nota);
            const refreshAction = await dispatch(fetchNotasByCursoId(selectedId));
            const refreshPayload = unwrapThunkPayload(refreshAction);
            const notasActualizadas = getNotasArray(refreshPayload);
            if (notasActualizadas.length > 0) {
                setNotesData(notasActualizadas);
            }

            setDrafts(d => {
                const n = { ...d };
                delete n[studentId];
                return n;
            });

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Nota de ${student?.name || 'estudiante'} guardada`,
                showConfirmButton: false,
                timer: 2200,
                timerProgressBar: true,
                didOpen: t => { t.style.borderRadius = '12px'; },
            });
        } catch (error) {
            console.error('Error al guardar nota:', error);
            Swal.fire({
                icon: 'error',
                title: 'No se pudo guardar la nota',
                text: error?.message || 'Ocurrió un error al registrar la nota.',
                confirmButtonColor: '#6D5DFD',
            });
        } finally {
            setSaving(null);
        }
    };

    const handleSaveAll = async () => {
        const pending = Object.entries(drafts).filter(([id, val]) =>
            val !== '' && Number(val) >= 0 && Number(val) <= 100
        );

        if (!pending.length) return;

        const res = await Swal.fire({
            title: 'Guardar todas las notas',
            html: `<div style="color:#5A6676;font-size:14px;line-height:1.5;margin-top:6px">
                     ¿Guardar las <strong style="color:#1A1F36">${pending.length} notas pendientes</strong>
                     para el curso<br/><strong style="color:#1A1F36">"${course.title}"</strong>?
                   </div>`,
            icon: 'question',
            width: 420,
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar todo',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            confirmButtonColor: '#6D5DFD',
            cancelButtonColor: '#98A2B3',
            didOpen: popup => {
                popup.style.borderRadius = '16px';
                const icon = popup.querySelector('.swal2-icon');
                if (icon) {
                    icon.style.transform = 'scale(0.78)';
                    icon.style.margin = '0 auto 6px';
                }
                const title = popup.querySelector('.swal2-title');
                if (title) {
                    title.style.fontSize = '18px';
                    title.style.fontWeight = '800';
                }
            },
        });

        if (!res.isConfirmed) return;

       try {
            const payloadRegistro = {
                cursoId: Number(selectedId),
                data: {
                    notas: pending.map(([id, val]) => ({
                        id_matricula: Number(id),
                        nota_final: Number(val),
                    })),
                },
            };

            console.log('payload registrarNota multiple:', payloadRegistro);

            const action = await dispatch(registrarNota(payloadRegistro));

            if (action?.meta?.requestStatus === 'rejected') {
                throw new Error(action?.payload?.msg || action?.error?.message || 'No se pudieron guardar las notas');
            }

            const refreshAction = await dispatch(fetchNotasByCursoId(selectedId));
            const refreshPayload = unwrapThunkPayload(refreshAction);
            const notasActualizadas = getNotasArray(refreshPayload);

            if (notasActualizadas.length > 0) {
                setNotesData(notasActualizadas);
            }

            setDrafts({});

            Swal.fire({
                title: '¡Notas guardadas!',
                text: `${pending.length} notas actualizadas correctamente.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                didOpen: p => { p.style.borderRadius = '16px'; },
            });
        } catch (error) {
            console.error('Error al guardar todas las notas:', error);
            Swal.fire({
                icon: 'error',
                title: 'No se pudieron guardar las notas',
                text: error?.message || 'Revisa el thunk o el endpoint de registro de notas.',
                confirmButtonColor: '#6D5DFD',
            });
        }
    };

    const pendingCount = Object.values(drafts).filter(v => v !== '').length;
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');

                .dn-root {
                    min-height: 100%;
                    padding: 36px 32px;
                    background: #EDEEF5;
                    font-family: 'DM Sans', sans-serif;
                    box-sizing: border-box;
                }

                /* ── Header ── */
                .dn-header {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap; gap: 14px;
                    margin-bottom: 24px;
                }
                .dn-header__left { display: flex; align-items: center; gap: 10px; }
                .dn-header__pill { width: 8px; height: 24px; background: #6D5DFD; border-radius: 4px; }
                .dn-header__title {
                  
                    font-size: 22px; color: #1A1F36; margin: 0;
                }

                /* ── Course selector ── */
                .dn-selector-row {
                    display: flex; align-items: flex-start;
                    gap: 14px; flex-wrap: wrap;
                    margin-bottom: 20px;
                }
                .dn-dropdown { position: relative; flex: 1; min-width: 260px; max-width: 480px; }
                .dn-dropdown__btn {
                    width: 100%; background: #fff;
                    border: 1.5px solid #DDE0EF; border-radius: 12px;
                    padding: 11px 16px; display: flex;
                    align-items: center; justify-content: space-between; gap: 10px;
                    cursor: pointer; font-family: 'DM Sans', sans-serif;
                    transition: border-color .15s, box-shadow .15s;
                }
                .dn-dropdown__btn:hover, .dn-dropdown__btn:focus {
                    border-color: #6D5DFD;
                    box-shadow: 0 0 0 3px rgba(109,93,253,.1);
                    outline: none;
                }
                .dn-dropdown__label {
                    display: flex; align-items: center; gap: 8px;
                }
                .dn-dropdown__icon { color: #6D5DFD; flex-shrink: 0; }
                .dn-dropdown__text { text-align: left; }
                .dn-dropdown__cat {
                    display: block; font-size: 10px; font-weight: 700;
                    color: #9FA8C7; letter-spacing: .6px; text-transform: uppercase;
                }
                .dn-dropdown__name {
                    display: block; font-size: 14px; font-weight: 600; color: #1A1F36;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 340px;
                }
                .dn-dropdown__chevron { color: #9FA8C7; transition: transform .2s; flex-shrink: 0; }
                .dn-dropdown__btn[aria-expanded="true"] .dn-dropdown__chevron { transform: rotate(180deg); }

                .dn-dropdown__menu {
                    position: absolute; top: calc(100% + 6px); left: 0; right: 0;
                    background: #fff; border: 1.5px solid #DDE0EF;
                    border-radius: 12px; overflow: hidden;
                    box-shadow: 0 8px 32px rgba(0,0,0,.1);
                    z-index: 50;
                    animation: dn-dd-open .18s ease;
                }
                @keyframes dn-dd-open {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .dn-dropdown__option {
                    display: flex; align-items: center; gap: 10px;
                    padding: 11px 16px; cursor: pointer;
                    transition: background .12s;
                    border: none; background: transparent;
                    width: 100%; font-family: 'DM Sans', sans-serif;
                    text-align: left;
                }
                .dn-dropdown__option:hover { background: #F5F4FF; }
                .dn-dropdown__option.selected { background: #EEF0FB; }
                .dn-dropdown__opt-cat {
                    font-size: 10px; font-weight: 700; color: #9FA8C7;
                    letter-spacing: .5px; text-transform: uppercase; display: block;
                }
                .dn-dropdown__opt-name { font-size: 13px; font-weight: 600; color: #1A1F36; display: block; }

                /* ── Summary chips ── */
                .dn-summary {
                    display: flex; gap: 10px; flex-wrap: wrap;
                    margin-bottom: 20px;
                }
                .dn-chip {
                    background: #fff; border: 1.5px solid #E8EAF5;
                    border-radius: 10px; padding: 9px 16px;
                    display: flex; align-items: center; gap: 8px;
                    font-size: 13px;
                }
                .dn-chip__icon { color: #6D5DFD; }
                .dn-chip__label { color: #9FA8C7; font-weight: 500; }
                .dn-chip__value { color: #1A1F36; font-weight: 700; }

                /* ── Toolbar ── */
                .dn-toolbar {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap; gap: 10px;
                    margin-bottom: 14px;
                }
                .dn-search { position: relative; width: 220px; }
                .dn-search input {
                    width: 100%; box-sizing: border-box;
                    border: 1.5px solid #DDE0EF; border-radius: 10px;
                    padding: 8px 12px 8px 34px;
                    font-size: 13px; font-family: 'DM Sans', sans-serif;
                    background: #fff; color: #1A1F36; outline: none;
                    transition: border-color .15s, box-shadow .15s;
                }
                .dn-search input:focus {
                    border-color: #6D5DFD;
                    box-shadow: 0 0 0 3px rgba(109,93,253,.12);
                }
                .dn-search__icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9FA8C7; }

                .dn-save-all-btn {
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 9px 20px; border-radius: 9px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px; font-weight: 700;
                    cursor: pointer; border: none;
                    background: #6D5DFD; color: #fff;
                    box-shadow: 0 3px 12px rgba(109,93,253,.28);
                    transition: all .18s;
                    position: relative;
                }
                .dn-save-all-btn:hover:not(:disabled) {
                    background: #5A4AE8;
                    transform: translateY(-1px);
                }
                .dn-save-all-btn:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }
                .dn-pending-badge {
                    position: absolute; top: -7px; right: -7px;
                    background: #EF4444; color: #fff;
                    font-size: 10px; font-weight: 800;
                    width: 18px; height: 18px;
                    border-radius: 50%; display: flex;
                    align-items: center; justify-content: center;
                    border: 2px solid #EDEEF5;
                }

                /* ── Table ── */
                .dn-table-wrap {
                    background: #fff; border-radius: 16px;
                    border: 1.5px solid #E8EAF5;
                    overflow: hidden;
                    box-shadow: 0 2px 20px rgba(109,93,253,.05);
                }
                .dn-table {
                    width: 100%; border-collapse: collapse;
                }
                .dn-thead th {
                    padding: 13px 18px;
                    text-align: left;
                    font-size: 11px; font-weight: 700;
                    color: #9FA8C7; letter-spacing: .7px;
                    text-transform: uppercase;
                    background: #F7F8FC;
                    border-bottom: 1.5px solid #E8EAF5;
                }
                .dn-row { transition: background .12s; }
                .dn-row:not(:last-child) { border-bottom: 1px solid #F0F1F8; }
                .dn-row:hover { background: #FAFAFE; }
                .dn-td { padding: 14px 18px; vertical-align: middle; }

                .dn-td--student { min-width: 200px; }
                .dn-student-info { display: flex; align-items: center; gap: 10px; }
                .dn-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #E8EAF5; flex-shrink: 0; }
                .dn-student-name { font-size: 14px; font-weight: 600; color: #1A1F36; }

                .dn-td--current { width: 120px; }
                .dn-nota-display { font-size: 18px; font-weight: 800; color: #1A1F36; }
                .dn-nota-max { font-size: 12px; color: #9FA8C7; font-weight: 500; margin-left: 1px; }
                .dn-no-nota { font-size: 18px; color: #CBD0E0; font-weight: 700; }

                .dn-bar-track { height: 4px; background: #EEF0FB; border-radius: 99px; overflow: hidden; margin-top: 5px; width: 80px; }
                .dn-bar-fill  { height: 100%; border-radius: 99px; transition: width .5s cubic-bezier(.4,0,.2,1); }

                .dn-td--badge { width: 130px; }
                .dn-grade-badge {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 4px 10px; border-radius: 99px;
                    font-size: 12px; font-weight: 700;
                }

                .dn-td--input { width: 140px; }
                .dn-input-wrap { display: flex; flex-direction: column; gap: 3px; }
                .dn-input {
                    width: 100px; box-sizing: border-box;
                    border: 1.5px solid #DDE0EF; border-radius: 8px;
                    padding: 7px 10px; font-size: 14px; font-weight: 600;
                    font-family: 'DM Sans', sans-serif; color: #1A1F36;
                    background: #F7F8FC; outline: none;
                    transition: border-color .15s, box-shadow .15s;
                    -moz-appearance: textfield;
                }
                .dn-input::-webkit-outer-spin-button,
                .dn-input::-webkit-inner-spin-button { -webkit-appearance: none; }
                .dn-input:focus {
                    border-color: #6D5DFD;
                    box-shadow: 0 0 0 3px rgba(109,93,253,.12);
                    background: #fff;
                }
                .dn-input--error { border-color: #EF4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,.12) !important; }
                .dn-input-hint { font-size: 10px; color: #EF4444; font-weight: 600; }

                .dn-td--action { width: 120px; }
                .dn-save-btn {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 7px 14px; border-radius: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 12px; font-weight: 700;
                    cursor: pointer; border: 1.5px solid #DDE0EF;
                    background: transparent; color: #C4C9E0;
                    transition: all .18s;
                }
                .dn-save-btn--active {
                    background: #6D5DFD; color: #fff;
                    border-color: #6D5DFD;
                    box-shadow: 0 3px 10px rgba(109,93,253,.28);
                }
                .dn-save-btn--active:hover {
                    background: #5A4AE8;
                    transform: translateY(-1px);
                }
                .dn-save-btn:disabled { cursor: not-allowed; }

                /* empty */
                .dn-empty { text-align: center; padding: 48px 20px; color: #9FA8C7; }
                .dn-empty p { margin: 8px 0 0; font-size: 14px; }

                @media (max-width: 700px) {
                    .dn-root { padding: 20px 12px; }
                    .dn-table-wrap { overflow-x: auto; }
                    .dn-search { width: 100%; }
                    .dn-toolbar { flex-direction: column; align-items: flex-start; }
                }
            `}</style>

            <div className="dn-root" onClick={() => ddOpen && setDdOpen(false)}>
                {loadingCursos && (
                <div style={{ marginBottom: '16px', padding: '12px 14px', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '10px', color: '#4338CA', fontSize: '13px', fontWeight: 600 }}>
                    Cargando materias del docente...
                </div>
                )}

                {!!errorCursos && (
                    <div style={{ marginBottom: '16px', padding: '12px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', color: '#B91C1C', fontSize: '13px', fontWeight: 600 }}>
                        {typeof errorCursos === 'string' ? errorCursos : 'No se pudieron cargar los cursos del docente.'}
                    </div>
                )}

                {!!errorNotas && !loadingNotas && (
                    <div style={{ marginBottom: '16px', padding: '12px 14px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '10px', color: '#C2410C', fontSize: '13px', fontWeight: 600 }}>
                        {typeof errorNotas === 'string' ? errorNotas : 'No se pudieron cargar las notas del curso.'}
                    </div>
                )}

                {/* ── Page header ── */}
                <div className="dn-header">
                    <div className="dn-header__left">
                        <div className="dn-header__pill" />
                        <h1 className="dn-header__title">Calificaciones</h1>
                    </div>
                </div>

                {/* ── Course selector + summary ── */}
                <div className="dn-selector-row">
                    <div className="dn-dropdown" onClick={e => e.stopPropagation()}>
                        <button
                            className="dn-dropdown__btn"
                            aria-expanded={ddOpen}
                            onClick={() => setDdOpen(o => !o)}
                        >
                            <div className="dn-dropdown__label">
                                <FiBook size={16} className="dn-dropdown__icon" />
                                <div className="dn-dropdown__text">
                                    <span className="dn-dropdown__cat">{course.category}</span>
                                    <span className="dn-dropdown__name">{course.title || 'Seleccione un curso'}</span>
                                </div>
                            </div>
                            <FiChevronDown size={16} className="dn-dropdown__chevron" />
                        </button>

                        {ddOpen && (
                            <div className="dn-dropdown__menu">
                                {courses.length === 0 ? (
                                    <button
                                        type="button"
                                        className="dn-dropdown__option"
                                        disabled
                                        style={{ cursor: 'default', opacity: 0.7 }}
                                    >
                                        <FiBook size={14} style={{ color: '#9FA8C7', flexShrink: 0 }} />
                                        <div>
                                            <span className="dn-dropdown__opt-cat">Sin datos</span>
                                            <span className="dn-dropdown__opt-name">No hay cursos cargados para este docente</span>
                                        </div>
                                    </button>
                                ) : courses.map(c => (
                                    <button
                                        key={c.id}
                                        className={`dn-dropdown__option${c.id === selectedId ? ' selected' : ''}`}
                                        onClick={() => { setSelectedId(c.id); setDrafts({}); setSearch(''); setDdOpen(false); }}
                                    >
                                        <FiBook size={14} style={{ color: '#6D5DFD', flexShrink: 0 }} />
                                        <div>
                                            <span className="dn-dropdown__opt-cat">{c.category}</span>
                                            <span className="dn-dropdown__opt-name">{c.title}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Summary chips ── */}
                <div className="dn-summary">
                    <div className="dn-chip">
                        <FiUser size={14} className="dn-chip__icon" />
                        <span className="dn-chip__label">Estudiantes</span>
                        <span className="dn-chip__value">{course.students.length}</span>
                    </div>
                    <div className="dn-chip">
                        <FiEdit3 size={14} className="dn-chip__icon" />
                        <span className="dn-chip__label">Calificados</span>
                        <span className="dn-chip__value">{calificados} / {course.students.length}</span>
                    </div>
                    <div className="dn-chip">
                        <FiAward size={14} className="dn-chip__icon" />
                        <span className="dn-chip__label">Promedio del curso</span>
                        <span className="dn-chip__value">{promedio !== null ? promedio : '—'}</span>
                    </div>
                    <div className="dn-chip">
                        <FiCheckCircle size={14} className="dn-chip__icon" />
                        <span className="dn-chip__label">Aprobados</span>
                        <span className="dn-chip__value" style={{ color: '#16A34A' }}>
                            {aprobados}
                        </span>
                    </div>
                    <div className="dn-chip">
                        <FiAlertCircle size={14} className="dn-chip__icon" />
                        <span className="dn-chip__label">Reprobados</span>
                        <span className="dn-chip__value" style={{ color: '#DC2626' }}>
                            {reprobados}
                        </span>
                    </div>
                </div>

                {/* ── Toolbar ── */}
                <div className="dn-toolbar">
                    <div className="dn-search">
                        <FiSearch size={14} className="dn-search__icon" />
                        <input
                            type="text"
                            placeholder="Buscar estudiante..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        className="dn-save-all-btn"
                        disabled={pendingCount === 0}
                        onClick={handleSaveAll}
                    >
                        {pendingCount > 0 && <span className="dn-pending-badge">{pendingCount}</span>}
                        <FiSave size={14} /> Guardar todo
                    </button>
                </div>

                {/* ── Table ── */}
                <div className="dn-table-wrap">
                    {loadingNotas && (
                        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E8EAF5', background: '#F8FAFC', color: '#475569', fontSize: '13px', fontWeight: 600 }}>
                            Cargando notas del curso...
                        </div>
                    )}
                    <table className="dn-table">
                        <thead className="dn-thead">
                            <tr>
                                <th>Estudiante</th>
                                <th>Nota actual</th>
                                <th>Estado</th>
                                <th>Nueva nota</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="dn-empty">
                                            <FiUser size={40} style={{ opacity: .3 }} />
                                            <p>No se encontraron estudiantes.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(student => (
                                <StudentRow
                                    key={student.id}
                                    student={student}
                                    draft={drafts[student.id] ?? ''}
                                    onChange={val => handleChange(student.id, val)}
                                    onSave={handleSave}
                                    saving={saving === student.id}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default DocenteNotas;