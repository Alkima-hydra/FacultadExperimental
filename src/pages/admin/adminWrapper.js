import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiBookOpen, FiChevronLeft, FiChevronRight, FiMenu, FiUser } from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import StudentsAdmin from './studentsAdmin';
import CoursesAdmin from './coursesAdmin';
import DocentesAdmin from './docentesAdmin';
import Swal from 'sweetalert2';


const NAV_ITEMS = [
    { id: 'students', label: 'Estudiantes', icon: <FiUsers /> },
    { id: 'courses',  label: 'Cursos',       icon: <FiBookOpen /> },
    { id: 'docentes', label: 'Docentes',     icon: <FiUser /> },
];

const renderContent = (activeTab) => {
    switch (activeTab) {
        case 'students': return <StudentsAdmin />;
        case 'courses':  return <CoursesAdmin />;
        case 'docentes': return <DocentesAdmin />;
        default:         return null;
    }
};

const AdminWrapper = () => {
    const [activeTab,   setActiveTab]   = useState('students');
    const [collapsed,   setCollapsed]   = useState(false);
    const [mobileOpen,  setMobileOpen]  = useState(false);

    const navigate = useNavigate();

    const handleAdminClick = async () => {
        const anchor = document.querySelector('.it-admin-sidebar__footer-user');

        const res = await Swal.fire({
            title: 'Cerrar sesión',
            html: '<div style="margin-top:6px; color:#5A6676; font-size:14px; line-height:1.35">¿Seguro que desea cerrar sesión?<br/><span style="opacity:.85">Volverá a la pantalla de inicio.</span></div>',
            icon: 'warning',
            width: 360,
            padding: '18px 18px 14px',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            focusCancel: true,
            showCloseButton: true,
            backdrop: 'rgba(0,0,0,0.18)',
            allowOutsideClick: true,
            confirmButtonColor: '#6D5DFD',
            cancelButtonColor: '#98A2B3',
            didOpen: (popup) => {
                // Make it look like a compact card
                popup.style.borderRadius = '14px';
                popup.style.boxShadow = '0 18px 50px rgba(16, 24, 40, 0.18)';

                // Smaller icon to avoid the "giant" look
                const icon = popup.querySelector('.swal2-icon');
                if (icon) {
                    icon.style.transform = 'scale(0.78)';
                    icon.style.margin = '0 auto 6px';
                }

                const title = popup.querySelector('.swal2-title');
                if (title) {
                    title.style.fontSize = '18px';
                    title.style.fontWeight = '800';
                    title.style.marginTop = '2px';
                }

                const actions = popup.querySelector('.swal2-actions');
                if (actions) {
                    actions.style.gap = '10px';
                    actions.style.marginTop = '16px';
                }

                // Anchor near the admin footer (bottom-left) if possible
                try {
                    if (anchor) {
                        const r = anchor.getBoundingClientRect();
                        popup.style.position = 'fixed';
                        popup.style.margin = '0';

                        const maxLeft = window.innerWidth - popup.offsetWidth - 12;
                        const left = Math.max(12, Math.min(r.left, maxLeft));

                        // Prefer showing above the footer card
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
            navigate('/');
        }
    };

    const handleNavClick = (id) => {
        setActiveTab(id);
        setMobileOpen(false);
    };

    return (
        <>

            <div className="it-admin-mobile-bar">
                <button
                    className="it-admin-mobile-bar__toggle"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Abrir menú"
                >
                    <FiMenu />
                </button>
                <h2 className="it-admin-mobile-bar__title">
                    Gatobyte <span>Admin</span>
                </h2>
            </div>


            <div
                className={`it-admin-sidebar-overlay${mobileOpen ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            <div className="it-admin-layout" style={{ height: '100vh' }}>

                <aside
                    className={[
                        'it-admin-sidebar',
                        collapsed   ? 'collapsed'    : '',
                        mobileOpen  ? 'mobile-open'  : '',
                    ].filter(Boolean).join(' ')}
                >

                    <div className="it-admin-sidebar__brand">
                        <div className="it-admin-sidebar__brand-icon">
                            <MdOutlineSchool />
                        </div>
                        <span className="it-admin-sidebar__brand-text">
                            Gatobyte <span>Admin</span>
                        </span>
                    </div>

                    <button
                        className="it-admin-sidebar__toggle"
                        onClick={() => setCollapsed(c => !c)}
                        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
                    >
                        {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                    </button>

                    <nav className="it-admin-sidebar__nav" aria-label="Navegación administrador">
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`it-admin-sidebar__nav-item${activeTab === item.id ? ' active' : ''}`}
                                onClick={() => handleNavClick(item.id)}
                                title={collapsed ? item.label : undefined}
                                aria-current={activeTab === item.id ? 'page' : undefined}
                            >
                                <span className="it-admin-sidebar__icon">{item.icon}</span>
                                <span className="it-admin-sidebar__label">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="it-admin-sidebar__footer">
                        <div
                            className="it-admin-sidebar__footer-user"
                            onClick={handleAdminClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="it-admin-sidebar__footer-avatar">
                                <FiUser />
                            </div>
                            <div className="it-admin-sidebar__footer-info">
                                <p>Administrador</p>
                                <span>admin@edu.com</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="it-admin-content" style={{ minHeight: 0, overflowY: 'auto' }}>
                    {renderContent(activeTab)}
                </main>
            </div>
        </>
    );
};

export default AdminWrapper;