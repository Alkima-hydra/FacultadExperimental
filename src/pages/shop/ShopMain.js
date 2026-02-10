import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import SingleShop from '../../components/Shop';

import productImg1 from '../../assets/img/shop/product-1-1.jpg';
import productImg2 from '../../assets/img/shop/product-1-2.jpg';
import productImg3 from '../../assets/img/shop/product-1-3.jpg';
import productImg4 from '../../assets/img/shop/product-1-4.jpg';
import productImg5 from '../../assets/img/shop/product-1-5.jpg';
import productImg6 from '../../assets/img/shop/product-1-6.jpg';
import productImg7 from '../../assets/img/shop/product-1-7.jpg';
import productImg8 from '../../assets/img/shop/product-1-8.jpg';

const ShopMain = () => {
  useEffect(() => {
    window.$('select').niceSelect();
  }, []);

  return (
    <main>
      <Breadcrumb title="Education Shop" subTitle="Shop" />

      <div className="it-shop-area pt-120 pb-120">
        <div className="container">
          <div className="row ">
            <div className="col-12">
              <div className="tp-shop-top pb-15">
                <div className="row align-items-center">
                  <div className="col-xl-6 col-lg-6 col-md-6 mb-30">
                    <div className="it-shop-text">
                      <span>Showing 12 of 120 results</span>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 mb-30">
                    <div className="it-shop-filter-box text-md-end">
                      <div className="it-shop-filter p-relative">
                        <select>
                          <option>12 Product of Per Page</option>
                          <option>Low to Hight</option>
                          <option>High to Low</option>
                          <option>New Added</option>
                          <option>On Sale</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleShop
                productImage={productImg1}
                badgeTitle="-10%"
                title="Jeff Gothelf learn UX"
                newPrice="100.00"
                oldPrice="150.00"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleShop
                productImage={productImg2}
                badgeTitle="-10%"
                title="Pride and Prejudice"
                newPrice="100.00"
                oldPrice="150.00"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleShop
                productImage={productImg3}
                badgeClass="it-shop-badge theme"
                badgeTitle="New"
                title="Hard Luck learn UX"
                newPrice="150.00"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleShop
                productImage={productImg4}
                badgeTitle="-10%"
                title="The Little Prince"
                newPrice="100.00"
                oldPrice="150.00"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleShop
                productImage={productImg5}
                badgeClass="it-shop-badge theme"
                badgeTitle="New"
                title="The Selfish Giant UX"
                newPrice="150.00"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleShop
                productImage={productImg6}
                badgeTitle="-10%"
                title="Little Women UX"
                newPrice="100.00"
                oldPrice="150.00"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleShop
                productImage={productImg7}
                badgeTitle="-10%"
                title="JFar From the Madding Crowd"
                newPrice="100.00"
                oldPrice="150.00"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleShop
                productImage={productImg8}
                badgeClass="it-shop-badge theme"
                badgeTitle="New"
                title="A Horseman in the Sky"
                newPrice="150.00"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="it-pagination text-center">
                <nav>
                  <ul>
                    <li>
                      <Link to="/shop">1</Link>
                    </li>
                    <li>
                      <Link to="/shop">2</Link>
                    </li>
                    <li>
                      <Link to="/shop">3</Link>
                    </li>
                    <li>
                      <Link className="color" to="/shop">
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default ShopMain;
