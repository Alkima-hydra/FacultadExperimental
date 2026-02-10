import React, { createContext, useContext, useRef, useState } from 'react';

// Create the context
const VideoContext = createContext();

// Create the provider component
export const VideoProvider = ({ children }) => {
  const swiperRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [videoId, setVideoId] = useState('');

  const stopAutoplay = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
    }
  };

  const startAutoplay = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.start();
    }
  };

  return (
    <VideoContext.Provider
      value={{
        swiperRef,
        isOpen,
        setOpen,
        videoId,
        setVideoId,
        stopAutoplay,
        startAutoplay,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

// Custom hook to use the VideoContext
export const useVideoContext = () => useContext(VideoContext);
