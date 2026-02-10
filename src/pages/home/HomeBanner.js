import React from 'react';
import { Link } from 'react-router-dom';
import RightArrow from '../../components/SVG';

import bannerBG from '../../assets/img/slider/slider-bg.png';
import instructorImg from '../../assets/img/slider/instructor.png';
import shapeImg1 from '../../assets/img/slider/shape-1-1.png';
import shapeImg2 from '../../assets/img/slider/shape-1-2.png';
import bannerImg from '../../assets/img/slider/thumb-1-1.jpg';

const HomeBanner = () => {
  return (
    <div className="ed-slider-area p-relative">
      <div
        className="ed-slider-bg p-relative"
        style={{ backgroundImage: `url(${bannerBG})` }}
      >
        <div className="ed-slider-instructor-box d-none d-lg-block">
          <div>
            <span>
              <i>200+</i> Instructor
            </span>
            <img src={instructorImg} alt="" />
          </div>
        </div>
        <div className="ed-slider-shape-2 d-none d-xl-block">
          <img src={shapeImg2} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-6">
              <div className="ed-slider-content">
                <span
                  className="ed-slider-subtitle pb-10 wow animate__fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".3s"
                >
                  Welcome Edunity online courses
                </span>
                <h1
                  className="ed-slider-title wow animate__fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".4s"
                >
                  Achieving Your Dreams <br />
                  Through <span>Education</span>
                </h1>
                <p
                  className="pb-25 wow animate__fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".5s"
                >
                  We are experienced in educationl platform and skilled
                  strategies <br />
                  for the success of our online learning.
                </p>
                <Link
                  className="ed-btn-dark wow animate__fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".7s"
                  to="/course-details"
                >
                  Find courses
                  <i>
                    <RightArrow />
                  </i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="ed-slider-thumb">
          <img src={bannerImg} alt="" />
          <div className="ed-slider-shape-1 d-none d-xl-block">
            <img src={shapeImg1} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomeBanner;
