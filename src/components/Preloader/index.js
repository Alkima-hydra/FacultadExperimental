import React from 'react';

import Logo from '../../assets/img/logo/pencil-upper.png';
import Icon from '../../assets/img/logo/pencil.png';

const Preloader = () => {
  return (
    <div id="it-loading">
      <div id="it-loading-center">
        <div id="it-loading-absolute">
          <div className="it-loading-content">
            <img className="it-loading-logo" src={Logo} alt="" />
            <div className="it-loading-stroke">
              <img className="it-loading-icon" src={Icon} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Preloader;
