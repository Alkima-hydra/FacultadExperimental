import React from 'react';
import { Link } from 'react-router-dom';
import RightArrow from '../SVG';

import Image from '../../assets/img/blog/blog-sidebar-1.jpg';

const SingleBlogFour = (props) => {
  const {
    itemClass,
    blogImage,
    publishedDate,
    authorName,
    title,
    btnClass,
    btnText,
  } = props;
  return (
    <div className={itemClass ? itemClass : 'postbox__thumb-box mb-80'}>
      <div className="postbox__main-thumb mb-30">
        <img src={blogImage ? blogImage : Image} alt="" />
      </div>
      <div className="postbox__content-box">
        <div className="postbox__meta">
          <span>
            <i className="fa-solid fa-calendar-days"></i>
            {publishedDate ? publishedDate : 'April 21, 2024'}
          </span>
          <span>
            <i className="fal fa-user"></i>
            {authorName ? authorName : 'Alamgir Chowdhuri'}
          </span>
        </div>
        <h4 className="postbox__details-title">
          <Link to="/blog-details">
            {title
              ? title
              : 'Curabitur at fermentum purus. Interdum et malesuada fames ac ante ipsum'}
          </Link>
        </h4>
        <a className={btnClass ? btnClass : 'ed-btn-theme'} href="#">
          {btnText ? btnText : 'read more'}
          <i>
            <RightArrow />
          </i>
        </a>
      </div>
    </div>
  );
};

export default SingleBlogFour;
