import React from 'react';
import Footer from '../../components/Footer';
import HomeFiveMain from './HomeFiveMain';
import HeaderFive from '../../components/Header/HeaderFive';

import Logo from '../../assets/img/logo/logo-white-2.png';

const HomeFiveOnePage = () => {
  return (
    <>
      <HeaderFive onePage={true} parentMenu="home" />

      <HomeFiveMain />

      <Footer
        footerClass="it-footer-area it-footer-bg ed-footer-style-2 black-bg pt-120 pb-70"
        footerLogo={Logo}
        copyrightTextClass="it-copyright-text style-3 text-center"
      />
    </>
  );
};
export default HomeFiveOnePage;
