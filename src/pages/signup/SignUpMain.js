import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import RightArrow from '../../components/SVG';

import signUpImg from '../../assets/img/contact/signup.jpg';
import iconImg from '../../assets/img/contact/Icon.png';

const SignUpMain = () => {
  return (
    <main>
      <Breadcrumb title="Sign up" />

      <div className="it-signup-area pt-120 pb-120">
        <div className="container">
          <div className="it-signup-bg p-relative">
            <div className="it-signup-thumb d-none d-lg-block">
              <img src={signUpImg} alt="" />
            </div>
            <div className="row">
              <div className="col-xl-6 col-lg-6">
                <form action="#">
                  <div className="it-signup-wrap">
                    <h4 className="it-signup-title">sign up</h4>
                    <div className="it-signup-input-wrap mb-40">
                      <div className="it-signup-input mb-20">
                        <input type="text" placeholder="Full Name *" />
                      </div>
                      <div className="it-signup-input mb-20">
                        <input type="text" placeholder="Phone *" />
                      </div>
                      <div className="it-signup-input mb-20">
                        <input type="email" placeholder="Email *" />
                      </div>
                      <div className="it-signup-input mb-20">
                        <input type="password" placeholder="Password *" />
                      </div>
                    </div>
                    <div className="it-signup-btn d-sm-flex justify-content-between align-items-center mb-40">
                      <button type="submit" className="ed-btn-theme">
                        sign up
                        <i>
                          <RightArrow />
                        </i>
                      </button>
                      <div className="it-signup-link">
                        <span>or sign up with</span>
                        <a href="#">
                          <img src={iconImg} alt="" />
                        </a>
                      </div>
                    </div>
                    <div className="it-signup-text">
                      <span>
                        Already have an account?{' '}
                        <Link to="/signin">Sign In</Link>
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUpMain;
