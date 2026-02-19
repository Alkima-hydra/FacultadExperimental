import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitleTwo from '../../components/SectionTitle/SectionTitleTwo';

import shapeImg1 from '../../assets/img/about/shape-5-4.png';
import shapeImg2 from '../../assets/img/about/shape-4-4.png';
import shapeImg3 from '../../assets/img/about/shape-4-1.png';
import shapeImg4 from '../../assets/img/about/shape-4-2.png';
import shapeImg5 from '../../assets/img/about/shape-4-3.png';
import shapeImg6 from '../../assets/img/hero/shape-1-2.png';
import shapeImg7 from '../../assets/img/hero/shape-1-3.png';
import aboutImg1 from '../../assets/img/about/about-4-1.png';
import aboutImg2 from '../../assets/img/about/about-4-2.png';
import studentImg from '../../assets/img/hero/student.png';

const About = () => {
  return (
    <div
      id="it-about"
      className="it-about-5-area fix ed-about-4-wrap p-relative pb-120"
    >
      <div className="it-about-5-shape-4 d-none d-md-block">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="it-about-5-shape-5 d-none d-xl-block">
        <img src={shapeImg2} alt="" />
      </div>

      <div className="container container-3">
        <div className="row align-items-center">
          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInLeft"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <div className="ed-hero-thumb-wrap text-center text-md-end p-relative">
              <div className="ed-hero-thumb-main p-relative">
                <img src={aboutImg1} alt="Aprendizaje en un entorno educativo" />
                <div className="ed-hero-thumb-shape-1 d-none d-md-block">
                  <img src={shapeImg3} alt="" />
                </div>
              </div>

              <div className="ed-hero-thumb-sm">
                <img src={aboutImg2} alt="Acompañamiento y aprendizaje práctico" />
                <div className="ed-hero-thumb-shape-1">
                  <img src={shapeImg4} alt="" />
                </div>
              </div>

              <div className="ed-hero-thumb-shape-2">
                <img src={shapeImg5} alt="" />
              </div>
              <div className="ed-hero-thumb-shape-3">
                <img src={shapeImg6} alt="" />
              </div>
              <div className="ed-hero-thumb-shape-4">
                <img src={shapeImg7} alt="" />
              </div>

              <div className="ed-hero-thumb-student d-none d-md-flex align-items-center">
                <span>
                  <i>
                    Estudiantes <br />
                  </i>
                  satisfechos
                </span>
                <img src={studentImg} alt="Comunidad de estudiantes" />
              </div>
            </div>
          </div>

          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInRight"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <div className="it-about-5-right">
              <div className="it-about-5-title-box pb-10">
                <span className="it-section-subtitle-5 orange">
                  <i className="fa-light fa-book"></i> Sobre nosotros
                </span>

                <h4 className="ed-section-title orange">
                  Nos apasiona acompañarte en tu aprendizaje <br />
                  y ayudarte a crecer <span>de forma profesional.</span>
                </h4>
              </div>

              <div className="it-about-5-text mb-30">
                <p>
                  Creemos en la educación práctica y accesible. Por eso diseñamos
                  cursos claros, actualizados y orientados a resultados, para que
                  desarrolles habilidades reales y avances con confianza en tu camino
                  académico y profesional.
                </p>
              </div>

              <div className="it-about-5-content">
                <div className="row">
                  <div className="col-xl-6 col-lg-6">
                    <div className="it-about-5-list list-style-1 mb-20">
                      <ul>
                        <li>
                          <i className="fa-sharp fa-solid fa-circle-check"></i>
                          Instructores calificados
                        </li>
                        <li>
                          <i className="fa-sharp fa-solid fa-circle-check"></i>
                          Seguimiento y acompañamiento
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-6">
                    <div className="it-about-5-list list-style-2 mb-20">
                      <ul>
                        <li>
                          <i className="fa-sharp fa-solid fa-circle-check"></i>
                          Aprendizaje práctico por proyectos
                        </li>
                        <li>
                          <i className="fa-sharp fa-solid fa-circle-check"></i>
                          Plataforma cómoda y fácil de usar
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="it-feature-button">
                <Link className="ed-btn-radius" to="/student-registration">
                  Inscripciones abiertas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;