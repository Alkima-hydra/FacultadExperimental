import React from 'react';
import SectionTitle from '../../components/SectionTitle';
import SingleCareer from '../../components/Career';

import shapeImg1 from '../../assets/img/career/shape-1-1.png';
import shapeImg2 from '../../assets/img/career/shape-1-2.png';
import shapeImg3 from '../../assets/img/career/shape-1-3.png';
import shapeImg4 from '../../assets/img/career/shape-1-4.png';
import shapeImg5 from '../../assets/img/career/shape-1-5.png';
import careerImg1 from '../../assets/img/career/thumb-1.png';
import careerImg2 from '../../assets/img/career/thumb-2.png';

const Career = () => {
  return (
    <div className="it-career-area it-career-bg p-relative pt-120">
      <div className="it-career-shape-2 d-none d-xl-block">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="it-career-shape-3 d-none d-xl-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="it-career-shape-4 d-none d-xl-block">
        <img src={shapeImg3} alt="" />
      </div>
      <div className="it-career-shape-5 d-none d-xl-block">
        <img src={shapeImg4} alt="" />
      </div>
      <div className="it-career-shape-6 d-none d-xl-block">
        <img src={shapeImg5} alt="" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <SectionTitle
              itemClass="it-career-title-box text-center mb-70"
              subTitle="Choose your career"
              title="Discover your gain"
            />
          </div>
          <div
            className="col-xl-6 col-lg-6 mb-30 wow animate__fadeInLeft"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <SingleCareer
              itemClass="it-career-item theme-bg p-relative fix"
              careerImage={careerImg1}
              title="Start from today"
              btnClass="ed-btn-yellow dark-bg"
            />
          </div>
          <div
            className="col-xl-6 col-lg-6 mb-30 wow animate__fadeInRight"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <SingleCareer
              itemClass="it-career-item yellow-bg p-relative fix"
              careerImage={careerImg2}
              title="Start from today"
              btnClass="ed-btn-theme"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Career;
