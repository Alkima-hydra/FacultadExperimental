import React from 'react';

import Avatar from '../../assets/img/avatar/avatar-3-1.png';

const SingleTestimonialTwo = (props) => {
  const { itemClass, description, authorAvatar, authorName, designation } =
    props;

  return (
    <div className={itemClass ? itemClass : 'it-testimonial-3-item'}>
      <div className="it-testimonial-3-content">
        <p>
          {description
            ? description
            : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquipLorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        </p>
        <div className="it-testimonial-3-author-box d-flex align-items-center">
          <div className="it-testimonial-3-avata">
            <img src={authorAvatar ? authorAvatar : Avatar} alt="" />
          </div>
          <div className="it-testimonial-3-author-info">
            <h5>{authorName ? authorName : 'Jorge Carter'}</h5>
            <span>{designation ? designation : 'Software Developer'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SingleTestimonialTwo;
