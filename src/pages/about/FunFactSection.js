import React from 'react';
import Counter from '../../components/Counter';

import funFactBG from '../../assets/img/funfact/funfact-bg.png';

const FunFact = () => {
  const counters = [
    {
      countIcon: 'flaticon-teacher',
      countNum: 3,
      countSubtext: 'K+',
      countTitle: 'Successfully Trained',
    },
    {
      countIcon: 'flaticon-completed-task',
      countNum: 15,
      countSubtext: 'K+',
      countTitle: 'Classes Completed',
    },
    {
      countIcon: 'flaticon-customer-review',
      countNum: 97,
      countSubtext: 'K+',
      countTitle: 'Satisfaction Rate',
    },
    {
      countIcon: 'flaticon-class',
      countNum: 102,
      countSubtext: 'K+',
      countTitle: 'Students Community',
    },
  ];
  return (
    <div className="it-funfact-area z-index-5">
      <div className="container">
        <div
          className="it-funfact-bg-wrap orange-bg"
          style={{ backgroundImage: `url(${funFactBG})` }}
        >
          <div className="row gx-0">
            {counters.map((counter, index) => (
              <div key={index} className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="it-funfact-item d-flex align-items-center">
                  <div className="it-funfact-icon">
                    <span>
                      <i className={counter.countIcon}></i>
                    </span>
                  </div>
                  <div className="it-funfact-content">
                    <h6>
                      <Counter
                        start={0}
                        end={counter.countNum}
                        duration={5}
                        counterSubText={counter.countSubtext}
                      />
                    </h6>
                    <span className="it-funfact-content-title">
                      {counter.countTitle}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FunFact;
