import React from 'react';
import { Link } from 'react-router-dom';

import Image from '../../assets/img/team/team-3-1.jpg';

const SingleTeamTwo = (props) => {
  const { itemClass, teamImage, title, designation } = props;

  return (
    <div className={itemClass ? itemClass : 'it-team-3-item text-center'}>
      <div className="it-team-3-thumb fix">
        <img src={teamImage ? teamImage : Image} alt="" />
      </div>
      <div className="it-team-3-content">
        <div className="it-team-3-social-box p-relative">
          <button>
            <i className="fa-light fa-share-nodes"></i>
          </button>
          <div className="it-team-3-social-wrap">
            <a href="#">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-pinterest-p"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        <div className="it-team-3-author-box">
          <h4 className="it-team-3-title">
            <Link to="/teacher-details">{title ? title : 'Nathan Allen'}</Link>
          </h4>
          <span>{designation ? designation : 'Teacher'}</span>
        </div>
      </div>
    </div>
  );
};
export default SingleTeamTwo;
