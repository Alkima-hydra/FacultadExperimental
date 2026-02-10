import React from 'react';

const SectionTitleSpecial = (props) => {
  const { itemClass, subTitle, preTitle, highlightText, postTitle } = props;

  return (
    <div className={itemClass ? itemClass : 'it-course-title-box mb-70'}>
      <span className="ed-section-subtitle">
        {subTitle ? subTitle : 'Top Popular Course'}
      </span>
      <h4 className="ed-section-title">
        {preTitle ? preTitle : 'Educom Course'}{' '}
        <span className="p-relative ed-title-shape  z-index">
          {highlightText ? highlightText : 'student'}
          <svg
            width="168"
            height="65"
            viewBox="0 0 168 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M73.3791 8.52241C78.4861 6.03398 82.5735 4.26476 88.8944 3.31494C94.2074 2.51659 99.6315 2.08052 104.982 1.95274C120.428 1.5839 135.136 4.94481 146.513 9.7789C158.639 14.931 166.74 22.7171 166.094 31.8511C165.316 42.8363 151.375 52.0035 133.539 57.1364C110.286 63.8284 81.7383 64.1305 58.5896 61.1289C37.5299 58.3982 11.6525 51.9446 3.59702 40.1836C-3.42072 29.9382 12.0777 18.2085 27.5463 11.6691C40.3658 6.24978 55.7075 2.97602 70.8049 4.09034C81.9407 4.91227 93.2195 6.91079 102.467 10.0494C112.882 13.5844 120.151 18.7016 127.875 23.7722"
              stroke="#704FE6"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>{' '}
        {postTitle ? postTitle : ''}
      </h4>
    </div>
  );
};
export default SectionTitleSpecial;
