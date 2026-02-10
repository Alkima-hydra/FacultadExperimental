import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalVideo from 'react-modal-video';
import RightArrow from '../../components/SVG';

import videoBG from '../../assets/img/video/bg-1-1.jpg';
import shapeImg1 from '../../assets/img/video/shape-1-2.png';
import shapeImg2 from '../../assets/img/video/shape-1-3.png';
import shapeImg3 from '../../assets/img/video/shape-1-4.png';
import shapeImg4 from '../../assets/img/video/shape-1-5.png';

const Video = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div
      className="it-video-area it-video-bg it-video-color p-relative fix pt-100 pb-95"
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
      <div className="it-video-shape-3 d-none d-lg-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="it-video-shape-4 d-none d-lg-block">
        <img src={shapeImg3} alt="" />
      </div>
      <div className="it-video-shape-5 d-none d-lg-block">
        <img src={shapeImg4} alt="" />
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-7 col-lg-7 col-md-9 col-sm-9">
            <div className="it-video-content">
              <span>Join Our New Session</span>
              <h3 className="it-video-title">
                Call To Enroll Your Child <br />
                <a href="tel:+91958423452">(+91)958423452</a>
              </h3>
              <div className="it-video-button">
                <Link className="ed-btn-theme theme-2" to="/contact">
                  <span>
                    Join With us
                    <i>
                      <RightArrow />
                    </i>
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-lg-5 col-md-3 col-sm-3">
            <div className="it-video-play-wrap d-flex justify-content-start justify-content-md-end align-items-center">
              <div className="it-video-play text-center">
                <Link
                  className="popup-video play"
                  to="#"
                  onClick={() => openModal()}
                >
                  <i className="fas fa-play"></i>
                </Link>
                <Link className="text" to="#" onClick={() => openModal()}>
                  watch now
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
