import React from 'react';
import { Link } from 'react-router-dom';

import Image from '../../assets/img/team/team-1-1.png';
import RightArrowThin from '../SVG/RightArrowThin';

const SingleTeam = (props) => {
  const { itemClass, teamImage, authorName, designation } = props;

  return (
    <div className={itemClass ? itemClass : 'it-team-item'}>
      <div className="it-team-thumb-box p-relative">
        <div className="it-team-thumb">
          <img src={teamImage ? teamImage : Image} alt="" />
        </div>
        <div className="it-team-social-box">
          <button>
            <i className="fa-sharp fa-light fa-share-nodes"></i>
          </button>
          <div className="it-team-social">
            <a href="#">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-pinterest-p"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
        <div className="it-team-author-box d-flex align-items-center justify-content-between">
          <div className="it-team-author-info">
            <h5 className="it-team-author-name">
              <Link to="/teacher-details">
                {authorName ? authorName : 'Esther Howard'}
              </Link>
            </h5>
            <span>{designation ? designation : 'Junior Instructor'}</span>
          </div>
          <div className="it-team-link">
            <Link to="/teacher-details">
              <RightArrowThin />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SingleTeam;
