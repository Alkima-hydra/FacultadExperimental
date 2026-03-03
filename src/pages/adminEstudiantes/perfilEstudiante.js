import React, { useState, useRef } from 'react';
import { FiEdit2, FiSave, FiX, FiCamera, FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiCalendar } from 'react-icons/fi';

/* ─── Mock initial data ─────────────────────────────────────── */
const INITIAL = {
    name:     'María González',
    email:    'maria.gonzalez@edu.com',
    phone:    '+591 70000001',
    address:  'Av. Arce 2345, La Paz, Bolivia',
    career:   'Ingeniería de Sistemas',
    enrolled: '2023-03-01',
    avatar:   null,
};

/* ─── Small helpers ─────────────────────────────────────────── */
const Field = ({ icon: Icon, label, value, editing, name, onChange, type = 'text' }) => (
    <div className="sp-field">
        <div className="sp-field__label">
            <Icon size={13} />
            <span>{label}</span>
        </div>
        {editing ? (
            <input
                className="sp-field__input"
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                autoComplete="off"
            />
        ) : (
            <p className="sp-field__value">{value || '—'}</p>
        )}
    </div>
);

/* ─── Component ─────────────────────────────────────────────── */
const StudentProfile = () => {
    const [data,    setData]    = useState(INITIAL);
    const [draft,   setDraft]   = useState(INITIAL);
    const [editing, setEditing] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileRef = useRef();

    const startEdit = () => { setDraft(data); setEditing(true); };
    const cancel    = () => { setEditing(false); setPreview(null); };
    const save      = () => {
        setData({ ...draft, avatar: preview ?? data.avatar });
        setEditing(false);
        setPreview(null);
    };

    const handleChange = e => setDraft(d => ({ ...d, [e.target.name]: e.target.value }));

    const handleAvatar = e => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
    };

    const avatarSrc = editing ? (preview ?? data.avatar) : data.avatar;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

                .sp-root {
                    min-height: 100%;
                    padding: 36px 32px;
                    background: #EDEEF5;
                    font-family: 'DM Sans', sans-serif;
                    box-sizing: border-box;
                }

                /* ── Page header ── */
                .sp-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 28px;
                }
                .sp-header__pill {
                    width: 8px; height: 24px;
                    background: #4B5FD6;
                    border-radius: 4px;
                }
                .sp-header__title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 22px;
                    color: #1A1F36;
                    margin: 0;
                }

                /* ── Card ── */
                .sp-card {
                    background: #fff;
                    border-radius: 18px;
                    padding: 36px 40px;
                    box-shadow: 0 4px 32px rgba(74, 95, 210, 0.07);
                    display: grid;
                    grid-template-columns: 220px 1fr;
                    gap: 48px;
                    max-width: 820px;
                    animation: sp-fade-in 0.35s ease;
                }
                @keyframes sp-fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* ── Left col ── */
                .sp-left {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                }

                .sp-avatar-wrap {
                    position: relative;
                    width: 160px; height: 160px;
                    border-radius: 16px;
                    background: #EEF0F8;
                    overflow: hidden;
                    flex-shrink: 0;
                    border: 2px solid #E4E6F0;
                }
                .sp-avatar-wrap img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                }
                .sp-avatar-placeholder {
                    width: 100%; height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #9FA8C7;
                }
                .sp-avatar-overlay {
                    position: absolute; inset: 0;
                    background: rgba(27, 35, 80, 0.45);
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    gap: 4px;
                    opacity: 0;
                    transition: opacity .2s;
                    cursor: pointer;
                    color: #fff;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: .4px;
                }
                .sp-avatar-wrap:hover .sp-avatar-overlay { opacity: 1; }

                .sp-name-display {
                    font-family: 'DM Serif Display', serif;
                    font-size: 18px;
                    color: #1A1F36;
                    text-align: center;
                    margin: 0;
                    line-height: 1.3;
                }
                .sp-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    background: #EEF0FB;
                    color: #4B5FD6;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 4px 10px;
                    border-radius: 99px;
                    letter-spacing: .3px;
                }

                /* ── Right col ── */
                .sp-right {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .sp-section-title {
                    font-size: 11px;
                    font-weight: 600;
                    color: #9FA8C7;
                    letter-spacing: .8px;
                    text-transform: uppercase;
                    margin: 0 0 14px;
                }

                .sp-fields-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px 32px;
                    flex: 1;
                }

                /* ── Field ── */
                .sp-field {}
                .sp-field__label {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #9FA8C7;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: .5px;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                }
                .sp-field__value {
                    margin: 0;
                    font-size: 14px;
                    color: #1A1F36;
                    font-weight: 500;
                }
                .sp-field__input {
                    width: 100%;
                    box-sizing: border-box;
                    border: 1.5px solid #DDE0EF;
                    border-radius: 8px;
                    padding: 7px 11px;
                    font-size: 14px;
                    font-family: 'DM Sans', sans-serif;
                    color: #1A1F36;
                    background: #F7F8FC;
                    outline: none;
                    transition: border-color .15s, box-shadow .15s;
                }
                .sp-field__input:focus {
                    border-color: #4B5FD6;
                    box-shadow: 0 0 0 3px rgba(75, 95, 214, 0.12);
                    background: #fff;
                }

                /* ── Divider ── */
                .sp-divider {
                    width: 100%; height: 1px;
                    background: #F0F1F8;
                    margin: 20px 0;
                }

                /* ── Actions ── */
                .sp-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 8px;
                }
                .sp-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 9px 20px;
                    border-radius: 9px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all .18s;
                    border: none;
                }
                .sp-btn--primary {
                    background: #4B5FD6;
                    color: #fff;
                    box-shadow: 0 3px 12px rgba(75, 95, 214, 0.3);
                }
                .sp-btn--primary:hover {
                    background: #3A4EC2;
                    transform: translateY(-1px);
                    box-shadow: 0 5px 16px rgba(75, 95, 214, 0.38);
                }
                .sp-btn--outline {
                    background: transparent;
                    color: #4B5FD6;
                    border: 1.5px solid #CBD0EC;
                }
                .sp-btn--outline:hover {
                    background: #F0F1FB;
                }
                .sp-btn--ghost {
                    background: transparent;
                    color: #9FA8C7;
                    border: 1.5px solid #E4E6F0;
                }
                .sp-btn--ghost:hover { background: #F7F8FC; }

                /* ── Responsive ── */
                @media (max-width: 680px) {
                    .sp-root { padding: 20px 16px; }
                    .sp-card {
                        grid-template-columns: 1fr;
                        gap: 28px;
                        padding: 24px 20px;
                    }
                    .sp-fields-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="sp-root">
                {/* Page header */}
                <div className="sp-header">
                    <div className="sp-header__pill" />
                    <h1 className="sp-header__title">Mi Perfil</h1>
                </div>

                <div className="sp-card">
                    {/* ── LEFT: avatar + name ── */}
                    <div className="sp-left">
                        <div className="sp-avatar-wrap">
                            {avatarSrc
                                ? <img src={avatarSrc} alt="avatar" />
                                : <div className="sp-avatar-placeholder"><FiUser size={56} /></div>
                            }
                            {editing && (
                                <div
                                    className="sp-avatar-overlay"
                                    onClick={() => fileRef.current.click()}
                                >
                                    <FiCamera size={20} />
                                    <span>Cambiar foto</span>
                                </div>
                            )}
                        </div>

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAvatar}
                        />

                        <p className="sp-name-display">
                            {editing ? draft.name : data.name}
                        </p>
                        <span className="sp-badge">
                            <FiBook size={11} />
                            Estudiante
                        </span>
                    </div>

                    {/* ── RIGHT: info fields ── */}
                    <div className="sp-right">
                        <p className="sp-section-title">Información Personal</p>

                        <div className="sp-fields-grid">
                            <Field
                                icon={FiUser}   label="Nombre completo"
                                name="name"     value={editing ? draft.name    : data.name}
                                editing={editing} onChange={handleChange}
                            />
                            <Field
                                icon={FiMail}   label="Correo electrónico"
                                name="email"    value={editing ? draft.email   : data.email}
                                editing={editing} onChange={handleChange} type="email"
                            />
                            <Field
                                icon={FiPhone}  label="Teléfono"
                                name="phone"    value={editing ? draft.phone   : data.phone}
                                editing={editing} onChange={handleChange}
                            />
                            <Field
                                icon={FiBook}   label="Carrera"
                                name="career"   value={editing ? draft.career  : data.career}
                                editing={editing} onChange={handleChange}
                            />
                            <Field
                                icon={FiMapPin} label="Dirección"
                                name="address"  value={editing ? draft.address : data.address}
                                editing={editing} onChange={handleChange}
                            />
                            <Field
                                icon={FiCalendar} label="Fecha de inscripción"
                                name="enrolled"   value={editing ? draft.enrolled : data.enrolled}
                                editing={editing} onChange={handleChange} type="date"
                            />
                        </div>

                        <div className="sp-divider" />

                        <div className="sp-actions">
                            {editing ? (
                                <>
                                    <button className="sp-btn sp-btn--primary" onClick={save}>
                                        <FiSave size={14} /> Guardar cambios
                                    </button>
                                    <button className="sp-btn sp-btn--ghost" onClick={cancel}>
                                        <FiX size={14} /> Cancelar
                                    </button>
                                </>
                            ) : (
                                <button className="sp-btn sp-btn--outline" onClick={startEdit}>
                                    <FiEdit2 size={14} /> Editar perfil
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentProfile;