import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle';
import RightArrow from '../../components/SVG';
import SingleTeam from '../../components/Team';

import shapeImg1 from '../../assets/img/team/shape-1-1.png';
import shapeImg2 from '../../assets/img/team/shape-1-2.png';
import shapeImg3 from '../../assets/img/team/shape-1-3.png';
import teamImg1 from '../../assets/img/team/team-1-1.png';
import teamImg2 from '../../assets/img/team/team-1-2.png';
import teamImg3 from '../../assets/img/team/team-1-3.png';
import teamImg4 from '../../assets/img/team/team-1-4.png';

const Team = () => {
  return (
    <div className="it-team-area p-relative pt-120 pb-120">
      <div className="it-team-shape-1 d-none d-xl-block">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="it-team-shape-2 d-none d-xxl-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="it-team-shape-3 d-none d-xl-block">
        <img src={shapeImg3} alt="" />
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-5 col-lg-5">
            <div className="it-team-left">
              <SectionTitle
                itemClass="it-team-title-box pb-15"
                subTitle="OUR INSTRUCTOR"
                title="Meet Our Expert Instructor"
              />
              <div className="it-team-text">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris..
                </p>
              </div>
              <div className="it-team-button">
                <Link className="ed-btn-theme mr-15" to="/contact">
                  Contact us
                  <i>
                    <RightArrow />
                  </i>
                </Link>
                <Link className="ed-btn-dark" to="/course-1">
                  Find courses
                  <i>
                    <RightArrow />
                  </i>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-7 col-lg-7">
            <div className="it-team-right-box">
              <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-6 mb-30">
                  <SingleTeam
                    teamImage={teamImg1}
                    authorName="Esther Howard"
                    designation="Junior Instructor"
                  />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 mb-30">
                  <SingleTeam
                    teamImage={teamImg2}
                    authorName="Beverly Hathcock"
                    designation="Junior Instructor"
                  />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 mb-30">
                  <SingleTeam
                    teamImage={teamImg3}
                    authorName="Donald Gonzales"
                    designation="Junior Instructor"
                  />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 mb-30">
                  <SingleTeam
                    teamImage={teamImg4}
                    authorName="Eddie Lenz"
                    designation="Junior Instructor"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Team;
