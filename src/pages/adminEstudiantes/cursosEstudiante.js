import React, { useEffect, useMemo } from 'react';
import {
  FiClock,
  FiUsers,
  FiFileText,
  FiAward,
  FiBook,
  FiSearch,
  FiEye,
  FiX,
  FiInfo,
  FiCalendar,
  FiUser,
} from 'react-icons/fi';
import Swal from 'sweetalert2';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInscripcionesByEstudianteId,
  fetchInscritoByMatriculaId,
} from './slicesCursos/CursosThunk';

import {
  selectInscritosFiltrados,
  selectIsLoadingInscritos,
  selectIsLoadingDetalle,
  selectError,
  selectFiltroEstado,
  selectSearchTermCursos,
  selectInscritoSeleccionado,
  selectModalDetalleOpen,
  selectCantidadInscritos,
  selectCantidadActivos,
  selectCantidadConcluidos,
  selectCantidadAprobados,
  selectCantidadReprobados,
  selectCantidadPendientesNota,
  setFiltroEstado,
  setSearchTerm,
  clearError,
  closeDetalleModal,
} from './slicesCursos/CursosSlice';

/* ─── Helpers ─────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function fmtHour(h) {
  if (!h) return '—';
  return String(h).slice(0, 5);
}

function getTeacherName(docente) {
  const u = docente?.usuario;
  if (!u) return 'Docente no asignado';
  return [u.nombres, u.apellido_paterno, u.apellido_materno].filter(Boolean).join(' ');
}

function getEstadoCursoData(estado) {
  if (estado === false) {
    return {
      label: 'Concluido',
      bg: '#F3F4F6',
      color: '#374151',
    };
  }

  return {
    label: 'Activo',
    bg: '#EEF2FF',
    color: '#4338CA',
  };
}

function getEstadoNota(inscrito) {
  const nota = inscrito?.materia_notas;

  if (!nota) {
    return {
      label: 'Pendiente',
      color: '#6B7280',
      bg: '#F3F4F6',
      text: 'Aún el profesor no registró tu nota.',
    };
  }

  if (nota?.aprobado === true) {
    return {
      label: 'Aprobado',
      color: '#166534',
      bg: '#DCFCE7',
      text: `Nota final: ${nota?.nota_final ?? '—'}`,
    };
  }

  if (nota?.aprobado === false) {
    return {
      label: 'Reprobado',
      color: '#991B1B',
      bg: '#FEE2E2',
      text: `Nota final: ${nota?.nota_final ?? '—'}`,
    };
  }

  return {
    label: 'Pendiente',
    color: '#6B7280',
    bg: '#F3F4F6',
    text: 'Aún el profesor no registró tu nota.',
  };
}

function getCourseImage(index) {
  const images = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80',
  ];
  return images[index % images.length];
}

/* ─── Modal ─────────────────────────────────────────────── */
const CourseDetailModal = ({ open, onClose, inscrito, isLoading }) => {
  if (!open) return null;

  const curso = inscrito?.curso || {};
  const materia = curso?.materia || {};
  const docente = curso?.docente || {};
  const nota = inscrito?.materia_notas || null;

  const estadoNota = getEstadoNota(inscrito);
  const estadoCurso = getEstadoCursoData(curso?.estado);

  return (
    <div className="scm-backdrop" onClick={onClose}>
      <div className="scm-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="scm-close" onClick={onClose}>
          <FiX size={18} />
        </button>

        {isLoading ? (
          <div className="scm-loading">Cargando detalle del curso...</div>
        ) : !inscrito ? (
          <div className="scm-loading">No se pudo cargar la información.</div>
        ) : (
          <>
            <div className="scm-header">
              <div className="scm-badge">{materia?.codigo || 'SIGLA'}</div>

              <div className="scm-title-wrap">
                <h2 className="scm-title">{materia?.nombre || 'Curso'}</h2>
                <div className="scm-subline">
                  <span>{curso?.periodo || 'Periodo no disponible'}</span>
                  <span
                    className="scm-pill"
                    style={{ background: estadoCurso.bg, color: estadoCurso.color }}
                  >
                    {estadoCurso.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="scm-top-grid">
              <div className="scm-box">
                <h3>Nota final</h3>
                <div
                  className="scm-pill"
                  style={{ background: estadoNota.bg, color: estadoNota.color }}
                >
                  {estadoNota.label}
                </div>
                <p>{estadoNota.text}</p>
                {nota?.nota_final != null ? (
                  <div className="scm-grade">{nota.nota_final}</div>
                ) : null}
              </div>

              <div className="scm-box">
                <h3>Información rápida</h3>
                <div className="scm-list">
                  <div><span>Sigla</span><strong>{materia?.codigo || '—'}</strong></div>
                  <div><span>Periodo</span><strong>{curso?.periodo || '—'}</strong></div>
                  <div><span>Inscrito</span><strong>{fmtDate(inscrito?.creado_en)}</strong></div>
                  <div><span>Horario</span><strong>{fmtHour(curso?.hora_inicio)} - {fmtHour(curso?.hora_fin)}</strong></div>
                </div>
              </div>
            </div>

            <div className="scm-grid">
              <div className="scm-box">
                <h3>Docente</h3>
                <div className="scm-list">
                  <div><span>Nombre</span><strong>{getTeacherName(docente)}</strong></div>
                  <div><span>Título</span><strong>{docente?.titulo || '—'}</strong></div>
                  <div><span>Tipo</span><strong>{docente?.tipo_docente || '—'}</strong></div>
                  <div><span>Correo</span><strong>{docente?.usuario?.mail || '—'}</strong></div>
                </div>
              </div>

              <div className="scm-box">
                <h3>Curso</h3>
                <div className="scm-list">
                  <div><span>Lecciones</span><strong>{curso?.lecciones ?? '—'}</strong></div>
                  <div><span>Horas académicas</span><strong>{curso?.horas_academicas ?? '—'}</strong></div>
                  <div><span>Cupos</span><strong>{curso?.cupos ?? '—'}</strong></div>
                  <div><span>Días</span><strong>{curso?.dias_de_clases || '—'}</strong></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── Card ─────────────────────────────────────────────── */
const CourseCard = ({ inscrito, onView, onCertificate, index }) => {
  const curso = inscrito?.curso || {};
  const materia = curso?.materia || {};
  const docente = curso?.docente || {};
  const estadoCurso = getEstadoCursoData(curso?.estado);
  const estadoNota = getEstadoNota(inscrito);
  const showCertificate = curso?.estado === false;
  const image = getCourseImage(index);

  return (
    <div className="scc-card">
      <div className="scc-image-wrap">
        <img src={image} alt={materia?.nombre || 'Curso'} className="scc-image" />
        <div className="scc-overlay-code">{materia?.codigo || 'SIGLA'}</div>
        <div
          className="scc-overlay-state"
          style={{ background: estadoCurso.bg, color: estadoCurso.color }}
        >
          {estadoCurso.label}
        </div>
      </div>

      <div className="scc-body">
        <div className="scc-topline">
          <span className="scc-period">{curso?.periodo || 'Periodo'}</span>
        </div>

        <h3 className="scc-title">{materia?.nombre || 'Curso sin nombre'}</h3>

        <div className="scc-teacher">
          <FiUser size={13} />
          <span>{getTeacherName(docente)}</span>
        </div>

        <div className="scc-stats">
          <span><FiFileText size={13} /> {curso?.lecciones ?? 0} lecciones</span>
          <span><FiClock size={13} /> {curso?.horas_academicas ?? '—'} h</span>
          <span><FiUsers size={13} /> {curso?.cupos ?? '—'} cupos</span>
        </div>

        <div className="scc-subinfo">
          <div><FiCalendar size={13} /> {curso?.dias_de_clases || 'Sin días'}</div>
          <div><FiClock size={13} /> {fmtHour(curso?.hora_inicio)} - {fmtHour(curso?.hora_fin)}</div>
          <div><strong>Inscrito:</strong> {fmtDate(inscrito?.creado_en)}</div>
        </div>

        <div className="scc-note-box">
          <span
            className="scc-note-badge"
            style={{ background: estadoNota.bg, color: estadoNota.color }}
          >
            {estadoNota.label}
          </span>
          <p>{estadoNota.text}</p>
        </div>

        <div className="scc-actions">
          <button className="scc-btn scc-btn--info" type="button" onClick={() => onView(inscrito)}>
            <FiEye size={14} />
            Ver info
          </button>

          {showCertificate && (
            <button
              className="scc-btn scc-btn--cert"
              type="button"
              onClick={() => onCertificate(inscrito)}
            >
              <FiAward size={14} />
              Certificado
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Main ─────────────────────────────────────────────── */
const StudentCourses = () => {
  const dispatch = useDispatch();

  const inscritos = useSelector(selectInscritosFiltrados);
  const isLoading = useSelector(selectIsLoadingInscritos);
  const isLoadingDetalle = useSelector(selectIsLoadingDetalle);
  const error = useSelector(selectError);

  const filtroEstado = useSelector(selectFiltroEstado);
  const searchTerm = useSelector(selectSearchTermCursos);

  const modalOpen = useSelector(selectModalDetalleOpen);
  const inscritoSeleccionado = useSelector(selectInscritoSeleccionado);

  const total = useSelector(selectCantidadInscritos);
  const totalActivos = useSelector(selectCantidadActivos);
  const totalConcluidos = useSelector(selectCantidadConcluidos);
  const totalAprobados = useSelector(selectCantidadAprobados);
  const totalReprobados = useSelector(selectCantidadReprobados);
  const totalPendientes = useSelector(selectCantidadPendientesNota);

  const userId = useSelector((state) => state.login?.user?.id || null);

  const estudianteId = useSelector(
    (state) =>
      state.perfil?.perfil?.id_estudiante ||
      state.login?.user?.id_estudiante ||
      null
  );

  useEffect(() => {
    if (!estudianteId) return;

    dispatch(clearError());
    dispatch(
      fetchInscripcionesByEstudianteId({
        id_estudiante: estudianteId,
        page: 1,
        limit: 50,
      })
    );
  }, [dispatch, estudianteId]);

  const resumenFiltros = useMemo(
    () => [
      { key: 'todos', label: 'Todos', count: total },
      { key: 'activos', label: 'Activos', count: totalActivos },
      { key: 'concluidos', label: 'Concluidos', count: totalConcluidos },
      { key: 'aprobados', label: 'Aprobados', count: totalAprobados },
      { key: 'reprobados', label: 'Reprobados', count: totalReprobados },
      { key: 'pendientes', label: 'Pendientes', count: totalPendientes },
    ],
    [total, totalActivos, totalConcluidos, totalAprobados, totalReprobados, totalPendientes]
  );

  const handleOpenDetail = (inscrito) => {
    if (inscrito?.id_matricula) {
      dispatch(fetchInscritoByMatriculaId(inscrito.id_matricula));
    }
  };

  const handleCloseModal = () => {
    dispatch(closeDetalleModal());
  };

  const handleCertificate = async (inscrito) => {
    const materia = inscrito?.curso?.materia?.nombre || 'este curso';

    await Swal.fire({
      title: 'Certificado',
      html: `
        <div style="margin-top:6px; color:#5A6676; font-size:14px; line-height:1.5">
          El curso <strong style="color:#1A1F36">"${materia}"</strong> está concluido.<br/>
          Aquí luego podremos generar o descargar el certificado.
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#6D5DFD',
      didOpen: (popup) => {
        popup.style.borderRadius = '16px';
      },
    });
  };

  return (
    <>
      <style>{`
        .sc-page {
          min-height: 100%;
          padding: 28px 24px;
          background: #edeef5;
          box-sizing: border-box;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }

        .sc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .sc-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sc-header-pill {
          width: 8px;
          height: 24px;
          border-radius: 4px;
          background: #6d5dfd;
        }

        .sc-title {
          margin: 0;
          font-size: 24px;
          font-weight: 900;
          color: #1a1f36;
        }

        .sc-count {
          background: #eef2ff;
          color: #4338ca;
          font-size: 12px;
          font-weight: 800;
          padding: 6px 10px;
          border-radius: 999px;
        }

        .sc-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .sc-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .sc-filter {
          border: 1px solid #e5e7eb;
          background: #fff;
          color: #374151;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all .15s ease;
        }

        .sc-filter:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0,0,0,.05);
        }

        .sc-filter.active {
          background: #6d5dfd;
          border-color: #6d5dfd;
          color: #fff;
        }

        .sc-search {
          position: relative;
          width: 300px;
          max-width: 100%;
        }

        .sc-search input {
          width: 100%;
          box-sizing: border-box;
          border: 1.5px solid #dde0ef;
          border-radius: 12px;
          padding: 10px 12px 10px 38px;
          font-size: 14px;
          background: #fff;
          color: #1a1f36;
          outline: none;
        }

        .sc-search input:focus {
          border-color: #6d5dfd;
          box-shadow: 0 0 0 3px rgba(109, 93, 253, 0.12);
        }

        .sc-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #98a2b3;
        }

        .sc-error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 700;
        }

        .sc-empty {
          background: #fff;
          border-radius: 18px;
          padding: 46px 24px;
          text-align: center;
          color: #6b7280;
          border: 1px solid #e5e7eb;
        }

        .sc-empty svg {
          opacity: .55;
          margin-bottom: 12px;
        }

        .sc-empty p {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
        }

        .sc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
          gap: 20px;
        }

        .scc-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid #e8eaf5;
          box-shadow: 0 8px 24px rgba(16,24,40,.05);
          transition: transform .18s ease, box-shadow .18s ease;
          max-width: 360px;
        }

        .scc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 34px rgba(16,24,40,.09);
        }

        .scc-image-wrap {
          position: relative;
          height: 165px;
          overflow: hidden;
        }

        .scc-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .35s ease;
        }

        .scc-card:hover .scc-image {
          transform: scale(1.04);
        }

        .scc-overlay-code {
          position: absolute;
          left: 12px;
          bottom: 12px;
          background: rgba(17, 24, 39, 0.78);
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          padding: 6px 10px;
          border-radius: 999px;
          backdrop-filter: blur(6px);
        }

        .scc-overlay-state {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 12px;
          font-weight: 800;
          padding: 6px 10px;
          border-radius: 999px;
          backdrop-filter: blur(4px);
        }

        .scc-body {
          padding: 14px 16px 16px;
        }

        .scc-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .scc-period {
          color: #6b7280;
          font-size: 12px;
          font-weight: 700;
        }

        .scc-title {
          margin: 0 0 10px;
          font-size: 17px;
          font-weight: 800;
          color: #1a1f36;
          line-height: 1.32;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 44px;
        }

        .scc-teacher {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #667085;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .scc-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          background: #f7f8fc;
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 12px;
        }

        .scc-stats span,
        .scc-subinfo div {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #4b5563;
          font-weight: 600;
        }

        .scc-subinfo {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 12px;
        }

        .scc-note-box {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px;
          background: #fcfcfd;
          margin-bottom: 12px;
        }

        .scc-note-badge {
          display: inline-flex;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .scc-note-box p {
          margin: 0;
          font-size: 13px;
          color: #4b5563;
          font-weight: 600;
          line-height: 1.4;
        }

        .scc-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .scc-btn {
          border: none;
          border-radius: 10px;
          padding: 9px 13px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all .15s ease;
        }

        .scc-btn--info {
          background: #eef2ff;
          color: #4338ca;
        }

        .scc-btn--info:hover {
          background: #e0e7ff;
        }

        .scc-btn--cert {
          background: #6d5dfd;
          color: #fff;
          box-shadow: 0 6px 16px rgba(109,93,253,.24);
        }

        .scc-btn--cert:hover {
          background: #5a4ae8;
          transform: translateY(-1px);
        }

        .scm-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.34);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          z-index: 9999;
        }

        .scm-modal {
          width: min(100%, 620px);
          max-height: 80vh;
          overflow-y: auto;
          background: #fff;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 24px 64px rgba(15,23,42,.20);
          position: relative;
        }

        .scm-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #f3f4f6;
          color: #374151;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scm-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-right: 40px;
        }

        .scm-badge {
          background: #eef2ff;
          color: #4338ca;
          font-size: 13px;
          font-weight: 900;
          padding: 9px 11px;
          border-radius: 12px;
          white-space: nowrap;
        }

        .scm-title {
          margin: 0;
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          line-height: 1.2;
        }

        .scm-subline {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
          margin-top: 6px;
          color: #6b7280;
          font-size: 13px;
          font-weight: 600;
        }

        .scm-pill {
          display: inline-flex;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .scm-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        .scm-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .scm-box {
          background: #fafafb;
          border: 1px solid #eceef3;
          border-radius: 15px;
          padding: 13px;
        }

        .scm-box h3 {
          margin: 0 0 10px;
          font-size: 15px;
          font-weight: 800;
          color: #1f2937;
        }

        .scm-box p {
          margin: 0;
          color: #4b5563;
          font-size: 14px;
          line-height: 1.5;
        }

        .scm-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 12px;
        }

        .scm-list div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .scm-list span {
          font-size: 11px;
          font-weight: 900;
          color: #98a2b3;
          text-transform: uppercase;
          letter-spacing: .05em;
        }

        .scm-list strong {
          font-size: 14px;
          color: #111827;
          line-height: 1.4;
        }

        .scm-grade {
          width: fit-content;
          min-width: 58px;
          text-align: center;
          padding: 9px 12px;
          background: #eef2ff;
          color: #4338ca;
          border-radius: 13px;
          font-size: 22px;
          font-weight: 900;
          margin-top: 10px;
        }

        .scm-loading {
          padding: 34px 12px;
          text-align: center;
          color: #6b7280;
          font-size: 15px;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .scm-top-grid,
          .scm-grid,
          .scm-list {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .sc-page {
            padding: 18px 12px;
          }

          .sc-header {
            align-items: flex-start;
          }

          .sc-toolbar {
            align-items: stretch;
          }

          .sc-search {
            width: 100%;
          }

          .sc-grid {
            grid-template-columns: 1fr;
          }

          .scc-card {
            max-width: 100%;
          }

          .scm-modal {
            width: min(100%, 96vw);
            padding: 16px;
            border-radius: 18px;
          }

          .scm-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .scm-title {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="sc-page">
        {error ? <div className="sc-error">{error}</div> : null}

        <div className="sc-header">
          <div className="sc-header-left">
            <div className="sc-header-pill" />
            <h1 className="sc-title">Mis Cursos</h1>
            <span className="sc-count">
              {isLoading ? 'Cargando…' : `${total} inscritos`}
            </span>
          </div>
        </div>

        <div className="sc-toolbar">
          <div className="sc-filters">
            {resumenFiltros.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`sc-filter ${filtroEstado === item.key ? 'active' : ''}`}
                onClick={() => dispatch(setFiltroEstado(item.key))}
              >
                {item.label} ({item.count})
              </button>
            ))}
          </div>

          <div className="sc-search">
            <FiSearch size={15} className="sc-search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre, sigla o docente..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="sc-empty">
            <FiBook size={46} />
            <p>Cargando tus cursos...</p>
          </div>
        ) : inscritos.length === 0 ? (
          <div className="sc-empty">
            <FiInfo size={46} />
            <p>No se encontraron cursos con los filtros actuales.</p>
          </div>
        ) : (
          <div className="sc-grid">
            {inscritos.map((inscrito, index) => (
              <CourseCard
                key={inscrito.id_matricula}
                inscrito={inscrito}
                onView={handleOpenDetail}
                onCertificate={handleCertificate}
                index={index}
              />
            ))}
          </div>
        )}

        <CourseDetailModal
          open={modalOpen}
          onClose={handleCloseModal}
          inscrito={inscritoSeleccionado}
          isLoading={isLoadingDetalle}
        />
      </div>
    </>
  );
};

export default StudentCourses;