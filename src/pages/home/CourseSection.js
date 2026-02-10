import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitleSpecial from '../../components/SectionTitle/SectionTitleSpecial';
import SingleCourse from '../../components/Course';
import RightArrow from '../../components/SVG';

import courseBG from '../../assets/img/course/ed-bg-1.jpg';
import courseImg1 from '../../assets/img/course/course-2-1.jpg';
import courseImg2 from '../../assets/img/course/course-2-2.jpg';
import courseImg3 from '../../assets/img/course/course-2-3.jpg';
import courseImg4 from '../../assets/img/course/course-2-4.jpg';
import courseImg5 from '../../assets/img/course/course-2-5.jpg';
import courseImg6 from '../../assets/img/course/course-2-6.jpg';
import avatarImg1 from '../../assets/img/course/ed-avata-1-1.png';
import avatarImg2 from '../../assets/img/course/ed-avata-1-2.png';
import avatarImg3 from '../../assets/img/course/ed-avata-1-3.png';
import avatarImg4 from '../../assets/img/course/ed-avata-1-4.png';
import avatarImg5 from '../../assets/img/course/ed-avata-1-5.png';
import avatarImg6 from '../../assets/img/course/ed-avata-1-6.png';

const Course = () => {
  return (
    <div
      id="it-course"
      className="it-course-area ed-course-bg ed-course-style-3 p-relative pt-120 pb-90"
      style={{ backgroundImage: `url(${courseBG})` }}
    >
      <div className="container">
        <div className="ed-course-title-wrap mb-65">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-7">
              <SectionTitleSpecial
                itemClass="it-course-title-boxmb-70 section-title-fixed-width"
                subTitle="Top Popular Course"
                preTitle="Edunity Course"
                highlightText="student"
                postTitle={`can join with us.`}
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-5">
              <div className="ed-course-button text-md-end">
                <Link className="ed-btn-theme" to="/course-1">
                  Load More Course
                  <i>
                    <RightArrow />
                  </i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
            <SingleCourse
              courseImage={courseImg1}
              thumbText="Digital Marketing"
              title="It Statistics Data Science And Business Analysis"
              authorAvatar={avatarImg1}
              authorName="Samantha"
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
            <SingleCourse
              courseImage={courseImg2}
              thumbText="Digital Marketing"
              title="Bilginer Adobe Illustrator For Graphic Design"
              authorAvatar={avatarImg2}
              authorName="Charles"
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
            <SingleCourse
              courseImage={courseImg3}
              thumbText="Digital Marketing"
              title="Starting SEO as your Home Based Business"
              authorAvatar={avatarImg3}
              authorName="Morgan"
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
            <SingleCourse
              courseImage={courseImg4}
              thumbText="Digital Marketing"
              title="Bilginer Adobe Illustrator For Graphic Design"
              authorAvatar={avatarImg4}
              authorName="Brian Brewer"
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
            <SingleCourse
              courseImage={courseImg5}
              thumbText="Digital Marketing"
              title="It Statistics Data Science And Business Analysis"
              authorAvatar={avatarImg5}
              authorName="Rodriquez"
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 mb-30">
            <SingleCourse
              courseImage={courseImg6}
              thumbText="Digital Marketing"
              title="Starting SEO as your Home Based Business"
              authorAvatar={avatarImg6}
              authorName="Morgan"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Course;
