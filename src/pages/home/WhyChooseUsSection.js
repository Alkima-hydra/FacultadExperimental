import React from 'react';
import SectionTitle from '../../components/SectionTitle';

import shapeImg1 from '../../assets/img/choose/shape-1-7.png';
import shapeImg2 from '../../assets/img/choose/shape-1-8.png';
import shapeImg3 from '../../assets/img/choose/shape-1-9.png';
import shapeImg4 from '../../assets/img/choose/shape-1-10.png';
import shapeImg5 from '../../assets/img/choose/shape-1-5.png';
import shapeImg6 from '../../assets/img/choose/shape-1-6.png';
import chooseImg from '../../assets/img/choose/choose-2-2.jpg';

const WhyChooseUs = () => {
  const items = [
    {
      icon: 'flaticon-skill',
      title: 'Cursos accesibles',
      description:
        'Ofrecemos programas de alta calidad a precios competitivos, brindando educación profesional al alcance de todos.',
    },
    {
      icon: 'flaticon-funds',
      title: 'Eficiencia y flexibilidad',
      description:
        'Nuestra metodología permite aprender a tu propio ritmo, con horarios adaptables y contenidos optimizados.',
    },
    {
      icon: 'flaticon-flexibility',
      title: 'Docentes especializados',
      description:
        'Contamos con profesionales altamente capacitados que combinan experiencia académica y práctica.',
    },
  ];

  return (
    <div className="it-choose-area it-choose-style-2 z-index fix p-relative grey-bg pt-180 pb-110">
      <div className="it-choose-shape-5 d-none d-xl-block">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="it-choose-shape-6 d-none d-xl-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="it-choose-shape-7 d-none d-xl-block">
        <img src={shapeImg3} alt="" />
      </div>
      <div className="it-choose-shape-8 d-none d-xl-block">
        <img src={shapeImg4} alt="" />
      </div>

      <div className="container">
        <div className="row align-items-center">

          <div className="col-xl-6 col-lg-6 mb-30">
            <div className="it-choose-thumb-box text-center text-lg-end">
              <div className="it-choose-thumb p-relative">
                <img src={chooseImg} alt="Estudiantes en clase" />
                <div className="it-choose-shape-1">
                  <img src={shapeImg5} alt="" />
                </div>
                <div className="it-choose-shape-2">
                  <img src={shapeImg6} alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6 col-lg-6 mb-30">
            <div className="it-choose-left">
              <SectionTitle
                itemClass="it-choose-title-box mb-30"
                subTitleClass="it-section-subtitle-2 white-bg"
                subTitle="¿Por qué elegirnos?"
                titleClass="ed-section-title"
                title="Construyendo una comunidad de aprendizaje continuo."
              />

              <div className="it-choose-content-box">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="it-choose-content d-flex align-items-center mb-30"
                  >
                    <div className="it-choose-icon">
                      <span>
                        <i className={item.icon}></i>
                      </span>
                    </div>

                    <div className="it-choose-text">
                      <h4 className="it-choose-title">{item.title}</h4>
                      <p className="mb-0">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;