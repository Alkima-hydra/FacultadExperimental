import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import SingleWork from '../../components/Work';

import iconImg1 from '../../assets/img/faq/1.svg';
import iconImg2 from '../../assets/img/faq/3.svg';

const ServiceThreeMain = () => {
  return (
    <main>
      <Breadcrumb title="Services Style 3" subTitle="Services" />

      <div className="it-wrok-area fix it-wrok-bg ed-work-style-2 ed-work-style-3 inner-style pt-120 pb-90">
        <div className="container container-3">
          <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <SingleWork
                itemClass="it-work-item"
                iconImage={iconImg1}
                title="Start course"
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <SingleWork
                itemClass="it-work-item"
                iconImage={iconImg2}
                title="EXPERT TEACHERS"
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <SingleWork
                itemClass="it-work-item"
                iconImage={iconImg2}
                title="STRATEGI LOCATION"
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <SingleWork
                itemClass="it-work-item"
                iconImage={iconImg1}
                title="Start course"
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <SingleWork
                itemClass="it-work-item"
                iconImage={iconImg2}
                title="EXPERT TEACHERS"
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <SingleWork
                itemClass="it-work-item"
                iconImage={iconImg2}
                title="STRATEGI LOCATION"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default ServiceThreeMain;
