import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import SectionTitleTwo from '../../components/SectionTitle/SectionTitleTwo';
import SingleTestimonialThree from '../../components/Testimonial/SingleTestimonialThree';

import shapeImg1 from '../../assets/img/testimonial/shape-4-1.png';
import shapeImg2 from '../../assets/img/testimonial/shape-5-3.png';
import avatarImg1 from '../../assets/img/testimonial/avatar-1-1.png';
import avatarImg2 from '../../assets/img/testimonial/avatar-1-2.png';
import avatarImg3 from '../../assets/img/testimonial/avatar-1-3.png';

const Testimonial = () => {
  const sliderOption = {
    speed: 1500,
    loop: true,
    slidesPerView: '3',
    spaceBetween: 50,
    autoplay: {
      delay: 5000,
    },
    breakpoints: {
      1400: {
        slidesPerView: 3,
      },
      992: {
        slidesPerView: 2,
      },
      0: {
        slidesPerView: 1,
      },
    },
  };
  return (
    <div
      id="it-testimonial"
      className="it-testimonial-area ed-testimonial-style-2 ed-testimonial-style-3 pt-120 pb-120 fix p-relative"
    >
      <div className="ed-testimonial-shape-1">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="ed-testimonial-shape-2 d-none d-xxl-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="container container-3">
        <div className="it-testimonial-title-wrap mb-55">
          <div className="row justify-content-center">
            <div className="col-xl-6">
              <SectionTitleTwo
                itemClass="it-testimonial-title-box text-center"
                subtitleClass="it-section-subtitle-5 orange"
                icon="fa-light fa-book"
                subtitle="testimonial"
                titleClass="ed-section-title"
                title="what parents say"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="ed-testimonial-wrapper">
              <div className="swiper-container ed-testimonial-active">
                <Swiper
                  modules={[Autoplay]}
                  {...sliderOption}
                  className="swiper-wrapper"
                >
                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonialThree
                      description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque 
                        dignissim enim. Amet consectetur adipiscing”`}
                      designation="CEO at House of Ramen"
                      authorAvatar={avatarImg1}
                      authorName="Ellen Perera"
                    />
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonialThree
                      description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque 
                        dignissim enim. Amet consectetur adipiscing”`}
                      authorAvatar={avatarImg2}
                      authorName="Kathy Sullivan"
                      designation="CEO at ordian it"
                    />
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonialThree
                      description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque 
                        dignissim enim. Amet consectetur adipiscing”`}
                      authorAvatar={avatarImg3}
                      authorName="Elsie Stroud"
                      designation="CEO at Edwards"
                    />
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonialThree
                      description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque 
                        dignissim enim. Amet consectetur adipiscing”`}
                      authorAvatar={avatarImg2}
                      authorName="Kathy Sullivan"
                      designation="CEO at ordian it"
                    />
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonialThree
                      description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque 
                        dignissim enim. Amet consectetur adipiscing”`}
                      authorAvatar={avatarImg1}
                      authorName="Ellen Perera"
                      designation="CEO at House of Ramen"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Testimonial;
