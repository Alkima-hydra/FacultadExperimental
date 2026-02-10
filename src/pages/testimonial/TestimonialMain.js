import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import SingleTestimonialThree from '../../components/Testimonial/SingleTestimonialThree';

import avatarImg1 from '../../assets/img/testimonial/avatar-1-1.png';
import avatarImg2 from '../../assets/img/testimonial/avatar-1-2.png';
import avatarImg3 from '../../assets/img/testimonial/avatar-1-3.png';

const TestimonialMain = () => {
  return (
    <main>
      <Breadcrumb title="Testimonial" />

      <div className="it-testimonial-area ed-testimonial-style-2 pt-120 pb-120 fix p-relative">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-6 mb-30">
              <SingleTestimonialThree
                description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque 
                        dignissim enim. Amet consectetur adipiscing”`}
                authorAvatar={avatarImg1}
                authorName="Ellen Perera"
                designation="CEO at House of Ramen"
              />
            </div>
            <div className="col-xl-4 col-lg-6 mb-30">
              <SingleTestimonialThree
                description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque 
                        dignissim enim. Amet consectetur adipiscing”`}
                authorAvatar={avatarImg2}
                authorName="Kathy Sullivan"
                designation="CEO at ordian it"
              />
            </div>
            <div className="col-xl-4 col-lg-6 mb-30">
              <SingleTestimonialThree
                description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque 
                        dignissim enim. Amet consectetur adipiscing”`}
                authorAvatar={avatarImg3}
                authorName="Elsie Stroud"
                designation="CEO at Edwards"
              />
            </div>
            <div className="col-xl-4 col-lg-6 mb-30">
              <SingleTestimonialThree
                description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque 
                        dignissim enim. Amet consectetur adipiscing”`}
                authorAvatar={avatarImg1}
                authorName="Ellen Perera"
                designation="CEO at House of Ramen"
              />
            </div>
            <div className="col-xl-4 col-lg-6 mb-30">
              <SingleTestimonialThree
                description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque 
                        dignissim enim. Amet consectetur adipiscing”`}
                authorAvatar={avatarImg2}
                authorName="Kathy Sullivan"
                designation="CEO at ordian it"
              />
            </div>
            <div className="col-xl-4 col-lg-6 mb-30">
              <SingleTestimonialThree
                description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque 
                        dignissim enim. Amet consectetur adipiscing”`}
                authorAvatar={avatarImg3}
                authorName="Elsie Stroud"
                designation="CEO at Edwards"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default TestimonialMain;
