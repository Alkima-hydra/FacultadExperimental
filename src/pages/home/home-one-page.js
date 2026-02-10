import React from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import HomeMain from './HomeMain';

const HomeOnePage = () => {
  return (
    <>
      <Header onePage={true} parentMenu="home" />
      <HomeMain />
      <Footer />
    </>
  );
};
export default HomeOnePage;
