import React from 'react';
import { Link } from 'react-router-dom';

import breadcrumbBG from '../../assets/img/breadcrumb/breadcrumb.jpg';
import shapeImg1 from '../../assets/img/breadcrumb/shape-1-1.png';
import shapeImg2 from '../../assets/img/breadcrumb/shape-1-2.png';
import shapeImg3 from '../../assets/img/breadcrumb/shape-1-3.png';
import shapeImg4 from '../../assets/img/breadcrumb/shape-1-4.png';

const Breadcrumb = (props) => {
  const { itemClass, title, subTitle } = props;
  return (
    <div
      className={
        itemClass
          ? itemClass
          : 'it-breadcrumb-area fix it-breadcrumb-bg p-relative'
      }
      style={{ backgroundImage: `url(${breadcrumbBG})` }}
    >
      <div className="it-breadcrumb-shape-1 d-none d-md-block">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="it-breadcrumb-shape-2 d-none d-md-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="it-breadcrumb-shape-3 d-none d-md-block">
        <img src={shapeImg3} alt="" />
      </div>
      <div className="it-breadcrumb-shape-4 d-none d-md-block">
        <img src={shapeImg4} alt="" />
      </div>
      <div className="container">
        <div className="row ">
          <div className="col-md-12">
            <div className="it-breadcrumb-content z-index-3 text-center">
              <div className="it-breadcrumb-title-box">
                <h3 className="it-breadcrumb-title">
                  {title ? title : 'about us'}
                </h3>
              </div>
              <div className="it-breadcrumb-list-wrap">
                <div className="it-breadcrumb-list">
                  <span>
                    <Link to="/">home</Link>
                  </span>
                  <span className="dvdr px-2">//</span>
                  <span>
                    {subTitle ? subTitle : title ? title : 'about us'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Breadcrumb;
