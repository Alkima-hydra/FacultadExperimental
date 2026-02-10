import React from 'react';
import { Link } from 'react-router-dom';

import Image from '../../assets/img/category/category-4-1.png';

const SingleCategoryTwo = (props) => {
  const { itemClass, iconImage, title, subTitle } = props;

  return (
    <div className={itemClass ? itemClass : 'it-category-4-item text-center'}>
      <div className="it-category-4-icon">
        <span>
          <img src={iconImage ? iconImage : Image} alt="" />
        </span>
      </div>
      <div className="it-category-4-content">
        <h4 className="it-category-4-title">
          <Link to="/course-details">{title ? title : 'web Design'}</Link>
        </h4>
        <span>{subTitle ? subTitle : '08 Courses'}</span>
      </div>
    </div>
  );
};
export default SingleCategoryTwo;
