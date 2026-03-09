import React, { useState, useEffect } from "react"
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi"
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
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user?.token && user?.id) {

      if (user?.rol === "admin") {
        navigate("/admin")
      }

      else if (user?.rol === "docente") {
        navigate("/admin-docente")
      }

      else if (user?.rol === "estudiante") {
        navigate("/admin-estudiante")
      }

      else {
        navigate("/")
      }

    }
  }, [isAuthenticated, user, navigate])

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
                      <div className="it-signup-input mb-20" style={{ position: "relative" }}>
                        <FiMail
                          style={{
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#888"
                          }}
                        />

                        <input
                          type="email"
                          placeholder="Correo Electrónico *"
                          value={email}
                          style={{ paddingLeft: "38px" }}
                          onChange={(e) => {
                            setEmail(e.target.value.toLowerCase())
                            if (error) dispatch(clearError())
                          }}
                          required
                        />
                      </div>

                      <div className="it-signup-input mb-10" style={{ position: "relative" }}>
                        <FiLock
                          style={{
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#888"
                          }}
                        />

                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Contraseña *"
                          value={password}
                          style={{ paddingLeft: "38px", paddingRight: "40px" }}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            if (error) dispatch(clearError())
                          }}
                          required
                        />

                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#888"
                          }}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          marginBottom: "20px",
                          lineHeight: "1.4"
                        }}
                      >
                        La contraseña debe tener al menos:
                        <br />
                        • 8 caracteres  
                        <br />
                        • Una letra mayúscula  
                        <br />
                        • Un número  
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