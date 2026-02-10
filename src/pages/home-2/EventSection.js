import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle';
import RightArrow from '../../components/SVG';

import shapeImg1 from '../../assets/img/event/shape-1-1.png';
import shapeImg2 from '../../assets/img/event/shape-1-2.png';
import shapeImg3 from '../../assets/img/event/shape-1-3.png';
import shapeImg4 from '../../assets/img/event/shape-1-4.png';
import shapeImg5 from '../../assets/img/event/shape-1-5.png';
import shapeImg6 from '../../assets/img/event/shape-1-6.png';
import eventImg from '../../assets/img/event/thumb-1.png';
import titleImg from '../../assets/img/about/title-home2.png';

const Event = () => {
  return (
    <div id="it-event" className="it-event-area p-relative pt-120 pb-120 fix">
      <div className="it-event-shape-3 d-none d-xxl-block">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="it-event-shape-4 d-none d-xl-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="it-event-shape-5">
        <img src={shapeImg3} alt="" />
      </div>
      <div className="it-event-shape-6">
        <img src={shapeImg4} alt="" />
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-7 col-lg-7">
            <div className="it-event-left">
              <SectionTitle
                itemClass="it-event-title-box"
                subTitleClass="it-section-subtitle-4"
                subTitle=" explore Events"
                titleClass="it-section-title-3 pb-20"
                title="our best upcoming events"
                titleImage={titleImg}
              />

              <div className="it-event-content">
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod <br />
                  tempor incididunt ut labore.
                </span>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate
                </p>
                <Link className="ed-btn-theme theme-2" to="/event-details">
                  Get Ticket Now
                  <i>
                    <RightArrow />
                  </i>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-lg-5">
            <div className="it-event-thumb-box text-center text-lg-start p-relative">
              <div className="it-event-shape-1 d-none d-lg-block">
                <img src={shapeImg5} alt="" />
              </div>
              <div className="it-event-shape-2">
                <img src={shapeImg6} alt="" />
              </div>
              <div className="it-event-thumb">
                <img src={eventImg} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Event;
