import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitleSpecial from '../../components/SectionTitle/SectionTitleSpecial';
import RightArrow from '../../components/SVG';

import shapeImg1 from '../../assets/img/about/shape-1-4.png';
import shapeImg2 from '../../assets/img/about/ed-shape-1-1.png';
import aboutImg1 from '../../assets/img/about/ed-about-1-1.jpg';
import aboutImg2 from '../../assets/img/about/ed-about-1-2.jpg';
import aboutImg3 from '../../assets/img/about/ed-about-1-3.jpg';

const About = () => {
  return (
    <div
      id="it-about"
      className="it-about-area ed-about-style-2 p-relative pt-185 pb-185"
    >
      <div className="it-about-shape-4 d-none d-md-block">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInLeft"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <div className="ed-about-thumb-box p-relative">
              <div className="ed-about-thumb-1">
                <img src={aboutImg1} alt="" />
              </div>
              <div className="ed-about-thumb-2">
                <img src={aboutImg2} alt="" />
              </div>
              <div className="ed-about-thumb-3">
                <img src={aboutImg3} alt="" />
              </div>
              <div className="ed-about-shape-1 d-none d-md-block">
                <img src={shapeImg2} alt="" />
              </div>
              <div className="ed-about-experience d-none d-md-block">
                <span>
                  <b>8+</b> <br />
                  Years Of <br />
                  Experiences
                </span>
              </div>
            </div>
          </div>
          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInRight"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <div className="it-about-right-box">
              <SectionTitleSpecial
                itemClass="it-about-title-box mb-20 section-title-fixed-width"
                subTitle="Our about us"
                preTitle="Learn & Grow your"
                highlightText="skills"
                postTitle="From anywhere"
              />

              <div className="it-about-text pb-10">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris..
                </p>
              </div>
              <div className="it-about-content-wrapper d-flex align-items-center justify-content-between pb-15">
                <div className="it-about-content">
                  <h5>Flexible classNamees</h5>
                  <p>
                    Suspendisse ultrice gravida dictum fusce placerat ultricies
                    integer quis auctor elit sed vulputate mi sit.
                  </p>
                </div>
                <div className="it-about-content">
                  <h5>Flexible classNamees</h5>
                  <p>
                    Suspendisse ultrice gravida dictum fusce placerat ultricies
                    integer quis auctor elit sed vulputate mi sit.
                  </p>
                </div>
              </div>
              <Link className="ed-btn-theme" to="/about-us">
                Load More
                <i>
                  <RightArrow />
                </i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
