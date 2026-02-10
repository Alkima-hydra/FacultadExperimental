import React, { useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import CountUp from 'react-countup';

const Counter = ({ start, end, duration, counterSubText }) => {
  const [isVisible, setIsVisible] = useState(false);

  const onVisibilityChange = (visible) => {
    if (visible) {
      setIsVisible(true);
    }
  };

  return (
    <VisibilitySensor
      onChange={onVisibilityChange}
      partialVisibility
      delayedCall
    >
      {({ isVisible: sensorVisible }) => (
        <div>
          {sensorVisible || isVisible ? (
            <CountUp start={start} end={end} duration={duration} />
          ) : (
            start
          )}
          {counterSubText}
        </div>
      )}
    </VisibilitySensor>
  );
};
export default Counter;
