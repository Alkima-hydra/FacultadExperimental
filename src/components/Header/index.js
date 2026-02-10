import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuItems from './MenuItems';
import MenuItemsOnePage from './MenuItemsOnePage';
import RightArrow from '../SVG';
import OffCanvasInsta from '../OffCanvas';

import Logo from '../../assets/img/logo/logo-gatobyte.png';
import svgImg1 from '../../assets/img/header/1.svg';
import svgImg2 from '../../assets/img/header/2.svg';
import svgImg3 from '../../assets/img/header/3.svg';

const Header = (props) => {
  const { headerClass, headerLogo, onePage, parentMenu } = props;
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sticky Header is displayed after scrolling for 400 pixels
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      <header className={headerClass ? headerClass : 'it-header-height'}>
          

        <div
          id="header-sticky"
          className={
            isVisible
              ? 'ed-header-area ed-header-ptb header-sticky'
              : 'ed-header-area ed-header-ptb'
          }
        >
          <div className="container">
            <div className="ed-header-wrapper p-relative">
              <div className="row align-items-center">
                <div className="col-xxl-3 col-xl-2 col-lg-3 col-lg-6 col-md-6 col-6 col-sm-4">
                  <div className="ed-header-logo">
                    <Link to="/">
                      <img src={headerLogo ? headerLogo : Logo} alt="" />
                    </Link>
                  </div>
                </div>
                <div className="col-xxl-6 col-xl-7 col-lg-6 d-none d-xl-block">
                  <div className="ed-header-main-menu it-main-menu">
                    <nav className="it-menu-content">
                      {!onePage ? (
                        <MenuItems />
                      ) : (
                        <MenuItemsOnePage
                          parentMenu={parentMenu}
                          onePageStyle="onePage1"
                        />
                      )}
                    </nav>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-lg-6 col-md-6 col-6 col-sm-8">
                  <div className="ed-header-button d-flex justify-content-end align-items-center">
                    <div className="d-none d-md-block">
                      <a className="ed-btn-theme" href="signin">
                        Iniciar Sesión
                        <i>
                          <RightArrow />
                        </i>
                      </a>
                    </div>
                    <div className="ed-header-5-bar ml-25 d-xl-none">
                      <button
                        className="it-menu-bar"
                        onClick={() => setIsOffCanvasOpen(true)}
                      >
                        <svg
                          width="24"
                          height="20"
                          viewBox="0 0 24 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M10 18.3333C10 17.4128 10.7462 16.6667 11.6667 16.6667H21.6667C22.5872 16.6667 23.3333 17.4128 23.3333 18.3333C23.3333 19.2538 22.5872 20 21.6667 20H11.6667C10.7462 20 10 19.2538 10 18.3333ZM0 1.66667C0 0.746183 0.746183 0 1.66667 0H21.6667C22.5872 0 23.3333 0.746183 23.3333 1.66667C23.3333 2.58713 22.5872 3.33333 21.6667 3.33333H1.66667C0.746183 3.33333 0 2.58713 0 1.66667ZM0 10C0 9.07953 0.746183 8.33333 1.66667 8.33333H21.6667C22.5872 8.33333 23.3333 9.07953 23.3333 10C23.3333 10.9205 22.5872 11.6667 21.6667 11.6667H1.66667C0.746183 11.6667 0 10.9205 0 10Z"
                            fill="#0E2A46"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="it-offcanvas-area">
        <div className={isOffCanvasOpen ? 'itoffcanvas opened' : 'itoffcanvas'}>
          <div className="it-offcanva-bottom-shape d-none d-xxl-block"></div>
          <div className="itoffcanvas__close-btn">
            <button
              className="close-btn"
              onClick={() => setIsOffCanvasOpen(false)}
            >
              <i className="fal fa-times"></i>
            </button>
          </div>
          <div className="itoffcanvas__logo">
            <Link to="/">
              <img src={Logo} alt="" />
            </Link>
          </div>
          <div className="itoffcanvas__text">
            <p>
              Suspendisse interdum consectetur libero id. Fermentum leo vel orci
              porta non. Euismod viverra nibh cras pulvinar suspen.
            </p>
          </div>
          <div className="it-menu-mobile d-xl-none">
            {!onePage ? (
              <MenuItems mobileMenu="show" />
            ) : (
              <MenuItemsOnePage
                parentMenu={parentMenu}
                onePageStyle="onePage1"
                mobileMenu="show"
              />
            )}
          </div>
          <div className="itoffcanvas__info">
            <h3 className="offcanva-title">Get In Touch</h3>
            <div className="it-info-wrapper mb-20 d-flex align-items-center">
              <div className="itoffcanvas__info-icon">
                <a href="#">
                  <i className="fal fa-envelope"></i>
                </a>
              </div>
              <div className="itoffcanvas__info-address">
                <span>Email</span>
                <a href="maito:hello@yourmail.com">hello@yourmail.com</a>
              </div>
            </div>
            <div className="it-info-wrapper mb-20 d-flex align-items-center">
              <div className="itoffcanvas__info-icon">
                <a href="#">
                  <i className="fal fa-phone-alt"></i>
                </a>
              </div>
              <div className="itoffcanvas__info-address">
                <span>Phone</span>
                <a href="tel:(00)45611227890">(00) 456 1122 7890</a>
              </div>
            </div>
            <div className="it-info-wrapper mb-20 d-flex align-items-center">
              <div className="itoffcanvas__info-icon">
                <a href="#">
                  <i className="fas fa-map-marker-alt"></i>
                </a>
              </div>
              <div className="itoffcanvas__info-address">
                <span>Location</span>
                <a
                  href="htits://www.google.com/maps/@37.4801311,22.8928877,3z"
                  target="_blank"
                >
                  Riverside 255, San Francisco.
                </a>
              </div>
            </div>
          </div>
          <OffCanvasInsta />
        </div>
      </div>

      {isOffCanvasOpen ? (
        <div
          className="body-overlay apply"
          onClick={() => setIsOffCanvasOpen(false)}
        ></div>
      ) : (
        <div className="body-overlay"></div>
      )}
    </>
  );
};
export default Header;
