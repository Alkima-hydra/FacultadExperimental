import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle';
import RightArrow from '../../components/SVG';

import shapeImg1 from '../../assets/img/about/ed-shape-2.png';
import shapeImg2 from '../../assets/img/about/ed-shape-1.png';
import aboutImg1 from '../../assets/img/about/ed-5-1.jpg';
import aboutImg2 from '../../assets/img/about/ed-5-2.jpg';

const About = () => {
  return (
    <div id="it-about" className="it-about-5-area p-relative fix pt-60 pb-120">
      <div className="ed-about-5-shape-2">
        <img src={shapeImg1} alt="" />
      </div>

      <div className="container">
        <div className="row align-items-center">

          <div className="col-xl-6 col-lg-6">
            <div className="it-about-5-right">
              <SectionTitle
                itemClass="it-about-5-title-box pb-10 section-title-fixed-width-2"
                subTitleClass="ed-section-subtitle"
                subTitle="Sobre nosotros"
                titleClass="it-section-title-5"
                title="Más de 10 años formando estudiantes con excelencia académica"
              />

              <div className="it-about-5-text mb-30">
                <p>
                  Contamos con una sólida trayectoria educativa enfocada en el
                  desarrollo integral de nuestros estudiantes. Nuestra experiencia
                  nos permite ofrecer programas actualizados, metodologías
                  dinámicas y un acompañamiento constante para garantizar un
                  aprendizaje efectivo y de calidad.
                </p>
              </div>

              <div className="ed-about-5-content">
                <div className="it-about-5-list mb-10">
                  <ul>
                    <li>
                      <i className="fa-regular fa-check"></i>
                      Metodología de enseñanza innovadora
                    </li>
                    <li>
                      <i className="fa-regular fa-check"></i>
                      Docentes altamente capacitados
                    </li>
                  </ul>
                </div>

                <div className="it-about-5-list mb-40">
                  <ul>
                    <li>
                      <i className="fa-regular fa-check"></i>
                      Tutores especializados
                    </li>
                    <li>
                      <i className="fa-regular fa-check"></i>
                      Programas accesibles y flexibles
                    </li>
                  </ul>
                </div>
              </div>

              <div className="it-feature-button">
                <Link
                  className="ed-btn-square orange"
                  to="/student-registration"
                >
                  Inscripciones abiertas
                  <i>
                    <RightArrow />
                  </i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-xl-6 col-lg-6">
            <div className="ed-about-5-right d-flex justify-content-between p-relative">
              <div className="ed-about-5-thumb-2">
                <img src={aboutImg1} alt="Estudiantes en clase" />
              </div>
              <div className="ed-about-5-thumb-1">
                <img src={aboutImg2} alt="Ambiente académico" />
              </div>
              <div className="ed-about-5-shape-1">
                <img src={shapeImg2} alt="" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;