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
      <li>
        <Link to="/">
          <span>Inicio</span>
        </Link>
      </li>
      <li>
        <Link to="/about-us">
          <span>Acerca de nosotros</span>
        </Link>
      </li>
      <li>
        <Link to="/faq">
          <span>FAQ</span>
        </Link>
      </li>
      <li>
        <Link to="/course-1">
          <span>Ofertas de cursos</span>
        </Link>
      </li>
    </ul>
  );
};

export default MenuItems;