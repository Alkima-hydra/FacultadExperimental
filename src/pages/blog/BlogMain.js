import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import SingleBlog from '../../components/Blog';

import blogImg1 from '../../assets/img/blog/blog-1-1.jpg';
import blogImg2 from '../../assets/img/blog/blog-1-2.jpg';
import blogImg3 from '../../assets/img/blog/blog-1-3.jpg';
import blogImg4 from '../../assets/img/blog/blog-1-11.jpg';
import blogImg5 from '../../assets/img/blog/blog-1-12.jpg';
import blogImg6 from '../../assets/img/blog/blog-1-13.jpg';

const BlogMain = () => {
  return (
    <main>
      <Breadcrumb title="Blog Style 1" subTitle="blog" />

      <div className="it-blog-area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <SingleBlog
                thumbImage={blogImg1}
                title="velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat"
                publishedDate="21 April 2024"
                btnClass="ed-btn-blog"
                hasArrow
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <SingleBlog
                thumbImage={blogImg2}
                title="velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat"
                publishedDate="21 April 2024"
                btnClass="ed-btn-blog"
                hasArrow
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <SingleBlog
                thumbImage={blogImg3}
                title="velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat"
                publishedDate="21 April 2024"
                btnClass="ed-btn-blog"
                hasArrow
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <SingleBlog
                thumbImage={blogImg4}
                title="velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat"
                publishedDate="21 April 2024"
                btnClass="ed-btn-blog"
                hasArrow
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <SingleBlog
                thumbImage={blogImg5}
                title="velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat"
                publishedDate="21 April 2024"
                btnClass="ed-btn-blog"
                hasArrow
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <SingleBlog
                thumbImage={blogImg6}
                title="velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat"
                publishedDate="21 April 2024"
                btnClass="ed-btn-blog"
                hasArrow
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogMain;
