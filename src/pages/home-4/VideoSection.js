import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalVideo from 'react-modal-video';

import videoBG from '../../assets/img/video/bg-4-3.jpg';
import videoBG2 from '../../assets/img/video/bg-4-2.jpg';
import shapeImg1 from '../../assets/img/video/shape-4-1.png';
import shapeImg2 from '../../assets/img/video/shape-4-2.png';

const Video = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="ed-video-area fix ed-video-bg p-relative pt-160 pb-120"
      style={{ backgroundImage: `url(${videoBG})` }}
    >
      <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId="PO_fBTkoznc"
        onClose={() => openModal()}
      />
      <div className="ed-video-shape-1">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="ed-video-shape-2">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="container container-3">
        <div className="row">
          <div className="col-xl-12">
            <div
              className="ed-video-wrap"
              style={{ backgroundImage: `url(${videoBG2})` }}
            >
              <div className="it-video-play-wrap">
                <div className="it-video-play">
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
    </div>
  );
};
export default Video;
