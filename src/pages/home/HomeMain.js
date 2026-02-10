import React from 'react';
import Newsletter from '../../components/Newsletter';
import About from './AboutSection';
import Blog from './BlogSection';
import Career from './CareerSection';
import Category from './CategorySection';
import Course from './CourseSection';
import FunFact from './FunFactSection';
import HomeBanner from './HomeBanner';
import Team from './TeamSection';
import Testimonial from './TestimonialSection';
import WhyChooseUs from './WhyChooseUsSection';
import Video from './VideoSection';

const HomeMain = () => {
  return (
    <main>
      <HomeBanner />
      <Category />
      <Course />
      <About />
      <Video />
      <WhyChooseUs />
      <FunFact />
      <Testimonial />
      <Team />
      <Career />
      <Blog />
      <Newsletter />
    </main>
  );
};
export default HomeMain;
