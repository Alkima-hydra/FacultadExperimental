import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import Breadcrumb from '../../components/Breadcrumb';
import RightArrow from '../../components/SVG';
import SingleProgress from '../../components/Progress';
import SectionTitle from '../../components/SectionTitle';
import SingleTeamThree from '../../components/Team/SingleTeamThree';
import NextArrow from '../../components/SVG/NextArrow';
import PrevArrow from '../../components/SVG/PrevArrow';

import teamMainImg from '../../assets/img/team/team-inner.jpg';
import teamImg1 from '../../assets/img/team/team-4-1.jpg';
import teamImg2 from '../../assets/img/team/team-4-2.jpg';
import teamImg3 from '../../assets/img/team/team-4-3.jpg';
import teamImg4 from '../../assets/img/team/team-4-4.jpg';
import teamImg5 from '../../assets/img/team/team-4-5.jpg';
import teamImg6 from '../../assets/img/team/team-4-6.jpg';

const TeacherDetailsMain = () => {
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
    <main>
      <Breadcrumb title="Teacher Details" subTitle="Teacher" />

      <div className="it-teacher-details-area pt-120 pb-120">
        <div className="container">
          <div className="it-teacher-details-wrap">
            <div className="row">
              <div className="col-xl-3 col-lg-3">
                <div className="it-teacher-details-left">
                  <div className="it-teacher-details-left-thumb">
                    <img src={teamMainImg} alt="" />
                  </div>
                  <div className="it-teacher-details-left-social text-center">
                    <a href="#">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-skype"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                  <div className="it-teacher-details-left-info">
                    <ul>
                      <li>
                        <i className="fa-light fa-phone-volume"></i>
                        <a href="tel:(568)367987237">(568) 367-987-237</a>
                      </li>
                      <li>
                        <i className="fa-light fa-location-dot"></i>
                        <a href="https://www.google.com/maps" target="_blank">
                          Hudson, Wisconsin(WI), 54016
                        </a>
                      </li>
                      <li>
                        <i className="fa-light fa-envelope"></i>
                        <a href="mailto:govillage@gmail.com">
                          govillage@gmail.com
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="it-teacher-details-left-btn">
                    <Link className="ed-btn-theme" to="/contact">
                      <span>
                        Contact us teacher
                        <i>
                          <RightArrow />
                        </i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-xl-9 col-lg-9">
                <div className="it-teacher-details-right">
                  <div className="it-teacher-details-right-title-box">
                    <h4>Melvin Warner</h4>
                    <span>teacher</span>
                    <p>
                      Tempor orci dapibus ultrices in iaculis nunc sed augue.
                      Feugiat in ante metus dictum at tempor commodo. Venenatis
                      lectus magna fringilla urna porttitor rhoncus dolor. Arcu
                      dictum varius duis at consectetur lorem donec massa.
                    </p>
                    <p>
                      Tempor orci dapibus ultrices in iaculis nunc sed augue.
                      Feugiat in ante metus dictum at tempor commodo lectus
                      magna fringilla.
                    </p>
                  </div>
                  <div className="it-teacher-details-right-content mb-40">
                    <h4>Education:</h4>
                    <p>
                      I’ve spent years figuring out the “formula” to teaching
                      technical skills in a classNameroom environment, and I’m
                      really excited to finally share my expertise with you. I
                      can confidently say that my online courses are without a
                      doubt the most comprehensive ones on the market.
                    </p>
                  </div>
                  <div className="it-progress-bar-wrap inner-style">
                    <h4>Expertise & Skills:</h4>
                    <div className="it-progress-bar-item">
                      <label>Lectures</label>
                      <SingleProgress progress="90" />
                    </div>
                    <div className="it-progress-bar-item">
                      <label>My Skill</label>
                      <SingleProgress
                        progress="82"
                        progressClass="progress-bar orange "
                      />
                    </div>
                    <div className="it-progress-bar-item">
                      <label>Consulting</label>
                      <SingleProgress progress="65" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ed-team-area grey-bg-5 p-relative inner-style fix z-index pt-110 pb-120">
        <div className="container">
          <div className="it-team-title-wrap mb-40">
            <div className="row align-items-center justify-content-center">
              <div className="col-xl-6">
                <SectionTitle
                  itemClass="it-team-title-box text-center"
                  subTitleClass="ed-section-subtitle"
                  subTitle="Teacher"
                  titleClass="ed-section-title"
                  title="Meet Our Instructor"
                />
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
                    teamImage={teamImg5}
                    authorName="Justin Clark"
                    designation="Teacher"
                  />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <SingleTeamThree
                    teamImage={teamImg6}
                    authorName="Walter Skeete"
                    designation="Teacher"
                  />
                </SwiperSlide>
              </Swiper>
              <div className="ed-team-arrow-box mt-65 text-center">
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
      </div>
    </main>
  );
};
export default TeacherDetailsMain;
