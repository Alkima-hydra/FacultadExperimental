import React, { useEffect, useMemo, useState } from 'react';
import {
  FiSearch,
  FiBook,
  FiClock,
  FiUsers,
  FiUser,
  FiInfo,
  FiX,
  FiShoppingCart,
  FiAlertCircle,
  FiCheckCircle,
  FiSlash,
  FiCalendar,
  FiFilter,
  FiTag,
  FiLayers,
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';

import { selectUserId } from '../signin/slices/loginSelectors';


import {
  fetchOfertaAcademicaByUsuarioId,
  addCursoOfertaToCarrito,
} from './slicesOfertaAcademica/OfertaAcademicaThunk';
import { fetchCarritoByUsuarioId } from './slicesCarrito/CarritoThunk';

import {
  selectOfertaResumen,
  selectOfertaCursos,
  selectOfertaCursosFiltrados,
  selectOfertaLoading,
  selectOfertaAdding,
  selectOfertaError,
  selectOfertaSuccess,
  selectOfertaSearch,
  selectOfertaFiltroEstado,
  selectOfertaFiltroDisponibilidad,
  selectOfertaFiltroCategoria,
  selectOfertaFiltroPeriodo,
  selectOfertaFiltroPrerequisitos,
  selectOfertaCursoSeleccionado,
  selectOfertaModalOpen,
  clearOfertaError,
  clearOfertaSuccess,
  setOfertaSearch,
  setOfertaFiltroEstado,
  setOfertaFiltroDisponibilidad,
  setOfertaFiltroCategoria,
  setOfertaFiltroPeriodo,
  setOfertaFiltroPrerequisitos,
  clearOfertaFiltros,
  openOfertaDetalle,
  closeOfertaDetalle,
} from './slicesOfertaAcademica/OfertaAcademicaSlice';

const swalTheme = {
  confirmButtonColor: '#704FE6',
  cancelButtonColor: '#4D5756',
  customClass: { popup: 'it-cadm-swal-popup' },
  didOpen: () => {
    const container = document.querySelector('.swal2-container');
    if (container) container.style.zIndex = '99999';
  },
};

function fmtHour(h) {
  if (!h) return '—';
  return String(h).slice(0, 5);
}

function money(v) {
  return `Bs. ${Number(v || 0).toFixed(2)}`;
}

function docenteNombre(docente) {
  const u = docente?.usuario;
  if (!u) return 'Docente no disponible';
  return [u.nombres, u.apellido_paterno, u.apellido_materno].filter(Boolean).join(' ');
}

function getBadge(curso) {
  if (curso?.ya_aprobada) return { text: 'Ya aprobada', cls: 'oa-badge oa-badge--gray' };
  if (curso?.cursando_actualmente) return { text: 'Cursando', cls: 'oa-badge oa-badge--blue' };
  if (curso?.en_carrito_pendiente) return { text: 'En carrito', cls: 'oa-badge oa-badge--purple' };
  if (curso?.tiene_prerequisitos_pendientes) return { text: 'Prerequisitos pendientes', cls: 'oa-badge oa-badge--red' };
  if (curso?.sin_cupos) return { text: 'Sin cupos', cls: 'oa-badge oa-badge--orange' };
  if (curso?.choque_horario) return { text: 'Choque horario', cls: 'oa-badge oa-badge--red' };
  if (curso?.reprobada_previamente) return { text: 'Repite materia', cls: 'oa-badge oa-badge--yellow' };
  if (curso?.puede_inscribirse) return { text: 'Disponible', cls: 'oa-badge oa-badge--green' };
  return { text: 'Bloqueado', cls: 'oa-badge oa-badge--gray' };
}

const PrereqPill = ({ item, ok }) => (
  <span className={`oa-prereq-pill ${ok ? 'ok' : 'bad'}`}>
    <FiTag size={12} />
    <span>{item?.materia_prereq?.codigo || 'MAT'}</span>
    <small>{item?.materia_prereq?.nombre || 'Materia'}</small>
  </span>
);

const OfertaDetailModal = ({ open, onClose, curso, onAdd, isAdding }) => {
  if (!open || !curso) return null;

  const badge = getBadge(curso);
  const motivos = Array.isArray(curso?.motivos_bloqueo) ? curso.motivos_bloqueo : [];

  return (
    <div className="oa-modal-backdrop" onClick={onClose}>
      <div className="oa-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="oa-modal__close" onClick={onClose}>
          <FiX size={18} />
        </button>

        <div className="oa-modal__header">
          <div className="oa-modal__code">{curso?.materia?.codigo || 'CUR'}</div>
          <div className="oa-modal__header-text">
            <h2>{curso?.materia?.nombre || 'Curso'}</h2>
            <div className="oa-modal__header-meta">
              <span>{curso?.periodo || 'Sin periodo'}</span>
              <span className={badge.cls}>{badge.text}</span>
            </div>
          </div>
        </div>

        <div className="oa-modal__grid">
          <div className="oa-modal__card">
            <h4>Información general</h4>
            <div className="oa-modal__list">
              <div><span>Sigla</span><strong>{curso?.materia?.codigo || '—'}</strong></div>
              <div><span>Materia</span><strong>{curso?.materia?.nombre || '—'}</strong></div>
              <div><span>Categoría</span><strong>{curso?.materia?.categoria || '—'}</strong></div>
              <div><span>Periodo</span><strong>{curso?.periodo || '—'}</strong></div>
            </div>
          </div>

          <div className="oa-modal__card">
            <h4>Horario</h4>
            <div className="oa-modal__list">
              <div><span>Días</span><strong>{curso?.dias_de_clases || '—'}</strong></div>
              <div><span>Hora inicio</span><strong>{fmtHour(curso?.hora_inicio)}</strong></div>
              <div><span>Hora fin</span><strong>{fmtHour(curso?.hora_fin)}</strong></div>
              <div><span>Horas académicas</span><strong>{curso?.horas_academicas ?? '—'}</strong></div>
            </div>
          </div>

          <div className="oa-modal__card">
            <h4>Docente</h4>
            <div className="oa-modal__list">
              <div><span>Nombre</span><strong>{docenteNombre(curso?.docente)}</strong></div>
              <div><span>Título</span><strong>{curso?.docente?.titulo || '—'}</strong></div>
              <div><span>Tipo</span><strong>{curso?.docente?.tipo_docente || '—'}</strong></div>
              <div><span>Correo</span><strong>{curso?.docente?.usuario?.mail || '—'}</strong></div>
            </div>
          </div>

          <div className="oa-modal__card">
            <h4>Disponibilidad</h4>
            <div className="oa-modal__list">
              <div><span>Cupos</span><strong>{curso?.cupos ?? 0}</strong></div>
              <div><span>Inscritos actuales</span><strong>{curso?.inscritos_actuales ?? 0}</strong></div>
              <div><span>Cupos disponibles</span><strong>{curso?.cupos_disponibles ?? 0}</strong></div>
              <div><span>Precio</span><strong>{money(curso?.precio)}</strong></div>
            </div>
          </div>

          <div className="oa-modal__card oa-modal__card--full">
            <h4>Descripción</h4>
            <p>{curso?.descripcion || 'No hay descripción disponible.'}</p>
          </div>

          <div className="oa-modal__card">
            <h4>Aprenderás</h4>
            <p>{curso?.aprenderas || 'No especificado.'}</p>
          </div>

          <div className="oa-modal__card">
            <h4>Dirigido a</h4>
            <p>{curso?.dirigido || 'No especificado.'}</p>
          </div>

          <div className="oa-modal__card oa-modal__card--full">
            <h4>Contenido</h4>
            <p>{curso?.contenido || 'No especificado.'}</p>
          </div>

          {!curso?.ya_aprobada && (
            <div className="oa-modal__card oa-modal__card--full">
              <h4>
                <FiLayers size={15} style={{ marginRight: 6 }} />
                Prerequisitos
              </h4>

              {!curso?.tiene_prerequisitos ? (
                <p>Esta materia no tiene prerequisitos.</p>
              ) : (
                <>
                  <div className="oa-prereq-section">
                    <label>Completados</label>
                    <div className="oa-prereq-wrap">
                      {curso?.prerequisitos_aprobados?.length > 0 ? (
                        curso.prerequisitos_aprobados.map((p) => (
                          <PrereqPill
                            key={`ok-${p.id_materia_prereq}-${p.materia_id_materia_prereq}`}
                            item={p}
                            ok
                          />
                        ))
                      ) : (
                        <span className="oa-prereq-empty">
                          Aún no tienes prerequisitos aprobados para esta materia.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="oa-prereq-section">
                    <label>Faltantes</label>
                    <div className="oa-prereq-wrap">
                      {curso?.prerequisitos_faltantes?.length > 0 ? (
                        curso.prerequisitos_faltantes.map((p) => (
                          <PrereqPill
                            key={`bad-${p.id_materia_prereq}-${p.materia_id_materia_prereq}`}
                            item={p}
                            ok={false}
                          />
                        ))
                      ) : (
                        <span className="oa-prereq-empty">No te faltan prerequisitos.</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {!curso?.puede_inscribirse && motivos.length > 0 && (
            <div className="oa-modal__card oa-modal__card--full oa-modal__card--warning">
              <h4>¿Por qué no puedes agregarla al carrito?</h4>
              <ul className="oa-modal__reasons">
                {motivos.map((r, i) => (
                  <li key={i}>
                    <FiAlertCircle size={15} />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="oa-modal__footer">
          <button type="button" className="oa-btn oa-btn--ghost" onClick={onClose}>
            Cerrar
          </button>

          <button
            type="button"
            className={`oa-btn ${curso?.puede_inscribirse ? 'oa-btn--primary' : 'oa-btn--disabled'}`}
            onClick={() => curso?.puede_inscribirse && onAdd(curso)}
            disabled={!curso?.puede_inscribirse || isAdding}
          >
            <FiShoppingCart size={15} />
            <span>
              {curso?.puede_inscribirse
                ? isAdding
                  ? 'Agregando...'
                  : 'Agregar al carrito'
                : 'No disponible'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const OfertaCard = ({ curso, onOpen, onAdd, isAdding }) => {
  const badge = getBadge(curso);
  const blocked = !curso?.puede_inscribirse;

  return (
    <div className={`oa-card${blocked ? ' blocked' : ''}`}>
      <div className="oa-card__top">
        <div className="oa-card__code">{curso?.materia?.codigo || 'CUR'}</div>
        <div className={badge.cls}>{badge.text}</div>
      </div>

      <h3 className="oa-card__title">{curso?.materia?.nombre || 'Curso sin nombre'}</h3>

      <p className="oa-card__teacher">
        <FiUser size={13} />
        <span>{docenteNombre(curso?.docente)}</span>
      </p>

      <div className="oa-card__meta">
        <span><FiCalendar size={13} /> {curso?.periodo || 'Sin periodo'}</span>
        <span><FiClock size={13} /> {fmtHour(curso?.hora_inicio)} - {fmtHour(curso?.hora_fin)}</span>
        <span><FiUsers size={13} /> {curso?.cupos_disponibles ?? 0} cupos</span>
        <span><FiBook size={13} /> {curso?.lecciones ?? 0} lecciones</span>
      </div>

      <div className="oa-card__chips">
        {curso?.materia?.categoria ? (
          <span className="oa-card__chip oa-card__chip--cat">{curso.materia.categoria}</span>
        ) : null}

        {!curso?.ya_aprobada && (
          curso?.tiene_prerequisitos ? (
            <span
              className={`oa-card__chip ${
                curso?.tiene_prerequisitos_pendientes
                  ? 'oa-card__chip--red'
                  : 'oa-card__chip--green'
              }`}
            >
              {curso?.tiene_prerequisitos_pendientes
                ? `${curso?.prerequisitos_faltantes?.length || 0} prereq. faltantes`
                : 'Prerequisitos completos'}
            </span>
          ) : (
            <span className="oa-card__chip oa-card__chip--gray">Sin prerequisitos</span>
          )
        )}
      </div>

      {blocked ? (
        <div className="oa-card__reason">
          <FiSlash size={14} />
          <span>{curso?.motivo_bloqueo || 'No disponible para agregar al carrito.'}</span>
        </div>
      ) : (
        <div className="oa-card__reason oa-card__reason--ok">
          <FiCheckCircle size={14} />
          <span>Disponible para agregar al carrito.</span>
        </div>
      )}

      <div className="oa-card__footer">
        <button type="button" className="oa-btn oa-btn--ghost" onClick={() => onOpen(curso)}>
          <FiInfo size={14} />
          <span>Ver detalle</span>
        </button>

        <button
          type="button"
          className={`oa-btn ${blocked ? 'oa-btn--disabled' : 'oa-btn--primary'}`}
          onClick={() => !blocked && onAdd(curso)}
          disabled={blocked || isAdding}
        >
          <FiShoppingCart size={14} />
          <span>{isAdding ? 'Agregando...' : 'Agregar al carrito'}</span>
        </button>
      </div>
    </div>
  );
};

const OfertaAcademica = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const resumen = useSelector(selectOfertaResumen);
  const cursosBase = useSelector(selectOfertaCursos);
  const cursos = useSelector(selectOfertaCursosFiltrados);
  const loading = useSelector(selectOfertaLoading);
  const isAdding = useSelector(selectOfertaAdding);
  const error = useSelector(selectOfertaError);
  const successMessage = useSelector(selectOfertaSuccess);

  const search = useSelector(selectOfertaSearch);
  const filtroEstado = useSelector(selectOfertaFiltroEstado);
  const filtroDisponibilidad = useSelector(selectOfertaFiltroDisponibilidad);
  const filtroCategoria = useSelector(selectOfertaFiltroCategoria);
  const filtroPeriodo = useSelector(selectOfertaFiltroPeriodo);
  const filtroPrerequisitos = useSelector(selectOfertaFiltroPrerequisitos);

  const modalOpen = useSelector(selectOfertaModalOpen);
  const cursoSeleccionado = useSelector(selectOfertaCursoSeleccionado);

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchOfertaAcademicaByUsuarioId(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: 'Error',
        text: error,
        icon: 'error',
        ...swalTheme,
        showCancelButton: false,
      });
      dispatch(clearOfertaError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      Swal.fire({
        title: 'Listo',
        text: successMessage,
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
        ...swalTheme,
      });
      dispatch(clearOfertaSuccess());

      if (userId) {
        dispatch(fetchOfertaAcademicaByUsuarioId(userId));
        dispatch(fetchCarritoByUsuarioId(userId));
      }
    }
  }, [successMessage, dispatch, userId]);

  const categorias = useMemo(() => {
    const set = new Set((cursosBase || []).map((c) => c?.materia?.categoria).filter(Boolean));
    return [...set].sort();
  }, [cursosBase]);

  const periodos = useMemo(() => {
    const set = new Set((cursosBase || []).map((c) => c?.periodo).filter(Boolean));
    return [...set].sort();
  }, [cursosBase]);

  const handleAdd = async (curso) => {
    const confirm = await Swal.fire({
      title: '¿Agregar al carrito?',
      html: `<div style="margin-top:6px; color:#5A6676; font-size:14px; line-height:1.5">
        Se agregará la materia <strong style="color:#1A1F36">"${curso?.materia?.nombre || 'Curso'}"</strong> a tu carrito.
      </div>`,
      icon: 'question',
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      ...swalTheme,
    });

    if (!confirm.isConfirmed) return;

    dispatch(
      addCursoOfertaToCarrito({
        id_usuario: userId,
        id_curso: curso?.id_curso,
      })
    );
  };

  return (
    <>
      <style>{styles}</style>

      <div className="oa-root">
        <div className="oa-header">
          <div className="oa-header__left">
            <div className="oa-header__pill" />
            <div>
              <h1 className="oa-header__title">Oferta Académica</h1>
              <p className="oa-header__sub">
                Explora materias disponibles y revisa restricciones antes de agregar al carrito.
              </p>
            </div>
          </div>

          <div className="oa-header__stats">
            <span>{resumen?.total_cursos_activos ?? 0} cursos</span>
            <span>{resumen?.disponibles ?? 0} disponibles</span>
            <span>{resumen?.bloqueados ?? 0} bloqueados</span>
          </div>
        </div>

        <div className="oa-toolbar">
          <div className="oa-search">
            <FiSearch className="oa-search__icon" />
            <input
              type="text"
              placeholder="Buscar por nombre, sigla, docente, motivo o prerequisito..."
              value={search}
              onChange={(e) => dispatch(setOfertaSearch(e.target.value))}
            />
          </div>

          <button
            type="button"
            className={`oa-filter-toggle${showFilters ? ' active' : ''}`}
            onClick={() => setShowFilters((v) => !v)}
          >
            <FiFilter size={15} />
            <span>Filtros</span>
          </button>
        </div>

        {showFilters && (
          <div className="oa-filters">
            <select
              value={filtroEstado}
              onChange={(e) => dispatch(setOfertaFiltroEstado(e.target.value))}
            >
              <option value="todos">Todos los estados</option>
              <option value="disponibles">Disponibles</option>
              <option value="bloqueados">Bloqueados</option>
              <option value="aprobadas">Ya aprobadas</option>
              <option value="cursando">Cursando actualmente</option>
              <option value="carrito">En carrito</option>
              <option value="reprobadas">Reprobadas previamente</option>
              <option value="choque">Con choque horario</option>
            </select>

            <select
              value={filtroDisponibilidad}
              onChange={(e) => dispatch(setOfertaFiltroDisponibilidad(e.target.value))}
            >
              <option value="todos">Todos los cupos</option>
              <option value="con-cupos">Con cupos</option>
              <option value="sin-cupos">Sin cupos</option>
            </select>

            <select
              value={filtroCategoria}
              onChange={(e) => dispatch(setOfertaFiltroCategoria(e.target.value))}
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filtroPeriodo}
              onChange={(e) => dispatch(setOfertaFiltroPeriodo(e.target.value))}
            >
              <option value="todos">Todos los periodos</option>
              {periodos.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={filtroPrerequisitos}
              onChange={(e) => dispatch(setOfertaFiltroPrerequisitos(e.target.value))}
            >
              <option value="todos">Todos los prerequisitos</option>
              <option value="con-prerequisitos">Con prerequisitos</option>
              <option value="sin-prerequisitos">Sin prerequisitos</option>
              <option value="prerequisitos-pendientes">Con prerequisitos pendientes</option>
              <option value="prerequisitos-completos">Prerequisitos completos</option>
            </select>

            <button
              type="button"
              className="oa-clear-btn"
              onClick={() => dispatch(clearOfertaFiltros())}
            >
              Limpiar
            </button>
          </div>
        )}

        {loading ? (
          <div className="oa-empty">
            <FiBook size={42} />
            <p>Cargando oferta académica...</p>
          </div>
        ) : cursos.length === 0 ? (
          <div className="oa-empty">
            <FiInfo size={42} />
            <p>No se encontraron cursos con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="oa-grid">
            {cursos.map((curso) => (
              <OfertaCard
                key={curso.id_curso}
                curso={curso}
                onOpen={(c) => dispatch(openOfertaDetalle(c))}
                onAdd={handleAdd}
                isAdding={isAdding}
              />
            ))}
          </div>
        )}

        <OfertaDetailModal
          open={modalOpen}
          onClose={() => dispatch(closeOfertaDetalle())}
          curso={cursoSeleccionado}
          onAdd={handleAdd}
          isAdding={isAdding}
        />
      </div>
    </>
  );
};

const styles = `
  .oa-root{
    min-height:100%;
    padding:32px;
    background:#f6f7fb;
    box-sizing:border-box;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  }

  .oa-header{
    display:flex;
    justify-content:space-between;
    gap:18px;
    align-items:flex-start;
    flex-wrap:wrap;
    margin-bottom:22px;
  }

  .oa-header__left{
    display:flex;
    gap:14px;
    align-items:flex-start;
  }

  .oa-header__pill{
    width:8px;
    height:48px;
    border-radius:8px;
    background:linear-gradient(180deg,#704fe6 0%, #4b5fd6 100%);
    margin-top:2px;
  }

  .oa-header__title{
    margin:0;
    font-size:32px;
    line-height:1.08;
    font-weight:500;
    color:#1a1f36;
    letter-spacing:-0.3px;
  }

  .oa-header__sub{
    margin:8px 0 0;
    color:#68708b;
    font-size:14px;
    line-height:1.6;
  }

  .oa-header__stats{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
  }

  .oa-header__stats span{
    display:inline-flex;
    align-items:center;
    padding:10px 14px;
    border-radius:999px;
    background:#fff;
    border:1px solid #e6e9f2;
    color:#4d5673;
    font-size:13px;
    font-weight:700;
  }

  .oa-toolbar{
    display:flex;
    justify-content:space-between;
    gap:14px;
    flex-wrap:wrap;
    margin-bottom:18px;
  }

  .oa-search{
    flex:1;
    min-width:260px;
    position:relative;
  }

  .oa-search input{
    width:100%;
    box-sizing:border-box;
    border:1.5px solid #dde0ef;
    border-radius:14px;
    padding:12px 14px 12px 40px;
    font-size:14px;
    background:#fff;
    color:#1a1f36;
    outline:none;
  }

  .oa-search input:focus{
    border-color:#6d5dfd;
    box-shadow:0 0 0 3px rgba(109,93,253,.12);
  }

  .oa-search__icon{
    position:absolute;
    left:14px;
    top:50%;
    transform:translateY(-50%);
    color:#98a2b3;
  }

  .oa-filter-toggle{
    border:none;
    background:#fff;
    border:1px solid #e6e9f2;
    color:#4d5673;
    border-radius:14px;
    padding:12px 16px;
    font-size:13px;
    font-weight:800;
    display:inline-flex;
    gap:8px;
    align-items:center;
    cursor:pointer;
  }

  .oa-filter-toggle.active{
    background:#eef2ff;
    color:#4b5fd6;
    border-color:#d8def8;
  }

  .oa-filters{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
    gap:12px;
    margin-bottom:20px;
    background:#fff;
    border:1px solid #eceef5;
    border-radius:18px;
    padding:16px;
  }

  .oa-filters select,
  .oa-clear-btn{
    width:100%;
    min-height:44px;
    border-radius:12px;
    border:1px solid #dde0ef;
    background:#fff;
    padding:10px 12px;
    font-size:14px;
    color:#1a1f36;
    outline:none;
  }

  .oa-clear-btn{
    cursor:pointer;
    font-weight:800;
    background:#f8f9fd;
  }

  .oa-grid{
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
    gap:20px;
  }

  .oa-card{
    background:#fff;
    border:1px solid #eceef5;
    border-radius:22px;
    box-shadow:0 10px 30px rgba(40,52,109,.05);
    padding:18px;
    transition:all .18s ease;
  }

  .oa-card:hover{
    transform:translateY(-3px);
    box-shadow:0 14px 34px rgba(40,52,109,.08);
  }

  .oa-card.blocked{
    opacity:.98;
  }

  .oa-card__top{
    display:flex;
    justify-content:space-between;
    gap:10px;
    margin-bottom:12px;
    align-items:center;
  }

  .oa-card__code{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    min-width:68px;
    height:34px;
    padding:0 12px;
    border-radius:999px;
    background:linear-gradient(180deg,#f2f4fb 0%, #e8ecfb 100%);
    color:#5a55d6;
    font-weight:800;
    font-size:12px;
    letter-spacing:.3px;
    border:1px solid #e3e7f6;
  }

  .oa-badge{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    min-height:30px;
    padding:6px 10px;
    border-radius:999px;
    font-size:12px;
    font-weight:800;
    white-space:nowrap;
  }

  .oa-badge--green{ background:#e8fff2; color:#177245; }
  .oa-badge--gray{ background:#f1f3f6; color:#596273; }
  .oa-badge--blue{ background:#eef2ff; color:#4b5fd6; }
  .oa-badge--purple{ background:#f3eefe; color:#6b4fd8; }
  .oa-badge--orange{ background:#fff4e8; color:#b86911; }
  .oa-badge--red{ background:#ffefef; color:#d14343; }
  .oa-badge--yellow{ background:#fff9e8; color:#9a6b00; }

  .oa-card__title{
    margin:0 0 10px;
    color:#1a1f36;
    font-size:20px;
    line-height:1.3;
    font-weight:800;
  }

  .oa-card__teacher{
    display:flex;
    align-items:center;
    gap:7px;
    color:#5f6781;
    font-size:13px;
    font-weight:600;
    margin:0 0 12px;
  }

  .oa-card__meta{
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    margin-bottom:12px;
  }

  .oa-card__meta span{
    display:inline-flex;
    align-items:center;
    gap:6px;
    padding:8px 10px;
    border-radius:12px;
    background:#f8f9fd;
    border:1px solid #edf0f7;
    color:#5f6781;
    font-size:12px;
    font-weight:600;
  }

  .oa-card__chips{
    display:flex;
    gap:8px;
    flex-wrap:wrap;
    margin-bottom:12px;
    min-height:34px;
  }

  .oa-card__chip{
    display:inline-flex;
    padding:7px 11px;
    border-radius:999px;
    font-size:12px;
    font-weight:800;
  }

  .oa-card__chip--cat{ background:#f8f4ff; color:#6b4fd8; }
  .oa-card__chip--red{ background:#ffefef; color:#d14343; }
  .oa-card__chip--green{ background:#e8fff2; color:#177245; }
  .oa-card__chip--gray{ background:#f1f3f6; color:#596273; }

  .oa-card__reason{
    display:flex;
    gap:8px;
    align-items:flex-start;
    color:#b45309;
    background:#fff9ed;
    border:1px solid #fde8c6;
    border-radius:14px;
    padding:12px 13px;
    font-size:12px;
    line-height:1.5;
    font-weight:700;
    margin-bottom:14px;
  }

  .oa-card__reason--ok{
    color:#177245;
    background:#eefcf4;
    border-color:#caefd9;
  }

  .oa-card__footer{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
  }

  .oa-btn{
    border:none;
    cursor:pointer;
    border-radius:14px;
    padding:11px 14px;
    font-size:13px;
    font-weight:800;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    transition:all .18s ease;
  }

  .oa-btn--primary{
    background:#704fe6;
    color:#fff;
    box-shadow:0 8px 20px rgba(112,79,230,.22);
  }

  .oa-btn--primary:hover{
    background:#6242da;
    transform:translateY(-1px);
  }

  .oa-btn--ghost{
    background:#fff;
    color:#55607d;
    border:1px solid #e4e8f1;
  }

  .oa-btn--ghost:hover{
    background:#f8f9fd;
  }

  .oa-btn--disabled{
    background:#f1f3f6;
    color:#98a2b3;
    cursor:not-allowed;
  }

  .oa-empty{
    background:#fff;
    border:1px solid #eceef5;
    border-radius:24px;
    box-shadow:0 10px 30px rgba(40,52,109,.05);
    padding:48px 24px;
    text-align:center;
    color:#6f7894;
  }

  .oa-empty p{
    margin:12px 0 0;
    font-size:15px;
    font-weight:600;
  }

  .oa-modal-backdrop{
    position:fixed;
    inset:0;
    background:rgba(15,23,42,.36);
    backdrop-filter:blur(7px);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    z-index:99999;
  }

  .oa-modal{
    width:min(100%, 860px);
    max-height:90vh;
    overflow-y:auto;
    background:#fff;
    border-radius:24px;
    padding:22px;
    box-shadow:0 24px 64px rgba(15,23,42,.22);
    position:relative;
  }

  .oa-modal__close{
    position:absolute;
    top:14px;
    right:14px;
    width:38px;
    height:38px;
    border:none;
    border-radius:50%;
    background:#f3f4f6;
    color:#374151;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
  }

  .oa-modal__header{
    display:flex;
    gap:14px;
    align-items:flex-start;
    margin-bottom:18px;
    padding-right:42px;
  }

  .oa-modal__code{
    min-width:78px;
    height:42px;
    border-radius:14px;
    display:flex;
    align-items:center;
    justify-content:center;
    background:linear-gradient(180deg,#f2f4fb 0%, #e8ecfb 100%);
    color:#5a55d6;
    font-weight:800;
    font-size:13px;
    border:1px solid #e3e7f6;
  }

  .oa-modal__header-text h2{
    margin:0;
    color:#1a1f36;
    font-size:26px;
    line-height:1.2;
    font-weight:800;
  }

  .oa-modal__header-meta{
    display:flex;
    gap:8px;
    flex-wrap:wrap;
    margin-top:8px;
    align-items:center;
    color:#68708b;
    font-size:13px;
    font-weight:700;
  }

  .oa-modal__grid{
    display:grid;
    grid-template-columns:repeat(2, minmax(0,1fr));
    gap:14px;
  }

  .oa-modal__card{
    background:#fafafb;
    border:1px solid #eceef5;
    border-radius:18px;
    padding:14px;
  }

  .oa-modal__card--full{
    grid-column:1 / -1;
  }

  .oa-modal__card--warning{
    background:#fff9ed;
    border-color:#fde8c6;
  }

  .oa-modal__card h4{
    margin:0 0 12px;
    color:#1a1f36;
    font-size:15px;
    font-weight:800;
    display:flex;
    align-items:center;
  }

  .oa-modal__card p{
    margin:0;
    color:#5f6781;
    font-size:14px;
    line-height:1.6;
  }

  .oa-modal__list{
    display:grid;
    grid-template-columns:repeat(2, minmax(0,1fr));
    gap:10px 12px;
  }

  .oa-modal__list div{
    display:flex;
    flex-direction:column;
    gap:4px;
  }

  .oa-modal__list span{
    color:#98a2b3;
    font-size:11px;
    font-weight:900;
    text-transform:uppercase;
    letter-spacing:.05em;
  }

  .oa-modal__list strong{
    color:#1a1f36;
    font-size:14px;
    font-weight:700;
    line-height:1.4;
  }

  .oa-modal__reasons{
    list-style:none;
    padding:0;
    margin:0;
    display:flex;
    flex-direction:column;
    gap:10px;
  }

  .oa-modal__reasons li{
    display:flex;
    gap:8px;
    align-items:flex-start;
    color:#a16207;
    font-size:13px;
    font-weight:700;
    line-height:1.5;
  }

  .oa-prereq-section{
    margin-bottom:14px;
  }

  .oa-prereq-section:last-child{
    margin-bottom:0;
  }

  .oa-prereq-section label{
    display:block;
    margin-bottom:8px;
    color:#6b7280;
    font-size:12px;
    font-weight:800;
    text-transform:uppercase;
    letter-spacing:.04em;
  }

  .oa-prereq-wrap{
    display:flex;
    gap:8px;
    flex-wrap:wrap;
  }

  .oa-prereq-pill{
    display:inline-flex;
    align-items:center;
    gap:6px;
    padding:8px 10px;
    border-radius:999px;
    font-size:12px;
    font-weight:800;
    border:1px solid transparent;
  }

  .oa-prereq-pill small{
    font-size:11px;
    font-weight:700;
    opacity:.92;
  }

  .oa-prereq-pill.ok{
    background:#eefcf4;
    color:#177245;
    border-color:#caefd9;
  }

  .oa-prereq-pill.bad{
    background:#ffefef;
    color:#d14343;
    border-color:#f7c4c4;
  }

  .oa-prereq-empty{
    color:#8a93ad;
    font-size:13px;
    font-weight:600;
  }

  .oa-modal__footer{
    margin-top:18px;
    display:flex;
    justify-content:flex-end;
    gap:10px;
    flex-wrap:wrap;
  }

  @media (max-width: 900px){
    .oa-modal__grid,
    .oa-modal__list{
      grid-template-columns:1fr;
    }
  }

  @media (max-width: 760px){
    .oa-root{
      padding:18px 12px;
    }

    .oa-header__title{
      font-size:28px;
    }

    .oa-modal{
      padding:18px;
      border-radius:20px;
    }

    .oa-modal__header{
      flex-direction:column;
      align-items:flex-start;
    }

    .oa-modal__header-text h2{
      font-size:22px;
    }
  }
`;

export default OfertaAcademica;