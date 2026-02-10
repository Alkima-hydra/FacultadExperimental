import React from 'react';
import NextArrow from '../../components/SVG/NextArrow';
import PrevArrow from '../../components/SVG/PrevArrow';
import BannerSlider from '../../components/Banner';
import { VideoProvider } from '../../context/VideoContext';

const Banner = () => {
  return (
    <div className="ed-slider-3-area">
      <div className="ed-slider-3-wrapper p-relative">
        <div className="ed-slider-2-arrow-box">
          <button className="slider-prev">
            <PrevArrow />
          </button>
          <button className="slider-next">
            <NextArrow />
          </button>
        </div>
        <VideoProvider>
          <BannerSlider />
        </VideoProvider>
      </div>
    </div>
  );
};
export default Banner;
