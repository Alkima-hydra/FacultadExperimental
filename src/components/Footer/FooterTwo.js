import React from 'react';
import { Link } from 'react-router-dom';

import footerBG from '../../assets/img/footer/bg-1-1.jpg';
import Logo from '../../assets/img/logo/logo-white-2.png';
import footerImg1 from '../../assets/img/footer/thumb-1-1.png';
import footerImg2 from '../../assets/img/footer/thumb-1-2.png';
import footerImg3 from '../../assets/img/footer/thumb-1-3.png';
import footerImg4 from '../../assets/img/footer/thumb-1-4.png';
import footerImg5 from '../../assets/img/footer/thumb-1-5.png';
import footerImg6 from '../../assets/img/footer/thumb-1-6.png';

const FooterTwo = (props) => {
  const { footerClass, footerLogo, btnClass, copyrightTextClass } = props;

  return (
    <footer>
      <div
        className={
          footerClass
            ? footerClass
            : 'it-footer-area it-footer-bg it-footer-style-5 ed-footer-style-2 black-bg pb-70'
        }
        style={{ backgroundImage: `url(${footerBG})` }}
      >
        <div className="it-footer-border">
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-4">
                <div className="it-footer-top-info d-flex align-items-center it-footer-top-col-1">
                  <div className="it-footer-top-icon">
                    <span>
                      <i className="fa-light fa-location-dot"></i>
                    </span>
                  </div>
                  <div className="it-footer-top-text">
                    <span>Address:</span>
                    <a
                      target="_blank"
                      href="https://www.google.com/maps/@25.1314121,87.0325089,8.83z?entry=ttu"
                    >
                      1925 Boggess Street
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4">
                <div className="it-footer-top-info d-flex align-items-center it-footer-top-col-2">
                  <div className="it-footer-top-icon">
                    <span>
                      <i className="fa-light fa-phone phone"></i>
                    </span>
                  </div>
                  <div className="it-footer-top-text">
                    <span>Phone:</span>
                    <a href="tel:00875784568">(00) 875 784 568</a>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4">
                <div className="it-footer-top-info d-flex align-items-center justify-content-md-end border-none it-footer-top-col-3">
                  <div className="it-footer-top-icon">
                    <span>
                      <i className="fa-light fa-envelope"></i>
                    </span>
                  </div>
                  <div className="it-footer-top-text">
                    <span>Email:</span>
                    <a href="mailto:info@gmail.com">info@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="it-footer-wrap pt-120">
          <div className="container">
            <div className="row">
              <div
                className="col-xl-4 col-lg-4 col-md-6 col-sm-6 mb-50 wow animate__fadeInUp"
                data-wow-duration=".9s"
                data-wow-delay=".3s"
              >
                <div className="it-footer-widget footer-col-5">
                  <div className="it-footer-logo pb-25">
                    <Link to="/">
                      <img src={footerLogo ? footerLogo : Logo} alt="" />
                    </Link>
                  </div>
                  <div className="it-footer-text pb-5">
                    <p>
                      Interdum velit laoreet id donec ultrices <br />
                      tincidunt arcu. Tincidunt tortor aliqua <br />
                      mfacilisi cras fermentum odio eu.
                    </p>
                  </div>
                  <div className="it-footer-social">
                    <a href="#">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                    <a href="#">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a href="#">
                      <i className="fa-brands fa-pinterest-p"></i>
                    </a>
                    <a href="#">
                      <i className="fa-brands fa-twitter"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="col-xl-2 col-lg-3 col-md-6 col-sm-6 mb-50 wow animate__fadeInUp"
                data-wow-duration=".9s"
                data-wow-delay=".5s"
              >
                <div className="it-footer-widget footer-col-6">
                  <h4 className="it-footer-title">our services:</h4>
                  <div className="it-footer-list">
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fa-regular fa-angle-right"></i>Web
                          development
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa-regular fa-angle-right"></i>UI/UX
                          Design
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa-regular fa-angle-right"></i>
                          Management
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa-regular fa-angle-right"></i>Digital
                          Marketing
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa-regular fa-angle-right"></i>Blog News
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-50 wow animate__fadeInUp"
                data-wow-duration=".9s"
                data-wow-delay=".7s"
              >
                <div className="it-footer-widget footer-col-4">
                  <h4 className="it-footer-title">Gallery</h4>
                  <div className="it-footer-gallery-box">
                    <div className="row gx-10">
                      <div className="col-md-4 col-4">
                        <div className="it-footer-thumb mb-10">
                          <a href="#">
                            <img src={footerImg1} alt="" />
                          </a>
                        </div>
                      </div>
                      <div className="col-md-4 col-4">
                        <div className="it-footer-thumb mb-10">
                          <a href="#">
                            <img src={footerImg2} alt="" />
                          </a>
                        </div>
                      </div>
                      <div className="col-md-4 col-4 mb-10">
                        <div className="it-footer-thumb">
                          <a href="#">
                            <img src={footerImg3} alt="" />
                          </a>
                        </div>
                      </div>
                      <div className="col-md-4 col-4">
                        <div className="it-footer-thumb">
                          <a href="#">
                            <img src={footerImg4} alt="" />
                          </a>
                        </div>
                      </div>
                      <div className="col-md-4 col-4">
                        <div className="it-footer-thumb">
                          <a href="#">
                            <img src={footerImg5} alt="" />
                          </a>
                        </div>
                      </div>
                      <div className="col-md-4 col-4">
                        <div className="it-footer-thumb">
                          <a href="#">
                            <img src={footerImg6} alt="" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-xl-3 col-lg-3 col-md-6 col-sm-8 mb-50 wow animate__fadeInUp"
                data-wow-duration=".9s"
                data-wow-delay=".9s"
              >
                <div className="it-footer-widget footer-col-8">
                  <h4 className="it-footer-title">Subscribe</h4>
                  <div className="it-footer-input-box p-relative">
                    <input
                      className="mb-20"
                      type="email"
                      placeholder="Enter your email:"
                    />
                    <button
                      className={btnClass ? btnClass : 'it-btn-white sky-bg'}
                    >
                      <span>SUBSCRIBE NOW</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="it-copyright-area it-copyright-height">
        <div className="container">
          <div className="row">
            <div
              className="col-12 wow animate__fadeInUp"
              data-wow-duration=".9s"
              data-wow-delay=".3s"
            >
              <div
                className={
                  copyrightTextClass
                    ? copyrightTextClass
                    : 'it-copyright-text style-2 text-center'
                }
              >
                <p>
                  Copyright &copy; 2024 <a href="#">edunity </a> || All Rights
                  Reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default FooterTwo;
