import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiBookOpen, FiChevronLeft, FiChevronRight, FiMenu } from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import StudentProfile from './perfilDocente';
import StudentCourses from './cursosDocente';
import DocenteNotas from './notasDocente';
import Swal from 'sweetalert2';

const NAV_ITEMS = [
    { id: 'profile', label: 'Mi Perfil',  icon: <FiUser /> },
    { id: 'courses', label: 'Mis Cursos', icon: <FiBookOpen /> },
    { id: 'notas', label: 'Mis Notas', icon: <FiBookOpen /> },
    
];

const renderContent = (activeTab) => {
    switch (activeTab) {
        case 'profile': return <StudentProfile />;
        case 'courses': return <StudentCourses />;
        case 'notas': return <DocenteNotas />;
        default:        return null;
    }
};

const StudentWrapper = () => {
    const [activeTab,  setActiveTab]  = useState('profile');
    const [collapsed,  setCollapsed]  = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navigate = useNavigate();

    const handleUserClick = async () => {
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
                popup.style.borderRadius = '14px';
                popup.style.boxShadow = '0 18px 50px rgba(16, 24, 40, 0.18)';

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

                try {
                    if (anchor) {
                        const r = anchor.getBoundingClientRect();
                        popup.style.position = 'fixed';
                        popup.style.margin = '0';

                        const maxLeft = window.innerWidth - popup.offsetWidth - 12;
                        const left = Math.max(12, Math.min(r.left, maxLeft));

                        const preferredTop = r.top - popup.offsetHeight - 12;
                        const maxTop = window.innerHeight - popup.offsetHeight - 12;
                        const top = Math.max(12, Math.min(preferredTop, maxTop));

                        popup.style.left = `${left}px`;
                        popup.style.top  = `${top}px`;
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
            {/* Mobile top bar */}
            <div className="it-admin-mobile-bar">
                <button
                    className="it-admin-mobile-bar__toggle"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Abrir menú"
                >
                    <FiMenu />
                </button>
                <h2 className="it-admin-mobile-bar__title">
                    Gatobyte <span>Docente</span>
                </h2>
            </div>

            {/* Overlay for mobile drawer */}
            <div
                className={`it-admin-sidebar-overlay${mobileOpen ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            <div className="it-admin-layout" style={{ height: '100vh' }}>

                <aside
                    className={[
                        'it-admin-sidebar',
                        collapsed  ? 'collapsed'   : '',
                        mobileOpen ? 'mobile-open' : '',
                    ].filter(Boolean).join(' ')}
                >
                    {/* Brand */}
                    <div className="it-admin-sidebar__brand">
                        <div className="it-admin-sidebar__brand-icon">
                            <MdOutlineSchool />
                        </div>
                        <span className="it-admin-sidebar__brand-text">
                            Gatobyte <span>Docente</span>
                        </span>
                    </div>

                    {/* Collapse toggle */}
                    <button
                        className="it-admin-sidebar__toggle"
                        onClick={() => setCollapsed(c => !c)}
                        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
                    >
                        {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                    </button>

                    {/* Nav */}
                    <nav className="it-admin-sidebar__nav" aria-label="Navegación docente">
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

                    {/* Footer / logout */}
                    <div className="it-admin-sidebar__footer">
                        <div
                            className="it-admin-sidebar__footer-user"
                            onClick={handleUserClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="it-admin-sidebar__footer-avatar">
                                <FiUser />
                            </div>
                            <div className="it-admin-sidebar__footer-info">
                                <p>docente</p>
                                <span>docente@edu.com</span>
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

export default StudentWrapper;