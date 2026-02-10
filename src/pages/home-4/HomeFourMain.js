import React from 'react';
import About from './AboutSection';
import Blog from './BlogSection';
import FunFact from './FunFactSection';
import Banner from './HomeFourBanner';
import Team from './TeamSection';
import Testimonial from './TestimonialSection';
import Video from './VideoSection';
import WhyChooseUs from './WhyChooseUsSection';
import Work from './WorkSection';

const HomeFourMain = () => {
  return (
    <main>
      <Banner />
      <Work />
      <About />
      <Video />
      <FunFact />
      <WhyChooseUs />
      <Testimonial />
      <Team />
      <Blog />
    </main>
  );
};
export default HomeFourMain;
