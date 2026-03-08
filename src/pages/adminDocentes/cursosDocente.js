import React, { useEffect, useMemo, useState } from 'react';
import { FiClock, FiUsers, FiFileText, FiSearch, FiCheckCircle, FiBook, FiBarChart2, FiCalendar, FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Swal from 'sweetalert2';

// para consumo
import { fetchCursosByDocenteId, eliminarCurso, fetchCursosWithInscritosByDocenteId } from './slicesCursos/CursosThunk';
import { selectCursosState,loadingCursos, errorCursos } from './slicesCursos/CursosSlices';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUserId,
  selectToken,
  selectIsAuthenticated,
} from "../signin/slices/loginSelectors";
import { tr } from 'date-fns/locale/tr';

/* ─── Mock data ─────────────────────────────────────────────── */
const MOCK_COURSES = [
    {
        id: 1,
        title: 'Estadística, Ciencia De Datos Y Análisis De Negocios',
        category: 'Ciencia de Datos',
        rating: 4.5,
        price: 50,
        lessons: 10,
        hours: '19h 30m',
        students: 24,
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80',
        startDate: '2024-03-01',
        endDate: '2024-06-01',
        status: 'active',   // active | finished
        completedStudents: 18,
        income: 1200,
    },
    {
        id: 2,
        title: 'Adobe Illustrator Para Diseño Gráfico (De Cero A Pro)',
        category: 'Diseño',
        rating: 4.8,
        price: 65,
        lessons: 12,
        hours: '22h 00m',
        students: 31,
        image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=500&q=80',
        startDate: '2024-04-10',
        endDate: '2024-07-10',
        status: 'active',
        completedStudents: 10,
        income: 2015,
    },
    {
        id: 3,
        title: 'SEO Desde Cero: Posiciona Tu Negocio En Google',
        category: 'Marketing Digital',
        rating: 4.0,
        price: 50,
        lessons: 8,
        hours: '14h 15m',
        students: 52,
        image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&q=80',
        startDate: '2023-11-01',
        endDate: '2024-02-01',
        status: 'finished',
        completedStudents: 52,
        income: 2600,
    },
];

//prueba de primer consumo 
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

//datos del curso que se ven en la card, mapeo de datos del backend a lo que se muestra en la card

const mapCursoToCard = (curso) => {
    const estudiantes =
        curso?.students ??
        curso?.estudiantes ??
        curso?.total_estudiantes ??
        curso?.cantidad_estudiantes ??
        curso?.inscritos?.length ??
        0;

    const precio = Number(curso?.precio ?? 0);

    return {
        id: curso?.id_curso ?? curso?.id,
        title: curso?.materia?.nombre || curso?.nombre_materia || curso?.title || 'Curso sin nombre',
        category: curso?.categoria || curso?.materia?.categoria || 'Materia',
        rating: Number(curso?.rating ?? 5),
        price: precio,
        lessons: Number(curso?.lessons ?? curso?.lecciones ?? 0),
        // para las horas, mapearlas solo para que se muestren horas y minutos, no segundos, y si no hay horas mostrar "Sin horario"
        hora_inicio: curso?.hora_inicio || curso?.hora_inicio_clase || curso?.hora_inicio_curso || 'Sin horario',
        hora_fin: curso?.hora_fin || 'Sin horario',
        students: estudiantes,
        image: curso?.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80',
        diasDeclase: curso?.diasDeclase || curso?.dias_de_clases || curso?.fecha_inicio || curso?.fechaInicio,
        // el estado en base de datos es un booleano, necesita mapearse a active/inactive o similar para mostrarlo en la card
        status: curso?.estado,
        completedStudents: Number(curso?.completedStudents ?? curso?.completados ?? 0),
        income: Number(curso?.income ?? (precio * estudiantes)),
        periodo: curso?.periodo || 'Sin periodo',
        cupos: curso?.cupos ?? curso?.cupo ?? 'N/A',
        raw: curso,
    };
};


{loadingCursos && (
    <div style={{ marginBottom: '16px', padding: '12px 14px', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '10px', color: '#4338CA', fontSize: '13px', fontWeight: 600 }}>
        Cargando cursos del docente...
    </div>
)}

{!loadingCursos && errorCursos && (
    <div style={{ marginBottom: '16px', padding: '12px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', color: '#B91C1C', fontSize: '13px', fontWeight: 600 }}>
        {errorCursos}
    </div>
)}

