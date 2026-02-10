import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import SectionTitle from '../../components/SectionTitle';
import SingleTestimonial from '../../components/Testimonial';

import testimonialBG from '../../assets/img/testimonial/testimonial-bg.jpg';

const Testimonial = () => {
  const sliderOption = {
    speed: 1500,
    loop: true,
    slidesPerView: '3',
    spaceBetween: 50,
    autoplay: {
      delay: 3000,
    },
    breakpoints: {
      1400: {
        slidesPerView: 3,
      },
      1200: {
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
      className="it-testimonial-area ed-testimonial-ptb fix p-relative"
      style={{ backgroundImage: `url(${testimonialBG})` }}
    >
      <div className="container">
        <div className="it-testimonial-title-wrap mb-90">
          <div className="row justify-content-center">
            <div className="col-xl-6">
              <SectionTitle
                itemClass="it-testimonial-title-box text-center"
                subTitle="testimonial"
                title="Creating A Community Of Life Long Learners."
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="ed-testimonial-wrapper">
              <div className="swiper-container">
                <Swiper
                  modules={[Autoplay]}
                  {...sliderOption}
                  className="swiper-wrapper ed-testimonial-active"
                >
                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonial
                      description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod
                          tempor incididunt ut labore et dolore magna aliqua.
                          Orci nulla pellentesque dignissim enim. Amet
                          consectetur adipiscing”`}
                      authorName="Ellen Perera"
                      designation="CEO at House of Ramen"
                    />
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonial
                      description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod
                          tempor incididunt ut labore et dolore magna aliqua.
                          Orci nulla pellentesque dignissim enim. Amet
                          consectetur adipiscing”`}
                      authorName="Kathy Sullivan"
                      designation="CEO at ordian it"
                    />
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonial
                      description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod
                          tempor incididunt ut labore et dolore magna aliqua.
                          Orci nulla pellentesque dignissim enim. Amet
                          consectetur adipiscing”`}
                      authorName="Elsie Stroud"
                      designation="CEO at Edwards"
                    />
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <SingleTestimonial
                      description={`“Lorem ipsum dolor sit amet, elit, sed do eiusmod
                          tempor incididunt ut labore et dolore magna aliqua.
                          Orci nulla pellentesque dignissim enim. Amet
                          consectetur adipiscing”`}
                      authorName="Kathy Sullivan"
                      designation="CEO at ordian it"
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
