import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiShoppingCart,
  FiLogOut,
  FiDollarSign
} from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { PiNotebookBold } from "react-icons/pi";
import Swal from "sweetalert2";

import { useSelector, useDispatch } from "react-redux";
import {
  selectUserId,
  selectToken,
  selectIsAuthenticated,
} from "../signin/slices/loginSelectors";

import { perfilApi } from "../../lib/api";
import { fetchCarritoByUsuarioId } from "./slicesCarrito/CarritoThunk";
import {
  selectCarrito,
  selectCarritoLoading,
} from "./slicesCarrito/CarritoSlice";

import StudentProfile from "./perfilEstudiante";
import StudentCourses from "./cursosEstudiante";
import CartMain from "./carritoCompras";
import OfertaAcademica from "./ofertaAcademica";
import StudentBalanceHistory from "./saldosMovimientos";

const NAV_ITEMS = [
  {
    id: "profile",
    label: "Mi Perfil",
    icon: <FiUser />,
    title: "Mi perfil",
    description: "Consulta y actualiza tu información personal.",
  },
  {
    id: "courses",
    label: "Mis Cursos",
    icon: <FiBookOpen />,
    title: "Mis cursos",
    description: "Revisa los cursos en los que estás inscrito.",
  },
  {
    id: "offer",
    label: "Oferta Académica",
    icon: <PiNotebookBold />,
    title: "Oferta académica",
    description: "Explora los cursos disponibles para tu inscripción.",
  },
  {
    id: "cart",
    label: "Carrito de compras",
    icon: <FiShoppingCart />,
    title: "Carrito de compras",
    description: "Administra tus cursos seleccionados antes de pagar.",
  },
  {
    id: "balances",
    label: "Saldos y Movimientos",
    icon: <FiDollarSign />,
    title: "Saldos y movimientos",
    description: "Consulta tu historial de transacciones y saldo disponible.",
  }

];

const renderContent = (activeTab, onGoToOffer) => {
  switch (activeTab) {
    case "profile":
      return <StudentProfile />;
    case "courses":
      return <StudentCourses />;
    case "offer":
      return <OfertaAcademica />;
    case "cart":
      return <CartMain onGoToOffer={onGoToOffer} />;
    case "balances":
      return <StudentBalanceHistory />;
    default:
      return null;
  }
};

