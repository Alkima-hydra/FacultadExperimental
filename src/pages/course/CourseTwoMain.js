import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../../components/Breadcrumb';
import SingleCourseTwo from '../../components/Course/SingleCourseTwo';

import courseImg1 from '../../assets/img/course/course-1-1.jpg';
import courseImg2 from '../../assets/img/course/course-1-2.jpg';
import courseImg3 from '../../assets/img/course/course-1-3.jpg';
import courseImg4 from '../../assets/img/course/course-1-6.jpg';
import courseImg5 from '../../assets/img/course/course-1-7.jpg';
import courseImg6 from '../../assets/img/course/course-1-8.jpg';
import avatarImg from '../../assets/img/course/avata-1.png';

import { fetchCursos } from './slicesCursos/CursosThunk';
import {
  selectCursos,
  selectIsLoadingCursos,
  selectError,
  clearError,
} from './slicesCursos/CursosSlice';

const COURSE_IMAGES = [courseImg1, courseImg2, courseImg3, courseImg4, courseImg5, courseImg6];

function normalizeToCourseCard(curso, idx) {
  const c = curso || {};
  const materia = c?.materia || {};
  const docente = c?.docente || {};

  const materiaNombre = materia?.nombre || (c?.materia_id_materia ? `Materia #${c.materia_id_materia}` : 'Curso');
  const docenteNombre = docente?.nombre || docente?.nombres || docente?.nombre_completo || (c?.docente_id_docente ? `Docente #${c.docente_id_docente}` : 'Docente');

  return {
    courseImage: COURSE_IMAGES[idx % COURSE_IMAGES.length],
    thumbText: materiaNombre,
    title: materiaNombre,
    authorAvatar: avatarImg,
    authorName: docenteNombre,
    designation: c?.periodo || 'Periodo',
    price: Number(c?.precio ?? 0),
    prevPrice: Number(c?.precio ?? 0),
  };
}

const CourseTwoMain = () => {
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
    return list.map((c, idx) => normalizeToCourseCard(c, idx));
  }, [cursos]);

  return (
    <main>
      <Breadcrumb title="Mis cursos" subTitle="course" />

      <div className="it-course-area it-course-style-3 it-course-bg p-relative grey-bg pt-120 pb-90">
        <div className="container">
          {error ? (
            <div className="alert alert-danger" role="alert" style={{ marginBottom: 20 }}>
              {String(error)}
            </div>
          ) : null}

          {isLoading ? (
            <div style={{ padding: '30px 0', color: '#6b7280' }}>Cargando cursos…</div>
          ) : (
            <div className="row">
              {cards.length === 0 ? (
                <div style={{ padding: '30px 0', color: '#6b7280' }}>No tienes cursos inscritos.</div>
              ) : (
                cards.map((c, idx) => (
                  <div className="col-xl-4 col-lg-4 col-md-6 mb-30" key={idx}>
                    <SingleCourseTwo
                      courseImage={c.courseImage}
                      thumbText={c.thumbText}
                      title={c.title}
                      authorAvatar={c.authorAvatar}
                      authorName={c.authorName}
                      designation={c.designation}
                      price={String(c.price)}
                      prevPrice={String(c.prevPrice)}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
export default CourseTwoMain;
