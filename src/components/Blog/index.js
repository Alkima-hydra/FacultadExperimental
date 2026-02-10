import React from 'react';
import { Link } from 'react-router-dom';
import RightArrow from '../SVG';

import blogBG from '../../assets/img/blog/bg-1.jpg';
import Image from '../../assets/img/blog/blog-1-1.jpg';

const SingleBlog = (props) => {
  const {
    itemClass,
    blogImage,
    publishedDate,
    commentCount,
    title,
    btnClass,
    btnText,
    hasArrow,
  } = props;
  return (
    <div
      className="it-blog-item-box"
      style={{ backgroundImage: `url(${blogBG})` }}
    >
      <div className={itemClass ? itemClass : 'it-blog-item'}>
        <div className="it-blog-thumb fix">
          <Link to="/blog-details">
            <img src={blogImage ? blogImage : Image} alt="" />
          </Link>
        </div>
        <div className="it-blog-meta pb-15">
          <span>
            <i className="fa-solid fa-calendar-days"></i>
            {publishedDate ? publishedDate : '14 June 2023'}
          </span>
          <span>
            <i className="fa-light fa-messages"></i>
            Comment ({commentCount ? commentCount : '06'})
          </span>
        </div>
        <h4 className="it-blog-title">
          <Link to="/blog-details">
            {title
              ? title
              : 'velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat'}
          </Link>
        </h4>
        <Link
          className={btnClass ? btnClass : 'ed-btn-blog'}
          to="/blog-details"
        >
          {btnText ? btnText : 'read more'}
          {hasArrow && (
            <i>
              <RightArrow />
            </i>
          )}
        </Link>
      </div>
    </div>
  );
};
export default SingleBlog;
