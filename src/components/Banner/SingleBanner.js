import React from 'react';
import { Link } from 'react-router-dom';
import RightArrow from '../SVG';
import { useVideoContext } from '../../context/VideoContext';

import Image from '../../assets/img/slider/thumb-5-1.jpg';

const SingleBanner = (props) => {
  const { itemClass, sliderImage, title, description, btnText } = props;
  const { setVideoId, setOpen, stopAutoplay } = useVideoContext();

  const openModal = () => {
    setVideoId('PO_fBTkoznc');
    setOpen(true);
    stopAutoplay();
  };

  return (
    <div
      className={
        itemClass
          ? itemClass
          : 'ed-slider-3-height ed-slider-3-overley  p-relative'
      }
    >
      <div
        className="ed-slider-3-bg"
        style={{ backgroundImage: `url(${sliderImage ? sliderImage : Image})` }}
      ></div>
      <div className="container">
        <div className="row">
          <div className="col-xl-7 col-lg-8">
            <div className="ed-slider-3-content">
              <div className="ed-slider-title text-white pb-5">
                {title
                  ? title
                  : 'We Lead A Professional Generation for the future.'}
              </div>
              <div className="ed-slider-3-text">
                <div>
                  <p className="text-white">
                    {description
                      ? description
                      : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam'}
                  </p>
                </div>
              </div>
              <div className="ed-slider-3-button-wrapper">
                <div className="ed-slider-3-button d-flex align-content-center ">
                  <Link className="ed-btn-square orange mr-25" to="/about-us">
                    {btnText ? btnText : 'discover more'}
                    <i>
                      <RightArrow />
                    </i>
                  </Link>
                  <div className="ed-slider-3-video">
                    <span>
                      <i className="fa-sharp fa-solid fa-play"></i>
                    </span>
                    <Link
                      className="popup-video"
                      to="#"
                      onClick={() => openModal()}
                    >
                      Watch Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SingleBanner;
