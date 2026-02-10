import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitleTwo from '../../components/SectionTitle/SectionTitleTwo';

import chooseBG from '../../assets/img/video/bg-5-1.jpg';
import shapeImg1 from '../../assets/img/video/shape-4-4.png';
import shapeImg2 from '../../assets/img/video/shape-4-5.png';
import shapeImg3 from '../../assets/img/video/shape-4-6.png';
import shapeImg4 from '../../assets/img/hero/shape-2-1.png';
import shapeImg5 from '../../assets/img/video/shape-4-3.png';
import thumbImg from '../../assets/img/video/thumb-5.jpg';

const WhyChooseUs = () => {
  return (
    <div
      className="ed-choose-area it-video-2-bg p-relative fix z-index pt-120 pb-120"
      style={{ backgroundImage: `url(${chooseBG})` }}
    >
      <div className="ed-choose-shape-2 d-none d-lg-block">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="ed-choose-shape-3 d-none d-lg-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="ed-choose-shape-4 d-none d-lg-block">
        <img src={shapeImg3} alt="" />
      </div>
      <div className="ed-choose-shape-5 d-none d-xl-block">
        <img src={shapeImg4} alt="" />
      </div>
      <div className="container container-3">
        <div className="row align-items-center">
          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInLeft"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <div className="it-video-2-left">
              <SectionTitleTwo
                itemClass="it-video-2-title-box mb-10"
                subtitleClass="it-section-subtitle-5 orange"
                icon="fa-light fa-book"
                subtitle="why choose us"
                titleClass="ed-section-title"
                title="new approach to fun"
              />

              <div className="it-video-2-text mb-20">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do <br />
                  eiusmod tempor incididunt ut labore et.
                </p>
              </div>
              <div className="ed-about-5-content mb-30">
                <div className="it-about-5-list">
                  <ul>
                    <li>
                      <i className="fa-regular fa-check"></i>Best Teaching
                    </li>
                    <li>
                      <i className="fa-regular fa-check"></i>Quality Educators
                    </li>
                  </ul>
                </div>
                <div className="it-about-5-list">
                  <ul>
                    <li>
                      <i className="fa-regular fa-check"></i>Expert Tutor
                    </li>
                    <li>
                      <i className="fa-regular fa-check"></i>Affordable
                    </li>
                  </ul>
                </div>
              </div>
              <div className="it-video-2-button">
                <Link className="ed-btn-radius sky-bg" to="/event-details">
                  Find Events
                </Link>
              </div>
            </div>
          </div>
          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInRight"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <div className="it-video-2-thumb p-relative">
              <img src={thumbImg} alt="" />
              <div className="ed-choose-shape-1">
                <img src={shapeImg5} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WhyChooseUs;
