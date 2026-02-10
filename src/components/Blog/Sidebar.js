import React from 'react';
import { Link } from 'react-router-dom';

import postImg1 from '../../assets/img/blog/blog-sidebar-sm-1.jpg';
import postImg2 from '../../assets/img/blog/blog-sidebar-sm-2.jpg';
import postImg3 from '../../assets/img/blog/blog-sidebar-sm-3.jpg';
import postImg4 from '../../assets/img/blog/blog-sidebar-sm-4.jpg';
import postImg5 from '../../assets/img/blog/blog-sidebar-sm-5.jpg';

const Sidebar = () => {
  const posts = [
    {
      id: 1,
      postImage: postImg1,
      publishedDate: 'June 2023',
      postTitle: 'Interdum velit laoreet id donec ultrices tincidunt arcu.',
    },
    {
      id: 2,
      postImage: postImg2,
      publishedDate: 'June 2023',
      postTitle: 'Interdum velit laoreet id donec ultrices tincidunt arcu.',
    },
    {
      id: 3,
      postImage: postImg3,
      publishedDate: 'June 2023',
      postTitle: 'Interdum velit laoreet id donec ultrices tincidunt arcu.',
    },
    {
      id: 4,
      postImage: postImg4,
      publishedDate: 'June 2023',
      postTitle: 'Interdum velit laoreet id donec ultrices tincidunt arcu.',
    },
    {
      id: 5,
      postImage: postImg5,
      publishedDate: 'June 2023',
      postTitle: 'Interdum velit laoreet id donec ultrices tincidunt arcu.',
    },
  ];

  return (
    <div className="it-sv-details-sidebar">
      <div className="it-sv-details-sidebar-search mb-55">
        <input type="text" placeholder="search" />
        <button type="submit">
          <i className="fal fa-search"></i>
        </button>
      </div>
      <div className="it-sv-details-sidebar-widget mb-55">
        <h4 className="it-sv-details-sidebar-title mb-30">service category</h4>
        <Link to="/blog-details">
          <div className="it-sv-details-sidebar-category mb-10">
            graphic design
            <span>
              <i className="fa-light fa-angle-right"></i>
            </span>
          </div>
        </Link>
        <Link to="/blog-details">
          <div className="it-sv-details-sidebar-category active mb-10">
            web design
            <span>
              <i className="fa-light fa-angle-right"></i>
            </span>
          </div>
        </Link>
        <Link to="/blog-details">
          <div className="it-sv-details-sidebar-category mb-10">
            it and software
            <span>
              <i className="fa-light fa-angle-right"></i>
            </span>
          </div>
        </Link>
        <Link to="/blog-details">
          <div className="it-sv-details-sidebar-category mb-10">
            seles marketing
            <span>
              <i className="fa-light fa-angle-right"></i>
            </span>
          </div>
        </Link>
        <Link to="/blog-details">
          <div className="it-sv-details-sidebar-category mb-10">
            art & humanities
            <span>
              <i className="fa-light fa-angle-right"></i>
            </span>
          </div>
        </Link>
        <Link to="/blog-details">
          <div className="it-sv-details-sidebar-category mb-10">
            mobile application
            <span>
              <i className="fa-light fa-angle-right"></i>
            </span>
          </div>
        </Link>
      </div>
      <div className="sidebar__widget mb-55">
        <div className="sidebar__widge-title-box">
          <h3 className="sidebar__widget-title pb-10">Recent Post</h3>
        </div>
        <div className="sidebar__widget-content">
          <div className="sidebar__post">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rc__post mb-30 d-flex align-items-start"
              >
                <div className="rc__post-thumb mr-20">
                  <Link to="/blog-details">
                    <img src={post.postImage} alt="" />
                  </Link>
                </div>
                <div className="rc__post-content">
                  <div className="rc__meta">
                    <span>
                      <i className="fa-solid fa-calendar-days"></i>14
                      {post.publishedDate}
                    </span>
                  </div>
                  <h3 className="rc__post-title">
                    <Link to="/blog-details">{post.postTitle}</Link>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="it-sv-details-sidebar-widget">
        <h4 className="it-sv-details-sidebar-title mb-30">popular tag:</h4>
        <div className="sidebar__widget-content">
          <div className="tagcloud">
            <a href="#"> Balance</a>
            <a href="#">coaching</a>
            <a href="#">Motivation</a>
            <a href="#">courses</a>
            <a href="#">Life guide</a>
            <a href="#">strategy</a>
            <a href="#">Education</a>
            <a href="#">coach</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
