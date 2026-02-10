import React from 'react';
import SingleCareerTwo from '../../components/Career/SingleCareerTwo';

import careerImg1 from '../../assets/img/career/thumb-1.png';
import careerImg2 from '../../assets/img/career/thumb-3.png';

const Career = () => {
  return (
    <div className="it-career-area ed-career-style-2 p-relative pb-100 pt-120">
      <div className="container">
        <div className="row">
          <div
            className="col-xl-6 col-lg-6 mb-30 wow animate__fadeInLeft"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <SingleCareerTwo
              itemClass="it-career-item theme-bg p-relative fix"
              careerImage={careerImg1}
              btnClass="ed-btn-square hover-2 sm"
            />
          </div>
          <div
            className="col-xl-6 col-lg-6 mb-30 wow animate__fadeInRight"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <SingleCareerTwo
              itemClass="it-career-item black-bg p-relative fix"
              careerImage={careerImg2}
              btnClass="ed-btn-square hover-2 sm purple-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Career;
