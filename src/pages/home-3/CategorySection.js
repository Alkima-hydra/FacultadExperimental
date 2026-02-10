import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle';
import SingleCategoryTwo from '../../components/Category/SingleCategoryTwo';

import shapeImg from '../../assets/img/category/shape-1-1.png';
import titleImg from '../../assets/img/category/title.svg';
import iconImg1 from '../../assets/img/category/category-4-1.png';
import iconImg2 from '../../assets/img/category/category-4-2.png';
import iconImg3 from '../../assets/img/category/category-4-3.png';
import iconImg4 from '../../assets/img/category/category-4-4.png';
import iconImg5 from '../../assets/img/category/category-4-5.png';

const Category = () => {
  return (
    <div className="it-category-4-area p-relative pt-120 pb-90">
      <div className="it-category-4-shape-1 d-none d-lg-block">
        <img src={shapeImg} alt="" />
      </div>
      <div className="container">
        <div className="it-category-4-title-wrap mb-60">
          <div className="row align-items-end">
            <div className="col-xl-6 col-lg-6 col-md-6">
              <SectionTitle
                itemClass="it-category-4-title-box"
                subTitleClass="it-section-subtitle-5 purple-2"
                subTitle="category"
                titleClass="it-section-title-3"
                title="Favorite topics to learn"
                titleImage={titleImg}
              />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="it-category-4-btn-box text-start text-md-end pt-25">
                <Link className="ed-btn-square purple-2" to="/course-details">
                  Browse edunity Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row row-cols-xl-5 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-1">
          <div
            className="col mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".3s"
          >
            <SingleCategoryTwo
              iconImage={iconImg1}
              title="web Design"
              subTitle="08 Courses"
            />
          </div>
          <div
            className="col mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".4s"
          >
            <SingleCategoryTwo
              iconImage={iconImg2}
              title="Graphics design"
              subTitle="15 Courses"
            />
          </div>
          <div
            className="col mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <SingleCategoryTwo
              iconImage={iconImg3}
              title="Video Editor"
              subTitle="10 Courses"
            />
          </div>
          <div
            className="col mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".6s"
          >
            <SingleCategoryTwo
              iconImage={iconImg4}
              title="Content Writing"
              subTitle="07 Courses"
            />
          </div>
          <div
            className="col mb-30 wow animate__fadeInUp"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <SingleCategoryTwo
              iconImage={iconImg5}
              title="Marketing"
              subTitle="15 Courses"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Category;
