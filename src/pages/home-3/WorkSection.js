import React from 'react';
import SectionTitle from '../../components/SectionTitle';
import SingleWork from '../../components/Work';

import workBG from '../../assets/img/work/work-bg.jpg';
import titleImg from '../../assets/img/category/title.svg';
import iconImg1 from '../../assets/img/work/work-1.svg';
import iconImg2 from '../../assets/img/work/work-2.svg';

const Work = () => {
  return (
    <div
      className="it-wrok-area it-wrok-bg pt-120 pb-90"
      style={{ backgroundImage: `url(${workBG})` }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6">
            <SectionTitle
              itemClass="it-course-title-box mb-60 text-center"
              subTitleClass="it-section-subtitle-5"
              subTitle="working strategy"
              titleClass="it-section-title-3"
              title="our work process"
              titleImage={titleImg}
            />
          </div>
        </div>
        <div className="row">
          <div
            className="col-xl-4 col-lg-4 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".3s"
          >
            <SingleWork
              itemClass="it-work-item text-center"
              iconImage={iconImg1}
              title="start course"
            />
          </div>
          <div
            className="col-xl-4 col-lg-4 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <SingleWork
              itemClass="it-work-item active text-center"
              iconImage={iconImg2}
              title="Make Decision"
            />
          </div>
          <div
            className="col-xl-4 col-lg-4 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <SingleWork
              itemClass="it-work-item text-center"
              iconImage={iconImg2}
              title="Get a Certificate"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Work;
