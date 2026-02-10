import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalVideo from 'react-modal-video';

import videoBG from '../../assets/img/video/bg-4-1.jpg';
import shapeImg1 from '../../assets/img/video/ed-shape-1-1.png';
import shapeImg2 from '../../assets/img/video/ed-shape-1-2.png';
import shapeImg3 from '../../assets/img/video/shape-1-5.png';
import subTitleSVG from '../../assets/img/video/svg.svg';

const Video = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="it-video-area it-video-style-4 it-video-bg ed-video-style-2 p-relative fix"
      style={{ backgroundImage: `url(${videoBG})` }}
    >
      <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId="PO_fBTkoznc"
        onClose={() => openModal()}
      />
      <div className="it-video-shape-2 d-none d-lg-block">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="it-video-shape-5 d-none d-lg-block">
        <img src={shapeImg3} alt="" />
      </div>
      <div className="it-video-shape-6 d-none d-lg-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-7 col-lg-7 col-md-9 col-sm-9">
            <div className="it-video-content">
              <span className="it-section-subtitle-5 sky">
                <img src={subTitleSVG} alt="" />
                are you ready for this offer
              </span>
              <h3 className="it-video-title">40% offer for very first 100</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor <br />
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis <br />
                nostrud exercitation ullamco laboris nisi.
              </p>
              <div className="it-video-button">
                <Link
                  className="ed-btn-square theme mr-25"
                  to="/student-registration"
                >
                  <span>admission Now</span>
                </Link>
                <Link className="ed-btn-square purple-3" to="/course-details">
                  <span>Our Courses</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-lg-5 col-md-3 col-sm-3">
            <div className="it-video-play-wrap d-flex justify-content-center align-items-center">
              <div className="it-video-play text-center">
                <Link
                  className="popup-video play"
                  to="#"
                  onClick={() => openModal()}
                >
                  <i className="fas fa-play"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Video;
