import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitleTwo from '../../components/SectionTitle/SectionTitleTwo';

import chooseBG from '../../assets/img/video/bg-5-1.jpg';
import shapeImg1 from '../../assets/img/video/shape-4-4.png';
import shapeImg2 from '../../assets/img/video/shape-4-5.png';
import shapeImg3 from '../../assets/img/video/shape-4-6.png';
import shapeImg4 from '../../assets/img/hero/shape-2-1.png';
import shapeImg5 from '../../assets/img/video/shape-4-3.png';
import thumbImg from '../../assets/img/video/thumb-5.jpg';

const WhyChooseUs = () => {
  return (
    <div
      className="ed-choose-area it-video-2-bg p-relative fix z-index pt-120 pb-120"
      style={{ backgroundImage: `url(${chooseBG})` }}
    >
      <div className="ed-choose-shape-2 d-none d-lg-block">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="ed-choose-shape-3 d-none d-lg-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="ed-choose-shape-4 d-none d-lg-block">
        <img src={shapeImg3} alt="" />
      </div>
      <div className="ed-choose-shape-5 d-none d-xl-block">
        <img src={shapeImg4} alt="" />
      </div>

      <div className="container container-3">
        <div className="row align-items-center">
          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInLeft"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <div className="it-video-2-left">
              <SectionTitleTwo
                itemClass="it-video-2-title-box mb-10"
                subtitleClass="it-section-subtitle-5 orange"
                icon="fa-light fa-book"
                subtitle="¿Por qué elegirnos?"
                titleClass="ed-section-title"
                title="Un enfoque moderno y motivador para aprender"
              />

              <div className="it-video-2-text mb-20">
                <p>
                  Combinamos metodología práctica, acompañamiento constante y
                  recursos actualizados para que el aprendizaje sea claro,
                  dinámico y realmente aplicable.
                </p>
              </div>

              <div className="ed-about-5-content mb-30">
                <div className="it-about-5-list">
                  <ul>
                    <li>
                      <i className="fa-regular fa-check"></i>
                      Metodología de enseñanza efectiva
                    </li>
                    <li>
                      <i className="fa-regular fa-check"></i>
                      Docentes altamente capacitados
                    </li>
                  </ul>
                </div>

                <div className="it-about-5-list">
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

              <div className="it-video-2-button">
                <Link className="ed-btn-radius sky-bg" to="/event-details">
                  Ver eventos
                </Link>
              </div>
            </div>
          </div>

          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInRight"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <div className="it-video-2-thumb p-relative">
              <img src={thumbImg} alt="Actividad educativa" />
              <div className="ed-choose-shape-1">
                <img src={shapeImg5} alt="" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;