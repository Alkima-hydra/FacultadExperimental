import React from 'react';
import About from './AboutSection';
import Blog from './BlogSection';
import Career from './CareerSection';
import Course from './CourseSection';
import Event from './EventSection';
import Feature from './FeatureSection';
import HomeTwoBanner from './HomeTwoBanner';
import Team from './TeamSection';
import Testimonial from './TestimonialSection';
import TextSlider from './TextSliderSection';
import Video from './VideoSection';
import Value from './ValueSection';

const HomeTwoMain = () => {
  return (
    <main>
      <HomeTwoBanner />
      <About />
      <Course />
      <Value />
      <Feature />
      <Video />
      <Career />
      <TextSlider />
      <Testimonial />
      <Event />
      <Team />
      <Blog />
    </main>
  );
};
export default HomeTwoMain;
