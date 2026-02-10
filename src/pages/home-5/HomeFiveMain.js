import React from 'react';
import About from './AboutSection';
import Blog from './BlogSection';
import Course from './CourseSection';
import CTA from './CTASection';
import FAQ from './FaqSection';
import Feature from './FeatureSection';
import Banner from './HomeFiveBanner';
import Testimonial from './TestimonialSection';
import Video from './VideoSection';
import WhyChooseUs from './WhyChooseUsSection';
import Work from './WorkSection';

const HomeFiveMain = () => {
  return (
    <main>
      <Banner />
      <Feature />
      <About />
      <CTA />
      <Course />
      <WhyChooseUs />
      <Testimonial />
      <Video />
      <FAQ />
      <Work />
      <Blog />
    </main>
  );
};
export default HomeFiveMain;
