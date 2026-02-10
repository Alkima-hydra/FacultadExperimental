import React from 'react';

import bannerBG from '../../assets/img/hero/bg-1-1.jpg';
import bannerImg1 from '../../assets/img/hero/thumb-1-1.png';
import bannerImg2 from '../../assets/img/hero/thumb-1-2.png';
import bannerShapeImg1 from '../../assets/img/hero/thumb-shape-1-1.png';
import bannerShapeImg2 from '../../assets/img/hero/thumb-shape-1-2.png';
import shapeImg1 from '../../assets/img/hero/shape-1-1.png';
import shapeImg2 from '../../assets/img/hero/shape-1-2.png';
import shapeImg3 from '../../assets/img/hero/shape-1-3.png';
import studentImg from '../../assets/img/hero/student.png';

const HomeTwoBanner = () => {
  return (
    <div className="ed-hero-area p-relative fix">
      <div
        className="ed-hero-bg p-relative z-index"
        style={{ backgroundImage: `url(${bannerBG})` }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6">
              <div className="ed-hero-content">
                <div className="ed-hero-title-box">
                  <span
                    className="ed-hero-subtitle  wow animate__fadeInUp"
                    data-wow-duration=".9s"
                    data-wow-delay=".3s"
                  >
                    Learn & Get Certificates
                  </span>
                  <h1
                    className="ed-slider-title  wow animate__fadeInUp"
                    data-wow-duration=".9s"
                    data-wow-delay=".5s"
                  >
                    Free online Courses With Certificates & Diplomas
                  </h1>
                </div>
                <span
                  className="pb-25  wow animate__fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".7s"
                >
                  25 Million Learners. 15 Years.100%
                </span>
                <div
                  className="ed-hero-search p-relative  wow animate__fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".9s"
                >
                  <input
                    type="text"
                    placeholder="What do you want to learn today?"
                  />
                  <span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.858 14.1839L10.9851 10.3731C11.9993 9.27123 12.6225 7.81402 12.6225 6.21052C12.622 2.78032 9.79656 0 6.31098 0C2.8254 0 0 2.78032 0 6.21052C0 9.64071 2.8254 12.421 6.31098 12.421C7.81699 12.421 9.19827 11.9001 10.2833 11.0341L14.1711 14.86C14.3605 15.0467 14.6681 15.0467 14.8575 14.86C15.0474 14.6734 15.0474 14.3706 14.858 14.1839ZM6.31098 11.4655C3.3618 11.4655 0.971033 9.11277 0.971033 6.21052C0.971033 3.30826 3.3618 0.955524 6.31098 0.955524C9.26019 0.955524 11.6509 3.30826 11.6509 6.21052C11.6509 9.11277 9.26019 11.4655 6.31098 11.4655Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="ed-hero-thumb-wrap text-center text-md-end  p-relative">
                <div className="ed-hero-thumb-main  p-relative">
                  <img src={bannerImg1} alt="" />
                  <div className="ed-hero-thumb-shape-1">
                    <img src={bannerShapeImg1} alt="" />
                  </div>
                </div>
                <div className="ed-hero-thumb-sm">
                  <img src={bannerImg2} alt="" />
                  <div className="ed-hero-thumb-shape-1">
                    <img src={bannerShapeImg2} alt="" />
                  </div>
                </div>
                <div className="ed-hero-thumb-shape-2">
                  <img src={shapeImg1} alt="" />
                </div>
                <div className="ed-hero-thumb-shape-3">
                  <img src={shapeImg2} alt="" />
                </div>
                <div className="ed-hero-thumb-shape-4">
                  <img src={shapeImg3} alt="" />
                </div>
                <div className="ed-hero-thumb-student d-none d-md-flex align-items-center">
                  <span>
                    <i>
                      2k+ <br />
                    </i>
                    Student
                  </span>
                  <img src={studentImg} alt="" />
                </div>
                <div className="ed-hero-thumb-courses d-none d-md-block">
                  <i>5.8k</i>
                  <span>Success Courses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomeTwoBanner;
