import React from 'react';
import FooterTwo from '../../components/Footer/FooterTwo';
import HeaderTwo from '../../components/Header/HeaderTwo';
import HomeTwoMain from './HomeTwoMain';

const HomeTwoOnePage = () => {
  return (
    <>
      <HeaderTwo onePage={true} parentMenu="home" />

      <HomeTwoMain />

      <FooterTwo />
    </>
  );
};
export default HomeTwoOnePage;
