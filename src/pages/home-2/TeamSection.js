import React from 'react';
import SingleTeamTwo from '../../components/Team/SingleTeamTwo';
import SectionTitle from '../../components/SectionTitle';

import teamBG from '../../assets/img/team/bg-3.png';
import svgImg from '../../assets/img/about/bg-2.svg';
import teamImg1 from '../../assets/img/team/team-3-1.jpg';
import teamImg2 from '../../assets/img/team/team-3-2.jpg';
import teamImg3 from '../../assets/img/team/team-3-3.jpg';
import teamImg4 from '../../assets/img/team/team-3-4.jpg';

const Team = () => {
  return (
    <div
      id="it-team"
      className="it-team-3-area p-relative z-index pt-110 pb-90"
    >
      <div
        className="it-team-3-bg"
        style={{ backgroundImage: `url(${teamBG})` }}
      ></div>
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <SectionTitle
              itemClass="it-event-title-box text-center pb-40"
              subTitleClass="it-section-subtitle-3"
              subTitle=" Teacher"
              titleClass="it-section-title-3 text-white"
              title="meet our expert Instructor"
              titleImage={svgImg}
              hasAfterImage
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-md-6 mb-30">
            <SingleTeamTwo teamImage={teamImg1} title="Nathan Allen" />
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 mb-30">
            <SingleTeamTwo teamImage={teamImg2} title="Esther Boyd" />
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 mb-30">
            <SingleTeamTwo teamImage={teamImg3} title="Jamie Keller" />
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 mb-30">
            <SingleTeamTwo teamImage={teamImg4} title="Jesus Pendley" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Team;
