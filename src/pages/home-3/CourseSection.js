import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle';
import SingleCourseThree from '../../components/Course/SingleCourseThree';

import titleImg from '../../assets/img/category/title.svg';
import courseImg1 from '../../assets/img/course/course-3-1.jpg';
import courseImg2 from '../../assets/img/course/course-3-2.jpg';
import courseImg3 from '../../assets/img/course/course-3-3.jpg';
import courseImg4 from '../../assets/img/course/course-3-4.jpg';
import avatarImg1 from '../../assets/img/course/avata-1.png';

const Course = () => {
  return (
    <div
      id="it-course"
      className="it-course-area it-course-style-3 it-course-style-4 it-course-bg p-relative pt-120 pb-90"
    >
      <div className="container">
        <div className="it-course-title-wrap mb-60">
          <div className="row align-items-end">
            <div className="col-xl-7 col-lg-7 col-md-8">
              <SectionTitle
                itemClass="it-course-title-box"
                subTitleClass="it-section-subtitle-5 purple-2"
                subTitle=" Top Popular Course"
                titleClass="it-section-title-3"
                title="Explore Featured Courses"
                titleImage={titleImg}
              />
            </div>
            <div className="col-xl-5 col-lg-5 col-md-4">
              <div className="it-course-button text-start text-md-end pt-25">
                <Link className="ed-btn-square theme" to="/course-2">
                  <span>Browse edunity Courses</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div
            className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".3s"
          >
            <SingleCourseThree
              courseImage={courseImg1}
              price="60"
              prevPrice="120"
              title="statistics data science and Business.."
              authorName="Angela"
              designation="Development"
              authorAvatar={avatarImg1}
            />
          </div>
          <div
            className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <SingleCourseThree
              courseImage={courseImg2}
              price="60"
              prevPrice="120"
              title="statistics data science and Business.."
              authorName="Angela"
              designation="Development"
              authorAvatar={avatarImg1}
            />
          </div>
          <div
            className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <SingleCourseThree
              courseImage={courseImg3}
              price="60"
              prevPrice="120"
              title="statistics data science and Business.."
              authorName="Angela"
              designation="Development"
              authorAvatar={avatarImg1}
            />
          </div>
          <div
            className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".9s"
          >
            <SingleCourseThree
              courseImage={courseImg4}
              price="60"
              prevPrice="120"
              title="statistics data science and Business.."
              authorName="Angela"
              designation="Development"
              authorAvatar={avatarImg1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Course;
