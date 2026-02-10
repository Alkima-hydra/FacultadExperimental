import React from 'react';
import SingleFeature from '../../components/Feature';
import SectionTitle from '../../components/SectionTitle';

import featureBG from '../../assets/img/feature/feature-bg.png';
import titleImg from '../../assets/img/about/title-home2.png';

const Feature = () => {
  return (
    <div
      className="it-feature-3-area it-feature-3-bg grey-bg pt-120 pb-90"
      style={{ backgroundImage: `url(${featureBG})` }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-7 col-md-8">
            <SectionTitle
              itemClass="it-feature-3-title-box text-center mb-60 section-title-fixed-width"
              subTitleClass="it-section-subtitle-4"
              subTitle="Edunity Feature"
              titleClass="it-section-title-3"
              title="Check out educate features win any exam"
              titleImage={titleImg}
              hasAfterImage
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xl-3 col-lg-6 col-md-6">
            <SingleFeature icon="flaticon-study" title="Best Coaching" />
          </div>
          <div className="col-xl-3 col-lg-6 col-md-6">
            <SingleFeature icon="flaticon-coach" title="Best Coaching" />
          </div>
          <div className="col-xl-3 col-lg-6 col-md-6">
            <SingleFeature icon="flaticon-booking" title="Best Coaching" />
          </div>
          <div className="col-xl-3 col-lg-6 col-md-6">
            <SingleFeature icon="flaticon-video" title="Best Coaching" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Feature;
