import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle';

import shapeImg1 from '../../assets/img/about/about-3-shap-1.png';
import shapeImg2 from '../../assets/img/about/ed-shape-3-1.png';
import aboutImg1 from '../../assets/img/about/thumb-4-1.jpg';
import aboutImg2 from '../../assets/img/about/thumb-4-2.jpg';
import titleImg from '../../assets/img/category/title.svg';

const About = () => {
  const items = [
    {
      icon: 'flaticon-video-1',
      title: 'Compartir pantalla',
      description:
        'Comparte tu pantalla en tiempo real para explicar conceptos, resolver ejercicios y aprender de forma más clara y visual, como si estuvieras en una clase presencial.',
    },
    {
      icon: 'flaticon-puzzle',
      title: 'Control del presentador',
      description:
        'Administra la sesión con herramientas de presentación: organiza el contenido, guía el ritmo de la clase y mantén la participación para mejorar la experiencia de aprendizaje.',
    },
  ];

  return (
    <div
      id="it-about"
      className="it-about-3-area it-about-4-style p-relative grey-bg pt-120 pb-120"
    >
      <div className="ed-about-3-shape-2">
        <img src={shapeImg1} alt="" />
      </div>

      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-6 col-lg-6">
            <div className="ed-about-3-thumb-wrap p-relative">
              <div className="ed-about-3-shape-1 d-none d-md-block">
                <img src={shapeImg2} alt="" />
              </div>
              <div className="ed-about-3-thumb">
                <img src={aboutImg1} alt="Aprendizaje en línea" />
              </div>
              <div className="ed-about-3-thumb-sm">
                <img src={aboutImg2} alt="Clases prácticas con acompañamiento" />
              </div>
            </div>
          </div>

          <div className="col-xl-6 col-lg-6">
            <SectionTitle
              itemClass="it-about-3-title-box"
              subTitleClass="it-section-subtitle-5 purple-2"
              subTitle="Sobre nosotros"
              titleClass="it-section-title-3 pb-30"
              title="Nos aseguramos de ofrecer los mejores cursos para tu aprendizaje"
              titleImage={titleImg}
              description="Nuestra formación está enfocada en resultados reales: contenido actualizado, clases prácticas y una experiencia de aprendizaje clara y estructurada. Aprende a tu ritmo, con recursos que te ayudan a avanzar con confianza y aplicar lo aprendido en proyectos reales."
            />

            <div className="it-about-3-mv-box">
              <div className="row">
                {items.map((item, index) => (
                  <div key={index} className="col-xl-12">
                    <div className="it-about-4-list-wrap d-flex align-items-start">
                      <div className="it-about-4-list-icon">
                        <span>
                          <i className={item.icon}></i>
                        </span>
                      </div>

                      <div className="it-about-3-mv-item">
                        <span className="it-about-3-mv-title">{item.title}</span>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="it-about-3-btn-box p-relative">
              <Link className="ed-btn-square" to="/student-registration">
                <span>Inscribirse ahora</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;