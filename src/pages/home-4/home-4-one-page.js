import React from 'react';
import FooterTwo from '../../components/Footer/FooterTwo';
import HomeFourMain from './HomeFourMain';
import HeaderFour from '../../components/Header/HeaderFour';

import Logo from '../../assets/img/logo/logo-white-5.png';

const HomeFourOnePage = () => {
  return (
    <>
      <HeaderFour onePage={true} parentMenu="home" />

      <HomeFourMain />

      <FooterTwo
        footerClass="it-footer-area it-footer-bg it-footer-style-5 ed-footer-style-5 black-bg pb-70"
        footerLogo={Logo}
        btnClass="it-btn-white sky-bg"
      />
    </>
  );
};
export default HomeFourOnePage;
