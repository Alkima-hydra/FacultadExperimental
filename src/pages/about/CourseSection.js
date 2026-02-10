import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle';
import RightArrow from '../../components/SVG';
import SingleCourse from '../../components/Course';

import courseImg1 from '../../assets/img/course/course-5-1.jpg';
import courseImg2 from '../../assets/img/course/course-5-2.jpg';
import courseImg3 from '../../assets/img/course/course-5-3.jpg';
import avatarImg1 from '../../assets/img/course/ed-avata-1-1.png';
import avatarImg2 from '../../assets/img/course/ed-avata-1-2.png';
import avatarImg3 from '../../assets/img/course/ed-avata-1-3.png';

const Course = () => {
  return (
    <div
      id="it-course"
      className="it-course-area ed-course-bg ed-course-style-3 p-relative pt-120 pb-90"
    >
      <div className="container">
        <div className="ed-course-title-wrap mb-65">
          <div className="row align-items-center">
            <div className="col-xl-6">
              <SectionTitle
                itemClass="it-course-title-box"
                subTitleClass="ed-section-subtitle"
                subTitle="Our Courses"
                titleClass="ed-section-title"
                title="Creating A Community Of Life Long Learners."
              />
            </div>
            <div className="col-xl-6">
              <div className="ed-course-button text-lg-end">
                <Link className="ed-btn-square orange" to="/course-details">
                  Explore courses
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
            className="col-xl-4 col-lg-6 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".3s"
          >
            <SingleCourse
              courseImage={courseImg1}
              thumbText="Digital Marketing"
              title="It Statistics Data Science And Business Analysis"
              authorAvatar={avatarImg1}
              authorName="Samantha"
            />
          </div>
          <div
            className="col-xl-4 col-lg-6 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <SingleCourse
              courseImage={courseImg2}
              thumbText="Digital Marketing"
              title="It Statistics Data Science And Business Analysis"
              authorAvatar={avatarImg2}
              authorName="Charles"
            />
          </div>
          <div
            className="col-xl-4 col-lg-6 col-md-6 mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <SingleCourse
              courseImage={courseImg3}
              thumbText="Digital Marketing"
              title="It Statistics Data Science And Business Analysis"
              authorAvatar={avatarImg3}
              authorName="Morgan"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Course;
