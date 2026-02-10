import React from 'react';

import quoteImg from '../../assets/img/testimonial/ed-quot.png';

const SingleTestimonial = (props) => {
  const { itemClass, description, authorName, designation } = props;

  return (
    <div className={itemClass ? itemClass : 'ed-testimonial-item p-relative'}>
      <div className="ed-testimonial-quote">
        <img src={quoteImg} alt="" />
      </div>
      <div className="ed-testimonial-text">
        <p>
          {description
            ? description
            : `“Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Orci nulla pellentesque dignissim enim.
          Amet consectetur adipiscing”`}
        </p>
      </div>
      <div className="ed-testimonial-author-box">
        <h5>{authorName ? authorName : 'Ellen Perera'}</h5>
        <span>{designation ? designation : 'CEO at House of Ramen'}</span>
      </div>
    </div>
  );
};
export default SingleTestimonial;
