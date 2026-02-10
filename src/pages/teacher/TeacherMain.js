import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import SectionTitle from '../../components/SectionTitle';
import SingleTeamThree from '../../components/Team/SingleTeamThree';

import teamImg1 from '../../assets/img/team/team-4-1.jpg';
import teamImg2 from '../../assets/img/team/team-4-2.jpg';
import teamImg3 from '../../assets/img/team/team-4-3.jpg';
import teamImg4 from '../../assets/img/team/team-4-4.jpg';
import teamImg5 from '../../assets/img/team/team-4-5.jpg';
import teamImg6 from '../../assets/img/team/team-4-6.jpg';
import teamImg7 from '../../assets/img/team/team-4-7.jpg';
import teamImg8 from '../../assets/img/team/team-4-8.jpg';

const TeacherMain = () => {
  return (
    <main>
      <Breadcrumb title="Teacher" />

      <div className="ed-team-area p-relative inner-style fix z-index pt-110 pb-90">
        <div className="container">
          <div className="it-team-title-wrap mb-40">
            <div className="row align-items-center justify-content-center">
              <div className="col-xl-6">
                <SectionTitle
                  itemClass="it-team-title-box text-center"
                  subTitleClass="ed-section-subtitle"
                  subTitle="Teacher"
                  titleClass="ed-section-title"
                  title="Meet Our Instructor"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleTeamThree
                teamImage={teamImg1}
                authorName="Micheal Hammond"
                designation="Teacher"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleTeamThree
                teamImage={teamImg2}
                authorName="Cheryl Curry"
                designation="Teacher"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleTeamThree
                teamImage={teamImg3}
                authorName="Willie Diaz"
                designation="Teacher"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleTeamThree
                teamImage={teamImg4}
                authorName="Jimmy Sifuentes"
                designation="Teacher"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleTeamThree
                teamImage={teamImg5}
                authorName="Justin Clark"
                designation="Teacher"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleTeamThree
                teamImage={teamImg6}
                authorName="Walter Skeete"
                designation="Teacher"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleTeamThree
                teamImage={teamImg7}
                authorName="Willie Diaz"
                designation="Teacher"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-30">
              <SingleTeamThree
                teamImage={teamImg8}
                authorName="Ann Dooley"
                designation="Teacher"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default TeacherMain;