/* ─── Summary stat card ─────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, accent }) => (
    <div className="dc-stat" style={{ '--accent': accent }}>
        <div className="dc-stat__icon"><Icon size={18} /></div>
        <div>
            <p className="dc-stat__value">{value}</p>
            <p className="dc-stat__label">{label}</p>
        </div>
    </div>
);

/* ─── Course Card ───────────────────────────────────────────── */
const CourseCard = ({ course, onFinish }) => {
    const pct = Math.round((course.students/ course.cupos) * 100);
    const isFinished = course.status === false || course.status === 'finished';

    return (
        <div className={`dc-card${isFinished ? ' dc-card--done' : ''}`}>
            {/* Image */}
            <div className="dc-card__img-wrap">
                <img src={course.image} alt={course.title} className="dc-card__img" />
                <h3 className="dc-card__title">{course.title}</h3>
                <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>
                    Periodo: {course.periodo}
                </p>

                <div className="dc-card__category">{course.category}</div>
                <div className="dc-card__status">{course.status ? 'Activo' : 'Finalizado'}</div>
                <div className={`dc-card__status-badge dc-card__status-badge--${course.status}`}>
                    {isFinished ? '✓ Finalizado' : '● En curso'}
                </div>
            </div>

            {/* Body */}
            <div className="dc-card__body">
                {/* Rating + price */}
                <div className="dc-card__meta-top">
                    <div className="dc-card__rating">
                        <span>{course.periodo}</span>
                    </div>
                    <span className="dc-card__price">Bs {course.price}.00</span>
                </div>

                <h3 className="dc-card__title">{course.title}</h3>

                {/* Stats row */}
                <div className="dc-card__stats">
                    <span><FiFileText size={12} /> {course.lessons} lecciones</span>
                    <span><FiClock size={12} /> {course.hora_inicio} - {course.hora_fin}</span>
                    <span><FiUsers size={12} /> {course.students} estudiantes</span>
                </div>

                {/* Dates */}
                <div className="dc-card__dates">
                    <div className="dc-card__date-item">
                        
                        <span className="dc-card__date-label">Días de clase:</span>
                        
                    </div>
                    <div className="dc-card__date-sep">→</div>
                    <span>{course.diasDeclase}</span>
                    
                </div>

                {/* Completion progress */}
                <div className="dc-card__progress-wrap">
                    <div className="dc-card__progress-header">
                        <span>Cupos</span>
                        <span style={{ fontWeight: 700, color: isFinished ? '#22C55E' : '#6D5DFD' }}>
                            {course.students}/{course.cupos}
                        </span>
                    </div>
                    <div className="dc-card__progress-track">
                        <div
                            className="dc-card__progress-fill"
                            style={{
                                width: `${pct}%`,
                                background: isFinished ? '#22C55E' : '#6D5DFD',
                            }}
                        />
                    </div>
                    
                </div>

                {/* Footer action */}
                <div className="dc-card__footer">
                    {isFinished ? (
                        <div className="dc-card__done-label">
                            <FiCheckCircle size={15} /> Curso marcado como finalizado
                        </div>
                    ) : (
                        <button className="dc-btn dc-btn--finish" onClick={() => onFinish(course)}>
                            <FiCheckCircle size={14} /> Marcar como finalizado
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Main ──────────────────────────────────────────────────── */
const DocenteCourses = () => {
    const dispatch = useDispatch();
    const cursosState = useSelector(selectCursosState);
    const userIdFromStore = useSelector(selectUserId);
    const tokenFromStore = useSelector(selectToken);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [courses, setCourses] = useState([]);
    const [search,  setSearch]  = useState('');
    const [filter,  setFilter]  = useState('all'); // all | active | finished
    const [loadingCursos, setLoadingCursos] = useState(false);
    const [errorCursos, setErrorCursos] = useState('');

    const localAuth = useMemo(() => getAuthFromLocalStorage(), []);
    const docenteId = userIdFromStore || localAuth?.id;
    const token = tokenFromStore || localAuth?.token;

    useEffect(() => {
        const cargarCursos = async () => {
            if (!docenteId) {
                setCourses(MOCK_COURSES);
                setErrorCursos('No se encontró el id del docente en la sesión.');
                return;
            }

            try {
                setLoadingCursos(true);
                setErrorCursos('');

                const action = await dispatch(fetchCursosWithInscritosByDocenteId(docenteId));
                const payload = action?.payload;

                const cursosApi = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.cursos)
                        ? payload.cursos
                        : Array.isArray(payload?.data)
                            ? payload.data
                            : Array.isArray(cursosState?.cursos)
                                ? cursosState.cursos
                                : Array.isArray(cursosState)
                                    ? cursosState
                                    : [];


                if (cursosApi.length > 0) {
                    setCourses(cursosApi.map(mapCursoToCard));
                } else {
                    setCourses([]);
                }
            } catch (error) {
                console.error('Error al cargar cursos del docente:', error);
                setErrorCursos('No se pudieron cargar los cursos del docente.');
                setCourses(MOCK_COURSES);
            } finally {
                setLoadingCursos(false);
            }
        };

        cargarCursos();
    }, [dispatch, docenteId]);

    const totalStudents = courses.reduce((a, c) => a + c.students, 0);
    const activeCourses = courses.filter(c => c.status === true).length;
    const finishedCourses = courses.filter(c => c.status === false).length;

    const filtered = courses.filter(c => {
        const matchSearch =
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.category.toLowerCase().includes(search.toLowerCase());

        const matchFilter =
            filter === 'all' ||
            (filter === 'active' && c.status === true) ||
            (filter === 'finished' && c.status === false);

        return matchSearch && matchFilter;
    });

    //para consumir el endpoint de cursos por docente

    const handleFinish = async (course) => {
        const res = await Swal.fire({
            title: 'Finalizar curso',
            html: `<div style="color:#5A6676;font-size:14px;line-height:1.5;margin-top:6px">
                    ¿Confirmas que el curso<br/>
                    <strong style="color:#1A1F36">"${course.title}"</strong><br/>
                    ha sido <strong style="color:#22C55E">completado</strong>?<br/>
                    <span style="opacity:.8">Esta acción no se puede deshacer, tampoco podrás cambiar las notas registradas hasta ahora.</span>
                </div>`,
            icon: 'question',
            width: 400,
            showCancelButton: true,
            confirmButtonText: 'Sí, finalizar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            confirmButtonColor: '#22C55E',
            cancelButtonColor: '#98A2B3',
            didOpen: (popup) => {
                popup.style.borderRadius = '16px';
                const icon = popup.querySelector('.swal2-icon');
                if (icon) { icon.style.transform = 'scale(0.78)'; icon.style.margin = '0 auto 6px'; }
                const title = popup.querySelector('.swal2-title');
                if (title) { title.style.fontSize = '18px'; title.style.fontWeight = '800'; }
            },
        });

        if (!res.isConfirmed) return;

        try {

            // llamada al backend
            const action = await dispatch(eliminarCurso(course.id));

            if (action.meta.requestStatus === 'rejected') {
                throw new Error(action.payload?.msg || 'No se pudo finalizar el curso');
            }

            // actualizar estado local
            setCourses(cs =>
                cs.map(c =>
                    c.id === course.id
                        ? { ...c, status: false, completedStudents: c.students }
                        : c
                )
            );

            Swal.fire({
                title: '¡Curso finalizado!',
                text: 'El curso ha sido marcado como completado correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                didOpen: (popup) => { popup.style.borderRadius = '16px'; },
            });

        } catch (error) {

            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });

        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');

                .dc-root {
                    min-height: 100%;
                    padding: 36px 32px;
                    background: #EDEEF5;
                    font-family: 'DM Sans', sans-serif;
                    box-sizing: border-box;
                }

                /* Header */
                .dc-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 14px;
                    margin-bottom: 24px;
                }
                .dc-header__left { display: flex; align-items: center; gap: 10px; }
                .dc-header__pill { width: 8px; height: 24px; background: #6D5DFD; border-radius: 4px; }
                .dc-header__title {
                 
                    font-size: 22px; color: #1A1F36; margin: 0;
                }

                /* Search */
                .dc-search { position: relative; width: 220px; }
                .dc-search input {
                    width: 100%; box-sizing: border-box;
                    border: 1.5px solid #DDE0EF; border-radius: 10px;
                    padding: 8px 12px 8px 34px;
                    font-size: 13px; font-family: 'DM Sans', sans-serif;
                    background: #fff; color: #1A1F36; outline: none;
                    transition: border-color .15s, box-shadow .15s;
                }
                .dc-search input:focus {
                    border-color: #6D5DFD;
                    box-shadow: 0 0 0 3px rgba(109,93,253,.12);
                }
                .dc-search__icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9FA8C7; }

                /* Stats summary */
                .dc-stats-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 14px;
                    margin-bottom: 24px;
                }
                .dc-stat {
                    background: #fff;
                    border-radius: 12px;
                    padding: 16px 18px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    border: 1.5px solid #E8EAF5;
                }
                .dc-stat__icon {
                    width: 40px; height: 40px;
                    border-radius: 10px;
                    background: color-mix(in srgb, var(--accent) 12%, white);
                    color: var(--accent);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .dc-stat__value { margin: 0; font-size: 20px; font-weight: 700; color: #1A1F36; }
                .dc-stat__label { margin: 2px 0 0; font-size: 12px; color: #9FA8C7; font-weight: 500; }

                /* Filter tabs */
                .dc-filters {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 20px;
                }
                .dc-filter-btn {
                    padding: 7px 16px;
                    border-radius: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    border: 1.5px solid #DDE0EF;
                    background: #fff;
                    color: #9FA8C7;
                    transition: all .18s;
                }
                .dc-filter-btn.active {
                    background: #6D5DFD;
                    border-color: #6D5DFD;
                    color: #fff;
                    box-shadow: 0 3px 10px rgba(109,93,253,.28);
                }
                .dc-filter-btn:hover:not(.active) { border-color: #6D5DFD; color: #6D5DFD; }

                /* Grid */
                .dc-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                }

                /* Empty */
                .dc-empty { text-align: center; padding: 60px 20px; color: #9FA8C7; }
                .dc-empty svg { margin-bottom: 12px; opacity: .4; }
                .dc-empty p { margin: 0; font-size: 15px; }

                /* Card */
                .dc-card {
                    background: #fff;
                    border-radius: 16px;
                    border: 1.5px solid #E8EAF5;
                    overflow: hidden;
                    transition: transform .2s, box-shadow .2s;
                    position: relative;
                }
                .dc-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 36px rgba(109,93,253,.1);
                }
                .dc-card--done { border-color: #BBF7D0; }
                .dc-card--done:hover { box-shadow: 0 12px 36px rgba(34,197,94,.1); }

                /* Watermark */
                .dc-card::before {
                    content: '';
                    position: absolute;
                    right: -20px; bottom: 60px;
                    width: 120px; height: 120px;
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z' fill='none' stroke='%236D5DFD' stroke-width='3' opacity='0.06'/%3E%3C/svg%3E") no-repeat center/contain;
                    pointer-events: none;
                    z-index: 0;
                }

                .dc-card__img-wrap { position: relative; height: 180px; overflow: hidden; }
                .dc-card__img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
                .dc-card:hover .dc-card__img { transform: scale(1.04); }

                .dc-card__category {
                    position: absolute; bottom: 12px; left: 12px;
                    background: rgba(26,31,54,.82); backdrop-filter: blur(6px);
                    color: #fff; font-size: 12px; font-weight: 600;
                    padding: 5px 12px; border-radius: 6px;
                }
                .dc-card__status {
                    position: absolute; bottom: 12px; right: 12px;
                    background: rgba(26,31,54,.82); backdrop-filter: blur(6px);
                    color: #fff; font-size: 12px; font-weight: 600;
                    padding: 5px 12px; border-radius: 6px;
                }

                .dc-card__status-badge {
                    position: absolute; top: 10px; right: 10px;
                    font-size: 11px; font-weight: 700;
                    padding: 4px 10px; border-radius: 99px; letter-spacing: .3px;
                }
                .dc-card__status-badge--active { background: #DBEAFE; color: #2563EB; }
                .dc-card__status-badge--finished { background: #DCFCE7; color: #16A34A; }

                .dc-card__body { padding: 16px 18px 18px; position: relative; z-index: 1; }

                .dc-card__meta-top {
                    display: flex; align-items: center;
                    justify-content: space-between; margin-bottom: 8px;
                }
                .dc-card__rating { display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 600; color: #1A1F36; }
                .dc-stars { display: flex; gap: 2px; color: #F59E0B; font-size: 12px; }
                .dc-card__price { color: #6D5DFD; font-weight: 700; font-size: 14px; }

                .dc-card__title {
                    font-size: 15px; font-weight: 700; color: #1A1F36;
                    margin: 0 0 10px; line-height: 1.4;
                    display: -webkit-box; -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical; overflow: hidden;
                }

                .dc-card__stats {
                    display: flex; flex-wrap: wrap; gap: 8px;
                    background: #F7F8FC; border-radius: 9px;
                    padding: 9px 12px; margin-bottom: 12px;
                }
                .dc-card__stats span {
                    display: flex; align-items: center; gap: 5px;
                    font-size: 12px; color: #5A6676; font-weight: 500;
                }

                /* Dates */
                .dc-card__dates {
                    display: flex; align-items: center; gap: 6px;
                    flex-wrap: wrap; margin-bottom: 12px;
                    font-size: 12px; color: #5A6676;
                }
                .dc-card__date-item { display: flex; align-items: center; gap: 4px; }
                .dc-card__date-label { color: #9FA8C7; font-weight: 600; }
                .dc-card__date-sep { color: #C4C9E0; font-size: 14px; }

                /* Progress */
                .dc-card__progress-wrap { margin-bottom: 10px; }
                .dc-card__progress-header {
                    display: flex; justify-content: space-between;
                    font-size: 11px; color: #9FA8C7; font-weight: 600;
                    margin-bottom: 5px; text-transform: uppercase; letter-spacing: .4px;
                }
                .dc-card__progress-track { height: 6px; background: #EEF0FB; border-radius: 99px; overflow: hidden; }
                .dc-card__progress-fill { height: 100%; border-radius: 99px; transition: width .6s cubic-bezier(.4,0,.2,1); }
                .dc-card__progress-pct { font-size: 11px; color: #9FA8C7; margin-top: 4px; text-align: right; }

                /* Income */
                .dc-card__income {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 12px; color: #5A6676;
                    background: #F0FDF4; border-radius: 8px;
                    padding: 7px 10px; margin-bottom: 14px;
                }
                .dc-card__income strong { color: #16A34A; font-size: 13px; margin-left: 2px; }

                /* Footer */
                .dc-card__footer {}
                .dc-btn--finish {
                    width: 100%;
                    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
                    padding: 10px 20px;
                    border-radius: 9px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px; font-weight: 700;
                    cursor: pointer; border: none;
                    background: #6D5DFD; color: #fff;
                    box-shadow: 0 3px 12px rgba(109,93,253,.28);
                    transition: all .18s;
                }
                .dc-btn--finish:hover {
                    background: #5A4AE8;
                    transform: translateY(-1px);
                    box-shadow: 0 5px 16px rgba(109,93,253,.38);
                }
                .dc-card__done-label {
                    display: flex; align-items: center; justify-content: center; gap: 7px;
                    font-size: 13px; font-weight: 600; color: #16A34A;
                    background: #F0FDF4; border: 1.5px solid #BBF7D0;
                    border-radius: 9px; padding: 10px;
                }

                @media (max-width: 700px) {
                    .dc-root { padding: 20px 14px; }
                    .dc-stats-row { grid-template-columns: 1fr 1fr; }
                    .dc-grid { grid-template-columns: 1fr; }
                    .dc-search { width: 100%; }
                }
                @media (max-width: 420px) {
                    .dc-stats-row { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="dc-root">
                {/* Header */}
                <div className="dc-header">
                    <div className="dc-header__left">
                        <div className="dc-header__pill" />
                        <h1 className="dc-header__title">Mis Cursos</h1>
                    </div>
                    <div className="dc-search">
                        <FiSearch size={14} className="dc-search__icon" />
                        <input
                            type="text"
                            placeholder="Buscar curso..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Summary stats */}
                <div className="dc-stats-row">
                    <StatCard icon={FiBook}      label="Cursos activos"      value={activeCourses}                       accent="#6D5DFD" />
                    <StatCard icon={FiBook}      label="Cursos finalizados"  value={finishedCourses}                       accent="#6D5DFD" />
                    <StatCard icon={FiUsers}     label="Total estudiantes"   value={totalStudents}                       accent="#3B82F6" />
                    
                </div>

                {/* Filter tabs */}
                <div className="dc-filters">
                    {[
                        { key: 'all', label: `Todos (${courses.length})` },
                        { key: 'active', label: `En curso (${activeCourses})` },
                        { key: 'finished', label: `Finalizados (${finishedCourses})` },
                    ].map(f => (
                        <button
                            key={f.key}
                            className={`dc-filter-btn${filter === f.key ? ' active' : ''}`}
                            onClick={() => setFilter(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="dc-empty">
                        <FiBook size={48} />
                        <p>No se encontraron cursos.</p>
                    </div>
                ) : (
                    <div className="dc-grid">
                        {filtered.map(course => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                onFinish={handleFinish}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default DocenteCourses;