const StudentWrapper = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [me, setMe] = useState({
    nombre: "Estudiante",
    mail: "—",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const isAuthed = useSelector(selectIsAuthenticated);

  const carrito = useSelector(selectCarrito);
  const carritoLoading = useSelector(selectCarritoLoading);

  const cantidadItemsCarrito = Number(carrito?.cantidad_items ?? 0);

  const activeItem = useMemo(
    () => NAV_ITEMS.find((item) => item.id === activeTab) || NAV_ITEMS[0],
    [activeTab]
  );

  useEffect(() => {
    let mounted = true;

    const loadMe = async () => {
      if (!isAuthed || !userId || !token) return;

      try {
        const json = await perfilApi.fetchPerfilByUserId(userId);

        if (!json?.ok) return;

        const u = json?.usuario || {};
        const fullName = [u.nombres, u.apellido_paterno, u.apellido_materno]
          .filter(Boolean)
          .join(" ")
          .trim();

        if (mounted) {
          setMe({
            nombre: fullName || u.nombres || "Estudiante",
            mail: u.mail || "—",
          });
        }
      } catch (error) {
        console.error("Error cargando perfil estudiante:", error);
      }
    };

    loadMe();

    return () => {
      mounted = false;
    };
  }, [isAuthed, userId, token]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCarritoByUsuarioId(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setMobileOpen(false);
      }

      if (window.innerWidth <= 991) {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStudentClick = async () => {
    const anchor = document.querySelector(".student-shell__footer-user");

    const res = await Swal.fire({
      title: "Cerrar sesión",
      html:
        '<div style="margin-top:6px; color:#5A6676; font-size:13px; line-height:1.35">¿Seguro que desea cerrar sesión?<br/><span style="opacity:.85">Volverá a la pantalla de inicio.</span></div>',
      icon: "warning",
      width: 340,
      padding: "16px 16px 12px",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
      showCloseButton: true,
      backdrop: "rgba(15,23,42,0.22)",
      allowOutsideClick: true,
      confirmButtonColor: "#6D5DFD",
      cancelButtonColor: "#98A2B3",
      didOpen: (popup) => {
        popup.style.borderRadius = "14px";
        popup.style.boxShadow = "0 18px 50px rgba(16, 24, 40, 0.18)";

        const icon = popup.querySelector(".swal2-icon");
        if (icon) {
          icon.style.transform = "scale(0.75)";
          icon.style.margin = "0 auto 4px";
        }

        const title = popup.querySelector(".swal2-title");
        if (title) {
          title.style.fontSize = "17px";
          title.style.fontWeight = "800";
          title.style.marginTop = "2px";
        }

        try {
          if (anchor) {
            const r = anchor.getBoundingClientRect();
            popup.style.position = "fixed";
            popup.style.margin = "0";

            const maxLeft = window.innerWidth - popup.offsetWidth - 12;
            const left = Math.max(12, Math.min(r.left, maxLeft));

            const preferredTop = r.top - popup.offsetHeight - 12;
            const maxTop = window.innerHeight - popup.offsetHeight - 12;
            const top = Math.max(12, Math.min(preferredTop, maxTop));

            popup.style.left = `${left}px`;
            popup.style.top = `${top}px`;
          }
        } catch {}
      },
    });

    if (res.isConfirmed) {
      setMobileOpen(false);
      navigate("/");
    }
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      <style>{`
        .student-shell {
          display: flex;
          height: 100vh;
          background: #f4f7fb;
        }

        .student-shell__overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.42);
          opacity: 0;
          pointer-events: none;
          transition: opacity .22s ease;
          z-index: 70;
        }

        .student-shell__overlay.active {
          opacity: 1;
          pointer-events: auto;
        }

        .student-shell__mobile-bar {
          display: none;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: #ffffff;
          border-bottom: 1px solid #e7ecf3;
          position: sticky;
          top: 0;
          z-index: 60;
        }

        .student-shell__mobile-toggle {
          width: 38px;
          height: 38px;
          border: none;
          border-radius: 10px;
          background: #eef2ff;
          color: #4f46e5;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
        }

        .student-shell__mobile-info {
          min-width: 0;
        }

        .student-shell__mobile-title {
          margin: 0;
          font-size: 16px;
          font-weight: 900;
          color: #111827;
          line-height: 1.15;
        }

        .student-shell__mobile-title span {
          color: #6d5dfd;
        }

        .student-shell__mobile-subtitle {
          margin: 2px 0 0;
          font-size: 11px;
          color: #6b7280;
          font-weight: 700;
        }

        .student-shell__sidebar {
          width: 248px;
          min-width: 248px;
          background: linear-gradient(180deg, #0f2f54 0%, #0d2a49 100%);
          color: #fff;
          display: flex;
          flex-direction: column;
          padding: 18px 14px 14px;
          position: relative;
          transition: width .22s ease, min-width .22s ease, transform .25s ease;
          z-index: 80;
          box-shadow: 18px 0 40px rgba(2, 18, 38, 0.08);
        }

        .student-shell__sidebar.collapsed {
          width: 82px;
          min-width: 82px;
        }

        .student-shell__brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .student-shell__brand-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #7c5cff 0%, #5f46e8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #fff;
          box-shadow: 0 12px 24px rgba(109, 93, 253, 0.24);
          flex-shrink: 0;
        }

        .student-shell__brand-text {
          min-width: 0;
        }

        .student-shell__brand-title {
          margin: 0;
          font-size: 16px;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.1;
        }

        .student-shell__brand-title span {
          color: #ffd15c;
        }

        .student-shell__brand-subtitle {
          margin: 3px 0 0;
          font-size: 11px;
          color: rgba(255,255,255,.72);
          font-weight: 700;
        }

        .student-shell__sidebar.collapsed .student-shell__brand-text {
          display: none;
        }

        .student-shell__toggle {
          position: absolute;
          top: 78px;
          right: -15px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #7c5cff 0%, #6d5dfd 100%);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(109, 93, 253, 0.26);
          font-size: 16px;
        }

        .student-shell__panel {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 13px;
          margin-bottom: 16px;
        }

        .student-shell__panel-title {
          margin: 0 0 5px;
          font-size: 14px;
          font-weight: 900;
          color: #ffffff;
        }

        .student-shell__panel-text {
          margin: 0;
          font-size: 12px;
          line-height: 1.5;
          color: rgba(255,255,255,.74);
        }

        .student-shell__sidebar.collapsed .student-shell__panel {
          display: none;
        }

        .student-shell__nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .student-shell__nav-item {
          width: 100%;
          border: none;
          background: transparent;
          color: rgba(255,255,255,.72);
          border-radius: 14px;
          padding: 12px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all .18s ease;
          position: relative;
          text-align: left;
        }

        .student-shell__nav-item:hover {
          background: rgba(255,255,255,0.08);
          color: #ffffff;
        }

        .student-shell__nav-item.active {
          background: rgba(255,255,255,0.10);
          color: #ffffff;
          box-shadow: inset 4px 0 0 #7c5cff;
        }

        .student-shell__nav-icon {
          font-size: 19px;
          width: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .student-shell__nav-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          width: 100%;
          min-width: 0;
        }

        .student-shell__nav-label {
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .student-shell__nav-badge {
          min-width: 22px;
          height: 22px;
          padding: 0 6px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #7c5cff;
          color: #fff;
          font-size: 11px;
          font-weight: 900;
          line-height: 1;
          flex-shrink: 0;
          box-shadow: 0 6px 14px rgba(109, 93, 253, 0.28);
        }

        .student-shell__sidebar.collapsed .student-shell__nav-item {
          justify-content: center;
          padding: 12px 10px;
        }

        .student-shell__sidebar.collapsed .student-shell__nav-label {
          display: none;
        }

        .student-shell__sidebar.collapsed .student-shell__nav-main {
          width: auto;
          min-width: auto;
        }

        .student-shell__sidebar.collapsed .student-shell__nav-badge {
          position: absolute;
          top: 6px;
          right: 7px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          font-size: 10px;
        }

        .student-shell__footer {
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.10);
          margin-top: 14px;
        }

        .student-shell__footer-user {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 12px;
          border-radius: 16px;
          transition: all .18s ease;
        }

        .student-shell__footer-user:hover {
          background: rgba(255,255,255,0.09);
        }

        .student-shell__footer-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #34d399 0%, #2dd4bf 100%);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .student-shell__footer-info {
          min-width: 0;
          flex: 1;
        }

        .student-shell__footer-info p {
          margin: 0;
          font-size: 13px;
          font-weight: 900;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .student-shell__footer-info span {
          display: block;
          margin-top: 2px;
          font-size: 11px;
          color: rgba(255,255,255,.72);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .student-shell__footer-action {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,.78);
          background: rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .student-shell__sidebar.collapsed .student-shell__footer-info,
        .student-shell__sidebar.collapsed .student-shell__footer-action {
          display: none;
        }

        .student-shell__sidebar.collapsed .student-shell__footer-user {
          justify-content: center;
          padding: 10px;
        }

        .student-shell__main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .student-shell__content-header {
          background: #ffffff;
          border-bottom: 1px solid #e9edf5;
          padding: 18px 22px 16px;
        }

        .student-shell__content-eyebrow {
          margin: 0 0 5px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #7c5cff;
        }

        .student-shell__content-title {
          margin: 0;
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          line-height: 1.12;
        }

        .student-shell__content-description {
          display: block;
          margin-top: 6px;
          font-size: 13px;
          color: #6b7280;
          line-height: 1.45;
        }

        .student-shell__content-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
        }

        @media (max-width: 991px) {
          .student-shell {
            display: block;
            height: 100vh;
          }

          .student-shell__mobile-bar {
            display: flex;
          }

          .student-shell__sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            transform: translateX(-100%);
            width: 248px;
            min-width: 248px;
          }

          .student-shell__sidebar.mobile-open {
            transform: translateX(0);
          }

          .student-shell__toggle {
            display: none;
          }

          .student-shell__main {
            height: calc(100vh - 63px);
          }

          .student-shell__content-header {
            padding: 16px 14px 14px;
          }

          .student-shell__content-title {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="student-shell__mobile-bar">
        <button
          className="student-shell__mobile-toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
        >
          <FiMenu />
        </button>

        <div className="student-shell__mobile-info">
          <h2 className="student-shell__mobile-title">
            Gatobyte <span>Estudiante</span>
          </h2>
          <p className="student-shell__mobile-subtitle">{activeItem.label}</p>
        </div>
      </div>

      <div
        className={`student-shell__overlay${mobileOpen ? " active" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className="student-shell">
        <aside
          className={[
            "student-shell__sidebar",
            collapsed ? "collapsed" : "",
            mobileOpen ? "mobile-open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="student-shell__brand">
            <div className="student-shell__brand-icon">
              <MdOutlineSchool />
            </div>

            <div className="student-shell__brand-text">
              <h1 className="student-shell__brand-title">
                Gatobyte <span>Estudiante</span>
              </h1>
              <p className="student-shell__brand-subtitle">Panel del estudiante</p>
            </div>
          </div>

          <button
            className="student-shell__toggle"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>

          <div className="student-shell__panel">
            <p className="student-shell__panel-title">{activeItem.title}</p>
            <p className="student-shell__panel-text">{activeItem.description}</p>
          </div>

          <nav className="student-shell__nav" aria-label="Navegación estudiante">
            {NAV_ITEMS.map((item) => {
              const isCart = item.id === "cart";
              const showCount = isCart && !carritoLoading && cantidadItemsCarrito > 0;

              return (
                <button
                  key={item.id}
                  className={`student-shell__nav-item${
                    activeTab === item.id ? " active" : ""
                  }`}
                  onClick={() => handleNavClick(item.id)}
                  title={collapsed ? item.label : undefined}
                  aria-current={activeTab === item.id ? "page" : undefined}
                >
                  <span className="student-shell__nav-icon">{item.icon}</span>

                  <div className="student-shell__nav-main">
                    <span className="student-shell__nav-label">{item.label}</span>

                    {showCount && (
                      <span className="student-shell__nav-badge">
                        {cantidadItemsCarrito}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="student-shell__footer">
            <div
              className="student-shell__footer-user"
              onClick={handleStudentClick}
              style={{ cursor: "pointer" }}
            >
              <div className="student-shell__footer-avatar">
                <FiUser />
              </div>

              <div className="student-shell__footer-info">
                <p>{me.nombre}</p>
                <span>{me.mail}</span>
              </div>

              <div className="student-shell__footer-action">
                <FiLogOut />
              </div>
            </div>
          </div>
        </aside>

        <main className="student-shell__main">
          <div className="student-shell__content-header">
            <p className="student-shell__content-eyebrow">Panel estudiante</p>
            <h1 className="student-shell__content-title">{activeItem.title}</h1>
            <span className="student-shell__content-description">
              {activeItem.description}
            </span>
          </div>

          <div className="student-shell__content-body">
            {renderContent(activeTab)}
          </div>
        </main>
      </div>
    </>
  );
};

export default StudentWrapper;