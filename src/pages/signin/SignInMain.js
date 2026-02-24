import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import RightArrow from '../../components/SVG';

import signInImg from '../../assets/img/contact/signin.jpg';
import iconImg from '../../assets/img/contact/Icon.png';

//para consumir
import { loginUser } from './slices/loginThunks';
import { clearError } from './slices/loginSlice';
import { selectIsLoading, selectError, selectUser } from './slices/loginSelectors';

const SignInMain = () => {
  return (
    <main>
      <Breadcrumb title="Iniciar Sesión" />

      <div className="it-signup-area pt-120 pb-120">
        <div className="container">
          <div className="it-signup-bg p-relative">
            <div className="it-signup-thumb d-none d-lg-block">
              <img src={signInImg} alt="" />
            </div>
            <div className="row">
              <div className="col-xl-6 col-lg-6">
                <form action="#">
                  <div className="it-signup-wrap">
                    <h4 className="it-signup-title">Iniciar Sesión</h4>
                    <div className="it-signup-input-wrap">
                      <div className="it-signup-input mb-20">
                        <input type="email" placeholder="Correo Electrónico *" />
                      </div>
                      <div className="it-signup-input mb-20">
                        <input type="password" placeholder="Contraseña *" />
                      </div>
                    </div>
                    <div className="it-signup-forget d-flex justify-content-between flex-wrap">
                      <a className="mb-20" href="#">
                        Olvidaste tu contraseña?
                      </a>
                      <div className="it-signup-agree mb-20">
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
                            Manten mi sesión iniciada
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="it-signup-btn d-sm-flex justify-content-between align-items-center mb-40">
                      <button type="submit" className="ed-btn-theme">
                        Iniciar Sesión
                        <i>
                          <RightArrow />
                        </i>
                      </button>
                      
                    </div>
                    <div className="it-signup-text">
                      <span>
                        ¿No tienes una cuenta? <Link to="/student-registration">Regístrate</Link>
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

export default SignInMain;
