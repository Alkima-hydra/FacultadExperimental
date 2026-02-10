import React from 'react';
import { Link } from 'react-router-dom';
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

const Course = () => {
  return (
    <div
      id="it-course"
      className="it-course-area ed-course-bg ed-course-style-3 p-relative pt-120 pb-90"
      style={{ backgroundImage: `url(${courseBG})` }}
    >
      <div className="container">
        <div className="ed-course-title-wrap mb-65">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-7">
              <SectionTitleSpecial
                itemClass="it-course-title-boxmb-70 section-title-fixed-width"
                subTitle="Cursos más populares"
                preTitle="Cursos a los cuales los"
                highlightText="alumnos"
                postTitle={`pueden unirse.`}
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-5">
              <div className="ed-course-button text-md-end">
                <Link className="ed-btn-theme" to="/course-1">
                  Cargar más cursos
                  <i>
                    <RightArrow />
                  </i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
            <SingleCourse
              courseImage={courseImg1}
              thumbText="Marketing Digital"
              title="Estadísticas TI, Ciencia de Datos y Análisis Empresarial"
              authorAvatar={avatarImg1}
              authorName="Samantha"
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
            <SingleCourse
              courseImage={courseImg2}
              thumbText="Diseño Gráfico"
              title="Adobe Illustrator Para Diseño Gráfico"
              authorAvatar={avatarImg2}
              authorName="Andres"
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
            <SingleCourse
              courseImage={courseImg3}
              thumbText="Marketing Digital"
              title="CEO de tu Negocio desde Casa"
              authorAvatar={avatarImg3}
              authorName="Pedro"
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
            <SingleCourse
              courseImage={courseImg4}
              thumbText="Diseño Gráfico"
              title="Adobe Illustrator Para Diseño Gráfico"
              authorAvatar={avatarImg4}
              authorName="Renato"
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
            <SingleCourse
              courseImage={courseImg5}
              thumbText="Marketing Digital"
              title="Estadísticas TI, Ciencia de Datos y Análisis Empresarial"
              authorAvatar={avatarImg5}
              authorName="Adrian"
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
            <SingleCourse
              courseImage={courseImg6}
              thumbText="Marketing Digital"
              title="CEO de tu Negocio desde Casa"
              authorAvatar={avatarImg6}
              authorName="Melanie"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Course;
