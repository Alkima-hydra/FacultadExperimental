import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle';

import shapeImg1 from '../../assets/img/about/about-3-shap-1.png';
import shapeImg2 from '../../assets/img/about/ed-shape-3-1.png';
import aboutImg1 from '../../assets/img/about/thumb-4-1.jpg';
import aboutImg2 from '../../assets/img/about/thumb-4-2.jpg';
import titleImg from '../../assets/img/category/title.svg';

const About = () => {
  const items = [
    {
      icon: 'flaticon-video-1',
      title: 'Sharing a Screen',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      icon: 'flaticon-puzzle',
      title: 'presenter Control',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor incididunt ut labore et dolore magna aliqua.',
    },
  ];
  return (
    <div
      id="it-about"
      className="it-about-3-area it-about-4-style p-relative grey-bg pt-120 pb-120"
    >
      <div className="ed-about-3-shape-2">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-6 col-lg-6">
            <div className="ed-about-3-thumb-wrap p-relative">
              <div className="ed-about-3-shape-1 d-none d-md-block">
                <img src={shapeImg2} alt="" />
              </div>
              <div className="ed-about-3-thumb">
                <img src={aboutImg1} alt="" />
              </div>
              <div className="ed-about-3-thumb-sm">
                <img src={aboutImg2} alt="" />
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <SectionTitle
              itemClass="it-about-3-title-box"
              subTitleClass="it-section-subtitle-5 purple-2"
              subTitle="about us"
              titleClass="it-section-title-3 pb-30"
              title="we are always ensure best course for your learning"
              titleImage={titleImg}
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi."
            />

            <div className="it-about-3-mv-box">
              <div className="row">
                {items.map((item, index) => (
                  <div key={index} className="col-xl-12">
                    <div className="it-about-4-list-wrap d-flex align-items-start">
                      <div className="it-about-4-list-icon">
                        <span>
                          <i className={item.icon}></i>
                        </span>
                      </div>
                      <div className="it-about-3-mv-item">
                        <span className="it-about-3-mv-title">
                          {item.title}
                        </span>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="it-about-3-btn-box p-relative">
              <Link className="ed-btn-square" to="/student-registration">
                <span>admission Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
