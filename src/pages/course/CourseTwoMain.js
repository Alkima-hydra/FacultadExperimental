import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import SingleCourseTwo from '../../components/Course/SingleCourseTwo';

import courseImg1 from '../../assets/img/course/course-1-1.jpg';
import courseImg2 from '../../assets/img/course/course-1-2.jpg';
import courseImg3 from '../../assets/img/course/course-1-3.jpg';
import courseImg4 from '../../assets/img/course/course-1-6.jpg';
import courseImg5 from '../../assets/img/course/course-1-7.jpg';
import courseImg6 from '../../assets/img/course/course-1-8.jpg';
import avatarImg from '../../assets/img/course/avata-1.png';

const CourseTwoMain = () => {
  return (
    <main>
      <Breadcrumb title="Course style 2" subTitle="course" />

      <div className="it-course-area it-course-style-3 it-course-bg p-relative grey-bg pt-120 pb-90">
        <div className="container">
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
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <SingleCourseTwo
                courseImage={courseImg4}
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
                courseImage={courseImg5}
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
                courseImage={courseImg6}
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
    </main>
  );
};
export default CourseTwoMain;
