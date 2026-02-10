import React from 'react';

const SectionTitleTwo = (props) => {
  const { itemClass, subtitleClass, icon, subtitle, titleClass, title } = props;

  return (
    <div className={itemClass ? itemClass : 'it-video-2-title-box mb-10'}>
      <span
        className={
          subtitleClass ? subtitleClass : 'it-section-subtitle-5 orange'
        }
      >
        <i className={icon ? icon : 'fa-light fa-book'}></i>
        {subtitle ? subtitle : 'why choose us'}
      </span>
      <h4 className={titleClass ? titleClass : 'ed-section-title'}>
        {title ? title : `new approach to fun`}
      </h4>
    </div>
  );
};
export default SectionTitleTwo;
