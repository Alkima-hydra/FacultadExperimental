import React from 'react';
import SectionTitle from '../../components/SectionTitle';
import SingleCareer from '../../components/Career';

import shapeImg1 from '../../assets/img/career/shape-1-2.png';
import shapeImg2 from '../../assets/img/career/shape-1-6.png';
import careerImg1 from '../../assets/img/career/thumb-1.png';
import careerImg2 from '../../assets/img/career/thumb-2.png';
import titleImg from '../../assets/img/about/title-home2.png';

const Career = () => {
  return (
    <div className="it-career-area it-career-bg p-relative pb-100 pt-120">
      <div className="it-career-shape-3 d-none d-xl-block">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="it-career-shape-6 d-none d-xl-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8">
            <SectionTitle
              itemClass="it-career-title-box text-center mb-70"
              subTitleClass="it-section-subtitle-4"
              subTitle="Exam preparation"
              title="Annual exam preparation"
              titleImage={titleImg}
              hasAfterImage
            />
          </div>
        </div>
        <div className="row">
          <div
            className="col-xl-6 col-lg-6 mb-30 wow animate__fadeInLeft"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <SingleCareer
              itemClass="it-career-item black-bg p-relative fix"
              careerImage={careerImg1}
              btnClass="ed-btn-theme theme-2"
            />
          </div>
          <div
            className="col-xl-6 col-lg-6 mb-30 wow animate__fadeInRight"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <SingleCareer
              itemClass="it-career-item theme-bg-3 p-relative fix"
              careerImage={careerImg2}
              btnClass="ed-btn-dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Career;
