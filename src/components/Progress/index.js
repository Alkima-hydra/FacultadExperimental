import React, { useEffect, useRef, useState } from 'react';

const SingleProgress = (props) => {
  const { itemClass, progress, progressClass } = props;
  const [width, setWidth] = useState(0);
  const progressRef = useRef();

  const handleScroll = () => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (isVisible) {
        setWidth(progress);
        window.removeEventListener('scroll', handleScroll);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      window.addEventListener('scroll', handleScroll);
    }, 1500);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const style = {
    width: `${width}%`,
    transition: 'width ease-in-out 1.5s',
  };

  return (
    <div
      className={itemClass ? itemClass : 'it-progress-bar'}
      ref={progressRef}
    >
      <div className="progress">
        <div
          className={progressClass ? progressClass : 'progress-bar'}
          data-wow-delay=".1s"
          data-wow-duration="2s"
          style={style}
        >
          <span>{progress ? progress : '90'}%</span>
        </div>
      </div>
    </div>
  );
};
export default SingleProgress;
