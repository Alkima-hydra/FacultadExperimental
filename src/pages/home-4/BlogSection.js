import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitleTwo from '../../components/SectionTitle/SectionTitleTwo';
import SingleBlog from '../../components/Blog';

import shapeImg1 from '../../assets/img/event/shape-1-2.png';
import shapeImg2 from '../../assets/img/hero/shape-2-1.png';
import blogImg1 from '../../assets/img/blog/blog-1-4.jpg';
import blogImg2 from '../../assets/img/blog/blog-1-5.jpg';
import blogImg3 from '../../assets/img/blog/blog-1-6.jpg';

const Blog = () => {
  return (
    <div
      id="it-blog"
      className="it-blog-area ed-blog-style-2 ed-blog-style-3 p-relative it-blog-color pt-115 pb-90"
    >
      <div className="ed-blog-shape-1">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="ed-blog-shape-2 d-none d-xxl-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="container">
        <div className="it-blog-title-wrap mb-80">
          <div className="row align-items-end">
            <div className="col-xl-7 col-lg-7 col-md-8">
              <SectionTitleTwo
                itemClass="it-course-title-box"
                subtitleClass="it-section-subtitle-5 orange"
                icon="fa-light fa-book"
                subtitle="explore newsletter"
                titleClass="ed-section-title"
                title="Most Popular Post."
              />
            </div>
            <div className="col-xl-5 col-lg-5 col-md-4">
              <div className="it-course-button text-start text-md-end pt-25">
                <Link className="ed-btn-radius oragnge" to="/blog-2">
                  all blog post
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
              publishedDate="15 April 2024"
              btnClass="ed-btn-blog radius theme-bg-2"
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
              btnClass="ed-btn-blog radius theme-bg-2"
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
              publishedDate="15 April 2024"
              btnClass="ed-btn-blog radius theme-bg-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Blog;
