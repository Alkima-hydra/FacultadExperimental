import React from 'react';
import Counter from '../../components/Counter';

import shapeImg from '../../assets/img/about/shape-1-5.png';

const FunFact = () => {
  const counters = [
    {
      countClass: 'it-funfact-item text-center border-style-1',
      countIcon: 'flaticon-teacher',
      countNum: 2500,
      countTitle: 'Total Teacher',
    },
    {
      countClass: 'it-funfact-item text-center border-style-1',
      countIcon: 'flaticon-completed-task',
      countNum: 5000,
      countTitle: 'Total student',
    },
    {
      countClass: 'it-funfact-item text-center border-style-1',
      countIcon: 'flaticon-customer-review',
      countNum: 350,
      countTitle: 'Total classroom',
    },
    {
      countClass: 'it-funfact-item text-center',
      countIcon: 'flaticon-class',
      countNum: 1200,
      countTitle: 'Best Awards Won',
    },
  ];

  return (
    <div className="ed-funfact-area ed-funfact-wrap p-relative pb-90">
      <div className="ed-funfact-shape-1 d-none d-xl-block">
        <img src={shapeImg} alt="" />
      </div>
      <div className="container container-3">
        <div className="row">
          {counters.map((counter, index) => (
            <div key={index} className="col-xl-3 col-lg-3 col-md-6 mb-30">
              <div className={counter.countClass}>
                <div className="it-funfact-icon mb-30">
                  <span>
                    <i className={counter.countIcon}></i>
                  </span>
                </div>
                <div className="it-funfact-content">
                  <h6>
                    <Counter start={0} end={counter.countNum} duration={2} />
                  </h6>
                  <p className="it-funfact-content-title">
                    {counter.countTitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FunFact;
