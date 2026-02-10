import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import homeImg1 from '../../assets/img/menu/home-1.jpg';
import homeImg2 from '../../assets/img/menu/home-2.jpg';
import homeImg3 from '../../assets/img/menu/home-3.jpg';
import homeImg4 from '../../assets/img/menu/home-4.jpg';
import homeImg5 from '../../assets/img/menu/home-5.jpg';

const MenuItems = (props) => {
  const { mobileMenu } = props;
  const [home, setHome] = useState(false);
  const [course, setCourse] = useState(false);
  const [page, setPage] = useState(false);
  const [blog, setBlog] = useState(false);

  const openMobileMenu = (menu) => {
    if (menu === 'home') {
      setHome(!home);
      setCourse(false);
      setPage(false);
      setBlog(false);
    } else if (menu === 'course') {
      setHome(false);
      setCourse(!course);
      setPage(false);
      setBlog(false);
    } else if (menu === 'page') {
      setHome(false);
      setCourse(false);
      setPage(!page);
      setBlog(false);
    } else if (menu === 'blog') {
      setHome(false);
      setCourse(false);
      setPage(false);
      setBlog(!blog);
    }
  };

  const handleClick = (e) => {
    if (mobileMenu) {
      e.preventDefault();
    }
  };

  return (
    <ul>
      <li className="has-dropdown p-static">
        <Link
          to="/"
          className={`${home ? 'expanded' : ''}`}
          onClick={handleClick}
        >
          <span>Home</span>
          <button
            className={`${
              home
                ? 'dropdown-toggle-btn dropdown-opened'
                : 'dropdown-toggle-btn'
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
                  <Link className="it-btn-white-sm" to="/home-one-page">
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
                  <Link className="it-btn-white-sm" to="/home-2-one-page">
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
                  <Link className="it-btn-white-sm" to="/home-3-one-page">
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
                  <Link className="it-btn-white-sm" to="/home-4-one-page">
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
                  <Link className="it-btn-white-sm" to="/home-5-one-page">
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
      <li>
        <Link to="/about-us">
          <span>About us</span>
        </Link>
      </li>
      <li className="has-dropdown">
        <Link
          to="/course-details"
          className={course ? 'expanded' : ''}
          onClick={handleClick}
        >
          <span>Courses</span>
          <button
            className={`${
              course
                ? 'dropdown-toggle-btn dropdown-opened'
                : 'dropdown-toggle-btn'
            } d-xl-none`}
            onClick={() => {
              openMobileMenu('course');
            }}
          >
            <i className="fal fa-angle-right"></i>
          </button>
        </Link>
        <ul
          className={
            course ? 'it-submenu submenu d-block' : 'it-submenu submenu'
          }
        >
          <li>
            <Link to="/course-1">Course 01</Link>
          </li>
          <li>
            <Link to="/course-2">Course 02</Link>
          </li>
          <li>
            <Link to="/course-details">Course Details</Link>
          </li>
        </ul>
      </li>
      <li className="has-dropdown p-static">
        <Link to="#" className={page ? 'expanded' : ''} onClick={handleClick}>
          <span>Pages</span>
          <button
            className={`${
              page
                ? 'dropdown-toggle-btn dropdown-opened'
                : 'dropdown-toggle-btn'
            } d-xl-none`}
            onClick={() => {
              openMobileMenu('page');
            }}
          >
            <i className="fal fa-angle-right"></i>
          </button>
        </Link>
        <div
          className={
            page
              ? 'it-submenu submenu it-mega-menu d-block'
              : 'it-submenu submenu it-mega-menu'
          }
        >
          <div className="it-mega-menu-wrap">
            <div className="row">
              <div className="col-xl-3">
                <ul className="it-megamenu-space-1">
                  <li>
                    <Link to="/event">Event</Link>
                  </li>
                  <li>
                    <Link to="/event-details">Event Details</Link>
                  </li>
                  <li>
                    <Link to="/teacher">Instructor</Link>
                  </li>
                  <li>
                    <Link to="/teacher-details">Instructor Details</Link>
                  </li>
                  <li>
                    <Link to="/instructor-registration">
                      Instructor Registration
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-xl-4">
                <ul className="it-megamenu-space-2">
                  <li>
                    <Link to="/services-1">Service Style 01</Link>
                  </li>
                  <li>
                    <Link to="/services-2">Service Style 02</Link>
                  </li>
                  <li>
                    <Link to="/services-3">Service Style 03</Link>
                  </li>
                  <li>
                    <Link to="/service-details">Service Details</Link>
                  </li>
                  <li>
                    <Link to="/student-registration">Student Registration</Link>
                  </li>
                </ul>
              </div>
              <div className="col-xl-3">
                <ul className="it-megamenu-space-3">
                  <li>
                    <Link to="/testimonial">Testimonial</Link>
                  </li>
                  <li>
                    <Link to="/faq">Faq</Link>
                  </li>
                  <li>
                    <Link to="/price">Price</Link>
                  </li>
                  <li>
                    <Link to="/shop">Shop</Link>
                  </li>
                  <li>
                    <Link to="/shop-details">Shop Details</Link>
                  </li>
                </ul>
              </div>
              <div className="col-xl-2">
                <ul className="it-megamenu-space-4">
                  <li>
                    <Link to="/cart">Cart</Link>
                  </li>
                  <li>
                    <Link to="/checkout">Checkout</Link>
                  </li>
                  <li>
                    <Link to="/signup">Sign Up</Link>
                  </li>
                  <li>
                    <Link to="/signin">Sign In</Link>
                  </li>
                  <li>
                    <Link to="/404">Error</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li className="has-dropdown">
        <Link
          to="/blog-1"
          className={blog ? 'expanded' : ''}
          onClick={handleClick}
        >
          <span>Blog</span>
          <button
            className={`${
              blog
                ? 'dropdown-toggle-btn dropdown-opened'
                : 'dropdown-toggle-btn'
            } d-xl-none`}
            onClick={() => {
              openMobileMenu('blog');
            }}
          >
            <i className="fal fa-angle-right"></i>
          </button>
        </Link>
        <ul
          className={blog ? 'it-submenu submenu d-block' : 'it-submenu submenu'}
        >
          <li>
            <Link to="/blog-1">Blog Style 01</Link>
          </li>
          <li>
            <Link to="/blog-2">Blog Style 02</Link>
          </li>
          <li>
            <Link to="/blog-sidebar">Blog Sidebar</Link>
          </li>
          <li>
            <Link to="/blog-details">Blog Details</Link>
          </li>
        </ul>
      </li>
      <li>
        <Link to="/contact">
          <span>Contact</span>
        </Link>
      </li>
    </ul>
  );
};
export default MenuItems;
