import React, { useEffect, useRef, useState } from 'react';
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from 'date-fns';
import emailjs from '@emailjs/browser';
import SectionTitle from '../../components/SectionTitle';

import shapeImg1 from '../../assets/img/contact/shape-1-1.png';
import shapeImg2 from '../../assets/img/contact/shape-1-2.png';
import shapeImg3 from '../../assets/img/contact/shape-1-3.png';
import shapeImg4 from '../../assets/img/contact/shape-1-4.png';
import titleImg from '../../assets/img/category/title.svg';
import contactBG from '../../assets/img/contact/bg-5.jpg';

const Contact = () => {
  const formRef = useRef();
  const targetDate = new Date('2024-12-01T00:00:00');

  const calculateTimeLeft = () => {
    const now = new Date();
    const timeLeft = {
      days: differenceInDays(targetDate, now),
      hours: differenceInHours(targetDate, now) % 24,
      minutes: differenceInMinutes(targetDate, now) % 60,
      seconds: differenceInSeconds(targetDate, now) % 60,
    };

    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const TimerData = [
    { countdownTimeLeft: timeLeft.days, countdownTitle: 'DAYS' },
    { countdownTimeLeft: timeLeft.hours, countdownTitle: 'HOURS' },
    { countdownTimeLeft: timeLeft.minutes, countdownTitle: 'MINUTES' },
    { countdownTimeLeft: timeLeft.seconds, countdownTitle: 'SECONDS' },
  ];

  // Emailjs Setup
  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formRef.current, {
        publicKey: 'YOUR_PUBLIC_KEY',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        }
      );
  };

  return (
    <div
      id="it-contact"
      className="it-contact-area it-contact-style-4 z-index p-relative pt-120 pb-100"
    >
      <div className="it-contact-shape-1 d-none d-lg-block">
        <img src={shapeImg1} alt="" />
      </div>
      <div className="it-contact-shape-2 d-none d-lg-block">
        <img src={shapeImg2} alt="" />
      </div>
      <div className="it-contact-shape-3 d-none d-xxl-block">
        <img src={shapeImg3} alt="" />
      </div>
      <div className="it-contact-shape-4 d-none d-lg-block">
        <img src={shapeImg4} alt="" />
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div
            className="col-xl-7 col-lg-7 wow animate__fadeInLeft"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <div className="it-contact-left">
              <SectionTitle
                itemClass="it-contact-title-box pb-20"
                subTitleClass="it-section-subtitle-5"
                subTitle="Contact With US"
                titleClass="it-section-title-3"
                title="Register Now Get Premium Online Admission"
                titleImage={titleImg}
              />
              <div className="it-contact-text pb-15">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo
                </p>
              </div>
              <div className="it-contact-timer-box mb-40">
                <div className="row">
                  {TimerData.map((timer, index) => (
                    <div
                      key={index}
                      className="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"
                    >
                      <div className="it-contact-timer text-center">
                        <h6>{timer.countdownTimeLeft}</h6>
                        <i>{timer.countdownTitle}</i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-xl-5 col-lg-5 wow animate__fadeInRight"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <div
              className="it-contact-wrap"
              style={{ backgroundImage: `url(${contactBG})` }}
            >
              <span className="it-section-subtitle-5 sky">
                <img src={titleImg} alt="" />
                get in touch
              </span>
              <h4 className="it-contact-title pb-15">
                Sign Up for Free Resources
              </h4>
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12 mb-15">
                    <div className="it-contact-input-box">
                      <input type="text" placeholder="Your Name" />
                    </div>
                  </div>
                  <div className="col-12 mb-15">
                    <div className="it-contact-input-box">
                      <input type="email" placeholder="Your Email" />
                    </div>
                  </div>
                  <div className="col-12 mb-15">
                    <div className="it-contact-input-box">
                      <input type="text" placeholder="Phone" />
                    </div>
                  </div>
                  <div className="col-12 mb-30">
                    <div className="it-contact-textarea-box">
                      <textarea placeholder="Message"></textarea>
                    </div>
                  </div>
                </div>
                <button type="submit" className="ed-btn-square">
                  <span>submit now</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
