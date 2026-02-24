import React from 'react';
import { Link } from 'react-router-dom';
import RightArrow from '../../components/SVG';

import aboutImg1 from '../../assets/img/about/ed-about-2-1.png';
import aboutImg2 from '../../assets/img/about/ed-about-2-3.png';
import aboutImg3 from '../../assets/img/about/ed-about-2-2.png';
import shapeImg1 from '../../assets/img/about/ed-shape-2-1.png';
import shapeImg2 from '../../assets/img/about/ed-shape-2-2.png';
import titleImg from '../../assets/img/about/title-home2.png';

const About = () => {
  return (
    <div id="it-about" className="it-about-3-area fix pt-120 pb-120 p-relative">
      <div className="container">
        <div className="row align-items-center">

          {/* Imágenes */}
          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInLeft"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <div className="ed-about-2-left p-relative text-end">
              <div className="ed-about-2-left-box d-inline-flex align-items-end">
                <div className="ed-about-2-thumb-one pb-110 mr-20">
                  <img src={aboutImg1} alt="Estudiantes aprendiendo en línea" />
                </div>
                <div className="ed-about-2-thumb-two text-start">
                  <img
                    className="mb-20 inner-top-img"
                    src={aboutImg2}
                    alt="Clase virtual interactiva"
                  />
                  <img
                    src={aboutImg3}
                    alt="Capacitación profesional digital"
                  />
                </div>
              </div>
              <div className="ed-about-2-thumb-shape-1 d-none lg-block">
                <img src={shapeImg1} alt="" />
              </div>
              <div className="ed-about-2-thumb-shape-2 d-none d-xxl-block">
                <img src={shapeImg2} alt="" />
              </div>
            </div>
          </div>

          {/* Texto */}
          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInRight"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <div className="it-about-3-title-box">
              <span className="it-section-subtitle-3">
                <img src={titleImg} alt="" /> Sobre Nosotros
              </span>

              <h2 className="it-section-title-3 pb-30">
                Impulsa tu crecimiento con nuestra experiencia en educación en línea y alcanza un nivel{' '}
                <span>profesional</span>
              </h2>

              <p>
                Somos una plataforma educativa enfocada en brindar formación práctica,
                actualizada y orientada al mundo real. Nuestro objetivo es que cada
                estudiante desarrolle habilidades aplicables y construya proyectos
                que potencien su perfil profesional.
              </p>
            </div>

            <div className="it-about-3-mv-box">
              <div className="row">

                <div className="col-xl-6 col-md-6">
                  <div className="it-about-3-mv-item">
                    <span className="it-about-3-mv-title">NUESTRA MISIÓN:</span>
                    <p>
                      Proporcionar educación accesible, práctica y de calidad,
                      enfocada en el desarrollo de competencias técnicas y
                      profesionales que preparen a nuestros estudiantes para
                      los desafíos del entorno digital actual.
                    </p>
                  </div>
                </div>

                <div className="col-xl-6 col-md-6">
                  <div className="it-about-3-mv-item">
                    <span className="it-about-3-mv-title">NUESTRA VISIÓN:</span>
                    <p>
                      Ser una referencia en formación digital y profesional,
                      destacándonos por la innovación educativa, la excelencia
                      académica y el impacto positivo en la carrera de nuestros
                      estudiantes.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="it-about-3-btn-box p-relative">
              <Link className="ed-btn-theme theme-2" to="/about-us">
                Inscripciones abiertas
                <i>
                  <RightArrow />
                </i>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;