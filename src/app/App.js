import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import 'animate.css/animate.min.css';
import { WOW } from 'wowjs';

import Preloader from '../components/Preloader';
import ScrollToTop from '../components/ScrollToTop';
import LoadTop from '../components/ScrollToTop/LoadTop';

import {
  About,
  Blog,
  BlogDetails,
  BlogSidebar,
  BlogTwo,
  Cart,
  Checkout,
  Contact,
  CourseDetails,
  CourseOne,
  CourseTwo,
  Error,
  Event,
  EventDetails,
  Faq,
  Home,
  HomeFive,
  HomeFiveOnePage,
  HomeFour,
  HomeFourOnePage,
  HomeOnePage,
  HomeThree,
  HomeThreeOnePage,
  HomeTwo,
  HomeTwoOnePage,
  InstructorRegistration,
  Price,
  Service,
  ServiceDetails,
  ServiceThree,
  ServiceTwo,
  Shop,
  ShopDetails,
  SignIn,
  SignUp,
  StudentRegistration,
  Teacher,
  TeacherDetails,
  Testimonial,
} from '../pages';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  //preloader
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  //Initialize wow
  useEffect(() => {
    new WOW({ live: false, animateClass: 'animate__animated' }).init();
  }, [location]);

  return (
    <div className="App">
      {isLoading && <Preloader />}
      <ScrollToTop />
      <LoadTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home-one-page" element={<HomeOnePage />} />
        <Route path="/home-2" element={<HomeTwo />} />
        <Route path="/home-2-one-page" element={<HomeTwoOnePage />} />
        <Route path="/home-3" element={<HomeThree />} />
        <Route path="/home-3-one-page" element={<HomeThreeOnePage />} />
        <Route path="/home-4" element={<HomeFour />} />
        <Route path="/home-4-one-page" element={<HomeFourOnePage />} />
        <Route path="/home-5" element={<HomeFive />} />
        <Route path="/home-5-one-page" element={<HomeFiveOnePage />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/course-1" element={<CourseOne />} />
        <Route path="/course-2" element={<CourseTwo />} />
        <Route path="/course-details" element={<CourseDetails />} />
        <Route path="/event" element={<Event />} />
        <Route path="/event-details" element={<EventDetails />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/teacher-details" element={<TeacherDetails />} />
        <Route
          path="/instructor-registration"
          element={<InstructorRegistration />}
        />
        <Route path="/services-1" element={<Service />} />
        <Route path="/services-2" element={<ServiceTwo />} />
        <Route path="/services-3" element={<ServiceThree />} />
        <Route path="/service-details" element={<ServiceDetails />} />
        <Route path="/student-registration" element={<StudentRegistration />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/price" element={<Price />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop-details" element={<ShopDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/blog-1" element={<Blog />} />
        <Route path="/blog-2" element={<BlogTwo />} />
        <Route path="/blog-sidebar" element={<BlogSidebar />} />
        <Route path="/blog-details" element={<BlogDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
