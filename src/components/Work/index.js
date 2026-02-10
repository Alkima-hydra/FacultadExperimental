import React from 'react';
import { Link } from 'react-router-dom';

import Image from '../../assets/img/work/work-1.svg';

const SingleWork = (props) => {
  const { itemClass, iconImage, title, description } = props;
  return (
    <div className={itemClass ? itemClass : 'it-work-item text-center'}>
      <div className="it-work-icon">
        <span>
          <img src={iconImage ? iconImage : Image} alt="" />
        </span>
      </div>
      <div className="it-work-content">
        <h4 className="it-work-title-sm">
          <Link to="/service-details">{title ? title : 'start course'}</Link>
        </h4>
        <p>
          {description
            ? description
            : 'Duis aute irure dolor reprehenderit in voluptate velit esse cillum dolore fugiat nulla pariatur. Excepteur'}
        </p>
      </div>
    </div>
  );
};
export default SingleWork;
