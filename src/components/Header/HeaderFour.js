import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuItems from './MenuItems';
import MenuItemsOnePage from './MenuItemsOnePage';
import OffCanvasInsta from '../OffCanvas';

import LogoWhite from '../../assets/img/logo/logo-white-2.png';
import Logo from '../../assets/img/logo/logo-black-3.png';

const HeaderFour = (props) => {
  const { headerClass, headerLogo, onePage, parentMenu } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

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

      <header className={headerClass ? headerClass : 'it-header-height'}>
        <div className="ed-header-4-top-area theme-bg-5">
          <div className="container container-3">
            <div className="row align-items-center">
              <div className="col-xl-8 col-lg-6 col-md-6">
                <div className="ed-header-top-left">
                  <ul className="text-center text-sm-start">
                    <li className="d-none d-xl-inline-block">
                      <a className="hover-anim" href="#">
                        <span>
                          <i className="fal fa-clock"></i>
                        </span>
                        Working : Monday -Friday.9:am - 5:Pm
                      </a>
                    </li>
                    <li>
                      <a
                        className="hover-anim"
                        target="_blank"
                        href="https://www.google.com/maps/@24.0161372,45.4773,7.67z?entry=ttup"
                      >
                        <span>
                          <i className="fal fa-map-marker-alt"></i>
                        </span>
                        Hudson, Wisconsin(WI), 54016
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 d-none d-md-block">
                <div className="ed-header-4-top-right-wrap text-end">
                  <div className="ed-header-4-top-right">
                    <ul>
                      <li>
                        <div
                          id="ed-header-4-lang"
                          className={
                            isLanguageOpen
                              ? 'ed-header-4-lang d-none d-sm-block open'
                              : 'ed-header-4-lang d-none d-sm-block'
                          }
                        >
                          <ul>
                            <li>
                              <a
                                href="javascript:void(0)"
                                onClick={() =>
                                  setIsLanguageOpen(!isLanguageOpen)
                                }
                              >
                                <img
                                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAVNQTFRFAAAAqqqq2yQk3yAg3d3d3xAw////IDBoKDB4Jy58JDJtJDBsKDB4KDR4TEh4KjVxmXidd2eLhomzkpaxOkJ4h4y1j5WvV2CYml2Db3anNT+CS1OFh4qqaXCh20lR7GZ33nd93Vxj8IWT9Kix4nuG9aix73GB4YKM4Z+i7m5+lWiPzUBKzkBL3UtVil+KLDVxMTqAkJSw1x8o5B008HeE3nyB73SERkd6aViAd32rjnKakI2qxKe8yMrc5h435y5EjXme5iU96TpP6kJW7Fdp8YaT1x8o2TY+4F9o5R015zdM////JS9sKTN6Pkh9Pkh+QUqCQkqDUVmTX2abbXSaeX+shouqhoy1qq3I1x8o2kRM2x4r3Wpv4Zyf4x005R015tvb5ytC56Ck5+fn6Uda6urq7nKB73KB74uX8ICN8YyY8o6a8vL39aqz9quz/fHy////FdmZ/AAAAEx0Uk5TAAMHCA8QECAgJzhAQECKjIyNjY+QkJCSkpOZn5+gx8rMz8/P0NDZ3d/f8PT09Pb4+Pj4+Pn6+vv7+/v7+/v7+/z8/Pz8/P7+/v7+/v/y6qoAAADXSURBVBjTY2AAAh5Jtfg4FWl2BghgE/cNNouPz/LzEWQG8VmVc4JAAtmBFu4KLEABCcfcnHCQgIO7abIwAwOnr55jbgFQIN3LNDnMh5tBysBAyzEXKBDvmmqor8/PoJqXl2cS7xQf75yXFBsbq8EQjwDRkZGRRugCbgyaaSCQCOTbecTExCgyiIaG2hZkA/mZKbrWISEyDLy+lt7Z9i5Ad+RHaZv7AJ0vBOTbgBwWkRClwwfyipK9FdjpAWEJcmDPMQmAPZfh7yPGCPUvh6y8p7G6CBeIDQCHLz7jeLHZSAAAAABJRU5ErkJggg=="
                                  alt=""
                                  className="pe-1"
                                />
                                English
                                <span>
                                  <svg
                                    width="9"
                                    height="7"
                                    viewBox="0 0 9 7"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.47035e-08 2.145L1.275 0.854999L4.5 4.08L7.725 0.854999L9 2.145L4.5 6.645L4.47035e-08 2.145Z"
                                      fill="currentcolor"
                                    />
                                  </svg>
                                </span>
                              </a>
                              <ul className="ed-header-4-lang-submenu">
                                <li>
                                  <a href="#">Arabic</a>
                                </li>
                                <li>
                                  <a href="#">Spanish</a>
                                </li>
                                <li>
                                  <a href="#">Mandarin</a>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <div className="ed-header-4-top-social">
                          <a href="#">
                            <i className="fab fa-facebook-f"></i>
                          </a>
                          <a href="#">
                            <i className="fab fa-twitter"></i>
                          </a>
                          <a href="#">
                            <i className="fab fa-skype"></i>
                          </a>
                          <a href="#">
                            <i className="fab fa-linkedin"></i>
                          </a>
                        </div>
                      </li>
                    </ul>
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
              ? 'ed-header-4-area ed-header-ptb header-sticky'
              : 'ed-header-4-area ed-header-ptb'
          }
        >
          <div className="container container-3">
            <div className="ed-header-4-wrap p-relative">
              <div className="row align-items-center">
                <div className="col-xl-2 col-lg-6 col-md-6 col-6">
                  <div className="ed-header-4-logo">
                    <Link to="/">
                      <img src={headerLogo ? headerLogo : Logo} alt="" />
                    </Link>
                  </div>
                </div>
                <div className="col-xl-7 d-none d-xl-block">
                  <div className="ed-header-5-main-menu it-main-menu">
                    <nav className="it-menu-content">
                      {!onePage ? (
                        <MenuItems />
                      ) : (
                        <MenuItemsOnePage
                          parentMenu={parentMenu}
                          onePageStyle="onePage4"
                        />
                      )}
                    </nav>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6 col-md-6 col-6">
                  <div className="ed-header-5-right d-flex align-items-center justify-content-end">
                    <div className="ed-header-5-search d-none d-lg-block">
                      <button
                        className="search-open-btn"
                        onClick={() => setIsPopUpOpen(true)}
                      >
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 25 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M24.7628 23.6399L18.3082 17.2884C19.9984 15.452 21.037 13.0234 21.037 10.3509C21.0362 4.63387 16.3273 0 10.5181 0C4.70891 0 0 4.63387 0 10.3509C0 16.0678 4.70891 20.7017 10.5181 20.7017C13.0281 20.7017 15.3301 19.8335 17.1384 18.3902L23.618 24.7667C23.9338 25.0777 24.4463 25.0777 24.7621 24.7667C25.0785 24.4557 25.0785 23.9509 24.7628 23.6399ZM10.5181 19.1092C5.60289 19.1092 1.61836 15.1879 1.61836 10.3509C1.61836 5.51376 5.60289 1.59254 10.5181 1.59254C15.4333 1.59254 19.4178 5.51376 19.4178 10.3509C19.4178 15.1879 15.4333 19.1092 10.5181 19.1092Z"
                            fill="#0E2A46"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="ed-header-4-user d-none d-lg-block">
                      <Link to="/signin">
                        <i className="fa-solid fa-user"></i>
                      </Link>
                    </div>
                    <div className="ed-header-4-button d-none d-md-block">
                      <Link className="ed-btn-radius" to="/contact">
                        Contact
                      </Link>
                    </div>
                    <div className="ed-header-5-button d-xl-none">
                      <button
                        className="it-menu-bar ml-25"
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
                onePageStyle="onePage4"
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
export default HeaderFour;
