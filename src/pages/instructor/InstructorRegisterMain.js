import React, { useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import RightArrow from '../../components/SVG';

const InstructorRegisterMain = () => {
  //Initialize Nice Select
  useEffect(() => {
    window.$('select').niceSelect();
  }, []);

  return (
    <main>
      <Breadcrumb title="Instructor Registration" subTitle="instructor" />

      <div className="it-student-area it-instructor-style pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="it-student-bg">
                <h4 className="it-student-title">Instructor Registration</h4>
                <div className="it-student-content mb-70">
                  <h4 className="it-student-subtitle">
                    Fields with are required
                  </h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim
                  </p>
                </div>
                <div className="it-student-regiform mb-40">
                  <h4 className="it-student-regiform-title">Credentials</h4>
                  <form>
                    <div className="it-student-regiform-wrap">
                      <div className="it-student-regiform-item">
                        <label>Email *</label>
                        <input type="text" />
                      </div>
                      <div className="it-student-regiform-item">
                        <label>Password minimum (5 Characters)</label>
                        <input type="text" />
                      </div>
                      <div className="it-student-regiform-item">
                        <label> Confirm Password *</label>
                        <input type="text" />
                      </div>
                    </div>
                  </form>
                </div>
                <div className="it-student-regiform">
                  <h4 className="it-student-regiform-title">
                    Profile information
                  </h4>
                  <form>
                    <div className="it-student-regiform-wrap">
                      <div className="row">
                        <div className="col-xl-6">
                          <div className="it-student-regiform-item">
                            <label>First Name *</label>
                            <input type="text" />
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div className="it-student-regiform-item">
                            <label>Last Name *</label>
                            <input type="text" />
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div className="it-student-regiform-item">
                            <label>Birth Date *</label>
                            <input type="text" />
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div className="it-student-regiform-item">
                            <label>Gender *</label>
                            <div className="postbox__select">
                              <select>
                                <option>Select an option</option>
                                <option>01 Year</option>
                                <option>02 Year</option>
                                <option>03 Year</option>
                                <option>04 Year</option>
                                <option>05 Year</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-12">
                          <div className="it-student-regiform-item">
                            <label>Nationality *</label>
                            <div className="postbox__select">
                              <select>
                                <option>Bangladesh</option>
                                <option>01 Year</option>
                                <option>02 Year</option>
                                <option>03 Year</option>
                                <option>04 Year</option>
                                <option>05 Year</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div className="it-student-regiform-item">
                            <label>Address 1 *</label>
                            <div className="postbox__select">
                              <select>
                                <option>Select an option</option>
                                <option>01 Year</option>
                                <option>02 Year</option>
                                <option>03 Year</option>
                                <option>04 Year</option>
                                <option>05 Year</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div className="it-student-regiform-item">
                            <label>Address 2 *</label>
                            <input type="email" />
                          </div>
                        </div>
                        <div className="col-xl-12">
                          <div className="it-student-regiform-item">
                            <label>Country * </label>
                            <div className="postbox__select">
                              <select>
                                <option>Bangladesh</option>
                                <option>01 Year</option>
                                <option>02 Year</option>
                                <option>03 Year</option>
                                <option>04 Year</option>
                                <option>05 Year</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-12">
                          <div className="it-student-regiform-item">
                            <label>City *</label>
                            <input type="text" />
                          </div>
                        </div>
                        <div className="col-xl-12">
                          <div className="it-student-regiform-item">
                            <label>Postcode / ZIP (optional)</label>
                            <input type="text" />
                          </div>
                        </div>
                        <div className="col-xl-12">
                          <div className="it-student-regiform-item">
                            <label>Password *</label>
                            <input type="text" />
                          </div>
                        </div>
                        <div className="col-xl-12">
                          <div className="it-student-regiform-item">
                            <label>Phone *</label>
                            <input type="text" />
                          </div>
                        </div>
                        <div className="col-xl-12">
                          <div className="it-student-regiform-item">
                            <label>Begin studies *</label>
                            <input type="text" />
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12">
                        <div className="it-student-regiform-item">
                          <label>Highest Degree *</label>
                          <div className="postbox__select">
                            <select>
                              <option>Select an option</option>
                              <option>01 Year</option>
                              <option>02 Year</option>
                              <option>03 Year</option>
                              <option>04 Year</option>
                              <option>05 Year</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12">
                        <div className="it-student-regiform-item">
                          <label>Intended Study Field *</label>
                          <div className="postbox__select">
                            <select>
                              <option>Select an option</option>
                              <option>01 Year</option>
                              <option>02 Year</option>
                              <option>03 Year</option>
                              <option>04 Year</option>
                              <option>05 Year</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12">
                        <div className="it-student-regiform-item">
                          <label>Degree Sought * </label>
                          <div className="postbox__select">
                            <select>
                              <option>Select an option</option>
                              <option>01 Year</option>
                              <option>02 Year</option>
                              <option>03 Year</option>
                              <option>04 Year</option>
                              <option>05 Year</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12">
                        <div className="postbox__resume-wrap mb-50 d-flex align-items-center flex-wrap">
                          <div className="postbox__resume mr-20">
                            <input
                              id="cv"
                              type="file"
                              hidden=""
                              className="d-none"
                            />
                            <label for="cv">
                              <span>Choose file</span>
                            </label>
                          </div>
                          <div className="postbox__resume border-transparent">
                            <input
                              id="cvv"
                              type="file"
                              hidden=""
                              className="d-none"
                            />
                            <label for="cvv">
                              <span>no file chosen</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12">
                        <div className="it-instructor-wrap">
                          <div className="it-signup-agree">
                            <h4 className="it-student-subtitle">
                              Fields with are required
                            </h4>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label"
                                for="flexCheckDefault"
                              >
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur.Excepteur sint
                                occaecat cupidatat non proident, sunt in culpa
                                qui officia deserunt mollit anim id est.
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="it-student-regiform-btn">
                        <button className="ed-btn-theme">
                          <span>
                            Submit now
                            <i>
                              <RightArrow />
                            </i>
                          </span>
                        </button>
                        <button className="ml-25 ed-btn-theme orange">
                          <span>
                            Cancel
                            <i>
                              <RightArrow />
                            </i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default InstructorRegisterMain;
