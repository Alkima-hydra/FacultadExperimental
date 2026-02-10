import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle';
import RightArrow from '../../components/SVG';
import SingleBlog from '../../components/Blog';

import shapeImg from '../../assets/img/event/shape-1-2.png';
import blogImg1 from '../../assets/img/blog/blog-1-1.jpg';
import blogImg2 from '../../assets/img/blog/blog-1-2.jpg';
import blogImg3 from '../../assets/img/blog/blog-1-3.jpg';
import titleImg from '../../assets/img/about/title-home2.png';

const Blog = () => {
  return (
    <div
      id="it-blog"
      className="it-blog-area ed-blog-style-2 p-relative it-blog-color pb-90"
    >
      <div className="ed-blog-shape-1">
        <img src={shapeImg} alt="" />
      </div>
      <div className="container">
        <div className="it-blog-title-wrap mb-80">
          <div className="row align-items-end">
            <div className="col-xl-7 col-lg-7 col-md-8">
              <SectionTitle
                itemClass="it-blog-title-box"
                subTitleClass="it-section-subtitle-4"
                subTitle="all blog post"
                titleClass="it-section-title-3"
                title="Most Popular Post."
                titleImage={titleImg}
              />
            </div>
            <div className="col-xl-5 col-lg-5 col-md-4">
              <div className="it-course-button text-start text-md-end pt-25">
                <Link className="ed-btn-theme theme-2" to="/blog-2">
                  all blog post
                  <i>
                    <RightArrow />
                  </i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div
            className="col-xl-4 col-lg-4 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".3s"
          >
            <SingleBlog
              blogImage={blogImg1}
              title="velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat"
              publishedDate="21 April 2023"
              btnClass="ed-btn-blog theme-bg-2"
              hasArrow
            />
          </div>
          <div
            className="col-xl-4 col-lg-4 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <SingleBlog
              blogImage={blogImg2}
              title="velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat"
              publishedDate="15 April 2024"
              btnClass="ed-btn-blog theme-bg-2"
              hasArrow
            />
          </div>
          <div
            className="col-xl-4 col-lg-4 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <SingleBlog
              blogImage={blogImg3}
              title="velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat"
              publishedDate="11 May 2024"
              btnClass="ed-btn-blog theme-bg-2"
              hasArrow
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Blog;
