import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import SectionTitleSpecial from '../../components/SectionTitle/SectionTitleSpecial';
import SingleCourse from '../../components/Course';
import RightArrow from '../../components/SVG';

import courseBG from '../../assets/img/course/ed-bg-1.jpg';
import courseImg1 from '../../assets/img/course/course-2-1.jpg';
import courseImg2 from '../../assets/img/course/course-2-2.jpg';
import courseImg3 from '../../assets/img/course/course-2-3.jpg';
import courseImg4 from '../../assets/img/course/course-2-4.jpg';
import courseImg5 from '../../assets/img/course/course-2-5.jpg';
import courseImg6 from '../../assets/img/course/course-2-6.jpg';
import avatarImg1 from '../../assets/img/course/ed-avata-1-1.png';
import avatarImg2 from '../../assets/img/course/ed-avata-1-2.png';
import avatarImg3 from '../../assets/img/course/ed-avata-1-3.png';
import avatarImg4 from '../../assets/img/course/ed-avata-1-4.png';
import avatarImg5 from '../../assets/img/course/ed-avata-1-5.png';
import avatarImg6 from '../../assets/img/course/ed-avata-1-6.png';

const CourseOneMain = () => {
  return (
    <main>
      {/* Breadcrumb */}
      <Breadcrumb title="Cursos" subTitle="Curso" />

      <div
        id="it-course"
        className="it-course-area ed-course-bg ed-course-style-3 p-relative pt-120 pb-90"
        style={{ backgroundImage: `url(${courseBG})` }}
      >
        <div className="container">
          {/* Title + Button */}
          <div className="ed-course-title-wrap mb-65">
            <div className="row align-items-center">
              <div className="col-xl-8 col-lg-8 col-md-7">
                <SectionTitleSpecial
                  itemClass="it-course-title-boxmb-70 section-title-fixed-width"
                  subTitle="Cursos más populares"
                  preTitle="Nuestros cursos"
                  highlightText="estudiantes"
                  postTitle="pueden unirse con nosotros."
                />
              </div>

              <div className="col-xl-4 col-lg-4 col-md-5">
                <div className="ed-course-button text-md-end">
                  <Link className="ed-btn-theme" to="/course-1">
                    Ver más cursos
                    <i>
                      <RightArrow />
                    </i>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="row">
            <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
              <SingleCourse
                courseImage={courseImg1}
                thumbText="Marketing Digital"
                title="Estadística, Ciencia de Datos y Análisis de Negocios"
                authorAvatar={avatarImg1}
                authorName="Samantha"
              />
            </div>

            <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
              <SingleCourse
                courseImage={courseImg2}
                thumbText="Marketing Digital"
                title="Adobe Illustrator para Diseño Gráfico (de Cero a Pro)"
                authorAvatar={avatarImg2}
                authorName="Charles"
              />
            </div>

            <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
              <SingleCourse
                courseImage={courseImg3}
                thumbText="Marketing Digital"
                title="SEO desde Cero: Posiciona tu Negocio en Google"
                authorAvatar={avatarImg3}
                authorName="Morgan"
              />
            </div>

            <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
              <SingleCourse
                courseImage={courseImg4}
                thumbText="Marketing Digital"
                title="Adobe Illustrator para Diseño Gráfico (proyectos reales)"
                authorAvatar={avatarImg4}
                authorName="Brian Brewer"
              />
            </div>

            <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
              <SingleCourse
                courseImage={courseImg5}
                thumbText="Marketing Digital"
                title="Análisis de Datos para Negocios: Métricas y Reportes"
                authorAvatar={avatarImg5}
                authorName="Rodriquez"
              />
            </div>

            <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
              <SingleCourse
                courseImage={courseImg6}
                thumbText="Marketing Digital"
                title="SEO para Emprendedores: Estrategia y Contenido"
                authorAvatar={avatarImg6}
                authorName="Morgan"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseOneMain;