import React from 'react';
import { Link } from 'react-router-dom';

import Image from '../../assets/img/course/course-2-1.jpg';
import avatarImg from '../../assets/img/course/ed-avata-1-1.png';
import shapeImg from '../../assets/img/course/ed-item-shape.png';
import RightArrowThin from '../SVG/RightArrowThin';

const SingleCourse = (props) => {
  const {
    itemClass,
    id,
    courseImage,
    thumbText,
    rating,
    price,
    title,
    lessonCount,
    duration,
    studentCount,
    authorAvatar,
    authorName,
    btnText,
    periodo,
  } = props;

  return (
    <div className={itemClass ? itemClass : 'it-course-item ed-course-style-2'}>
      <div className="it-course-thumb mb-25 p-relative">
        <Link to={`/course-details/${id}`}>
          <img src={courseImage ? courseImage : Image} alt="" />
        </Link>
        <div className="it-course-thumb-text">
          <span>{periodo ? periodo : 'Digital Marketing'}</span>
        </div>
      </div>
      <div className="it-course-content p-relative">
        <div className="it-course-rating mb-10 d-flex align-items-center justify-content-between">
          <div>
            <i className="fa-sharp fa-solid fa-star"></i>
            <i className="fa-sharp fa-solid fa-star"></i>
            <i className="fa-sharp fa-solid fa-star"></i>
            <i className="fa-sharp fa-solid fa-star"></i>
            <i className="fa-sharp fa-regular fa-star"></i>
            <span>{rating != null ? rating : '—'}</span>
          </div>
          <div className="it-course-price-box">
            {price != null && price !== '' ? (
              <span className="it-course-price">Bs {Number(price).toFixed(2)}</span>
            ) : (
              <span className="it-course-price">—</span>
            )}
          </div>
        </div>
        <h4 className="it-course-title pb-15">
          <Link to={`/course-details/${id}`}>
            {title ? title : 'It Statistics Data Science And Business Analysis'}
          </Link>
        </h4>
        <div className="it-course-info pb-15 mb-30 d-flex justify-content-between">
          <span>
            <i className="fa-light fa-file-invoice"></i>
            {lessonCount != null && lessonCount !== '' ? `Lecciones ${lessonCount}` : 'Lecciones —'}
          </span>
          <span>
            <i className="fa-sharp fa-regular fa-clock"></i>
            {duration != null && duration !== '' ? duration : 'Duración —'}
          </span>
          <span>
            <i className="fa-light fa-user"></i>
            {studentCount != null && studentCount !== '' ? `Cupos ${studentCount}` : 'Cupos —'}
          </span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="it-course-author">
            <img src={authorAvatar ? authorAvatar : avatarImg} alt="" />
            <span>{authorName ? authorName : 'Samantha'}</span>
          </div>
          <div className="ed-course-price-box">
            <Link className="ed-course-btn" to={`/course-details/${id}`}>
              {btnText ? btnText : 'Ver detalles'}
              <span>
                <RightArrowThin />
              </span>
            </Link>
          </div>
        </div>
        <div className="ed-course-shape">
          <img src={shapeImg} alt="" />
        </div>
      </div>
    </div>
  );
};
export default SingleCourse;
