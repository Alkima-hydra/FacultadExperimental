import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Sidebar from '../../components/Blog/Sidebar';

import blogImg from '../../assets/img/blog/blog-details-1.jpg';
import blogImg2 from '../../assets/img/blog/blog-details-2.jpg';
import blogImg3 from '../../assets/img/blog/blog-details-3.jpg';
import avatarImg from '../../assets/img/avatar/avata-3.png';

const BlogDetailsMain = () => {
  return (
    <main>
      <Breadcrumb title="Blog Details" subTitle="blog" />

      <div className="postbox__area fix pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xxl-8 col-xl-8 col-lg-8">
              <div className="postbox__details-wrapper">
                <article>
                  <div className="postbox__thumb mb-30 w-img">
                    <img src={blogImg} alt="" />
                  </div>
                  <div className="postbox__details-title-box pb-40">
                    <div className="postbox__meta">
                      <span>
                        <i className="fa-solid fa-calendar-days"></i>14 June
                        2023
                      </span>
                      <span>
                        <i className="fa-regular fa-comments"></i>Comment (06)
                      </span>
                    </div>
                    <h4 className="postbox__title mb-20">
                      Pellentesque dignissim enim sit amet venenatis cursus eget
                      nunc.
                    </h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat
                      aute irure dolor in reprehenderit.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat
                      aute irure dolor in reprehenderit.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat
                      aute irure dolor in reprehenderit.
                    </p>
                  </div>
                  <div className="postbox__content pb-20">
                    <div className="postbox__content-img mb-40 d-flex justify-content-between">
                      <img className="mr-30" src={blogImg2} alt="" />
                      <img src={blogImg3} alt="" />
                    </div>
                    <div className="postbox__text">
                      <h4 className="postbox__details-title">
                        Latest Articles Updated Daily
                      </h4>
                      <p>
                        With worldwide annual spend on digital advertising
                        surpassing $325 billion, it’s no surprise that different
                        approaches to online marketing are becoming available.
                        One of these new approaches is performance marketing or
                        digital performance marketing. Keep reading to learn all
                        about performance marketing
                      </p>
                    </div>
                  </div>
                  <div className="postbox__item text-center">
                    <i className="fas fa-quote-right"></i>
                    <p>
                      Diam luctus nostra dapibus varius et semper semper rutrum
                      ad risus felis eros. Cursus libero viverra tempus netus
                      diam vestibulum
                    </p>
                    <span>David Backhum</span>
                  </div>
                  <div className="postbox__details-share-wrapper">
                    <div className="row align-items-center">
                      <div className="col-xl-7 col-lg-7 col-md-7">
                        <div className="postbox__details-tag">
                          <span>Posted in:</span>
                          <a href="#">Development</a>
                          <a href="#">Digital</a>
                          <a href="#">Tech</a>
                        </div>
                      </div>
                      <div className="col-xl-5 col-lg-5 col-md-5">
                        <div className="postbox__details-share text-lg-end">
                          <span>Share:</span>
                          <a href="#">
                            <i className="fab fa-facebook-f"></i>
                          </a>
                          <a href="#">
                            <i className="fa-brands fa-instagram"></i>
                          </a>
                          <a href="#">
                            <i className="fab fa-twitter"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="postbox__comment">
                    <h3 className="postbox__comment-title">01 Comments</h3>
                    <ul>
                      <li>
                        <div className="postbox__comment-box d-flex align-items-center">
                          <div className="postbox__comment-info ">
                            <div className="postbox__comment-avater mr-20">
                              <img src={avatarImg} alt="" />
                            </div>
                          </div>
                          <div className="postbox__comment-text">
                            <div className="postbox__comment-reply d-flex align-items-center justify-content-between">
                              <span className="post-meta">
                                September 6, 2022 at 1:28 pm{' '}
                              </span>
                              <a href="#">Reply</a>
                            </div>
                            <div className="postbox__comment-name">
                              <h5>Jonathon Lopez</h5>
                            </div>
                            <p>
                              Lorem ipsum dolor sit amet consectetur adipi
                              vestibulum lectus egestas cubilia nam sagittis,
                              nulla posuere habitant
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="postbox__content-wrap">
                    <div className="it-contact__wrap">
                      <div className="it-contact__text pb-30">
                        <h5 className="it-contact__title">
                          Let’s Get in Touch
                        </h5>
                        <p>
                          Your email address will not be published. Required
                          fields are marked *
                        </p>
                      </div>
                      <div className="it-contact__form-box">
                        <form action="#">
                          <div className="row">
                            <div className="col-xl-6 col-lg-6 col-12 mb-20">
                              <div className="it-contact__input-box">
                                <input type="text" placeholder="Your Name*" />
                              </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-12 mb-20">
                              <div className="it-contact__input-box">
                                <input
                                  type="email"
                                  placeholder="Email Address*"
                                />
                              </div>
                            </div>
                            <div className="col-12 mb-20">
                              <div className="it-contact__input-box">
                                <input type="email" placeholder="Website*" />
                              </div>
                            </div>
                            <div className="col-12 mb-20">
                              <div className="it-contact__textarea-box">
                                <textarea placeholder="Write Your Message*"></textarea>
                              </div>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="ed-btn-square raduis purple-4"
                          >
                            <span>Send Message</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-4">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogDetailsMain;
