import React, { useEffect, useMemo, useState } from 'react';
import {
  FiClock,
  FiUsers,
  FiFileText,
  FiSearch,
  FiCheckCircle,
  FiBook,
  FiAlertCircle,
  FiXCircle,
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchCursosWithInscritosByDocenteId,
  finalizarCurso,
  cancelarCurso,
} from './slicesCursos/CursosThunk';

import {
  selectCursos,
  selectLoadingCursos,
  selectErrorCursos,
} from './slicesCursos/CursosSlices';

import { selectUserId } from '../signin/slices/loginSelectors';

const ESTADO_ACTIVO = 'ACTIVO';
const ESTADO_FINALIZADO = 'FINALIZADO';
const ESTADO_CANCELADO = 'CANCELADO';

const MOCK_COURSES = [
  {
    id: 1,
    title: 'Estadística, Ciencia De Datos Y Análisis De Negocios',
    category: 'Ciencia de Datos',
    price: 50,
    lessons: 10,
    students: 24,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80',
    status: ESTADO_ACTIVO,
    periodo: 'I-2026',
    cupos: 30,
    hora_inicio: '19:30',
    hora_fin: '21:00',
    diasDeclase: 'Lunes y Miércoles',
  },
];

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

const mapEstadoToUi = (estado) => {
  const value = String(estado || '').toUpperCase();

  if (value === ESTADO_FINALIZADO) {
    return {
      key: 'finished',
      label: 'Finalizado',
      badgeClass: 'dc-card__status-badge--finished',
      isFinished: true,
      isCancelled: false,
      isActive: false,
    };
  }

  if (value === ESTADO_CANCELADO) {
    return {
      key: 'cancelled',
      label: 'Cancelado',
      badgeClass: 'dc-card__status-badge--cancelled',
      isFinished: false,
      isCancelled: true,
      isActive: false,
    };
  }

  return {
    key: 'active',
    label: 'Activo',
    badgeClass: 'dc-card__status-badge--active',
    isFinished: false,
    isCancelled: false,
    isActive: true,
  };
};

const mapCursoToCard = (curso) => {
  const estudiantes =
    curso?.students ??
    curso?.estudiantes ??
    curso?.total_estudiantes ??
    curso?.cantidad_estudiantes ??
    curso?.inscritos?.length ??
    0;

  const precio = Number(curso?.precio ?? 0);
  const cupos = Number(curso?.cupos ?? curso?.cupos_max ?? curso?.cupo ?? 0);
  const estado = String(curso?.estado || ESTADO_ACTIVO).toUpperCase();
  const estadoInfo = mapEstadoToUi(estado);

  return {
    id: curso?.id_curso ?? curso?.id,
    id_curso: curso?.id_curso ?? curso?.id,
    title:
      curso?.materia?.nombre ||
      curso?.nombre_materia ||
      curso?.title ||
      'Curso sin nombre',
    category: curso?.categoria || curso?.materia?.categoria || 'Materia',
    price: precio,
    lessons: Number(curso?.lessons ?? curso?.lecciones ?? 0),
    hora_inicio: curso?.hora_inicio
      ? String(curso.hora_inicio).slice(0, 5)
      : curso?.hora_inicio_clase
      ? String(curso.hora_inicio_clase).slice(0, 5)
      : curso?.hora_inicio_curso
      ? String(curso.hora_inicio_curso).slice(0, 5)
      : 'Sin horario',
    hora_fin: curso?.hora_fin
      ? String(curso.hora_fin).slice(0, 5)
      : 'Sin horario',
    students: Number(estudiantes || 0),
    image:
      curso?.image ||
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80',
    diasDeclase:
      curso?.diasDeclase ||
      curso?.dias_de_clases ||
      curso?.fecha_inicio ||
      curso?.fechaInicio ||
      'Sin días definidos',
    status: estado,
    statusUi: estadoInfo,
    completedStudents: Number(curso?.completedStudents ?? curso?.completados ?? 0),
    income: Number(curso?.income ?? precio * estudiantes),
    periodo: curso?.periodo || 'Sin periodo',
    cupos: cupos,
    raw: curso,
  };
};

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="dc-stat" style={{ '--accent': accent }}>
    <div className="dc-stat__icon">
      <Icon size={18} />
    </div>
    <div>
      <p className="dc-stat__value">{value}</p>
      <p className="dc-stat__label">{label}</p>
    </div>
  </div>
);

