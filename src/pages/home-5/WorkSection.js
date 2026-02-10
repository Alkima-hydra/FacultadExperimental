import React from 'react';
import SectionTitle from '../../components/SectionTitle';
import SingleWork from '../../components/Work';

import iconImg1 from '../../assets/img/faq/1.svg';
import iconImg2 from '../../assets/img/faq/2.svg';
import iconImg3 from '../../assets/img/faq/3.svg';

const Work = () => {
  return (
    <div className="it-wrok-area it-wrok-bg ed-work-style-2 pt-120 pb-90 grey-bg-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6">
            <SectionTitle
              itemClass="it-course-title-box mb-60 text-center"
              subTitleClass="it-section-subtitle-2 white-bg"
              subTitle="OUR feature"
              titleClass="ed-section-title"
              title="Meet Our Expert Instructor"
            />
          </div>
        </div>
        <div className="row">
          <div
            className="col-xl-4 col-lg-6 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".3s"
          >
            <SingleWork
              itemClass="it-work-item"
              iconImage={iconImg1}
              title="start course"
            />
          </div>
          <div
            className="col-xl-4 col-lg-6 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <SingleWork
              itemClass="it-work-item active"
              iconImage={iconImg2}
              title="EXPERT TEACHERS"
            />
          </div>
          <div
            className="col-xl-4 col-lg-6 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <SingleWork
              itemClass="it-work-item"
              iconImage={iconImg3}
              title="STRATEGI LOCATION"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Work;
