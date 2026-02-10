import React from 'react';
import SingleProgress from '../../components/Progress';

import shapeImg1 from '../../assets/img/value/value-shape-3.jpg';
import shapeImg2 from '../../assets/img/value/value-shape-4.jpg';
import shapeImg3 from '../../assets/img/value/value-shape-5.jpg';
import valueImg from '../../assets/img/value/value-1.jpg';
import valueShapeImg1 from '../../assets/img/value/value-shape-2.jpg';
import valueShapeImg2 from '../../assets/img/value/value-shape-5.jpg';
import titleImg from '../../assets/img/about/title-home2.png';

const Value = () => {
  const progresses = [
    {
      progressLabel: 'Case study success',
      progress: '90',
    },
    {
      progressLabel: 'Happy student',
      progress: '75',
    },
    {
      progressLabel: 'Engaging',
      progress: '93',
    },
    {
      progressLabel: 'Student Community',
      progress: '63',
    },
  ];
  return (
    <div className="it-value-area pt-120 pb-120 p-relative fix">
      <div className="it-value-shape-1 d-none d-xxl-block">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="it-value-shape-2 d-none d-xl-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="it-value-shape-3 d-none d-xl-block">
        <img src={shapeImg3} alt="" />
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInLeft"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <div className="it-value-title-box">
              <span className="it-section-subtitle-4">
                <img src={titleImg} alt="" /> Our Status Values
              </span>
              <h4 className="it-section-title-3 pb-25">
                Our Classroom is a very deferent <span>school</span> than all
                <br />
                the others
              </h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod <br /> tempor incididunt ut labore.
              </p>
            </div>
            <div className="it-progress-bar-wrap">
              {progresses.map((item, index) => (
                <div key={index} className="it-progress-bar-item">
                  <label>{item.progressLabel}</label>
                  <SingleProgress progress={item.progress} />
                </div>
              ))}
            </div>
          </div>
          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInRight"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <div className="it-value-right-wrap text-end p-relative">
              <div className="it-value-right-img p-relative">
                <img src={valueImg} alt="" />
              </div>
              <div className="it-value-img-shape d-none d-xl-block">
                <img src={valueShapeImg1} alt="" />
              </div>
              <div className="it-value-img-shape-2 d-none d-xl-block">
                <img src={valueShapeImg2} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Value;
