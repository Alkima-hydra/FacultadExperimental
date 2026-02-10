import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import Breadcrumb from '../../components/Breadcrumb';

const StudentRegistrationMain = () => {
  const formRef = useRef();

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
    <main>
      <Breadcrumb title="Student Registration" subTitle="Registration" />

      <div className="it-student-area pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="it-student-bg">
                <h4 className="it-student-title">Student Registration</h4>
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
                <div className="it-student-regiform">
                  <h4 className="it-student-regiform-title">Credentials</h4>
                  <form ref={formRef} onSubmit={handleSubmit}>
                    <div className="it-student-regiform-wrap">
                      <div className="it-student-regiform-item">
                        <label>First Name *</label>
                        <input type="text" />
                      </div>
                      <div className="it-student-regiform-item">
                        <label>Last Name *</label>
                        <input type="text" />
                      </div>
                      <div className="it-student-regiform-item">
                        <label>User Name *</label>
                        <input type="text" />
                      </div>
                      <div className="it-student-regiform-item">
                        <label>Email *</label>
                        <input type="email" />
                      </div>
                      <div className="it-student-regiform-item">
                        <label>Password *</label>
                        <input type="text" />
                      </div>
                      <div className="it-student-regiform-item">
                        <label>Password Confirmation *</label>
                        <input type="text" />
                      </div>
                      <div className="it-student-regiform-btn">
                        <button
                          className="ed-btn-square purple-4 w-100"
                          type="submit"
                        >
                          <span>Create account</span>
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
export default StudentRegistrationMain;
