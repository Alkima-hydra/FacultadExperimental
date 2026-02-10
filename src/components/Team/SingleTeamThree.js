import React from 'react';
import { Link } from 'react-router-dom';

import Image from '../../assets/img/team/team-4-1.jpg';

const SingleTeamThree = (props) => {
  const { itemClass, teamImage, authorName, designation } = props;

  return (
    <div className={itemClass ? itemClass : 'ed-team-item'}>
      <div className="ed-team-thumb fix">
        <img src={teamImage ? teamImage : Image} alt="" />
      </div>
      <div className="ed-team-content p-relative">
        <div className="ed-team-social-box">
          <button>
            <i className="fa-light fa-share-nodes"></i>
          </button>
          <div className="ed-team-social-wrap">
            <a href="#">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        <div className="ed-team-author-box">
          <h4 className="ed-team-title">
            <Link to="/teacher-details">
              {authorName ? authorName : 'Micheal Hammond'}
            </Link>
          </h4>
          <span>{designation ? designation : 'Teacher'}</span>
        </div>
      </div>
    </div>
  );
};
export default SingleTeamThree;
