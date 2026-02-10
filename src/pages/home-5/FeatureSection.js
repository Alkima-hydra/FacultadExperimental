import React from 'react';
import SingleFeatureTwo from '../../components/Feature/SingleFeatureTwo';

import iconImg1 from '../../assets/img/feature/1.svg';
import iconImg2 from '../../assets/img/feature/2.svg';
import iconImg3 from '../../assets/img/feature/3.svg';

const Feature = () => {
  return (
    <div id="it-feature" className="it-feature-area pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div
            className="col-xl-4 col-lg-4 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".3s"
          >
            <SingleFeatureTwo iconImage={iconImg1} title="Education Services" />
          </div>
          <div
            className="col-xl-4 col-lg-4 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <SingleFeatureTwo iconImage={iconImg2} title="International Hubs" />
          </div>
          <div
            className="col-xl-4 col-lg-4 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <SingleFeatureTwo
              iconImage={iconImg3}
              title="Bachelor’s and Master’s"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Feature;
