import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';

import eventImg1 from '../../assets/img/event/details-1.jpg';
import eventImg2 from '../../assets/img/event/details-sm.jpg';

const EventDetailsMain = () => {
  return (
    <main>
      <Breadcrumb title="Event Details" subTitle="Event" />

      <div className="it-event-details-area pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-9 col-lg-8">
              <div className="it-evn-details-wrap">
                <div className="it-evn-details-thumb mb-35">
                  <img src={eventImg1} alt="" />
                </div>
                <h4 className="it-evn-details-title">
                  These are Designed to Provide Hands Training and
                  Skill-Building.
                </h4>
                <div className="postbox__meta">
                  <span>
                    <i className="fa-light fa-file-invoice"></i>Lesson 10
                  </span>
                  <span>
                    <i className="fa-light fa-clock"></i>9.00AM- 01.00 PM
                  </span>
                  <span>
                    <i className="fa-light fa-location-dot"></i>3783 Columbia
                    Mine Road
                  </span>
                </div>
                <div className="it-evn-details-text mb-40">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in.
                  </p>
                </div>
                <div className="it-evn-details-text">
                  <h6 className="it-evn-details-title-sm pb-10">
                    Event Description
                  </h6>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim.. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi
                    ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum..
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4">
              <div className="it-evn-sidebar-box it-course-sidebar-box">
                <div className="it-evn-sidebar-thumb mb-30">
                  <img src={eventImg2} alt="" />
                </div>
                <div className="it-course-sidebar-rate-box pb-20">
                  <div className="it-course-sidebar-rate d-flex justify-content-between align-items-center">
                    <span>course fee</span>
                    <span className="rate">
                      $60 <i>$120</i>
                    </span>
                  </div>
                  <i>29-da money-back guarantee</i>
                </div>
                <Link
                  className="ed-btn-square radius purple-4 w-100 text-center mb-20"
                  to="/cart"
                >
                  <span>buy now</span>
                </Link>
                <div className="it-evn-sidebar-list">
                  <ul>
                    <li>
                      <span>4:00 pm 6:00 pm </span> <span>start date</span>
                    </li>
                    <li>
                      <span>enrolled</span>
                      <span>100</span>
                    </li>
                    <li>
                      <span>lectures</span>
                      <span>80</span>
                    </li>
                    <li>
                      <span>skill level</span>
                      <span>Basic</span>
                    </li>
                    <li>
                      <span>className day</span>
                      <span>Monday-friday</span>
                    </li>
                    <li>
                      <span>language</span>
                      <span>English</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default EventDetailsMain;
