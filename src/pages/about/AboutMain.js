import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import About from './AboutSection';
import Course from './CourseSection';
import FunFact from './FunFactSection';
import Team from './TeamSection';
import Testimonial from './TestimonialSection';

const AboutMain = () => {
  return (
    <main>
      <Breadcrumb title="Sobre nosotros" />
      <About />
      <FunFact />
      <Testimonial />
    </main>
  );
};

export default AboutMain;