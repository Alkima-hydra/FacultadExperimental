import React from 'react';
import { Link } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Breadcrumb from '../../components/Breadcrumb';

import courseImg from '../../assets/img/event/details-1.jpg';
import courseImg2 from '../../assets/img/event/details-sm.jpg';

const CourseDetailsMain = () => {
  return (
    <main>
      <Breadcrumb title="Detalles del Curso" subTitle="Curso" />

      <div className="it-course-details-area pt-120 pb-100">
        <div className="container">
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
                    (4.7)
                  </span>
                </div>

                <h4 className="it-evn-details-title mb-0 pb-5">
                  Desarrollo Web Profesional: De Cero a Proyecto Real
                </h4>

                <div className="postbox__meta">
                  <span>
                    <i className="fa-light fa-file-invoice"></i> Lección 10
                  </span>
                  <span>
                    <i className="fa-light fa-clock"></i> 9:00 AM - 1:00 PM
                  </span>
                  <span>
                    <i className="fa-light fa-user"></i> Más de 20 estudiantes
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
                      <Tab>
                        <button>Reseñas</button>
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
                          <h6 className="it-evn-details-title-sm pb-5">
                            Descripción del Curso
                          </h6>
                          <p>
                            Este curso está diseñado para que aprendas desarrollo web
                            desde los fundamentos hasta la creación y publicación de
                            un proyecto completo. Trabajarás con HTML, CSS y JavaScript
                            moderno, aplicando buenas prácticas utilizadas en entornos
                            profesionales.
                          </p>
                          <p>
                            Al finalizar, serás capaz de construir interfaces responsivas,
                            consumir APIs, organizar tu código correctamente y desplegar
                            tus proyectos en un servidor real.
                          </p>
                        </div>

                        <div className="it-evn-details-text mb-40">
                          <h6 className="it-evn-details-title-sm pb-5">
                            ¿Qué Aprenderás?
                          </h6>
                          <p>
                            Aprenderás a estructurar páginas web semánticas,
                            diseñar layouts modernos con Flexbox y Grid,
                            programar interacciones con JavaScript,
                            manejar datos dinámicos y trabajar con APIs.
                            También dominarás el uso de Git y GitHub para
                            control de versiones y trabajo colaborativo.
                          </p>
                        </div>

                        <div className="it-evn-details-text">
                          <h6 className="it-evn-details-title-sm pb-5">
                            ¿A Quién Está Dirigido?
                          </h6>
                          <p>
                            Este curso está orientado a principiantes que desean
                            iniciar en el mundo del desarrollo web, estudiantes
                            que buscan fortalecer sus bases y personas que desean
                            construir un portafolio profesional.
                          </p>
                        </div>

                      </div>
                    </TabPanel>

                    {/* CONTENIDO */}
                    <TabPanel>
                      <div className="it-course-details-wrapper">

                        <div className="it-evn-details-text mb-40">
                          <h6 className="it-evn-details-title-sm pb-5">
                            Contenido del Curso
                          </h6>
                          <p>
                            El curso está dividido en módulos progresivos que
                            permiten avanzar paso a paso, combinando teoría
                            clara con práctica aplicada.
                          </p>
                        </div>

                        <div className="it-evn-details-text">
                          <h6 className="it-evn-details-title-sm pb-5">
                            Módulos Principales
                          </h6>
                          <p>
                            1) Fundamentos de HTML y accesibilidad<br />
                            2) Diseño con CSS moderno (Flexbox y Grid)<br />
                            3) JavaScript esencial y manipulación del DOM<br />
                            4) Consumo de APIs y manejo de datos<br />
                            5) Buenas prácticas y organización de código<br />
                            6) Git y GitHub para proyectos reales<br />
                            7) Publicación y despliegue de aplicaciones
                          </p>
                        </div>

                      </div>
                    </TabPanel>

                    {/* INSTRUCTOR */}
                    <TabPanel>
                      <div className="it-course-details-wrapper">

                        <div className="it-evn-details-text mb-40">
                          <h6 className="it-evn-details-title-sm pb-5">
                            Sobre el Instructor
                          </h6>
                          <p>
                            El instructor cuenta con experiencia en desarrollo
                            de aplicaciones reales, trabajando tanto en frontend
                            como en backend. El enfoque del curso es práctico,
                            directo y orientado a resultados.
                          </p>
                          <p>
                            Cada lección está diseñada para que comprendas
                            no solo cómo hacer algo, sino por qué se hace
                            de esa manera en proyectos profesionales.
                          </p>
                        </div>

                        <div className="it-evn-details-text">
                          <h6 className="it-evn-details-title-sm pb-5">
                            Metodología
                          </h6>
                          <p>
                            Explicación clara, ejemplo práctico y aplicación inmediata.
                            El objetivo es que construyas proyectos reales mientras
                            aprendes los conceptos fundamentales.
                          </p>
                        </div>

                      </div>
                    </TabPanel>

                    {/* RESEÑAS */}
                    <TabPanel>
                      <div className="it-course-details-wrapper">

                        <div className="it-evn-details-text mb-40">
                          <h6 className="it-evn-details-title-sm pb-5">
                            Opiniones de Estudiantes
                          </h6>
                          <p>
                            Los estudiantes destacan la claridad de las explicaciones,
                            el enfoque práctico y la utilidad de los proyectos
                            desarrollados durante el curso.
                          </p>
                        </div>

                        <div className="it-evn-details-text">
                          <h6 className="it-evn-details-title-sm pb-5">
                            Lo Más Valorados
                          </h6>
                          <p>
                            Proyectos reales, ejemplos aplicados,
                            aprendizaje paso a paso y orientación profesional.
                          </p>
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
                    <span className="rate">
                      $60 <i>$120</i>
                    </span>
                  </div>
                  <i>Garantía de devolución de 29 días</i>
                </div>

                <Link
                  className="ed-btn-square radius purple-4 w-100 text-center mb-20"
                  to="/cart"
                >
                  <span>Comprar Ahora</span>
                </Link>

                <div className="it-evn-sidebar-list">
                  <ul>
                    <li>
                      <span>4:00 PM - 6:00 PM</span>
                      <span>Horario</span>
                    </li>
                    <li>
                      <span>Inscritos</span>
                      <span>100</span>
                    </li>
                    <li>
                      <span>Lecciones</span>
                      <span>80</span>
                    </li>
                    <li>
                      <span>Nivel</span>
                      <span>Principiante</span>
                    </li>
                    <li>
                      <span>Días de Clase</span>
                      <span>Lunes a Viernes</span>
                    </li>
                    <li>
                      <span>Idioma</span>
                      <span>Español</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetailsMain;