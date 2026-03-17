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
  FiRotateCcw,
} from 'react-icons/fi';
import Swal from 'sweetalert2';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInscripcionesByEstudianteId,
  fetchInscritoByMatriculaId,
  enviarCertificadoPorMatricula,
  desinscribirseMismoDia,
} from './slicesCursos/CursosThunk';

import {
  selectInscritosFiltrados,
  selectIsLoadingInscritos,
  selectIsLoadingDetalle,
  selectIsSendingCertificate,
  selectIsUnenrolling,
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
  clearCertificateSuccess,
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

function fmtMoney(value) {
  return `BOB ${Number(value || 0).toFixed(2)}`;
}

function getTeacherName(docente) {
  const u = docente?.usuario;
  if (!u) return 'Docente no asignado';
  return [u.nombres, u.apellido_paterno, u.apellido_materno].filter(Boolean).join(' ');
}

function getEstadoCursoData(estado) {
  if (estado === 'FINALIZADO') {
    return {
      label: 'Concluido',
      bg: '#F3F4F6',
      color: '#374151',
    };
  }

  if (estado === 'CANCELADO') {
    return {
      label: 'Cancelado',
      bg: '#FEE2E2',
      color: '#991B1B',
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

function puedeDesinscribirse(inscrito) {
  if (!inscrito?.id_matricula) return false;

  const estado = inscrito?.estado_inscripcion || inscrito?.estado;
  if (estado !== 'PAGADO') return false;

  const fechaBase = inscrito?.fecha_inscripcion || inscrito?.creado_en;
  if (!fechaBase) return false;

  const fecha = new Date(fechaBase);
  if (Number.isNaN(fecha.getTime())) return false;

  const ahora = new Date();

  return (
    fecha.getFullYear() === ahora.getFullYear() &&
    fecha.getMonth() === ahora.getMonth() &&
    fecha.getDate() === ahora.getDate()
  );
}

/* ─── Modal ─────────────────────────────────────────────── */
const CourseDetailModal = ({
  open,
  onClose,
  inscrito,
  isLoading,
  onCertificate,
  onUnenroll,
  isSendingCertificate,
  isUnenrolling,
}) => {
  if (!open) return null;

  const curso = inscrito?.curso || {};
  const materia = curso?.materia || {};
  const docente = curso?.docente || {};
  const nota = inscrito?.materia_notas || null;

  const estadoNota = getEstadoNota(inscrito);
  const estadoCurso = getEstadoCursoData(curso?.estado);
  const mostrarCertificado =
    curso?.estado === 'FINALIZADO' && nota?.aprobado === true;
  const mostrarDesinscripcion = puedeDesinscribirse(inscrito);

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
                  <div><span>Inscrito</span><strong>{fmtDate(inscrito?.fecha_inscripcion || inscrito?.creado_en)}</strong></div>
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

            {(mostrarCertificado || mostrarDesinscripcion) && (
              <div className="scm-actions">
                {mostrarDesinscripcion && (
                  <button
                    type="button"
                    className="scm-action-btn scm-action-btn--danger"
                    onClick={() => onUnenroll(inscrito)}
                    disabled={isUnenrolling}
                  >
                    <FiRotateCcw size={15} />
                    {isUnenrolling ? 'Procesando...' : 'Desinscribirse'}
                  </button>
                )}

                {mostrarCertificado && (
                  <button
                    type="button"
                    className="scm-action-btn scm-action-btn--primary"
                    onClick={() => onCertificate(inscrito)}
                    disabled={isSendingCertificate}
                  >
                    <FiAward size={15} />
                    {isSendingCertificate ? 'Enviando...' : 'Enviar certificado'}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ─── Card ─────────────────────────────────────────────── */
const CourseCard = ({
  inscrito,
  onView,
  onCertificate,
  onUnenroll,
  index,
  isSendingCertificate,
  isUnenrolling,
}) => {
  const curso = inscrito?.curso || {};
  const materia = curso?.materia || {};
  const docente = curso?.docente || {};
  const nota = inscrito?.materia_notas || null;

  const estadoCurso = getEstadoCursoData(curso?.estado);
  const estadoNota = getEstadoNota(inscrito);

  const showCertificate =
    curso?.estado === 'FINALIZADO' && nota?.aprobado === true;

  const showUnenroll = puedeDesinscribirse(inscrito);
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
          <div><strong>Inscrito:</strong> {fmtDate(inscrito?.fecha_inscripcion || inscrito?.creado_en)}</div>
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

          {showUnenroll && (
            <button
              className="scc-btn scc-btn--danger"
              type="button"
              onClick={() => onUnenroll(inscrito)}
              disabled={isUnenrolling}
            >
              <FiRotateCcw size={14} />
              {isUnenrolling ? 'Procesando...' : 'Desinscribirse'}
            </button>
          )}

          {showCertificate && (
            <button
              className="scc-btn scc-btn--cert"
              type="button"
              onClick={() => onCertificate(inscrito)}
              disabled={isSendingCertificate}
            >
              <FiAward size={14} />
              {isSendingCertificate ? 'Enviando...' : 'Certificado'}
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
  const isSendingCertificate = useSelector(selectIsSendingCertificate);
  const isUnenrolling = useSelector(selectIsUnenrolling);
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
    try {
      const materia = inscrito?.curso?.materia?.nombre || 'este curso';
      const idMatricula = inscrito?.id_matricula;

      if (!idMatricula) {
        await Swal.fire({
          icon: 'error',
          title: 'No se pudo enviar',
          text: 'No se encontró la matrícula del curso.',
          confirmButtonColor: '#6D5DFD',
        });
        return;
      }

      const confirm = await Swal.fire({
        title: 'Enviar certificado',
        html: `
          <div style="margin-top:6px; color:#5A6676; font-size:14px; line-height:1.5">
            Se enviará el certificado del curso
            <strong style="color:#1A1F36">"${materia}"</strong>
            a tu correo electrónico registrado.
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#6D5DFD',
        cancelButtonColor: '#CBD5E1',
      });

      if (!confirm.isConfirmed) return;

      Swal.fire({
        title: 'Enviando certificado...',
        text: 'Espera un momento, estamos preparando tu PDF.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await dispatch(enviarCertificadoPorMatricula(idMatricula)).unwrap();
      dispatch(clearCertificateSuccess());

      await Swal.fire({
        icon: 'success',
        title: 'Certificado enviado',
        html: `
          <div style="margin-top:6px; color:#5A6676; font-size:14px; line-height:1.5">
            Tu certificado fue enviado correctamente a tu correo electrónico.
          </div>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#6D5DFD',
      });
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al enviar',
        text: err || 'Ocurrió un problema al enviar el certificado.',
        confirmButtonColor: '#6D5DFD',
      });
    }
  };

  const handleUnenroll = async (inscrito) => {
    try {
      const materia = inscrito?.curso?.materia?.nombre || 'este curso';
      const idMatricula = inscrito?.id_matricula;
      const precioCurso =
        inscrito?.curso?.precio ||
        inscrito?.pago?.monto ||
        0;

      if (!idMatricula) {
        await Swal.fire({
          icon: 'error',
          title: 'No se pudo desinscribir',
          text: 'No se encontró la matrícula del curso.',
          confirmButtonColor: '#6D5DFD',
        });
        return;
      }

      const confirm = await Swal.fire({
        title: '¿Desinscribirte del curso?',
        html: `
          <div style="margin-top:6px; color:#5A6676; font-size:14px; line-height:1.6">
            Vas a desinscribirte de
            <strong style="color:#1A1F36">"${materia}"</strong>.<br/><br/>
            El importe se acreditará como saldo a tu favor.
            ${precioCurso ? `<br/><strong style="color:#166534">Saldo estimado: ${fmtMoney(precioCurso)}</strong>` : ''}
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desinscribirme',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#DC2626',
        cancelButtonColor: '#CBD5E1',
      });

      if (!confirm.isConfirmed) return;

      Swal.fire({
        title: 'Procesando desinscripción...',
        text: 'Espera un momento.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await dispatch(desinscribirseMismoDia(idMatricula)).unwrap();

      await Swal.fire({
        icon: 'success',
        title: 'Desinscripción realizada',
        html: `
          <div style="margin-top:6px; color:#5A6676; font-size:14px; line-height:1.6">
            Te desinscribiste correctamente del curso
            <strong style="color:#1A1F36">"${materia}"</strong>.<br/><br/>
            <span style="display:inline-flex; align-items:center; gap:6px; color:#166534; font-weight:700;">
              Saldo generado: ${fmtMoney(response?.saldo_generado || 0)}
            </span>
          </div>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#6D5DFD',
      });

      if (modalOpen) {
        dispatch(closeDetalleModal());
      }
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo desinscribir',
        text: err || 'Ocurrió un problema al desinscribirte del curso.',
        confirmButtonColor: '#6D5DFD',
      });
    }
  };

  return (
    <>
      <style>{`
        .sc-page {
          min-height: 100%;
          padding: 16px 18px 22px;
          background: transparent;
          box-sizing: border-box;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }

        .sc-shell {
          background: #ffffff;
          border: 1px solid #e7edf5;
          border-radius: 22px;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
          overflow: hidden;
        }

        .sc-headbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 18px 20px 14px;
          border-bottom: 1px solid #eef2f7;
          background: #ffffff;
          flex-wrap: wrap;
        }

        .sc-headbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .sc-headbar-accent {
          width: 8px;
          height: 40px;
          border-radius: 999px;
          background: linear-gradient(180deg, #7c5cff 0%, #6d5dfd 100%);
          flex-shrink: 0;
        }

        .sc-headbar-text {
          min-width: 0;
        }

        .sc-headbar-title {
          margin: 0;
          font-size: 19px;
          font-weight: 900;
          color: #101828;
          line-height: 1.15;
        }

        .sc-headbar-sub {
          margin: 4px 0 0;
          font-size: 13px;
          color: #667085;
          font-weight: 700;
        }

        .sc-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #eef2ff;
          color: #4338ca;
          font-size: 13px;
          font-weight: 900;
          padding: 10px 14px;
          border-radius: 999px;
          white-space: nowrap;
        }

        .sc-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          padding: 16px 20px 18px;
          background: #ffffff;
          border-bottom: 1px solid #eef2f7;
        }

        .sc-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .sc-filter {
          border: 1px solid #dfe6f0;
          background: #fbfcfe;
          color: #344054;
          border-radius: 999px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all .15s ease;
        }

        .sc-filter:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(15,23,42,.06);
        }

        .sc-filter.active {
          background: linear-gradient(135deg, #7c5cff 0%, #6d5dfd 100%);
          border-color: #7c5cff;
          color: #fff;
          box-shadow: 0 10px 18px rgba(109,93,253,.18);
        }

        .sc-search {
          position: relative;
          width: 390px;
          max-width: 100%;
        }

        .sc-search input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dfe6f0;
          border-radius: 15px;
          padding: 13px 14px 13px 42px;
          font-size: 14px;
          font-weight: 600;
          background: #fbfcfe;
          color: #1a1f36;
          outline: none;
        }

        .sc-search input:focus {
          border-color: #8f7bff;
          box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.10);
          background: #fff;
        }

        .sc-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #98a2b3;
        }

        .sc-content {
          padding: 20px;
          background: #ffffff;
        }

        .sc-error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
          border-radius: 14px;
          padding: 12px 14px;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 700;
        }

        .sc-empty {
          background: #ffffff;
          border-radius: 20px;
          padding: 54px 24px;
          text-align: center;
          color: #6b7280;
          border: 1px dashed #d9e2ef;
        }

        .sc-empty svg {
          opacity: .45;
          margin-bottom: 12px;
        }

        .sc-empty p {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
        }

        .sc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 22px;
        }

        .scc-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #e7edf5;
          box-shadow: 0 12px 28px rgba(15,24,42,.05);
          transition: transform .18s ease, box-shadow .18s ease;
          max-width: 100%;
        }

        .scc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 36px rgba(15,24,42,.09);
        }

        .scc-image-wrap {
          position: relative;
          height: 185px;
          overflow: hidden;
          background: #f4f6fb;
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
          left: 14px;
          bottom: 14px;
          background: rgba(17, 24, 39, 0.78);
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          padding: 7px 11px;
          border-radius: 999px;
          backdrop-filter: blur(6px);
        }

        .scc-overlay-state {
          position: absolute;
          top: 14px;
          right: 14px;
          font-size: 12px;
          font-weight: 900;
          padding: 7px 11px;
          border-radius: 999px;
          backdrop-filter: blur(4px);
        }

        .scc-body {
          padding: 16px 16px 18px;
        }

        .scc-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .scc-period {
          color: #667085;
          font-size: 12px;
          font-weight: 800;
          background: #f2f4f7;
          border-radius: 999px;
          padding: 7px 11px;
        }

        .scc-title {
          margin: 0 0 10px;
          font-size: 18px;
          font-weight: 900;
          color: #101828;
          line-height: 1.32;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 46px;
        }

        .scc-teacher {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #667085;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 13px;
        }

        .scc-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #edf2f7;
          border-radius: 12px;
          padding: 10px 12px;
          margin-bottom: 12px;
        }

        .scc-stats span,
        .scc-subinfo div {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #475467;
          font-weight: 700;
        }

        .scc-subinfo {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }

        .scc-note-box {
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 12px;
          background: #fcfcfd;
          margin-bottom: 14px;
        }

        .scc-note-badge {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .scc-note-box p {
          margin: 0;
          font-size: 13px;
          color: #4b5563;
          font-weight: 700;
          line-height: 1.45;
        }

        .scc-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .scc-btn {
          border: none;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 900;
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

        .scc-btn--danger {
          background: #fff1f2;
          color: #be123c;
        }

        .scc-btn--danger:hover {
          background: #ffe4e6;
        }

        .scc-btn--cert {
          background: linear-gradient(135deg, #7c5cff 0%, #6d5dfd 100%);
          color: #fff;
          box-shadow: 0 8px 18px rgba(109,93,253,.22);
        }

        .scc-btn--cert:hover {
          transform: translateY(-1px);
        }

        .scc-btn:disabled {
          opacity: .72;
          cursor: not-allowed;
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
          max-height: 82vh;
          overflow-y: auto;
          background: #fff;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 24px 64px rgba(15,23,42,.20);
          position: relative;
          border: 1px solid #e7edf5;
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
          font-weight: 700;
        }

        .scm-pill {
          display: inline-flex;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
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
          font-weight: 900;
          color: #1f2937;
        }

        .scm-box p {
          margin: 0;
          color: #4b5563;
          font-size: 14px;
          line-height: 1.5;
          font-weight: 600;
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

        .scm-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 14px;
        }

        .scm-action-btn {
          border: none;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .scm-action-btn--primary {
          background: linear-gradient(135deg, #7c5cff 0%, #6d5dfd 100%);
          color: #fff;
        }

        .scm-action-btn--danger {
          background: #fff1f2;
          color: #be123c;
        }

        .scm-action-btn:disabled {
          opacity: .72;
          cursor: not-allowed;
        }

        .scm-loading {
          padding: 34px 12px;
          text-align: center;
          color: #6b7280;
          font-size: 15px;
          font-weight: 700;
        }

        @media (max-width: 900px) {
          .scm-top-grid,
          .scm-grid,
          .scm-list {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .sc-page {
            padding: 12px;
          }

          .sc-headbar,
          .sc-toolbar,
          .sc-content {
            padding-left: 14px;
            padding-right: 14px;
          }

          .sc-headbar {
            align-items: stretch;
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

          .scm-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="sc-page">
        <div className="sc-shell">
          <div className="sc-headbar">
            <div className="sc-headbar-left">
              <div className="sc-headbar-accent" />
              <div className="sc-headbar-text">
                <h2 className="sc-headbar-title">Cursos inscritos</h2>
                <p className="sc-headbar-sub">
                  Revisa tu avance, tus notas y la información de cada materia.
                </p>
              </div>
            </div>

            <span className="sc-count">
              {isLoading ? 'Cargando…' : `${total} inscritos`}
            </span>
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

          <div className="sc-content">
            {error ? <div className="sc-error">{error}</div> : null}

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
                    onUnenroll={handleUnenroll}
                    index={index}
                    isSendingCertificate={isSendingCertificate}
                    isUnenrolling={isUnenrolling}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <CourseDetailModal
          open={modalOpen}
          onClose={handleCloseModal}
          inscrito={inscritoSeleccionado}
          isLoading={isLoadingDetalle}
          onCertificate={handleCertificate}
          onUnenroll={handleUnenroll}
          isSendingCertificate={isSendingCertificate}
          isUnenrolling={isUnenrolling}
        />
      </div>
    </>
  );
};

export default StudentCourses;