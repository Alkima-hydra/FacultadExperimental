import React from 'react';
import { Link } from 'react-router-dom';

import Image from '../../assets/img/event/event-3-1.jpg';

const SingleEvent = (props) => {
  const {
    itemClass,
    eventImage,
    eventDate,
    eventMonth,
    title,
    description,
    eventTime,
    eventLocation,
  } = props;

  return (
    <div className={itemClass ? itemClass : 'it-event-2-item-box'}>
      <div className="it-event-2-item">
        <div className="it-event-2-thumb fix">
          <Link to="/event-details">
            <img src={eventImage ? eventImage : Image} alt="" />
          </Link>
          <div className="it-event-2-date">
            <span>
              <i>{eventDate ? eventDate : '08'}</i> <br />
              {eventMonth ? eventMonth : 'October'}
            </span>
          </div>
        </div>
        <div className="it-event-2-content">
          <h4 className="it-event-2-title">
            <Link to="/event-details">
              {title
                ? title
                : 'print, and publishing industries for previewing'}
            </Link>
          </h4>
          <div className="it-event-2-text">
            <p className="mb-0 pb-10">
              {description
                ? description
                : 'Lorem ipsum dolor sit amet, consectetur elit, sed doeiusmod tempor'}
            </p>
          </div>
          <div className="it-event-2-meta">
            <span>
              <i className="fa-light fa-clock"></i>
              Time: {eventTime ? eventTime : '11:00am 03;00pm'}
            </span>
            <span>
              <a href="#">
                <i className="fa-light fa-location-dot"></i>
              </a>
              Location: {eventLocation ? eventLocation : 'USA'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SingleEvent;
