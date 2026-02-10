import React from 'react';
import { Link } from 'react-router-dom';

import Image from '../../assets/img/course/course-3-1.jpg';
import Avatar from '../../assets/img/course/avata-1.png';

const SingleCourseThree = (props) => {
  const {
    itemClass,
    courseImage,
    thumbText,
    rating,
    price,
    prevPrice,
    title,
    authorAvatar,
    authorName,
    designation,
    lessonCount,
    duration,
    studentCount,
  } = props;

  return (
    <div className={itemClass ? itemClass : 'ed-course-2-item'}>
      <div className="it-course-thumb p-relative">
        <Link to="/course-details">
          <img src={courseImage ? courseImage : Image} alt="" />
        </Link>
        <div className="it-course-thumb-text">
          <span>{thumbText ? thumbText : 'Development'}</span>
        </div>
      </div>
      <div className="it-course-content">
        <div className="d-flex align-items-center justify-content-between mb-5">
          <div className="it-course-rating">
            <i className="fa-sharp fa-solid fa-star"></i>
            <i className="fa-sharp fa-solid fa-star"></i>
            <i className="fa-sharp fa-solid fa-star"></i>
            <i className="fa-sharp fa-solid fa-star"></i>
            <i className="fa-sharp fa-regular fa-star"></i>
            <span>({rating ? rating : '4.7'})</span>
          </div>
          <div className="it-course-price-box d-flex justify-content-between">
            <span>
              <i>${price ? price : '60'}</i>
              <del>${prevPrice ? prevPrice : '120'}</del>
            </span>
          </div>
        </div>
        <h4 className="it-course-title">
          <Link to="/course-details">
            {title ? title : 'statistics data science and Business..'}
          </Link>
        </h4>
        <div className="it-course-author pb-20">
          <img src={authorAvatar ? authorAvatar : Avatar} alt="" />
          <span>
            By <i>{authorName ? authorName : 'Angela'}</i> in{' '}
            <i>{designation ? designation : 'Development'}</i>
          </span>
        </div>
        <div className="it-course-info pb-15 mb-10 d-flex justify-content-between">
          <span>
            <i className="fa-light fa-file-invoice"></i>
            {lessonCount ? lessonCount : '02 Lessons'}
          </span>
          <span>
            <i className="fa-sharp fa-regular fa-clock"></i>
            {duration ? duration : '4h 50m'}
          </span>
          <span>
            <i className="fa-light fa-user"></i>
            {studentCount ? studentCount : 'Students'}
          </span>
        </div>
      </div>
    </div>
  );
};
export default SingleCourseThree;
