import React from 'react';

import instaImg1 from '../../assets/img/footer/thumb-1-1.png';
import instaImg2 from '../../assets/img/footer/thumb-1-2.png';
import instaImg3 from '../../assets/img/footer/thumb-1-3.png';
import instaImg4 from '../../assets/img/footer/thumb-1-4.png';
import instaImg5 from '../../assets/img/footer/thumb-1-5.png';
import instaImg6 from '../../assets/img/footer/thumb-1-6.png';

const OffCanvasInsta = () => {
  return (
    <div className="it-offcanvas-insta d-none d-xl-block mt-50">
      <div className="row gx-10">
        <div className="col-xl-3 mb-10">
          <div className="it-offcanvas-insta-item">
            <a href="#">
              <img className="w-100" src={instaImg1} alt="" />
            </a>
          </div>
        </div>
        <div className="col-xl-3 mb-10">
          <div className="it-offcanvas-insta-item">
            <a href="#">
              <img className="w-100" src={instaImg2} alt="" />
            </a>
          </div>
        </div>
        <div className="col-xl-3 mb-10">
          <div className="it-offcanvas-insta-item">
            <a href="#">
              <img className="w-100" src={instaImg3} alt="" />
            </a>
          </div>
        </div>
        <div className="col-xl-3 mb-10">
          <div className="it-offcanvas-insta-item">
            <a href="#">
              <img className="w-100" src={instaImg4} alt="" />
            </a>
          </div>
        </div>
        <div className="col-xl-3 mb-10">
          <div className="it-offcanvas-insta-item">
            <a href="#">
              <img className="w-100" src={instaImg3} alt="" />
            </a>
          </div>
        </div>
        <div className="col-xl-3 mb-10">
          <div className="it-offcanvas-insta-item">
            <a href="#">
              <img className="w-100" src={instaImg5} alt="" />
            </a>
          </div>
        </div>
        <div className="col-xl-3 mb-10">
          <div className="it-offcanvas-insta-item">
            <a href="#">
              <img className="w-100" src={instaImg6} alt="" />
            </a>
          </div>
        </div>
        <div className="col-xl-3 mb-10">
          <div className="it-offcanvas-insta-item">
            <a href="#">
              <img className="w-100" src={instaImg1} alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OffCanvasInsta;
