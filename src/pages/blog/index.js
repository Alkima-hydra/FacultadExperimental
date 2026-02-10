import React from 'react';
import HeaderFive from '../../components/Header/HeaderFive';
import BlogMain from './BlogMain';
import FooterTwo from '../../components/Footer/FooterTwo';

import Logo from '../../assets/img/logo/logo-white-2.png';

const Blog = () => {
  return (
    <>
      <HeaderFive />

      <BlogMain />

      <FooterTwo
        footerClass="it-footer-area it-footer-bg it-footer-style-5 ed-footer-style-5 inner-style black-bg pb-70"
        footerLogo={Logo}
        btnClass="it-btn-white sky-bg"
        copyrightTextClass="it-copyright-text inner-style text-center"
      />
    </>
  );
};

export default Blog;
