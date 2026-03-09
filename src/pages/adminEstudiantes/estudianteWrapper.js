import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  FiUser,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiShoppingCart,
} from "react-icons/fi"
import { MdOutlineSchool } from "react-icons/md"
import { PiNotebookBold } from "react-icons/pi"
import Swal from "sweetalert2"

import { useSelector, useDispatch } from "react-redux"
import {
  selectUserId,
  selectToken,
  selectIsAuthenticated,
} from "../signin/slices/loginSelectors"

import { perfilApi } from "../../lib/api"
import {
  fetchCarritoByUsuarioId,
} from "./slicesCarrito/CarritoThunk"
import {
  selectCarrito,
  selectCarritoLoading,
} from "./slicesCarrito/CarritoSlice"

import StudentProfile from "./perfilEstudiante"
import StudentCourses from "./cursosEstudiante"
import CartMain from "./carritoCompras"
import OfertaAcademica from "./ofertaAcademica"

const NAV_ITEMS = [
  { id: "profile", label: "Mi Perfil", icon: <FiUser /> },
  { id: "courses", label: "Mis Cursos", icon: <FiBookOpen /> },
  { id: "offer", label: "Oferta Académica", icon: <PiNotebookBold /> },
  { id: "cart", label: "Carrito de compras", icon: <FiShoppingCart /> },
]

const renderContent = (activeTab) => {
  switch (activeTab) {
    case "profile":
      return <StudentProfile />
    case "courses":
      return <StudentCourses />
    case "offer":
      return <OfertaAcademica />
    case "cart":
      return <CartMain />
    default:
      return null
  }
}

