import React from 'react';
import { Link } from 'react-router-dom';

import svgImg from '../../assets/img/video/svg.svg';
import Image from '../../assets/img/career/thumb-1.png';
import shapeImg from '../../assets/img/career/shape-1.png';

const SingleCareerTwo = (props) => {
  const { itemClass, subTitleImg, title, careerImage, btnClass, btnText } =
    props;

  return (
    <div
      className={
        itemClass ? itemClass : 'it-career-item theme-bg p-relative fix'
      }
    >
      <div className="it-career-content">
        <span className="it-section-subtitle-5 sky">
          <img src={subTitleImg ? subTitleImg : svgImg} alt="" />
          {title ? title : 'popular courses'}
        </span>
        <p>
          get the best courses & <br />
          Upgrade your skills
        </p>
        <Link
          className={btnClass ? btnClass : 'ed-btn-square hover-2 sm'}
          to="/student-registration"
        >
          {btnText ? btnText : 'Join with us'}
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
export default SingleCareerTwo;
