import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import homeImg1 from '../../assets/img/menu/home-1.jpg';
import homeImg2 from '../../assets/img/menu/home-2.jpg';
import homeImg3 from '../../assets/img/menu/home-3.jpg';
import homeImg4 from '../../assets/img/menu/home-4.jpg';
import homeImg5 from '../../assets/img/menu/home-5.jpg';

const MenuItemsOnePage = (props) => {
  const { parentMenu, onePageStyle, mobileMenu } = props;
  const [home, setHome] = useState(false);
  const [isActive, setIsActive] = useState(parentMenu);

  const openMobileMenu = (menu) => {
    if (menu === 'home') {
      setHome(!home);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsActive(id);
  };

  const handleClick = (e) => {
    if (!mobileMenu) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      e.preventDefault();
    }
  };

  const onePageHomeMenu = (
    <li
      className={
        isActive === 'home'
          ? 'has-dropdown p-static active'
          : 'has-dropdown p-static'
      }
    >
      <Link
        to="#"
        className={`${home ? 'expanded' : ''}`}
        onClick={handleClick}
      >
        <span>Home</span>
        <button
          className={`${
            home ? 'dropdown-toggle-btn dropdown-opened' : 'dropdown-toggle-btn'
          } d-xl-none `}
          onClick={() => {
            openMobileMenu('home');
          }}
        >
          <i className="fal fa-angle-right"></i>
        </button>
      </Link>
      <div
        className={
          home
            ? 'it-submenu submenu has-home-img d-block'
            : 'it-submenu submenu has-home-img'
        }
      >
        <div className="row gx-6 row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-5">
          <div className="col home-img">
            <div className="home-img-thumb mb-15">
              <img src={homeImg1} alt="" />
              <div className="home-img-btn">
                <Link className="it-btn-white-sm" to="/">
                  Multi Page
                </Link>
                <Link
                  className="it-btn-white-sm"
                  to="/home-one-page"
                  onClick={() => setIsActive('home')}
                >
                  One Page
                </Link>
              </div>
            </div>
            <div className="home-img-content text-center">
              <h4 className="home-img-title">
                <Link to="/">Home 01</Link>
              </h4>
            </div>
          </div>
          <div className="col home-img">
            <div className="home-img-thumb mb-15">
              <img src={homeImg2} alt="" />
              <div className="home-img-btn">
                <Link className="it-btn-white-sm" to="/home-2">
                  Multi Page
                </Link>
                <Link
                  className="it-btn-white-sm"
                  to="/home-2-one-page"
                  onClick={() => setIsActive('home')}
                >
                  One Page
                </Link>
              </div>
            </div>
            <div className="home-img-content text-center">
              <h4 className="home-img-title">
                <Link to="/home-2">Home 02</Link>
              </h4>
            </div>
          </div>
          <div className="col home-img">
            <div className="home-img-thumb mb-15">
              <img src={homeImg3} alt="" />
              <div className="home-img-btn">
                <Link className="it-btn-white-sm" to="/home-3">
                  Multi Page
                </Link>
                <Link
                  className="it-btn-white-sm"
                  to="/home-3-one-page"
                  onClick={() => setIsActive('home')}
                >
                  One Page
                </Link>
              </div>
            </div>
            <div className="home-img-content text-center">
              <h4 className="home-img-title">
                <Link to="/home-3">Home 03</Link>
              </h4>
            </div>
          </div>
          <div className="col home-img">
            <div className="home-img-thumb mb-15">
              <img src={homeImg4} alt="" />
              <div className="home-img-btn">
                <Link className="it-btn-white-sm" to="/home-4">
                  Multi Page
                </Link>
                <Link
                  className="it-btn-white-sm"
                  to="/home-4-one-page"
                  onClick={() => setIsActive('home')}
                >
                  One Page
                </Link>
              </div>
            </div>
            <div className="home-img-content text-center">
              <h4 className="home-img-title">
                <Link to="/home-4">Home 04</Link>
              </h4>
            </div>
          </div>
          <div className="col home-img">
            <div className="home-img-thumb mb-15">
              <img src={homeImg5} alt="" />
              <div className="home-img-btn">
                <Link className="it-btn-white-sm" to="/home-5">
                  Multi Page
                </Link>
                <Link
                  className="it-btn-white-sm"
                  to="/home-5-one-page"
                  onClick={() => setIsActive('home')}
                >
                  One Page
                </Link>
              </div>
            </div>
            <div className="home-img-content text-center">
              <h4 className="home-img-title">
                <Link to="/home-5">Home 05</Link>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </li>
  );

  return (
    <>
      {onePageStyle === 'onePage1' ? (
        <ul className="onepage-menu">
          {onePageHomeMenu}
          <li className={isActive === 'it-course' ? 'active' : ''}>
            <Link to="#it-course" onClick={() => scrollToSection('it-course')}>
              <span>Courses</span>
            </Link>
          </li>
          <li className={isActive === 'it-about' ? 'active' : ''}>
            <Link to="#it-course" onClick={() => scrollToSection('it-about')}>
              <span>About us</span>
            </Link>
          </li>
          <li className={isActive === 'it-team' ? 'active' : ''}>
            <Link to="#it-team" onClick={() => scrollToSection('it-team')}>
              <span>Team</span>
            </Link>
          </li>
          <li className={isActive === 'it-blog' ? 'active' : ''}>
            <Link to="#it-blog" onClick={() => scrollToSection('it-blog')}>
              <span>Blog</span>
            </Link>
          </li>
          <li className={isActive === 'it-contact' ? 'active' : ''}>
            <Link
              to="#it-contact"
              onClick={() => scrollToSection('it-contact')}
            >
              <span>Contact</span>
            </Link>
          </li>
        </ul>
      ) : onePageStyle === 'onePage2' ? (
        <ul className="onepage-menu">
          {onePageHomeMenu}
          <li className={isActive === 'it-about' ? 'active' : ''}>
            <Link to="#it-course" onClick={() => scrollToSection('it-about')}>
              <span>About us</span>
            </Link>
          </li>
          <li className={isActive === 'it-course' ? 'active' : ''}>
            <Link to="#it-course" onClick={() => scrollToSection('it-course')}>
              <span>Courses</span>
            </Link>
          </li>
          <li className={isActive === 'it-event' ? 'active' : ''}>
            <Link to="#it-event" onClick={() => scrollToSection('it-event')}>
              <span>Event</span>
            </Link>
          </li>
          <li className={isActive === 'it-team' ? 'active' : ''}>
            <Link to="#it-team" onClick={() => scrollToSection('it-team')}>
              <span>Team</span>
            </Link>
          </li>
          <li className={isActive === 'it-blog' ? 'active' : ''}>
            <Link to="#it-blog" onClick={() => scrollToSection('it-blog')}>
              <span>Blog</span>
            </Link>
          </li>
        </ul>
      ) : onePageStyle === 'onePage3' ? (
        <ul className="onepage-menu">
          {onePageHomeMenu}
          <li className={isActive === 'it-about' ? 'active' : ''}>
            <Link to="#it-about" onClick={() => scrollToSection('it-about')}>
              <span>About us</span>
            </Link>
          </li>
          <li className={isActive === 'it-course' ? 'active' : ''}>
            <Link to="#it-course" onClick={() => scrollToSection('it-course')}>
              <span>Courses</span>
            </Link>
          </li>
          <li className={isActive === 'it-contact' ? 'active' : ''}>
            <Link
              to="#it-contact"
              onClick={() => scrollToSection('it-contact')}
            >
              <span>Contact</span>
            </Link>
          </li>
          <li className={isActive === 'it-event' ? 'active' : ''}>
            <Link to="#it-event" onClick={() => scrollToSection('it-event')}>
              <span>Event</span>
            </Link>
          </li>
          <li className={isActive === 'it-blog' ? 'active' : ''}>
            <Link to="#it-blog" onClick={() => scrollToSection('it-blog')}>
              <span>Blog</span>
            </Link>
          </li>
        </ul>
      ) : onePageStyle === 'onePage4' ? (
        <ul className="onepage-menu">
          {onePageHomeMenu}
          <li className={isActive === 'it-work' ? 'active' : ''}>
            <Link to="#it-work" onClick={() => scrollToSection('it-work')}>
              <span>Work</span>
            </Link>
          </li>
          <li className={isActive === 'it-about' ? 'active' : ''}>
            <Link to="#it-about" onClick={() => scrollToSection('it-about')}>
              <span>About us</span>
            </Link>
          </li>
          <li className={isActive === 'it-testimonial' ? 'active' : ''}>
            <Link
              to="#it-testimonial"
              onClick={() => scrollToSection('it-testimonial')}
            >
              <span>Testimonial</span>
            </Link>
          </li>
          <li className={isActive === 'it-team' ? 'active' : ''}>
            <Link to="#it-team" onClick={() => scrollToSection('it-team')}>
              <span>Team</span>
            </Link>
          </li>
          <li className={isActive === 'it-blog' ? 'active' : ''}>
            <Link to="#it-blog" onClick={() => scrollToSection('it-blog')}>
              <span>Blog</span>
            </Link>
          </li>
        </ul>
      ) : onePageStyle === 'onePage5' ? (
        <ul className="onepage-menu">
          {onePageHomeMenu}
          <li className={isActive === 'it-feature' ? 'active' : ''}>
            <Link
              to="#it-feature"
              onClick={() => scrollToSection('it-feature')}
            >
              <span>Feature</span>
            </Link>
          </li>
          <li className={isActive === 'it-about' ? 'active' : ''}>
            <Link to="#it-about" onClick={() => scrollToSection('it-about')}>
              <span>About us</span>
            </Link>
          </li>
          <li className={isActive === 'it-course' ? 'active' : ''}>
            <Link to="#it-course" onClick={() => scrollToSection('it-course')}>
              <span>Courses</span>
            </Link>
          </li>
          <li className={isActive === 'it-faq' ? 'active' : ''}>
            <Link to="#it-faq" onClick={() => scrollToSection('it-faq')}>
              <span>Faq</span>
            </Link>
          </li>
          <li className={isActive === 'it-blog' ? 'active' : ''}>
            <Link to="#it-blog" onClick={() => scrollToSection('it-blog')}>
              <span>Blog</span>
            </Link>
          </li>
        </ul>
      ) : (
        <ul></ul>
      )}
    </>
  );
};
export default MenuItemsOnePage;
