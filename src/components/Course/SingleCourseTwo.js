import React from 'react';
import { Link } from 'react-router-dom';

import Image from '../../assets/img/course/course-1-1.jpg';
import avatarImg from '../../assets/img/course/avata-1.png';

const SingleCourseTwo = (props) => {
  const {
    itemClass,
    courseImage,
    thumbText,
    rating,
    title,
    lessonCount,
    duration,
    studentCount,
    authorAvatar,
    authorName,
    designation,
    price,
    prevPrice,
  } = props;

  return (
    <div className={itemClass ? itemClass : 'it-course-item'}>
      <div className="it-course-thumb mb-20 p-relative">
        <Link to="/course-details">
          <img src={courseImage ? courseImage : Image} alt="" />
        </Link>
        <div className="it-course-thumb-text">
          <span>{thumbText ? thumbText : 'Development'}</span>
        </div>
      </div>
      <div className="it-course-content">
        <div className="it-course-rating mb-10">
          <i className="fa-sharp fa-solid fa-star"></i>
          <i className="fa-sharp fa-solid fa-star"></i>
          <i className="fa-sharp fa-solid fa-star"></i>
          <i className="fa-sharp fa-solid fa-star"></i>
          <i className="fa-sharp fa-regular fa-star"></i>
          <span>({rating ? rating : '4.7'})</span>
        </div>
        <h4 className="it-course-title pb-5">
          <Link to="/course-details">
            {title ? title : 'It statistics data science and Business analysis'}
          </Link>
        </h4>
        <div className="it-course-info pb-15 mb-25 d-flex justify-content-between">
          <span>
            <i className="fa-light fa-file-invoice"></i>
            {lessonCount ? lessonCount : 'Lesson 10'}
          </span>
          <span>
            <i className="fa-sharp fa-regular fa-clock"></i>
            {duration ? duration : '19h 30m'}
          </span>
          <span>
            <i className="fa-light fa-user"></i>
            {studentCount ? studentCount : 'Students 20+'}
          </span>
        </div>
        <div className="it-course-author pb-15">
          <img src={authorAvatar ? authorAvatar : avatarImg} alt="" />
          <span>
            By <i>{authorName ? authorName : 'Angela'}</i> in{' '}
            <i>{designation ? designation : 'Development'}</i>
          </span>
        </div>
        <div className="it-course-price-box d-flex justify-content-between">
          <span>
            <i>${price ? price : '60'}</i> ${prevPrice ? prevPrice : '120'}
          </span>
          <Link to="/cart">
            <i className="fa-light fa-cart-shopping"></i>Add to cart
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SingleCourseTwo;
