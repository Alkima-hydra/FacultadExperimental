import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import Breadcrumb from "../../components/Breadcrumb"
import RightArrow from "../../components/SVG"
import signInImg from "../../assets/img/contact/signin.jpg"

import { loginUser } from "./slices/loginThunks"
import { clearError } from "./slices/loginSlice"
import {
  selectIsLoading,
  selectError,
  selectUser,
  selectIsAdmin,
  selectIsAuthenticated,
} from "./slices/loginSelectors"

const SignInMain = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isLoading = useSelector(selectIsLoading)
  const error = useSelector(selectError)
  const user = useSelector(selectUser)
  const isAdmin = useSelector(selectIsAdmin)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // 🔐 Si ya está autenticado (rehidratado desde localStorage),
  // redirige automáticamente
  useEffect(() => {
    if (isAuthenticated && user?.token && user?.id) {
      navigate(isAdmin ? "/admin" : "/")
    }
  }, [isAuthenticated, user, isAdmin, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) return

    dispatch(
      loginUser({
        mail: email.trim(),
        password: password.trim(),
      })
    )
  }

  return (
    <main>
      <Breadcrumb title="Iniciar Sesión" />

      <div className="it-signup-area pt-120 pb-120">
        <div className="container">
          <div className="it-signup-bg p-relative">
            
            {/* Imagen lateral */}
            <div className="it-signup-thumb d-none d-lg-block">
              <img src={signInImg} alt="Sign In" />
            </div>

            <div className="row">
              <div className="col-xl-6 col-lg-6">
                <form onSubmit={handleSubmit}>
                  <div className="it-signup-wrap">
                    <h4 className="it-signup-title">Iniciar Sesión</h4>

                    {/* Inputs */}
                    <div className="it-signup-input-wrap">
                      <div className="it-signup-input mb-20">
                        <input
                          type="email"
                          placeholder="Correo Electrónico *"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (error) dispatch(clearError())
                          }}
                          required
                        />
                      </div>

                      <div className="it-signup-input mb-20">
                        <input
                          type="password"
                          placeholder="Contraseña *"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            if (error) dispatch(clearError())
                          }}
                          required
                        />
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div
                        style={{
                          color: "red",
                          marginBottom: 15,
                          fontSize: "14px",
                        }}
                      >
                        {error}
                      </div>
                    )}

                    {/* Botón */}
                    <div className="it-signup-btn d-sm-flex justify-content-between align-items-center mb-40">
                      <button
                        type="submit"
                        className="ed-btn-theme"
                        disabled={isLoading}
                      >
                        {isLoading ? "Iniciando..." : "Iniciar Sesión"}
                        <i>
                          <RightArrow />
                        </i>
                      </button>
                    </div>

                    {/* Registro */}
                    <div className="it-signup-text">
                      <span>
                        ¿No tienes una cuenta?{" "}
                        <Link to="/student-registration">
                          Regístrate
                        </Link>
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
  )
}

export default SignInMain