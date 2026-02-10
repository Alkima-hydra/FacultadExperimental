import React from 'react';
import SectionTitleSpecial from '../../components/SectionTitle/SectionTitleSpecial';

import shapeImg1 from '../../assets/img/choose/shape-1-1.png';
import shapeImg2 from '../../assets/img/choose/shape-1-2.png';
import shapeImg3 from '../../assets/img/choose/shape-1-3.png';
import shapeImg4 from '../../assets/img/choose/shape-1-4.png';
import chooseImg from '../../assets/img/choose/choose-2-1.jpg';

const WhyChooseUs = () => {
  return (
    <div className="it-choose-area p-relative fix pt-180 pb-110">
      <div className="it-choose-shape-4 d-none d-md-block">
        <img src={shapeImg4} alt="" />
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div
            className="col-xl-6 col-lg-6 mb-30 wow animate__fadeInLeft"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <div className="it-choose-left">
              <SectionTitleSpecial
                itemClass="it-choose-title-box mb-30"
                subTitle="WHY CHOOSE US"
                preTitle="Creating A Community Of Life Long"
                highlightText="Learners."
              />

              <div className="it-choose-text pb-15">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris..
                </p>
              </div>
              <div className="it-choose-content-box">
                <div className="row gx-20">
                  <div className="col-md-6 col-sm-6 mb-20">
                    <div className="it-choose-content">
                      <h5>
                        <i className="fa-solid fa-circle-check"></i>World
                        className Trainers
                      </h5>
                      <p>Gravida dictum fusce placerat ultricies integer</p>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6 mb-20">
                    <div className="it-choose-content">
                      <h5>
                        <i className="fa-solid fa-circle-check"></i>Easy
                        Learning
                      </h5>
                      <p>Gravida dictum fusce placerat ultricies integer</p>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6 mb-20">
                    <div className="it-choose-content">
                      <h5>
                        <i className="fa-solid fa-circle-check"></i>Flexible
                      </h5>
                      <p>Gravida dictum fusce placerat ultricies integer</p>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6 mb-20">
                    <div className="it-choose-content">
                      <h5>
                        <i className="fa-solid fa-circle-check"></i>Affordable
                        Price
                      </h5>
                      <p>Gravida dictum fusce placerat ultricies integer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-xl-6 col-lg-6 mb-30 wow animate__fadeInRight"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <div className="it-choose-thumb-box text-center text-lg-end">
              <div className="it-choose-thumb p-relative">
                <img src={chooseImg} alt="" />
                <div className="it-choose-shape-1">
                  <img src={shapeImg1} alt="" />
                </div>
                <div className="it-choose-shape-2">
                  <img src={shapeImg2} alt="" />
                </div>
                <div className="it-choose-shape-3 d-none d-lg-block">
                  <img src={shapeImg3} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WhyChooseUs;
