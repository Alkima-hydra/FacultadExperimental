import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import FaqOne from '../../components/Faq';

import faqImg from '../../assets/img/faq/thumb-1.jpg';

const FaqMain = () => {
  const items = [
    {
      id: 'a',
      btnText: 'Why do students prefer online learning?',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscingelit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      faqImage: faqImg,
    },
    {
      id: 'b',
      btnText: 'Where should I study abroad?',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscingelit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      faqImage: faqImg,
    },
    {
      id: 'c',
      btnText: 'How can I contact a school directly?',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscingelit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      faqImage: faqImg,
    },
    {
      id: 'd',
      btnText: 'How do I find a school where I want to study?',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscingelit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      faqImage: faqImg,
    },
    {
      id: 'e',
      btnText: 'How do I find a school where I want to study?',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscingelit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      faqImage: faqImg,
    },
  ];
  return (
    <main>
      <Breadcrumb title="Faqs" />

      <div className="it-faq-area p-relative pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="it-faq-wrap">
                <FaqOne
                  itemClass="it-custom-accordion it-custom-accordion-style-3 inner-style"
                  items={items}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default FaqMain;
