import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Breadcrumb from '../../components/Breadcrumb';

import courseImg from '../../assets/img/event/details-1.jpg';
import courseImg2 from '../../assets/img/event/details-sm.jpg';

import { useDispatch, useSelector } from 'react-redux';
import { fetchCursoById } from './slicesCursos/CursosThunk';
import {
  selectCursoSeleccionado,
  selectError,
  clearError,
  selectIsLoadingCursoById,
} from './slicesCursos/CursosSlice';

const CourseDetailsMain = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const curso = useSelector(selectCursoSeleccionado);
  const isLoading = useSelector(selectIsLoadingCursoById);
  const error = useSelector(selectError);

  const idCurso = useMemo(() => {
    const n = Number(id);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [id]);

  useEffect(() => {
    dispatch(clearError());
    if (idCurso) dispatch(fetchCursoById(idCurso));
  }, [dispatch, idCurso]);

  const materiaNombre = curso?.materia?.nombre || (curso?.materia_id_materia ? `Materia #${curso.materia_id_materia}` : 'Curso');
  const docenteNombre =
    curso?.docente?.nombre ||
    curso?.docente?.nombres ||
    curso?.docente?.nombre_completo ||
    (curso?.docente_id_docente ? `Docente #${curso.docente_id_docente}` : 'Docente');

  const lecciones = curso?.lecciones ?? '—';
  const cupos = curso?.cupos ?? '—';
  const horas = curso?.horas_academicas != null ? `${curso.horas_academicas}h` : '—';
  const horario = curso?.hora_inicio && curso?.hora_fin ? `${curso.hora_inicio} - ${curso.hora_fin}` : '—';
  const dias = curso?.dias_de_clases || '—';

  const precioNum = curso?.precio != null ? Number(curso.precio) : null;
  const precioTxt = precioNum != null && Number.isFinite(precioNum) ? `Bs ${precioNum.toFixed(2)}` : '—';

  return (
    <main>
      <Breadcrumb title="Detalles del Curso" subTitle="Curso" />

      <div className="it-course-details-area pt-120 pb-100">
        <div className="container">
          {error ? (
            <div className="alert alert-danger" role="alert" style={{ marginBottom: 20 }}>
              {String(error)}
            </div>
          ) : null}

          {!idCurso ? (
            <div className="alert alert-warning" role="alert">
              ID de curso inválido.
            </div>
          ) : isLoading ? (
            <div style={{ padding: '20px 0', color: '#6b7280' }}>Cargando detalles del curso…</div>
          ) : !curso ? (
            <div style={{ padding: '20px 0', color: '#6b7280' }}>No se encontró el curso.</div>
          ) : (
            <div className="row">
              <div className="col-xl-9 col-lg-8">
                <Tabs className="it-course-details-wrap">
                  <div className="it-evn-details-thumb mb-35">
                    <img src={courseImg} alt="Portada del curso" />
                  </div>

                  <div className="it-evn-details-rate mb-15">
                    <span>
                      <i className="fa-sharp fa-solid fa-star"></i>
                      <i className="fa-sharp fa-solid fa-star"></i>
                      <i className="fa-sharp fa-solid fa-star"></i>
                      <i className="fa-sharp fa-solid fa-star"></i>
                      <i className="fa-regular fa-star"></i>
                      (—)
                    </span>
                  </div>

                  <h4 className="it-evn-details-title mb-0 pb-5">{materiaNombre}</h4>

                  <div className="postbox__meta">
                    <span>
                      <i className="fa-light fa-file-invoice"></i> Lecciones {lecciones}
                    </span>
                    <span>
                      <i className="fa-light fa-clock"></i> {horario}
                    </span>
                    <span>
                      <i className="fa-light fa-user"></i> Cupos {cupos}
                    </span>
                  </div>

                  <div className="it-course-details-nav pb-60">
                    <nav>
                      <TabList className="nav nav-tab" id="nav-tab" role="tablist">
                        <Tab>
                          <button>Resumen</button>
                        </Tab>
                        <Tab>
                          <button>Contenido</button>
                        </Tab>
                        <Tab>
                          <button>Instructor</button>
                        </Tab>
                      
                      </TabList>
                    </nav>
                  </div>

                  <div className="it-course-details-content">
                    <div className="tab-content" id="nav-tabContent">
                      {/* RESUMEN */}
                      <TabPanel>
                        <div className="it-course-details-wrapper">
                          <div className="it-evn-details-text mb-40">
                            <h6 className="it-evn-details-title-sm pb-5">Descripción del Curso</h6>
                            <p>{curso?.descripcion || '—'}</p>
                          </div>

                          <div className="it-evn-details-text mb-40">
                            <h6 className="it-evn-details-title-sm pb-5">¿Qué aprenderás?</h6>
                            <p>{curso?.aprenderas || '—'}</p>
                          </div>

                          <div className="it-evn-details-text">
                            <h6 className="it-evn-details-title-sm pb-5">¿A quién está dirigido?</h6>
                            <p>{curso?.dirigido || '—'}</p>
                          </div>
                        </div>
                      </TabPanel>

                      {/* CONTENIDO */}
                      <TabPanel>
                        <div className="it-course-details-wrapper">
                          <div className="it-evn-details-text mb-40">
                            <h6 className="it-evn-details-title-sm pb-5">Contenido del Curso</h6>
                            <p>{curso?.contenido || '—'}</p>
                          </div>

                          <div className="it-evn-details-text">
                            <h6 className="it-evn-details-title-sm pb-5">Datos rápidos</h6>
                            <p>
                              <strong>Periodo:</strong> {curso?.periodo || '—'}
                              <br />
                              <strong>Días de clase:</strong> {dias}
                              <br />
                              <strong>Horas académicas:</strong> {horas}
                            </p>
                          </div>
                        </div>
                      </TabPanel>

                      {/* INSTRUCTOR */}
                      <TabPanel>
                        <div className="it-course-details-wrapper">
                          <div className="it-evn-details-text mb-40">
                            <h6 className="it-evn-details-title-sm pb-5">Instructor</h6>
                            <p>{docenteNombre}</p>
                          </div>

                          <div className="it-evn-details-text">
                            <h6 className="it-evn-details-title-sm pb-5">Metodología</h6>
                            <p>
                              Explicación clara, ejemplo práctico y aplicación inmediata.
                            </p>
                          </div>
                        </div>
                      </TabPanel>

                      {/* RESEÑAS */}
                      <TabPanel>
                        <div className="it-course-details-wrapper">
                          <div className="it-evn-details-text mb-40">
                            <h6 className="it-evn-details-title-sm pb-5">Reseñas</h6>
                            <p>—</p>
                          </div>
                        </div>
                      </TabPanel>
                    </div>
                  </div>
                </Tabs>
              </div>

              {/* SIDEBAR */}
              <div className="col-xl-3 col-lg-4">
                <div className="it-evn-sidebar-box it-course-sidebar-box">
                  <div className="it-evn-sidebar-thumb mb-30">
                    <img src={courseImg2} alt="Vista previa del curso" />
                  </div>

                  <div className="it-course-sidebar-rate-box pb-20">
                    <div className="it-course-sidebar-rate d-flex justify-content-between align-items-center">
                      <span>Precio del Curso</span>
                      <span className="rate">{precioTxt}</span>
                    </div>
                    <i>Garantía de devolución de 29 días</i>
                  </div>

                  <Link className="ed-btn-square radius purple-4 w-100 text-center mb-20" to="/cart">
                    <span>Comprar Ahora</span>
                  </Link>

                  <div className="it-evn-sidebar-list">
                    <ul>
                      <li>
                        <span>{horario}</span>
                        <span>Horario</span>
                      </li>
                      <li>
                        <span>Cupos</span>
                        <span>{cupos}</span>
                      </li>
                      <li>
                        <span>Lecciones</span>
                        <span>{lecciones}</span>
                      </li>
                      <li>
                        <span>Periodo</span>
                        <span>{curso?.periodo || '—'}</span>
                      </li>
                      <li>
                        <span>Días de Clase</span>
                        <span>{dias}</span>
                      </li>
                      <li>
                        <span>Horas Académicas</span>
                        <span>{horas}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CourseDetailsMain;