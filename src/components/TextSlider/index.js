import React from 'react';

import textImg from '../../assets/img/career/ed-text.png';

const SingleTextSlider = ({ title }) => {
  return (
    <div className="ed-text-slider-content d-flex align-items-center">
      <span>{title ? title : 'online school'}</span>
      <img src={textImg} alt="" />
    </div>
  );
};
export default SingleTextSlider;