const CourseCard = ({ course, onFinish, onCancel }) => {
  const cupos = Number(course.cupos || 0);
  const students = Number(course.students || 0);
  const pct = cupos > 0 ? Math.min(Math.round((students / cupos) * 100), 100) : 0;

  const isFinished = course.statusUi.isFinished;
  const isCancelled = course.statusUi.isCancelled;

  return (
    <div
      className={`dc-card${
        isFinished ? ' dc-card--done' : isCancelled ? ' dc-card--cancelled' : ''
      }`}
    >
      <div className="dc-card__img-wrap">
        <img src={course.image} alt={course.title} className="dc-card__img" />

        <div className="dc-card__category">{course.category}</div>
        <div className="dc-card__status">{course.statusUi.label}</div>

        <div className={`dc-card__status-badge ${course.statusUi.badgeClass}`}>
          {isFinished ? '✓ Finalizado' : isCancelled ? '✕ Cancelado' : '● En curso'}
        </div>
      </div>

      <div className="dc-card__body">
        <div className="dc-card__meta-top">
          <div className="dc-card__rating">
            <span>{course.periodo}</span>
          </div>
          <span className="dc-card__price">Bs {Number(course.price).toFixed(2)}</span>
        </div>

        <h3 className="dc-card__title">{course.title}</h3>

        <div className="dc-card__stats">
          <span><FiFileText size={12} /> {course.lessons} lecciones</span>
          <span><FiClock size={12} /> {course.hora_inicio} - {course.hora_fin}</span>
          <span><FiUsers size={12} /> {course.students} estudiantes</span>
        </div>

        <div className="dc-card__dates">
          <div className="dc-card__date-item">
            <span className="dc-card__date-label">Días de clase:</span>
          </div>
          <div className="dc-card__date-sep">→</div>
          <span>{course.diasDeclase}</span>
        </div>

        <div className="dc-card__progress-wrap">
          <div className="dc-card__progress-header">
            <span>Cupos</span>
            <span
              style={{
                fontWeight: 700,
                color: isFinished
                  ? '#22C55E'
                  : isCancelled
                  ? '#EF4444'
                  : '#6D5DFD',
              }}
            >
              {course.students}/{course.cupos}
            </span>
          </div>

          <div className="dc-card__progress-track">
            <div
              className="dc-card__progress-fill"
              style={{
                width: `${pct}%`,
                background: isFinished
                  ? '#22C55E'
                  : isCancelled
                  ? '#EF4444'
                  : '#6D5DFD',
              }}
            />
          </div>
        </div>

        <div className="dc-card__footer">
          {isFinished ? (
            <div className="dc-card__done-label">
              <FiCheckCircle size={15} /> Curso marcado como finalizado
            </div>
          ) : isCancelled ? (
            <div className="dc-card__cancelled-label">
              <FiXCircle size={15} /> Curso cancelado
            </div>
          ) : (
            <div className="dc-card__actions">
              <button className="dc-btn dc-btn--finish" onClick={() => onFinish(course)}>
                <FiCheckCircle size={14} /> Marcar como finalizado
              </button>

              <button className="dc-btn dc-btn--cancel" onClick={() => onCancel(course)}>
                <FiAlertCircle size={14} /> Cancelar curso
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DocenteCourses = () => {
  const dispatch = useDispatch();

  const cursosRedux = useSelector(selectCursos);
  const isLoadingCursos = useSelector(selectLoadingCursos);
  const cursosError = useSelector(selectErrorCursos);
  const userIdFromStore = useSelector(selectUserId);

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  //para verificar donde se cargan los cursos
  console.log('Cursos desde Redux:', cursosRedux);
  console.log('Cursos mapeados para UI:', courses);


  const localAuth = useMemo(() => getAuthFromLocalStorage(), []);
  const docenteId = userIdFromStore || localAuth?.id;

  useEffect(() => {
    if (!docenteId) {
      setCourses(MOCK_COURSES);
      return;
    }

    dispatch(fetchCursosWithInscritosByDocenteId(docenteId));
    console.log('Dispatching fetchCursosWithInscritosByDocenteId with docenteId:', docenteId);
  }, [dispatch, docenteId]);

  useEffect(() => {
    if (Array.isArray(cursosRedux)) {
      setCourses(cursosRedux.map(mapCursoToCard));
    }
  }, [cursosRedux]);

  const totalStudents = courses.reduce((a, c) => a + Number(c.students || 0), 0);
  const activeCourses = courses.filter((c) => c.status === ESTADO_ACTIVO).length;
  const finishedCourses = courses.filter((c) => c.status === ESTADO_FINALIZADO).length;
  const cancelledCourses = courses.filter((c) => c.status === ESTADO_CANCELADO).length;

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === 'all' ||
      (filter === 'active' && c.status === ESTADO_ACTIVO) ||
      (filter === 'finished' && c.status === ESTADO_FINALIZADO) ||
      (filter === 'cancelled' && c.status === ESTADO_CANCELADO);

    return matchSearch && matchFilter;
  });

  const handleFinish = async (course) => {
    const res = await Swal.fire({
      title: 'Finalizar curso',
      html: `
        <div style="color:#5A6676;font-size:14px;line-height:1.5;margin-top:6px">
          ¿Confirmas que el curso<br/>
          <strong style="color:#1A1F36">"${course.title}"</strong><br/>
          ha sido <strong style="color:#22C55E">completado</strong>?<br/>
          <span style="opacity:.8">Esta acción no se puede deshacer, tampoco podrás cambiar las notas registradas.</span>
        </div>
      `,
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
      },
    });

    if (!res.isConfirmed) return;

    try {
      const action = await dispatch(finalizarCurso(course.id));

      if (action.meta.requestStatus === 'rejected') {
        throw new Error(action.payload || 'No se pudo finalizar el curso');
      }

      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id
            ? {
                ...c,
                status: ESTADO_FINALIZADO,
                statusUi: mapEstadoToUi(ESTADO_FINALIZADO),
                completedStudents: c.students,
              }
            : c
        )
      );

      Swal.fire({
        title: '¡Curso finalizado!',
        text: 'El curso ha sido marcado como finalizado correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        didOpen: (popup) => {
          popup.style.borderRadius = '16px';
        },
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  const handleCancel = async (course) => {
    const res = await Swal.fire({
      title: 'Cancelar curso',
      html: `
        <div style="color:#5A6676;font-size:14px;line-height:1.5;margin-top:6px">
          ¿Confirmas que deseas cancelar el curso<br/>
          <strong style="color:#1A1F36">"${course.title}"</strong>?<br/>
          <span style="opacity:.8">Esta acción acreditará saldo a los inscritos si corresponde.</span>
        </div>
      `,
      icon: 'warning',
      width: 430,
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
      reverseButtons: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#98A2B3',
      didOpen: (popup) => {
        popup.style.borderRadius = '16px';
      },
    });

    if (!res.isConfirmed) return;

    try {
      const action = await dispatch(cancelarCurso(course.id));

      if (action.meta.requestStatus === 'rejected') {
        throw new Error(action.payload || 'No se pudo cancelar el curso');
      }

      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id
            ? {
                ...c,
                status: ESTADO_CANCELADO,
                statusUi: mapEstadoToUi(ESTADO_CANCELADO),
              }
            : c
        )
      );

      Swal.fire({
        title: 'Curso cancelado',
        text: 'El curso fue cancelado correctamente.',
        icon: 'success',
        timer: 2200,
        showConfirmButton: false,
        didOpen: (popup) => {
          popup.style.borderRadius = '16px';
        },
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

        .dc-root {
          min-height: 100%;
          padding: 36px 32px;
          background: #EDEEF5;
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }

        .dc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 24px;
        }

        .dc-header__left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dc-header__pill {
          width: 8px;
          height: 24px;
          background: #6D5DFD;
          border-radius: 4px;
        }

        .dc-header__title {
          font-size: 22px;
          color: #1A1F36;
          margin: 0;
          font-weight: 800;
        }

        .dc-search {
          position: relative;
          width: 220px;
        }

        .dc-search input {
          width: 100%;
          box-sizing: border-box;
          border: 1.5px solid #DDE0EF;
          border-radius: 10px;
          padding: 8px 12px 8px 34px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          color: #1A1F36;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }

        .dc-search input:focus {
          border-color: #6D5DFD;
          box-shadow: 0 0 0 3px rgba(109,93,253,.12);
        }

        .dc-search__icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #9FA8C7;
        }

        .dc-feedback {
          margin-bottom: 16px;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
        }

        .dc-feedback--loading {
          background: #EEF2FF;
          border: 1px solid #C7D2FE;
          color: #4338CA;
        }

        .dc-feedback--error {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #B91C1C;
        }

        .dc-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
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
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: color-mix(in srgb, var(--accent) 12%, white);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dc-stat__value {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #1A1F36;
        }

        .dc-stat__label {
          margin: 2px 0 0;
          font-size: 12px;
          color: #9FA8C7;
          font-weight: 500;
        }

        .dc-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
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

        .dc-filter-btn:hover:not(.active) {
          border-color: #6D5DFD;
          color: #6D5DFD;
        }

        .dc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .dc-empty {
          text-align: center;
          padding: 60px 20px;
          color: #9FA8C7;
        }

        .dc-empty svg {
          margin-bottom: 12px;
          opacity: .4;
        }

        .dc-empty p {
          margin: 0;
          font-size: 15px;
        }

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

        .dc-card--done {
          border-color: #BBF7D0;
        }

        .dc-card--cancelled {
          border-color: #FECACA;
        }

        .dc-card__img-wrap {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .dc-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .4s;
        }

        .dc-card:hover .dc-card__img {
          transform: scale(1.04);
        }

        .dc-card__category {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(26,31,54,.82);
          backdrop-filter: blur(6px);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 6px;
        }

        .dc-card__status {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(26,31,54,.82);
          backdrop-filter: blur(6px);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 6px;
        }

        .dc-card__status-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 99px;
          letter-spacing: .3px;
        }

        .dc-card__status-badge--active {
          background: #DBEAFE;
          color: #2563EB;
        }

        .dc-card__status-badge--finished {
          background: #DCFCE7;
          color: #16A34A;
        }

        .dc-card__status-badge--cancelled {
          background: #FEE2E2;
          color: #DC2626;
        }

        .dc-card__body {
          padding: 16px 18px 18px;
          position: relative;
          z-index: 1;
        }

        .dc-card__meta-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .dc-card__rating {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          font-weight: 600;
          color: #1A1F36;
        }

        .dc-card__price {
          color: #6D5DFD;
          font-weight: 700;
          font-size: 14px;
        }

        .dc-card__title {
          font-size: 15px;
          font-weight: 700;
          color: #1A1F36;
          margin: 0 0 10px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .dc-card__stats {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          background: #F7F8FC;
          border-radius: 9px;
          padding: 9px 12px;
          margin-bottom: 12px;
        }

        .dc-card__stats span {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #5A6676;
          font-weight: 500;
        }

        .dc-card__dates {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 12px;
          font-size: 12px;
          color: #5A6676;
        }

        .dc-card__date-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dc-card__date-label {
          color: #9FA8C7;
          font-weight: 600;
        }

        .dc-card__date-sep {
          color: #C4C9E0;
          font-size: 14px;
        }

        .dc-card__progress-wrap {
          margin-bottom: 10px;
        }

        .dc-card__progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #9FA8C7;
          font-weight: 600;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: .4px;
        }

        .dc-card__progress-track {
          height: 6px;
          background: #EEF0FB;
          border-radius: 99px;
          overflow: hidden;
        }

        .dc-card__progress-fill {
          height: 100%;
          border-radius: 99px;
          transition: width .6s cubic-bezier(.4,0,.2,1);
        }

        .dc-card__footer {
          margin-top: 12px;
        }

        .dc-card__actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .dc-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all .18s;
        }

        .dc-btn--finish {
          background: #6D5DFD;
          color: #fff;
          box-shadow: 0 3px 12px rgba(109,93,253,.28);
        }

        .dc-btn--finish:hover {
          background: #5A4AE8;
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(109,93,253,.38);
        }

        .dc-btn--cancel {
          background: #fff1f2;
          color: #DC2626;
          border: 1px solid #FECDD3;
        }

        .dc-btn--cancel:hover {
          background: #ffe4e6;
        }

        .dc-card__done-label,
        .dc-card__cancelled-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 9px;
          padding: 10px;
        }

        .dc-card__done-label {
          color: #16A34A;
          background: #F0FDF4;
          border: 1.5px solid #BBF7D0;
        }

        .dc-card__cancelled-label {
          color: #DC2626;
          background: #FEF2F2;
          border: 1.5px solid #FECACA;
        }

        @media (max-width: 900px) {
          .dc-stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .dc-root {
            padding: 20px 14px;
          }

          .dc-grid {
            grid-template-columns: 1fr;
          }

          .dc-search {
            width: 100%;
          }
        }

        @media (max-width: 420px) {
          .dc-stats-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dc-root">
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
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoadingCursos && (
          <div className="dc-feedback dc-feedback--loading">
            Cargando cursos del docente...
          </div>
        )}

        {!isLoadingCursos && cursosError && (
          <div className="dc-feedback dc-feedback--error">
            {cursosError}
          </div>
        )}

        <div className="dc-stats-row">
          <StatCard icon={FiBook} label="Cursos activos" value={activeCourses} accent="#6D5DFD" />
          <StatCard icon={FiCheckCircle} label="Cursos finalizados" value={finishedCourses} accent="#22C55E" />
          <StatCard icon={FiXCircle} label="Cursos cancelados" value={cancelledCourses} accent="#EF4444" />
          <StatCard icon={FiUsers} label="Total estudiantes" value={totalStudents} accent="#3B82F6" />
        </div>

        <div className="dc-filters">
          {[
            { key: 'all', label: `Todos (${courses.length})` },
            { key: 'active', label: `En curso (${activeCourses})` },
            { key: 'finished', label: `Finalizados (${finishedCourses})` },
            { key: 'cancelled', label: `Cancelados (${cancelledCourses})` },
          ].map((f) => (
            <button
              key={f.key}
              className={`dc-filter-btn${filter === f.key ? ' active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="dc-empty">
            <FiBook size={48} />
            <p>No se encontraron cursos.</p>
          </div>
        ) : (
          <div className="dc-grid">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onFinish={handleFinish}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DocenteCourses;