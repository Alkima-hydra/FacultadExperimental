import React from 'react';

const SectionTitle = (props) => {
  const {
    itemClass,
    subTitleClass,
    subTitle,
    titleClass,
    title,
    titleImage,
    description,
    hasAfterImage,
  } = props;

  return (
    <div
      className={
        itemClass ? itemClass : 'ed-category-title-box text-center mb-70'
      }
    >
      <span className={subTitleClass ? subTitleClass : 'ed-section-subtitle'}>
        <img src={titleImage ? titleImage : ''} alt="" />
        {subTitle ? subTitle : 'CATEGORIES'}{' '}
        {hasAfterImage && <img src={titleImage} alt="" />}
      </span>
      <h4 className={titleClass ? titleClass : 'ed-section-title'}>
        {title ? title : 'Browse By Categories'}
      </h4>
      <p>{description ? description : ''}</p>
    </div>
  );
};
export default SectionTitle;
