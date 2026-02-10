import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalVideo from 'react-modal-video';

import shapeImg1 from '../../assets/img/hero/shape-2-1.png';
import shapeImg2 from '../../assets/img/hero/shape-2-2.png';
import shapeImg3 from '../../assets/img/hero/shape-2-3.png';
import shapeImg4 from '../../assets/img/hero/shape-2-4.png';
import shapeImg5 from '../../assets/img/hero/shape-2-5.png';
import bannerImg1 from '../../assets/img/hero/thumb-2-1.png';
import bannerImg2 from '../../assets/img/hero/thumb-2-2.png';
import studentImg from '../../assets/img/hero/student.png';

const Banner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="ed-hero-2-area ed-hero-2-bg fix z-index p-relative">
      <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId="PO_fBTkoznc"
        onClose={() => openModal()}
      />
      <div className="ed-hero-2-shape-1">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="ed-hero-2-shape-2 d-none d-md-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="ed-hero-2-shape-3">
        <img src={shapeImg4} alt="" />
      </div>
      <div className="ed-hero-2-shape-4">
        <img src={shapeImg3} alt="" />
      </div>
      <div className="ed-hero-2-shape-5">
        <img src={shapeImg3} alt="" />
      </div>
      <div className="container container-3">
        <div className="row align-items-center">
          <div className="col-xxl-6 col-xl-5 col-lg-6">
            <div className="ed-hero-2-content">
              <h1
                className="ed-slider-title pb-5 wow animate__fadeInUp"
                data-wow-duration=".9s"
                data-wow-delay=".3s"
              >
                The Best Place <br /> TO Learn and Play <br /> For Kids
              </h1>
              <div
                className="ed-hero-2-text mb-30 wow animate__fadeInUp"
                data-wow-duration=".9s"
                data-wow-delay=".5s"
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod <br />
                  tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div
                className="ed-hero-2-button-wrapper wow animate__fadeInUp"
                data-wow-duration=".9s"
                data-wow-delay=".7s"
              >
                <div className="ed-hero-2-button d-flex align-content-center">
                  <Link className="ed-btn-radius" to="/course-details">
                    Browse Courses
                  </Link>
                  <div className="ed-slider-3-video">
                    <span>
                      <i className="fa-sharp fa-solid fa-play"></i>
                    </span>
                    <Link
                      className="popup-video"
                      to="#"
                      onClick={() => {
                        openModal();
                      }}
                    >
                      Watch Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-6 col-xl-7 col-lg-6">
            <div className="ed-hero-2-right p-relative">
              <div className="ed-hero-2-thumb style-1">
                <img src={bannerImg1} alt="" />
              </div>
              <div className="ed-hero-2-thumb style-2">
                <img src={bannerImg2} alt="" />
              </div>
              <div className="ed-hero-thumb-student d-md-flex align-items-center d-none">
                <span>
                  <i>
                    10k+ <br />
                  </i>
                  Student
                </span>
                <img src={studentImg} alt="" />
              </div>
              <div className="ed-hero-thumb-courses d-none d-md-block">
                <i>5.8k</i>
                <span>Success Courses</span>
              </div>
              <div className="ed-hero-2-shape-6">
                <img src={shapeImg5} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Banner;
