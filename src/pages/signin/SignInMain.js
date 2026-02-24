import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import RightArrow from '../../components/SVG';

import signInImg from '../../assets/img/contact/signin.jpg';
import iconImg from '../../assets/img/contact/Icon.png';

//para consumir
import { loginUser } from './slices/loginThunks';
import { clearError } from './slices/loginSlice';
import { selectIsLoading, selectError, selectUser } from './slices/loginSelectors';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SignInMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const user = useSelector(selectUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🔐 Cuando el login sea exitoso redirigimos según el rol
  useEffect(() => {
    if (user && user.token) {
      // DEBUG (temporal): revisa en consola el objeto guardado en redux
      // Cuando todo funcione, puedes borrar este console.log.
      console.log('[login] user en redux:', user);

      // Backend envía `admin` boolean, pero por seguridad aceptamos 1/'true'
      const isAdmin = user.admin === true || user.admin === 1 || user.admin === 'true';

      navigate(isAdmin ? '/admin' : '/');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // ⚠️ AQUÍ debes ajustar el payload si tu backend usa otros nombres (ej: username en vez de email)
    dispatch(
      loginUser({
        // ⚠️ Backend espera `mail` en vez de `email`
        mail: email,
        password,
      })
    );
  };

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
                <form onSubmit={handleSubmit}>
                  <div className="it-signup-wrap">
                    <h4 className="it-signup-title">Iniciar Sesión</h4>
                    <div className="it-signup-input-wrap">
                      <div className="it-signup-input mb-20">
                        <input
                          type="email"
                          placeholder="Correo Electrónico *"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="it-signup-input mb-20">
                        <input
                          type="password"
                          placeholder="Contraseña *"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
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
                          <label className="form-check-label" htmlFor="flexCheckDefault">
                            Manten mi sesión iniciada
                          </label>
                        </div>
                      </div>
                    </div>
                    {error && (
                      <div style={{ color: 'red', marginBottom: '15px' }}>
                        {error}
                      </div>
                    )}
                    <div className="it-signup-btn d-sm-flex justify-content-between align-items-center mb-40">
                      <button type="submit" className="ed-btn-theme" disabled={isLoading}>
                        {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
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