const StudentWrapper = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userId = useSelector(selectUserId)
  const token = useSelector(selectToken)
  const isAuthed = useSelector(selectIsAuthenticated)

  const carrito = useSelector(selectCarrito)
  const carritoLoading = useSelector(selectCarritoLoading)

  const cantidadItemsCarrito = carrito?.cantidad_items ?? 0

  const [me, setMe] = useState({ nombre: "Estudiante", mail: "—" })

  useEffect(() => {
    let mounted = true

    async function loadMe() {
      if (!isAuthed || !userId || !token) return

      try {
        const json = await perfilApi.fetchPerfilByUserId(userId)

        if (!json?.ok) return

        const u = json.usuario || {}
        const fullName = [u.nombres, u.apellido_paterno, u.apellido_materno]
          .filter(Boolean)
          .join(" ")

        if (mounted) {
          setMe({
            nombre: fullName || u.nombres || "Estudiante",
            mail: u.mail || "—",
          })
        }
      } catch (error) {
        console.error("Error cargando perfil:", error)
      }
    }

    loadMe()

    return () => {
      mounted = false
    }
  }, [isAuthed, userId, token])

  useEffect(() => {
    if (userId) {
      dispatch(fetchCarritoByUsuarioId(userId))
    }
  }, [dispatch, userId])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setMobileOpen(false)
      }

      if (window.innerWidth <= 991) {
        setCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleUserClick = async () => {
    const anchor = document.querySelector(".it-admin-sidebar__footer-user")

    const res = await Swal.fire({
      title: "Cerrar sesión",
      html:
        '<div style="margin-top:6px; color:#5A6676; font-size:14px; line-height:1.35">¿Seguro que desea cerrar sesión?<br/><span style="opacity:.85">Volverá a la pantalla de inicio.</span></div>',
      icon: "warning",
      width: 360,
      padding: "18px 18px 14px",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
      showCloseButton: true,
      backdrop: "rgba(0,0,0,0.18)",
      allowOutsideClick: true,
      confirmButtonColor: "#6D5DFD",
      cancelButtonColor: "#98A2B3",
      didOpen: (popup) => {
        popup.style.borderRadius = "14px"
        popup.style.boxShadow = "0 18px 50px rgba(16, 24, 40, 0.18)"

        const icon = popup.querySelector(".swal2-icon")
        if (icon) {
          icon.style.transform = "scale(0.78)"
          icon.style.margin = "0 auto 6px"
        }

        const title = popup.querySelector(".swal2-title")
        if (title) {
          title.style.fontSize = "18px"
          title.style.fontWeight = "800"
          title.style.marginTop = "2px"
        }

        const actions = popup.querySelector(".swal2-actions")
        if (actions) {
          actions.style.gap = "10px"
          actions.style.marginTop = "16px"
        }

        try {
          if (anchor) {
            const r = anchor.getBoundingClientRect()
            popup.style.position = "fixed"
            popup.style.margin = "0"

            const maxLeft = window.innerWidth - popup.offsetWidth - 12
            const left = Math.max(12, Math.min(r.left, maxLeft))

            const preferredTop = r.top - popup.offsetHeight - 12
            const maxTop = window.innerHeight - popup.offsetHeight - 12
            const top = Math.max(12, Math.min(preferredTop, maxTop))

            popup.style.left = `${left}px`
            popup.style.top = `${top}px`
          }
        } catch {}
      },
    })

    if (res.isConfirmed) {
      setMobileOpen(false)
      navigate("/")
    }
  }

  const handleNavClick = (id) => {
    setActiveTab(id)
    setMobileOpen(false)
  }

  return (
    <>
      <style>{`
        .it-admin-sidebar__nav-label-wrap{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:8px;
          width:100%;
          min-width:0;
        }

        .it-admin-sidebar__nav-count{
          min-width:20px;
          height:20px;
          padding:0 6px;
          border-radius:999px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          background:#6D5DFD;
          color:#fff;
          font-size:11px;
          font-weight:800;
          line-height:1;
          flex-shrink:0;
          box-shadow:0 4px 10px rgba(109, 93, 253, 0.25);
        }

        .it-admin-sidebar.collapsed .it-admin-sidebar__nav-count{
          position:absolute;
          top:8px;
          right:10px;
          min-width:18px;
          height:18px;
          padding:0 4px;
          font-size:10px;
        }

        .it-admin-sidebar__nav-item{
          position:relative;
        }
      `}</style>

      <div className="it-admin-mobile-bar">
        <button
          className="it-admin-mobile-bar__toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
        >
          <FiMenu />
        </button>
        <h2 className="it-admin-mobile-bar__title">
          Gatobyte <span>Estudiante</span>
        </h2>
      </div>

      <div
        className={`it-admin-sidebar-overlay${mobileOpen ? " active" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className="it-admin-layout" style={{ height: "100vh" }}>
        <aside
          className={[
            "it-admin-sidebar",
            collapsed ? "collapsed" : "",
            mobileOpen ? "mobile-open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="it-admin-sidebar__brand">
            <div className="it-admin-sidebar__brand-icon">
              <MdOutlineSchool />
            </div>
            <span className="it-admin-sidebar__brand-text">
              Gatobyte <span>Estudiante</span>
            </span>
          </div>

          <button
            className="it-admin-sidebar__toggle"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>

          <nav className="it-admin-sidebar__nav" aria-label="Navegación estudiante">
            {NAV_ITEMS.map((item) => {
              const isCart = item.id === "cart"
              const showCount = isCart && !carritoLoading && cantidadItemsCarrito > 0

              return (
                <button
                  key={item.id}
                  className={`it-admin-sidebar__nav-item${
                    activeTab === item.id ? " active" : ""
                  }`}
                  onClick={() => handleNavClick(item.id)}
                  title={collapsed ? item.label : undefined}
                  aria-current={activeTab === item.id ? "page" : undefined}
                >
                  <span className="it-admin-sidebar__icon">{item.icon}</span>

                  <div className="it-admin-sidebar__nav-label-wrap">
                    <span className="it-admin-sidebar__label">{item.label}</span>

                    {showCount && (
                      <span className="it-admin-sidebar__nav-count">
                        {cantidadItemsCarrito}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </nav>

          <div className="it-admin-sidebar__footer">
            <div
              className="it-admin-sidebar__footer-user"
              onClick={handleUserClick}
              style={{ cursor: "pointer" }}
            >
              <div className="it-admin-sidebar__footer-avatar">
                <FiUser />
              </div>
              <div className="it-admin-sidebar__footer-info">
                <p>{me.nombre}</p>
                <span>{me.mail}</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="it-admin-content" style={{ minHeight: 0, overflowY: "auto" }}>
          {renderContent(activeTab)}
        </main>
      </div>
    </>
  )
}

export default StudentWrapper