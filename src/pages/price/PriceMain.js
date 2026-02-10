import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';

import shapeImg from '../../assets/img/price/shape-1.png';

const PriceMain = () => {
  return (
    <main>
      <Breadcrumb title="Pricing tables" subTitle="pricing" />

      <div className="it-price-area pt-120 pb-60">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-6 col-md-6 mb-60">
              <div className="it-price-item-wrap p-relative z-index">
                <div className="it-price-shape-1">
                  <img src={shapeImg} alt="" />
                </div>
                <div className="it-price-category text-center">
                  <span>basin plan</span>
                </div>
                <div className="it-price-item">
                  <div className="it-price-category-wrap">
                    <div className="it-price-month text-center">
                      <span>
                        20<i>Month</i>
                      </span>
                    </div>
                  </div>
                  <div className="it-price-list text-center">
                    <p>
                      Advanced features for pros who need more customization.
                    </p>
                    <ul>
                      <li>
                        <i className="fa-light fa-check"></i>
                        7-Days Shipping World Wide
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>3 Kg Weight Max
                        /Package
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>
                        Free Wood Crate
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>
                        Get in touch to discuss
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>
                        Use Personal And Commercial
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>
                        24/7 Support
                      </li>
                    </ul>
                  </div>
                  <Link
                    className="ed-btn-square purple-4 radius w-100 text-center"
                    to="/contact"
                  >
                    <span>Purchase now</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 mb-60">
              <div className="it-price-item-wrap active p-relative z-index">
                <div className="it-price-shape-1">
                  <img src={shapeImg} alt="" />
                </div>
                <div className="it-price-category text-center">
                  <span>standard plan</span>
                </div>
                <div className="it-price-item">
                  <div className="it-price-category-wrap">
                    <div className="it-price-month text-center">
                      <span>
                        20<i>Month</i>
                      </span>
                    </div>
                  </div>
                  <div className="it-price-list text-center">
                    <p>
                      Advanced features for pros who need more customization.
                    </p>
                    <ul>
                      <li>
                        <i className="fa-light fa-check"></i>
                        7-Days Shipping World Wide
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>3 Kg Weight Max
                        /Package
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>
                        Free Wood Crate
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>
                        Get in touch to discuss
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>
                        Use Personal And Commercial
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>
                        24/7 Support
                      </li>
                    </ul>
                  </div>
                  <Link
                    className="ed-btn-square purple-4 radius w-100 text-center"
                    to="/contact"
                  >
                    <span>Purchase now</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 mb-60">
              <div className="it-price-item-wrap p-relative z-index">
                <div className="it-price-shape-1">
                  <img src={shapeImg} alt="" />
                </div>
                <div className="it-price-category text-center">
                  <span>premium plan</span>
                </div>
                <div className="it-price-item">
                  <div className="it-price-category-wrap">
                    <div className="it-price-month text-center">
                      <span>
                        20<i>Month</i>
                      </span>
                    </div>
                  </div>
                  <div className="it-price-list text-center">
                    <p>
                      Advanced features for pros who need more customization.
                    </p>
                    <ul>
                      <li>
                        <i className="fa-light fa-check"></i>
                        7-Days Shipping World Wide
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>3 Kg Weight Max
                        /Package
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>
                        Free Wood Crate
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>
                        Get in touch to discuss
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>
                        Use Personal And Commercial
                      </li>
                      <li>
                        <i className="fa-light fa-check"></i>
                        24/7 Support
                      </li>
                    </ul>
                  </div>
                  <Link
                    className="ed-btn-square purple-4 radius w-100 text-center"
                    to="/contact"
                  >
                    <span>Purchase now</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default PriceMain;
