import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import SingleBlogFour from '../../components/Blog/SingleBlogFour';
import Sidebar from '../../components/Blog/Sidebar';

import blogImg1 from '../../assets/img/blog/blog-sidebar-1.jpg';
import blogImg2 from '../../assets/img/blog/blog-sidebar-2.jpg';
import blogImg3 from '../../assets/img/blog/blog-sidebar-3.jpg';

const BlogSidebarMain = () => {
  const sliderOption = {
    speed: 1000,
    loop: true,
    slidesPerView: '1',
    autoplay: {
      delay: 5000,
    },
    navigation: {
      prevEl: '.postbox-arrow-prev',
      nextEl: '.postbox-arrow-next',
    },
  };

  return (
    <main>
      <Breadcrumb title="Blog Sidebar" subTitle="blog" />

      <div className="postbox__area pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8 mb-40">
              <div className="postbox__details-wrapper">
                <SingleBlogFour
                  itemClass="postbox__thumb-box mb-80"
                  blogImage={blogImg1}
                  publishedDate="April 21, 2024"
                  authorName="Alamgir Chowdhuri"
                  title="Curabitur at fermentum purus. Interdum et malesuada fames ac ante ipsum"
                />

                <div className="postbox__thumb-box mb-80">
                  <div className="it-postbox__wrapper p-relative mb-30">
                    <div className="swiper-container postbox__thumb-slider-active">
                      <Swiper
                        modules={[Autoplay, Navigation]}
                        {...sliderOption}
                        className="swiper-wrapper"
                      >
                        <SwiperSlide className="swiper-slide">
                          <div className="postbox__main-thumb">
                            <img src={blogImg2} alt="" />
                          </div>
                        </SwiperSlide>
                        <SwiperSlide className="swiper-slide">
                          <div className="postbox__main-thumb">
                            <img src={blogImg3} alt="" />
                          </div>
                        </SwiperSlide>
                        <SwiperSlide className="swiper-slide">
                          <div className="postbox__main-thumb">
                            <img src={blogImg1} alt="" />
                          </div>
                        </SwiperSlide>
                      </Swiper>
                    </div>
                    <div className="postbox__slider-arrow-wrap">
                      <button className="postbox-arrow-prev">
                        <i className="fa-solid fa-arrow-left"></i>
                      </button>
                      <button className="postbox-arrow-next">
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                  <div className="postbox__content-box">
                    <div className="postbox__meta">
                      <span>
                        <i className="fa-solid fa-calendar-days"></i>April 21,
                        2024
                      </span>
                      <span>
                        <i className="fal fa-user"></i>Alamgir Chowdhuri
                      </span>
                    </div>
                    <h4 className="postbox__details-title">
                      <a href="blog-details.html">
                        Aenean nec aliquet enim. Donec at dapibus enim. Integer
                        et tur is vel turpis
                      </a>
                    </h4>
                    <a className="ed-btn-theme" href="#">
                      read more
                      <i>
                        <svg
                          width="17"
                          height="14"
                          viewBox="0 0 17 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 1.24023L16 7.24023L11 13.2402"
                            stroke="currentcolor"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M1 7.24023H16"
                            stroke="currentcolor"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </i>
                    </a>
                  </div>
                </div>

                <SingleBlogFour
                  itemClass="postbox__thumb-box"
                  blogImage={blogImg3}
                  publishedDate="April 21, 2024"
                  authorName="Alamgir Chowdhuri"
                  title="Curabitur at fermentum purus. Interdum et malesuada fames ac ante ipsum"
                />
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-4">
              <Sidebar />
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="it-pagination">
                <nav>
                  <ul>
                    <li>
                      <Link to="/blog-sidebar">1</Link>
                    </li>
                    <li>
                      <Link to="/blog-sidebar">2</Link>
                    </li>
                    <li>
                      <Link to="/blog-sidebar">3</Link>
                    </li>
                    <li>
                      <Link className="color" to="#">
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogSidebarMain;
