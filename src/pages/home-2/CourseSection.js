import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle';
import RightArrow from '../../components/SVG';
import SingleCourseTwo from '../../components/Course/SingleCourseTwo';

import courseBG from '../../assets/img/course/course-bg.png';
import courseImg1 from '../../assets/img/course/course-1-1.jpg';
import courseImg2 from '../../assets/img/course/course-1-2.jpg';
import courseImg3 from '../../assets/img/course/course-1-3.jpg';
import titleImg from '../../assets/img/about/title-home2.png';
import avatarImg from '../../assets/img/course/avata-1.png';

const Course = () => {
  return (
    <div
      id="it-course"
      className="it-course-area it-course-style-3 it-course-bg p-relative grey-bg pt-120 pb-120"
      style={{ backgroundImage: `url(${courseBG})` }}
    >
      <div className="container">
        <div className="it-course-title-wrap mb-60">
          <div className="row align-items-end">
            <div className="col-xl-7 col-lg-7 col-md-12">
              <SectionTitle
                itemClass="it-course-title-box section-title-fixed-width-2"
                subTitleClass="it-section-subtitle-4"
                subTitle="Top Popular Course"
                titleClass="it-section-title-3"
                title="Check out educate features win any exam"
                titleImage={titleImg}
              />
            </div>
            <div className="col-xl-5 col-lg-5 col-md-12">
              <div className="it-course-button text-start text-lg-end pt-25">
                <Link className="ed-btn-theme theme-2" to="/course-2">
                  Browse edunity Courses
                  <i>
                    <RightArrow />
                  </i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
            <SingleCourseTwo
              courseImage={courseImg1}
              thumbText="Development"
              title="It statistics data science and Business analysis"
              authorAvatar={avatarImg}
              authorName="Angela"
              designation="Development"
              price="60"
              prevPrice="120"
            />
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
            <SingleCourseTwo
              courseImage={courseImg2}
              thumbText="Development"
              title="It statistics data science and Business analysis"
              authorAvatar={avatarImg}
              authorName="Angela"
              designation="Development"
              price="60"
              prevPrice="120"
            />
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
            <SingleCourseTwo
              courseImage={courseImg3}
              thumbText="Development"
              title="It statistics data science and Business analysis"
              authorAvatar={avatarImg}
              authorName="Angela"
              designation="Development"
              price="60"
              prevPrice="120"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Course;
