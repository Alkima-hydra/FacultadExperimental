import React, { useState } from 'react';
import { FiUsers, FiBookOpen, FiChevronLeft, FiChevronRight, FiMenu, FiUser } from 'react-icons/fi';
import { MdOutlineSchool } from 'react-icons/md';
import StudentsAdmin from './studentsAdmin';
import CoursesAdmin from './coursesAdmin';


const NAV_ITEMS = [
    { id: 'students', label: 'Estudiantes', icon: <FiUsers /> },
    { id: 'courses',  label: 'Cursos',       icon: <FiBookOpen /> },
];

const renderContent = (activeTab) => {
    switch (activeTab) {
        case 'students': return <StudentsAdmin />;
        case 'courses':  return <CoursesAdmin />;
        default:         return null;
    }
};

const AdminWrapper = () => {
    const [activeTab,   setActiveTab]   = useState('students');
    const [collapsed,   setCollapsed]   = useState(false);
    const [mobileOpen,  setMobileOpen]  = useState(false);

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
                        <div className="it-admin-sidebar__footer-user">
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