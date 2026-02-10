import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalVideo from 'react-modal-video';
import Breadcrumb from '../../components/Breadcrumb';
import Newsletter from '../../components/Newsletter';

import serviceImg from '../../assets/img/service/sv-1.jpg';
import serviceImg2 from '../../assets/img/service/sv-2.jpg';

const ServiceDetailsMain = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <main>
      <Breadcrumb title="Services Details" subTitle="Services" />

      <div className="it-sv-details-area pt-120 pb-120">
        <ModalVideo
          channel="youtube"
          isOpen={isOpen}
          videoId="PO_fBTkoznc"
          onClose={() => openModal()}
        />
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8">
              <div className="it-sv-details-top-wrap mb-20">
                <div className="row">
                  <div className="col-xl-6 col-lg-6">
                    <div className="it-sv-details-top-thumb">
                      <img src={serviceImg} alt="" />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="it-sv-details-top-content">
                      <h4 className="it-sv-details-title">web design</h4>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat aute irure dolor in reprehenderit.
                      </p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua exercitation ullamco laboris.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12">
                  <div className="it-sv-details-top-content mb-50">
                    <h4 className="it-sv-details-title">service Description</h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat
                      aute irure dolor in reprehenderit.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat
                      aute irure dolor in reprehenderit.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <div className="it-sv-details-content-box mb-50">
                    <h5 className="it-sv-details-title-sm">
                      <span>
                        <i className="fa-sharp fa-light fa-check"></i>
                      </span>
                      Requirements
                    </h5>
                    <p>
                      Dui id ornare arcu odio ut sem nulla pharetra diam eget
                      aliquet nibh praesent tristique magna sit amet purus.
                      Aenean euismod elementum nisi quis eleifend quam
                      adipiscing vitae proin.
                    </p>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <div className="it-sv-details-content-box mb-50">
                    <h5 className="it-sv-details-title-sm">
                      <span>
                        <i className="fa-sharp fa-light fa-check"></i>
                      </span>
                      Description
                    </h5>
                    <p>
                      Dui id ornare arcu odio ut sem nulla pharetra diam eget
                      aliquet nibh praesent tristique magna sit amet purus.
                      Aenean euismod elementum nisi quis eleifend quam
                      adipiscing vitae proin.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12">
                  <div className="it-sv-details-top-content">
                    <h4 className="it-sv-details-title">What you'll learn</h4>
                    <p className="mb-30">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat
                      aute irure dolor in reprehenderit.
                    </p>
                    <div className="it-sv-details-middle-thumb p-relative mb-30">
                      <img src={serviceImg2} alt="" />
                      <Link
                        className="popup-video it-pulse"
                        to="#"
                        onClick={openModal}
                      >
                        <i className="fa-sharp fa-solid fa-play"></i>
                      </Link>
                    </div>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat
                      aute irure dolor in reprehenderit.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat
                      aute irure dolor in reprehenderit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4">
              <div className="it-sv-details-sidebar">
                <div className="it-sv-details-sidebar-search mb-55">
                  <input type="text" placeholder="search" />
                  <button type="submit">
                    <i className="fal fa-search"></i>
                  </button>
                </div>
                <div className="it-sv-details-sidebar-widget mb-45">
                  <h4 className="it-sv-details-sidebar-title mb-30">
                    service category
                  </h4>
                  <div className="it-sv-details-sidebar-category mb-10">
                    graphic design
                    <span>
                      <i className="fa-light fa-angle-right"></i>
                    </span>
                  </div>
                  <div className="it-sv-details-sidebar-category active mb-10">
                    web design
                    <span>
                      <i className="fa-light fa-angle-right"></i>
                    </span>
                  </div>
                  <div className="it-sv-details-sidebar-category mb-10">
                    it and software
                    <span>
                      <i className="fa-light fa-angle-right"></i>
                    </span>
                  </div>
                  <div className="it-sv-details-sidebar-category mb-10">
                    seles marketing
                    <span>
                      <i className="fa-light fa-angle-right"></i>
                    </span>
                  </div>
                  <div className="it-sv-details-sidebar-category mb-10">
                    art & humanities
                    <span>
                      <i className="fa-light fa-angle-right"></i>
                    </span>
                  </div>
                  <div className="it-sv-details-sidebar-category mb-10">
                    mobile application
                    <span>
                      <i className="fa-light fa-angle-right"></i>
                    </span>
                  </div>
                </div>
                <div className="it-sv-details-sidebar-widget">
                  <h4 className="it-sv-details-sidebar-title mb-30">
                    popular tag:
                  </h4>
                  <div className="sidebar__widget-content">
                    <div className="tagcloud">
                      <a href="#"> Balance</a>
                      <a href="#">coaching</a>
                      <a href="#">Motivation</a>
                      <a href="#">courses</a>
                      <a href="#">Life guide</a>
                      <a href="#">strategy</a>
                      <a href="#">Education</a>
                      <a href="#">coach</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
    </main>
  );
};
export default ServiceDetailsMain;
