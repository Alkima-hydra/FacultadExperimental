import React from 'react';
import { Link } from 'react-router-dom';
import RightArrow from '../SVG';

const SingleFeature = (props) => {
  const { itemClass, icon, title, description, btnText } = props;

  return (
    <div
      className={itemClass ? itemClass : 'it-feature-3-item mb-30 text-center'}
    >
      <div className="it-feature-3-icon">
        <span>
          <i className={icon ? icon : 'flaticon-coach'}></i>
        </span>
      </div>
      <div className="it-feature-3-content">
        <h4 className="it-feature-3-title">
          <Link to="/service-details">{title ? title : 'Best Coaching'}</Link>
        </h4>
        <p>
          {description
            ? description
            : 'In pellentesque massa vida placerat duis. Cursus sit amet dictum sit amet.'}
        </p>
      </div>
      <div className="it-feature-3-btn">
        <Link className="ed-btn-theme theme-2" to="/service-details">
          {btnText ? btnText : 'view details'}
          <i>
            <RightArrow />
          </i>
        </Link>
      </div>
    </div>
  );
};
export default SingleFeature;
