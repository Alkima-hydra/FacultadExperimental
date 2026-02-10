import React from 'react';
import FaqOne from '../../components/Faq';
import SectionTitle from '../../components/SectionTitle';

import faqMainImg from '../../assets/img/faq/faq-2.jpg';
import faqImg from '../../assets/img/faq/thumb-2.jpg';

const FAQ = () => {
  const items = [
    {
      id: 'a',
      btnText: 'Why do students prefer online learning?',
      description:
        'Lorem ipsum dolor sit amet, consectetur elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
      faqImage: faqImg,
    },
    {
      id: 'b',
      btnText: 'Where should I study abroad?',
      description:
        'Lorem ipsum dolor sit amet, consectetur elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
      faqImage: faqImg,
    },
    {
      id: 'c',
      btnText: 'How can I contact a school directly?',
      description:
        'Lorem ipsum dolor sit amet, consectetur elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
      faqImage: faqImg,
    },
    {
      id: 'd',
      btnText: 'How do I find a school where I want to study?',
      description:
        'Lorem ipsum dolor sit amet, consectetur elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
      faqImage: faqImg,
    },
  ];

  return (
    <div id="it-faq" className="it-faq-area p-relative pt-120 pb-120">
      <div className="container">
        <div className="row align-items-center">
          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInLeft"
            data-wow-duration=".9s"
            data-wow-delay=".5s"
          >
            <div className="it-faq-thumb text-center text-lg-start">
              <img src={faqMainImg} alt="" />
            </div>
          </div>
          <div
            className="col-xl-6 col-lg-6 wow animate__fadeInRight"
            data-wow-duration=".9s"
            data-wow-delay=".7s"
          >
            <div className="it-faq-wrap">
              <SectionTitle
                itemClass="it-faq-title-box mb-20"
                subTitleClass="ed-section-subtitle"
                subTitle="faq"
                titleClass="it-section-title-5"
                title="Frequently asked some questions?"
              />

              <FaqOne items={items} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FAQ;
