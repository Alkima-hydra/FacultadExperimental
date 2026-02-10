import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuItems from './MenuItems';
import MenuItemsOnePage from './MenuItemsOnePage';
import RightArrow from '../SVG';
import OffCanvasInsta from '../OffCanvas';

import svgImg1 from '../../assets/img/header/4.svg';
import svgImg2 from '../../assets/img/header/5.svg';
import Logo from '../../assets/img/logo/logo-black-2.png';
import LogoWhite from '../../assets/img/logo/logo-white-2.png';

const HeaderTwo = (props) => {
  const { headerClass, headerLogo, onePage, parentMenu } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

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
      <div
        className={
          isPopUpOpen ? 'search__popup search-opened' : 'search__popup'
        }
      >
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="search__wrapper">
                <div className="search__top d-flex justify-content-between align-items-center">
                  <div className="search__logo">
                    <Link to="/">
                      <img src={LogoWhite} alt="" />
                    </Link>
                  </div>
                  <div className="search__close">
                    <button
                      type="button"
                      className="search__close-btn search-close-btn"
                      onClick={() => setIsPopUpOpen(false)}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17 1L1 17"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 1L17 17"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="search__form">
                  <form action="#">
                    <div className="search__input">
                      <input
                        className="search-input-field"
                        type="text"
                        placeholder="Type here to search..."
                      />
                      <span className="search-focus-border"></span>
                      <button type="submit">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.55 18.1C14.272 18.1 18.1 14.272 18.1 9.55C18.1 4.82797 14.272 1 9.55 1C4.82797 1 1 4.82797 1 9.55C1 14.272 4.82797 18.1 9.55 18.1Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.0002 19.0002L17.2002 17.2002"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header
        className={
          headerClass ? headerClass : 'it-header-height ed-header-transparent'
        }
      >
        <div className="ed-header-top-area ed-header-top-height ed-header-top-style-2 black-bg-2">
          <div className="container">
            <div className="row">
              <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-8">
                <div className="ed-header-top-left text-center  text-md-start">
                  <ul>
                    <li>
                      <i>
                        <img src={svgImg1} alt="" />
                      </i>
                      <a href="#">Working : Monday -Friday.9:am - 5:Pm </a>
                    </li>
                    <li className="d-none d-xl-inline-block">
                      <i>
                        <img src={svgImg2} alt="" />
                      </i>
                      <a
                        target="_blank"
                        href="https://www.google.com/maps/@24.0161372,45.4773,7.67z?entry=ttu"
                      >
                        Hudson, Wisconsin(WI), 54016
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 d-none d-md-block">
                <div className="ed-header-top-social-box d-flex align-content-center justify-content-end">
                  <div className="ed-header-top-login d-none d-lg-block">
                    <Link to="/signin">
                      <i className="fa-solid fa-user"></i>
                      Login/ Register
                    </Link>
                  </div>
                  <div className="ed-header-top-social">
                    <a href="#">
                      <svg
                        width="8"
                        height="15"
                        viewBox="0 0 8 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.05618 15V8.1583H7.35173L7.69613 5.49117H5.05618V3.7886C5.05618 3.01665 5.26966 2.49057 6.37789 2.49057L7.78905 2.48999V0.104422C7.54501 0.072709 6.70731 0 5.73231 0C3.69636 0 2.30252 1.24272 2.30252 3.52445V5.49117H0V8.1583H2.30252V15H5.05618Z"
                          fill="currentcolor"
                        />
                      </svg>
                    </a>
                    <a href="#">
                      <i className="fa-brands fa-twitter"></i>
                    </a>
                    <a href="#">
                      <i className="fa-brands fa-skype"></i>
                    </a>
                    <a href="#">
                      <i className="fa-brands fa-linkedin"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="header-sticky"
          className={
            isVisible
              ? 'ed-header-2-area ed-header-ptb header-sticky'
              : 'ed-header-2-area ed-header-ptb'
          }
        >
          <div className="container">
            <div className="ed-header-wrapper p-relative">
              <div className="row align-items-center">
                <div className="col-xxl-3 col-xl-2 col-lg-6 col-6">
                  <div className="ed-header-2-logo">
                    <Link to="/">
                      <img src={headerLogo ? headerLogo : Logo} alt="" />
                    </Link>
                  </div>
                </div>
                <div className="col-xxl-6 col-xl-6 d-none d-xl-block">
                  <div className="ed-header-2-main-menu it-main-menu">
                    <nav className="it-menu-content">
                      {!onePage ? (
                        <MenuItems />
                      ) : (
                        <MenuItemsOnePage
                          parentMenu={parentMenu}
                          onePageStyle="onePage2"
                        />
                      )}
                    </nav>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-4 col-lg-6 col-6">
                  <div className="ed-header-2-right d-flex align-items-center justify-content-end">
                    <div className="ed-header-2-bar d-xl-none">
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
                    <div className="ed-header-2-search d-none d-lg-block">
                      <button
                        className="search-open-btn ml-25"
                        onClick={() => setIsPopUpOpen(true)}
                      >
                        <svg
                          width="21"
                          height="21"
                          viewBox="0 0 21 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.8 14.934L20.895 19.008C20.965 19.078 21 19.169 21 19.281C21 19.393 20.965 19.484 20.895 19.554L19.551 20.898C19.481 20.968 19.39 21.003 19.278 21.003C19.166 21.003 19.075 20.968 19.005 20.898L18.627 20.499L18.438 20.331C18.34 20.247 18.284 20.198 18.27 20.184L14.952 16.866C14.882 16.782 14.784 16.74 14.658 16.74C14.546 16.726 14.448 16.754 14.364 16.824C13.608 17.356 12.789 17.769 11.907 18.063C10.997 18.357 10.066 18.504 9.114 18.504C7.462 18.504 5.929 18.091 4.515 17.265C3.143 16.453 2.051 15.361 1.239 13.989C0.413 12.575 0 11.042 0 9.39C0 7.738 0.413 6.205 1.239 4.791C2.051 3.419 3.143 2.327 4.515 1.515C5.929 0.688999 7.462 0.275999 9.114 0.275999C10.766 0.275999 12.292 0.688999 13.692 1.515C15.064 2.327 16.156 3.419 16.968 4.791C17.794 6.205 18.207 7.738 18.207 9.39C18.207 11.182 17.724 12.827 16.758 14.325C16.702 14.423 16.674 14.528 16.674 14.64C16.688 14.752 16.73 14.85 16.8 14.934ZM14.616 13.632C15.078 13.03 15.435 12.372 15.687 11.658C15.939 10.93 16.065 10.174 16.065 9.39C16.065 8.13 15.75 6.961 15.12 5.883C14.504 4.819 13.671 3.979 12.621 3.363C11.543 2.733 10.374 2.418 9.114 2.418C7.854 2.418 6.685 2.733 5.607 3.363C4.543 3.979 3.703 4.819 3.087 5.883C2.457 6.961 2.142 8.13 2.142 9.39C2.142 10.65 2.457 11.819 3.087 12.897C3.703 13.961 4.543 14.801 5.607 15.417C6.685 16.047 7.854 16.362 9.114 16.362C9.954 16.362 10.759 16.222 11.529 15.942C12.299 15.648 12.992 15.235 13.608 14.703C13.986 14.381 14.322 14.024 14.616 13.632Z"
                            fill="#17254E"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="ed-header-button text-end d-none d-lg-block">
                      <Link className="ed-btn-theme theme-2" to="/contact">
                        Contact us
                        <i>
                          <RightArrow />
                        </i>
                      </Link>
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
                onePageStyle="onePage2"
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
export default HeaderTwo;
