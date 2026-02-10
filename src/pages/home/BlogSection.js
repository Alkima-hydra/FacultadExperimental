import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle';
import RightArrow from '../../components/SVG';
import SingleBlog from '../../components/Blog';

import blogImg1 from '../../assets/img/blog/blog-1-1.jpg';
import blogImg2 from '../../assets/img/blog/blog-1-2.jpg';
import blogImg3 from '../../assets/img/blog/blog-1-3.jpg';

const Blog = () => {
  return (
    <div className="it-blog-area pt-120 pb-90">
      <div className="container">
        <div className="it-blog-title-wrap mb-60">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-8">
              <SectionTitle
                itemClass="it-blog-title-box"
                subTitle="BLOG POST"
                title="Most Popular Post."
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4">
              <div className="it-blog-button text-start text-md-end">
                <Link className="ed-btn-theme" to="/blog-1">
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
              publishedDate="14 June 2023"
              btnClass="ed-btn-blog"
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
              publishedDate="21 April 2024"
              btnClass="ed-btn-blog"
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
              publishedDate="14 June 2023"
              btnClass="ed-btn-blog"
              hasArrow
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Blog;
