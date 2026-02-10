import React from 'react';
import { Link } from 'react-router-dom';
import RightArrow from '../SVG';

import shapeImg from '../../assets/img/career/shape-1.png';
import Image from '../../assets/img/career/thumb-1.png';

const SingleCareer = (props) => {
  const { itemClass, title, careerImage, btnClass, btnText } = props;

  return (
    <div
      className={
        itemClass ? itemClass : 'it-career-item theme-bg p-relative fix'
      }
    >
      <div className="it-career-content">
        <span>{title ? title : 'Start from today'}</span>
        <p>
          Join our training courses & <br />
          Build your skill.
        </p>
        <Link
          className={btnClass ? btnClass : 'ed-btn-yellow dark-bg'}
          to="/student-registration"
        >
          {btnText ? btnText : 'Join now'}
          <i>
            <RightArrow />
          </i>
        </Link>
      </div>
      <div className="it-career-thumb">
        <img src={careerImage ? careerImage : Image} alt="" />
      </div>
      <div className="it-career-shape-1">
        <img src={shapeImg} alt="" />
      </div>
    </div>
  );
};
export default SingleCareer;
