import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCursos } from './slicesCursos/CursosThunk';
import { selectCursos, selectIsLoadingCursos, selectError, clearError } from './slicesCursos/CursosSlice';
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
import { id } from 'date-fns/locale';

const COURSE_IMAGES = [courseImg1, courseImg2, courseImg3, courseImg4, courseImg5, courseImg6];
const AVATARS = [avatarImg1, avatarImg2, avatarImg3, avatarImg4, avatarImg5, avatarImg6];

function normalizeCourse(curso, idx) {
  const c = curso || {};
  const materia = c?.materia || {};
  const docente = c?.docente || {};
  const usuario = c?.docente?.usuario || {};

  const materiaNombre = materia?.nombre || (c?.materia_id_materia ? `Materia #${c.materia_id_materia}` : 'Curso');
  const docenteNombre = usuario?.nombres || (c?.docente_id_docente ? `Docente #${c.docente_id_docente}` : 'Docente');

  return {
    courseImage: COURSE_IMAGES[idx % COURSE_IMAGES.length],
    thumbText: materiaNombre,
    title: materiaNombre,
    authorAvatar: AVATARS[idx % AVATARS.length],
    authorName: docenteNombre,

    // Extra info for the card
    rating: c?.rating ?? null,
    price: c?.precio ?? null,
    lessonCount: c?.lecciones ?? null,
    duration: c?.horas_academicas != null ? `${c.horas_academicas}h` : null,
    studentCount: c?.cupos ?? null,
    periodo: c?.periodo ?? null,
    id: c?.id_curso ?? id(), // fallback a un id aleatorio si no hay id_curso, para evitar warnings de React
  };
}

const CourseOneMain = () => {
  const dispatch = useDispatch();
  const cursos = useSelector(selectCursos);
  const isLoading = useSelector(selectIsLoadingCursos);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(clearError());
    // Si tu thunk soporta paginación, manda { page, limit }. Si no, igual no rompe.
    dispatch(fetchCursos({ page: 1, limit: 60 }));
  }, [dispatch]);

  const cards = useMemo(() => {
    const list = Array.isArray(cursos) ? cursos : [];
    // en esta página mostramos 6 como en el diseño
    return list.slice(0, 6).map((c, idx) => normalizeCourse(c, idx));
  }, [cursos]);

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

          {/* Errors */}
          {error ? (
            <div className="alert alert-danger" role="alert" style={{ marginBottom: 20 }}>
              {String(error)}
            </div>
          ) : null}

          {/* Courses Grid */}
          <div className="row">
            {isLoading ? (
              <div style={{ padding: '16px 0', color: '#6b7280' }}>Cargando cursos…</div>
            ) : cards.length === 0 ? (
              <div style={{ padding: '16px 0', color: '#6b7280' }}>No hay cursos disponibles.</div>
            ) : (
              cards.map((c, idx) => (
                <div className="col-xl-4 col-lg-6 col-md-6 mb-30" key={idx}>
                  <SingleCourse

                    courseImage={c.courseImage}
                    id={c.id}
                    thumbText={c.thumbText}
                    title={c.title}
                    authorAvatar={c.authorAvatar}
                    authorName={c.authorName}
                    periodo={c.periodo}
                    rating={c.rating}
                    price={c.price}
                    lessonCount={c.lessonCount}
                    duration={c.duration}
                    studentCount={c.studentCount}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseOneMain;