import React from 'react';
import { Link } from 'react-router-dom';

import Image from '../../assets/img/feature/1.svg';

const SingleFeatureTwo = (props) => {
  const { itemClass, iconImage, title, description } = props;

  return (
    <div className={itemClass ? itemClass : 'it-feature-item text-center'}>
      <div className="it-feature-item-content z-index">
        <div className="it-feature-icon">
          <span>
            <img src={iconImage ? iconImage : Image} alt="" />
          </span>
        </div>
        <div className="it-feature-text pt-35">
          <h4 className="it-feature-title">
            <Link to="/service-details">
              {title ? title : 'Education Services'}
            </Link>
          </h4>
          <p>
            {description
              ? description
              : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et'}
          </p>
        </div>
      </div>
    </div>
  );
};
export default SingleFeatureTwo;
