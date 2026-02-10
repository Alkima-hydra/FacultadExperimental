import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuItems from './MenuItems';
import MenuItemsOnePage from './MenuItemsOnePage';
import OffCanvasInsta from '../OffCanvas';

import LogoWhite from '../../assets/img/logo/logo-white-2.png';
import Logo from '../../assets/img/logo/logo-black.png';
import phoneSVG from '../../assets/img/footer/1.svg';
import mailSVG from '../../assets/img/footer/2.svg';

const HeaderFive = (props) => {
  const { headerClass, headerLogo, onePage, parentMenu } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Sticky Header is displayed after scrolling for 400 pixels
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
        <div className="ed-header-top-5-area ed-header-top-5-bg fix">
          <div className="container container-2">
            <div className="row">
              <div className="col-xl-2 d-none d-xl-block">
                <div className="ed-header-top-5-social">
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
                    <svg
                      width="14"
                      height="13"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_5_1002)">
                        <path
                          d="M10.2701 0H4.30804C2.36764 0 0.789062 1.57858 0.789062 3.51898V9.4811C0.789062 11.4214 2.36764 13 4.30804 13H10.2702C12.2105 13 13.789 11.4214 13.789 9.4811V3.51898C13.789 1.57858 12.2105 0 10.2701 0ZM13.0269 9.4811C13.0269 11.0012 11.7902 12.2379 10.2701 12.2379H4.30804C2.78788 12.2379 1.55118 11.0012 1.55118 9.4811V3.51898C1.55118 1.99881 2.78788 0.762114 4.30804 0.762114H10.2702C11.7902 0.762114 13.0269 1.99881 13.0269 3.51898V9.4811Z"
                          fill="currentcolor"
                        />
                        <path
                          d="M7.28896 2.94531C5.32892 2.94531 3.73438 4.53986 3.73438 6.49989C3.73438 8.45993 5.32892 10.0545 7.28896 10.0545C9.24899 10.0545 10.8435 8.45993 10.8435 6.49989C10.8435 4.53986 9.24899 2.94531 7.28896 2.94531ZM7.28896 9.29236C5.74926 9.29236 4.49649 8.03969 4.49649 6.49989C4.49649 4.96019 5.74926 3.70743 7.28896 3.70743C8.82876 3.70743 10.0814 4.96019 10.0814 6.49989C10.0814 8.03969 8.82876 9.29236 7.28896 9.29236Z"
                          fill="currentcolor"
                        />
                        <path
                          d="M10.9288 1.68262C10.3495 1.68262 9.87842 2.15383 9.87842 2.73295C9.87842 3.31218 10.3495 3.78339 10.9288 3.78339C11.508 3.78339 11.9792 3.31218 11.9792 2.73295C11.9792 2.15373 11.508 1.68262 10.9288 1.68262ZM10.9288 3.02118C10.7699 3.02118 10.6405 2.89184 10.6405 2.73295C10.6405 2.57397 10.7699 2.44473 10.9288 2.44473C11.0877 2.44473 11.2171 2.57397 11.2171 2.73295C11.2171 2.89184 11.0877 3.02118 10.9288 3.02118Z"
                          fill="currentcolor"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_5_1002">
                          <rect
                            width="13"
                            height="13"
                            fill="white"
                            transform="translate(0.789062)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                  <a href="#">
                    <svg
                      width="14"
                      height="13"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.57381 0C2.08907 0 1.64838 0.17628 1.31788 0.506788C0.965342 0.859321 0.789062 1.29998 0.789062 1.76269C0.789062 2.24743 0.987367 2.68812 1.31788 3.01862C1.64838 3.34913 2.1111 3.54744 2.55178 3.52541C2.55178 3.52541 2.57381 3.52541 2.59586 3.52541C3.03654 3.52541 3.45518 3.34913 3.78569 3.01862C4.1162 2.68812 4.3145 2.24743 4.3145 1.76269C4.33653 1.29998 4.13822 0.859296 3.80771 0.528787C3.4772 0.176254 3.03652 0 2.57381 0ZM3.47721 2.71017C3.23482 2.95255 2.90432 3.10678 2.55178 3.08475C2.22127 3.08475 1.86874 2.95255 1.62636 2.71017C1.36195 2.46779 1.22975 2.11525 1.22975 1.76272C1.22975 1.41019 1.36195 1.07968 1.62636 0.815271C1.86874 0.57289 2.19925 0.440686 2.57381 0.440686C2.90432 0.440686 3.23482 0.57289 3.47721 0.815271C3.74161 1.07968 3.87381 1.41019 3.87381 1.76272C3.87381 2.11525 3.74161 2.46779 3.47721 2.71017Z"
                        fill="currentcolor"
                      />
                      <path
                        d="M3.4335 3.96582H1.64876C1.29622 3.96582 1.00977 4.25225 1.00977 4.62684V12.3387C1.00977 12.6912 1.31825 12.9997 1.67078 12.9997H3.4335C3.78604 12.9997 4.09452 12.6912 4.09452 12.3607V4.62684C4.09452 4.27428 3.78604 3.96582 3.4335 3.96582ZM3.65383 12.3607C3.65383 12.4709 3.54365 12.559 3.4335 12.559H1.67078C1.5606 12.559 1.45045 12.4489 1.45045 12.3387V4.62684C1.45045 4.51666 1.53858 4.40651 1.64876 4.40651H3.4335C3.54368 4.40651 3.65383 4.51668 3.65383 4.62684V12.3607Z"
                        fill="currentcolor"
                      />
                      <path
                        d="M10.9247 3.74609H10.462C9.60264 3.74609 8.78739 4.12068 8.25858 4.71559V4.40711C8.25858 4.18678 8.03825 3.96642 7.81789 3.96642H5.61451C5.41621 3.96642 5.17383 4.1427 5.17383 4.38506V12.6037C5.17383 12.8461 5.41621 13.0003 5.61451 13.0003H8.03825C8.23656 13.0003 8.47894 12.8461 8.47894 12.6037V7.84437C8.47894 7.11725 9.00775 6.54436 9.69079 6.54436C10.0433 6.54436 10.3738 6.67657 10.6162 6.91895C10.8365 7.11725 10.9247 7.42574 10.9247 7.82235V12.5596C10.9247 12.78 11.145 13.0003 11.3654 13.0003H13.5688C13.7891 13.0003 14.0094 12.78 14.0094 12.5596V6.8749C14.0094 5.1122 12.6654 3.74609 10.9247 3.74609ZM13.5687 12.5376L13.5467 12.5596H11.3874L11.3654 7.82237C11.3654 7.29356 11.2332 6.89695 10.9467 6.61052C10.6162 6.28001 10.1755 6.10373 9.71282 6.10373C8.78739 6.12575 8.06028 6.87492 8.06028 7.8444V12.5596H5.63654V4.40711H7.81789L7.83992 4.42914V5.81727L8.43483 5.22236L8.45686 5.20033C8.89755 4.58339 9.66872 4.18678 10.484 4.18678H10.9467C12.423 4.18678 13.5687 5.37661 13.5687 6.87492V12.5376Z"
                        fill="currentcolor"
                      />
                    </svg>
                  </a>
                  <a href="#">
                    <svg
                      width="13"
                      height="10"
                      viewBox="0 0 13 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.51017 4.34197L5.63818 2.77054C5.47304 2.68019 5.27785 2.68356 5.11599 2.77947C4.95402 2.87547 4.85742 3.04507 4.85742 3.23332V6.3492C4.85742 6.53656 4.95343 6.70586 5.1143 6.80196C5.19831 6.85215 5.29144 6.87734 5.38477 6.87734C5.47026 6.87734 5.55596 6.85622 5.63481 6.81377L8.5069 5.26941C8.67739 5.17767 8.78381 5.00043 8.78461 4.80673C8.7853 4.61303 8.68017 4.435 8.51017 4.34197ZM5.61923 5.95724V3.62846L7.76572 4.80296L5.61923 5.95724Z"
                        fill="currentcolor"
                      />
                      <path
                        d="M12.9136 2.32392L12.913 2.31797C12.902 2.21333 12.7924 1.28261 12.3399 0.809221C11.8169 0.252417 11.224 0.184775 10.9389 0.152343C10.9153 0.149665 10.8936 0.147185 10.8743 0.144606L10.8516 0.142226C9.13297 0.0172576 6.53749 0.000198363 6.51151 9.91814e-05L6.50923 0L6.50695 9.91814e-05C6.48096 0.000198363 3.88548 0.0172576 2.1514 0.142226L2.12849 0.144606C2.11004 0.147086 2.08971 0.149367 2.06759 0.151946C1.78571 0.184477 1.19916 0.252218 0.674685 0.829156C0.243742 1.29749 0.11917 2.20827 0.106376 2.31063L0.104888 2.32392C0.10102 2.36746 0.00927734 3.404 0.00927734 4.44461V5.41739C0.00927734 6.458 0.10102 7.49454 0.104888 7.53818L0.105582 7.54473C0.116592 7.64768 0.226088 8.56134 0.67647 9.03493C1.16821 9.57308 1.78998 9.6443 2.12442 9.68258C2.17728 9.68863 2.22281 9.69379 2.25385 9.69924L2.2839 9.70341C3.27621 9.79783 6.38743 9.84435 6.51934 9.84623L6.52331 9.84633L6.52728 9.84623C6.55326 9.84613 9.14864 9.82907 10.8673 9.7041L10.89 9.70172C10.9117 9.69885 10.9361 9.69627 10.9629 9.69349C11.2432 9.66374 11.8265 9.60195 12.3438 9.03284C12.7747 8.56441 12.8994 7.65363 12.9121 7.55137L12.9136 7.53808C12.9174 7.49444 13.0093 6.458 13.0093 5.41739V4.44461C13.0092 3.404 12.9174 2.36756 12.9136 2.32392ZM12.2474 5.41739C12.2474 6.38054 12.1633 7.37245 12.1553 7.4635C12.123 7.71433 11.9916 8.29057 11.7816 8.51879C11.4579 8.87495 11.1253 8.91026 10.8825 8.93594C10.8532 8.93902 10.826 8.94199 10.8014 8.94507C9.13912 9.06528 6.64163 9.08372 6.52658 9.08442C6.39755 9.08253 3.33185 9.03562 2.36979 8.94626C2.3205 8.93822 2.26724 8.93208 2.2111 8.92573C1.92635 8.8931 1.53657 8.84847 1.23685 8.51879L1.2298 8.51125C1.02351 8.29632 0.89586 7.75747 0.863427 7.46647C0.857377 7.39764 0.771089 6.39402 0.771089 5.41739V4.44461C0.771089 3.48256 0.854997 2.49173 0.86313 2.3988C0.901711 2.10334 1.03561 1.56201 1.23685 1.34321C1.57049 0.976242 1.92229 0.935578 2.15497 0.9087C2.17718 0.906121 2.19791 0.903741 2.21705 0.901261C3.90353 0.780458 6.41897 0.762506 6.50923 0.761812C6.59948 0.762407 9.11403 0.780458 10.7855 0.901261C10.8061 0.90384 10.8285 0.906419 10.8526 0.909196C11.0919 0.936471 11.4536 0.97773 11.7856 1.33181L11.7887 1.33508C11.9949 1.55001 12.1226 2.09828 12.155 2.39513C12.1608 2.46009 12.2474 3.46589 12.2474 4.44461V5.41739Z"
                        fill="currentcolor"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3">
                <div className="ed-header-top-5-contact text-center text-sm-start">
                  <ul>
                    <li className="d-none d-xxl-inline-block">
                      <i>
                        <img src={phoneSVG} alt="" />
                      </i>
                      <a href="tel:(00)8757845682">(00) 875 784 5682</a>
                    </li>
                    <li>
                      <i>
                        <img src={mailSVG} alt="" />
                      </i>
                      <a href="mailto:pacargoinfo@gmail.com">
                        pacargoinfo@gmail.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-6 col-lg-8 col-md-8 d-none d-sm-block col-sm-9">
                <div className="ed-header-top-5-right text-end">
                  <ul>
                    <li>
                      <a href="#">Portal</a>
                    </li>
                    <li className="d-none d-lg-inline-block">
                      <a href="#">Calendar</a>
                    </li>
                    <li className="d-none d-md-inline-block">
                      <a href="#">Alumni</a>
                    </li>
                    <li className="d-none d-md-inline-block">
                      <a href="#">Events</a>
                    </li>
                    <li>
                      <a href="#">Contact us</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="header-sticky"
          className={
            isVisible
              ? 'ed-header-5-area ed-header-ptb header-sticky'
              : 'ed-header-5-area ed-header-ptb'
          }
        >
          <div className="container container-2">
            <div className="ed-header-5-wrapper p-relative">
              <div className="row align-items-center">
                <div className="col-xl-2 col-lg-6 col-md-6 col-6">
                  <div className="ed-header-5-logo">
                    <Link to="/">
                      <img src={headerLogo ? headerLogo : Logo} alt="" />
                    </Link>
                  </div>
                </div>
                <div className="col-xl-9 d-none d-xl-block">
                  <div className="ed-header-5-main-menu it-main-menu text-end">
                    <nav className="it-menu-content">
                      {!onePage ? (
                        <MenuItems />
                      ) : (
                        <MenuItemsOnePage
                          parentMenu={parentMenu}
                          onePageStyle="onePage5"
                        />
                      )}
                    </nav>
                  </div>
                </div>
                <div className="col-xl-1 col-lg-6 col-md-6 col-6">
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
                    <div className="ed-header-5-button">
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
                onePageStyle="onePage5"
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
export default HeaderFive;
