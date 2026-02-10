import React from 'react';
import { Link } from 'react-router-dom';

import Image from '../../assets/img/blog/blog-1-7.jpg';
import RightArrow from '../SVG';

const SingleBlogTwo = (props) => {
  const {
    itemClass,
    blogImage,
    authorName,
    publishedDate,
    title,
    btnClass,
    btnText,
    hasArrow,
  } = props;
  return (
    <div className={itemClass ? itemClass : 'it-blog-item'}>
      <div className="it-blog-thumb mb-0 fix">
        <Link to="/blog-details">
          <img src={blogImage ? blogImage : Image} alt="" />
        </Link>
      </div>
      <div className="it-blog-content">
        <div className="it-blog-meta pb-25">
          <span>
            <i className="fa-light fa-user"></i>
            {authorName ? authorName : 'Sunilra smoth'}
          </span>
          <span>
            <i className="fa-light fa-calendar-days"></i>
            {publishedDate ? publishedDate : 'March 28, 2023'}
          </span>
        </div>
        <h4 className="it-blog-title pb-5">
          <Link to="/blog-details">
            {title
              ? title
              : 'Lorem ipsum dolor sit amet, consectetur Adipiscing elit, sed do.'}
          </Link>
        </h4>
        <Link
          className={btnClass ? btnClass : 'ed-btn-square purple-3'}
          to="/blog-details"
        >
          <span>
            {btnText ? btnText : 'read more'} {hasArrow && <RightArrow />}
          </span>
        </Link>
      </div>
    </div>
  );
};
export default SingleBlogTwo;
