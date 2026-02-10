import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import SectionTitleTwo from '../../components/SectionTitle/SectionTitleTwo';
import SingleTeamThree from '../../components/Team/SingleTeamThree';
import PrevArrow from '../../components/SVG/PrevArrow';
import NextArrow from '../../components/SVG/NextArrow';

import shapeImg from '../../assets/img/about/shape-4-4.png';
import teamImg1 from '../../assets/img/team/team-4-1.jpg';
import teamImg2 from '../../assets/img/team/team-4-2.jpg';
import teamImg3 from '../../assets/img/team/team-4-3.jpg';
import teamImg4 from '../../assets/img/team/team-4-4.jpg';

const Team = () => {
  const sliderOption = {
    speed: 1500,
    loop: true,
    slidesPerView: '4',
    spaceBetween: 50,
    autoplay: {
      delay: 5000,
    },
    breakpoints: {
      1400: {
        slidesPerView: 4,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      0: {
        slidesPerView: 1,
      },
    },
    navigation: {
      prevEl: '.slider-prev',
      nextEl: '.slider-next',
    },
  };

  return (
    <div
      id="it-team"
      className="ed-team-area grey-bg-5 p-relative fix z-index pt-110 pb-90"
    >
      <div className="ed-team-shape-1 d-none d-md-block">
        <img src={shapeImg} alt="" />
      </div>
      <div className="container">
        <div className="it-team-title-wrap mb-40">
          <div className="row align-items-center">
            <div className="col-xl-6">
              <SectionTitleTwo
                itemClass="it-team-title-box"
                subtitleClass="it-section-subtitle-5 orange"
                icon="fa-light fa-book"
                subtitle="Teacher"
                titleClass="ed-section-title"
                title="Meet Our Instructor"
              />
            </div>
            <div className="col-xl-6">
              <div className="ed-team-arrow-box text-end">
                <button className="slider-prev">
                  <PrevArrow />
                </button>
                <button className="slider-next">
                  <NextArrow />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="ed-team-wrapper">
          <div className="swiper-container ed-team-active">
            <Swiper
              modules={[Autoplay, Navigation]}
              {...sliderOption}
              className="swiper-wrapper"
            >
              <SwiperSlide className="swiper-slide">
                <SingleTeamThree
                  teamImage={teamImg1}
                  authorName="Micheal Hammond"
                  designation="Teacher"
                />
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <SingleTeamThree
                  teamImage={teamImg2}
                  authorName="Cheryl Curry"
                  designation="Teacher"
                />
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <SingleTeamThree
                  teamImage={teamImg3}
                  authorName="Willie Diaz"
                  designation="Teacher"
                />
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <SingleTeamThree
                  teamImage={teamImg4}
                  authorName="Jimmy Sifuentes"
                  designation="Teacher"
                />
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <SingleTeamThree
                  teamImage={teamImg1}
                  authorName="Micheal Hammond"
                  designation="Teacher"
                />
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <SingleTeamThree
                  teamImage={teamImg2}
                  authorName="Cheryl Curry"
                  designation="Teacher"
                />
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <SingleTeamThree
                  teamImage={teamImg3}
                  authorName="Willie Diaz"
                  designation="Teacher"
                />
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <SingleTeamThree
                  teamImage={teamImg4}
                  authorName="Jimmy Sifuentes"
                  designation="Teacher"
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Team;
