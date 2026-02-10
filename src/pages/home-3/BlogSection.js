import React from 'react';
import { Link } from 'react-router-dom';
import SingleBlogTwo from '../../components/Blog/SingleBlogTwo';

import titleImg from '../../assets/img/category/title.svg';
import blogImg1 from '../../assets/img/blog/blog-1-7.jpg';
import blogImg2 from '../../assets/img/blog/blog-1-8.jpg';

const Blog = () => {
  return (
    <div
      id="it-blog"
      className="it-blog-area it-blog-style-3 it-blog-style-4 pt-120 pb-90"
    >
      <div className="container">
        <div className="it-blog-title-wrap mb-60">
          <div className="row align-items-end">
            <div className="col-xl-8 col-lg-8 col-md-8">
              <div className="it-blog-title-box">
                <span className="it-section-subtitle-5 purple-2">
                  <img src={titleImg} alt="" />
                  Popular courses
                </span>
                <h4 className="ed-section-title">
                  Our latest news <br /> & upcoming blog posts
                </h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4">
              <div className="it-blog-button text-start text-md-end">
                <Link className="ed-btn-square" to="/blog-1">
                  <span>view all recent post</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div
            className="col-xl-6 col-lg-6 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".3s"
          >
            <SingleBlogTwo
              blogImage={blogImg1}
              title="Lorem ipsum dolor sit amet, consectetur Adipiscing elit, sed
                    do."
              authorName="Sunilra smoth"
              publishedDate="March 28, 2023"
              btnClass="ed-btn-square purple-3"
            />
          </div>
          <div
            className="col-xl-6 col-lg-6 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <SingleBlogTwo
              blogImage={blogImg2}
              title="Lorem ipsum dolor sit amet, consectetur Adipiscing elit, sed
                    do."
              authorName="Sunilra smoth"
              publishedDate="March 28, 2023"
              btnClass="ed-btn-square purple-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Blog;
