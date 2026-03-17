import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import StudentsAdmin from "./studentsAdmin";
import CoursesAdmin from "./coursesAdmin";
import DocentesAdmin from "./docentesAdmin";

import {
  selectUserId,
  selectToken,
  selectIsAuthenticated,
} from "../signin/slices/loginSelectors";

import { perfilApi } from "../../lib/api";

const NAV_ITEMS = [
  {
    id: "students",
    label: "Estudiantes",
    icon: <FiUsers />,
    title: "Gestión de estudiantes",
    description: "Administra la información y registro de estudiantes.",
  },
  {
    id: "courses",
    label: "Cursos",
    icon: <FiBookOpen />,
    title: "Gestión de cursos",
    description: "Crea, edita y organiza la oferta académica.",
  },
  {
    id: "docentes",
    label: "Docentes",
    icon: <FiUser />,
    title: "Gestión de docentes",
    description: "Consulta y administra a los docentes registrados.",
  },
];

const renderContent = (activeTab) => {
  switch (activeTab) {
    case "students":
      return <StudentsAdmin />;
    case "courses":
      return <CoursesAdmin />;
    case "docentes":
      return <DocentesAdmin />;
    default:
      return null;
  }
};

const AdminWrapper = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [me, setMe] = useState({
    nombre: "Administrador",
    mail: "admin@edu.com",
  });

  const navigate = useNavigate();

  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const isAuthed = useSelector(selectIsAuthenticated);

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
            nombre: fullName || u.nombres || "Administrador",
            mail: u.mail || "admin@edu.com",
          });
        }
      } catch (error) {
        console.error("Error cargando perfil admin:", error);
      }
    };

    loadMe();

    return () => {
      mounted = false;
    };
  }, [isAuthed, userId, token]);

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

  const handleAdminClick = async () => {
    const anchor = document.querySelector(".admin-shell__footer-user");

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
        .admin-shell {
          display: flex;
          height: 100vh;
          background: #f4f7fb;
        }

        .admin-shell__overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.42);
          opacity: 0;
          pointer-events: none;
          transition: opacity .22s ease;
          z-index: 70;
        }

        .admin-shell__overlay.active {
          opacity: 1;
          pointer-events: auto;
        }

        .admin-shell__mobile-bar {
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

        .admin-shell__mobile-toggle {
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

        .admin-shell__mobile-info {
          min-width: 0;
        }

        .admin-shell__mobile-title {
          margin: 0;
          font-size: 16px;
          font-weight: 900;
          color: #111827;
          line-height: 1.15;
        }

        .admin-shell__mobile-title span {
          color: #6d5dfd;
        }

        .admin-shell__mobile-subtitle {
          margin: 2px 0 0;
          font-size: 11px;
          color: #6b7280;
          font-weight: 700;
        }

        .admin-shell__sidebar {
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

        .admin-shell__sidebar.collapsed {
          width: 82px;
          min-width: 82px;
        }

        .admin-shell__brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .admin-shell__brand-icon {
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

        .admin-shell__brand-text {
          min-width: 0;
        }

        .admin-shell__brand-title {
          margin: 0;
          font-size: 16px;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.1;
        }

        .admin-shell__brand-title span {
          color: #ffd15c;
        }

        .admin-shell__brand-subtitle {
          margin: 3px 0 0;
          font-size: 11px;
          color: rgba(255,255,255,.72);
          font-weight: 700;
        }

        .admin-shell__sidebar.collapsed .admin-shell__brand-text {
          display: none;
        }

        .admin-shell__toggle {
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

        .admin-shell__panel {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 13px;
          margin-bottom: 16px;
        }

        .admin-shell__panel-title {
          margin: 0 0 5px;
          font-size: 14px;
          font-weight: 900;
          color: #ffffff;
        }

        .admin-shell__panel-text {
          margin: 0;
          font-size: 12px;
          line-height: 1.5;
          color: rgba(255,255,255,.74);
        }

        .admin-shell__sidebar.collapsed .admin-shell__panel {
          display: none;
        }

        .admin-shell__nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .admin-shell__nav-item {
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

        .admin-shell__nav-item:hover {
          background: rgba(255,255,255,0.08);
          color: #ffffff;
        }

        .admin-shell__nav-item.active {
          background: rgba(255,255,255,0.10);
          color: #ffffff;
          box-shadow: inset 4px 0 0 #7c5cff;
        }

        .admin-shell__nav-icon {
          font-size: 19px;
          width: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .admin-shell__nav-label {
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-shell__sidebar.collapsed .admin-shell__nav-item {
          justify-content: center;
          padding: 12px 10px;
        }

        .admin-shell__sidebar.collapsed .admin-shell__nav-label {
          display: none;
        }

        .admin-shell__footer {
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.10);
          margin-top: 14px;
        }

        .admin-shell__footer-user {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 12px;
          border-radius: 16px;
          transition: all .18s ease;
        }

        .admin-shell__footer-user:hover {
          background: rgba(255,255,255,0.09);
        }

        .admin-shell__footer-avatar {
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

        .admin-shell__footer-info {
          min-width: 0;
          flex: 1;
        }

        .admin-shell__footer-info p {
          margin: 0;
          font-size: 13px;
          font-weight: 900;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-shell__footer-info span {
          display: block;
          margin-top: 2px;
          font-size: 11px;
          color: rgba(255,255,255,.72);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-shell__footer-action {
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

        .admin-shell__sidebar.collapsed .admin-shell__footer-info,
        .admin-shell__sidebar.collapsed .admin-shell__footer-action {
          display: none;
        }

        .admin-shell__sidebar.collapsed .admin-shell__footer-user {
          justify-content: center;
          padding: 10px;
        }

        .admin-shell__main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .admin-shell__content-header {
          background: #ffffff;
          border-bottom: 1px solid #e9edf5;
          padding: 18px 22px 16px;
        }

        .admin-shell__content-eyebrow {
          margin: 0 0 5px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #7c5cff;
        }

        .admin-shell__content-title {
          margin: 0;
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          line-height: 1.12;
        }

        .admin-shell__content-description {
          display: block;
          margin-top: 6px;
          font-size: 13px;
          color: #6b7280;
          line-height: 1.45;
        }

        .admin-shell__content-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
        }

        @media (max-width: 991px) {
          .admin-shell {
            display: block;
            height: 100vh;
          }

          .admin-shell__mobile-bar {
            display: flex;
          }

          .admin-shell__sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            transform: translateX(-100%);
            width: 248px;
            min-width: 248px;
          }

          .admin-shell__sidebar.mobile-open {
            transform: translateX(0);
          }

          .admin-shell__toggle {
            display: none;
          }

          .admin-shell__main {
            height: calc(100vh - 63px);
          }

          .admin-shell__content-header {
            padding: 16px 14px 14px;
          }

          .admin-shell__content-title {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="admin-shell__mobile-bar">
        <button
          className="admin-shell__mobile-toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
        >
          <FiMenu />
        </button>

        <div className="admin-shell__mobile-info">
          <h2 className="admin-shell__mobile-title">
            Gatobyte <span>Admin</span>
          </h2>
          <p className="admin-shell__mobile-subtitle">{activeItem.label}</p>
        </div>
      </div>

      <div
        className={`admin-shell__overlay${mobileOpen ? " active" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className="admin-shell">
        <aside
          className={[
            "admin-shell__sidebar",
            collapsed ? "collapsed" : "",
            mobileOpen ? "mobile-open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="admin-shell__brand">
            <div className="admin-shell__brand-icon">
              <MdOutlineSchool />
            </div>

            <div className="admin-shell__brand-text">
              <h1 className="admin-shell__brand-title">
                Gatobyte <span>Admin</span>
              </h1>
              <p className="admin-shell__brand-subtitle">Panel administrativo</p>
            </div>
          </div>

          <button
            className="admin-shell__toggle"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>

          <div className="admin-shell__panel">
            <p className="admin-shell__panel-title">{activeItem.title}</p>
            <p className="admin-shell__panel-text">{activeItem.description}</p>
          </div>

          <nav className="admin-shell__nav" aria-label="Navegación administrador">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`admin-shell__nav-item${
                  activeTab === item.id ? " active" : ""
                }`}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : undefined}
                aria-current={activeTab === item.id ? "page" : undefined}
              >
                <span className="admin-shell__nav-icon">{item.icon}</span>
                <span className="admin-shell__nav-label">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="admin-shell__footer">
            <div
              className="admin-shell__footer-user"
              onClick={handleAdminClick}
              style={{ cursor: "pointer" }}
            >
              <div className="admin-shell__footer-avatar">
                <FiUser />
              </div>

              <div className="admin-shell__footer-info">
                <p>{me.nombre}</p>
                <span>{me.mail}</span>
              </div>

              <div className="admin-shell__footer-action">
                <FiLogOut />
              </div>
            </div>
          </div>
        </aside>

        <main className="admin-shell__main">
          <div className="admin-shell__content-header">
            <p className="admin-shell__content-eyebrow">Panel administrador</p>
            <h1 className="admin-shell__content-title">{activeItem.title}</h1>
            <span className="admin-shell__content-description">
              {activeItem.description}
            </span>
          </div>

          <div className="admin-shell__content-body">
            {renderContent(activeTab)}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminWrapper;