import React, { useState } from 'react';
import { FiClock, FiUsers, FiFileText, FiAward, FiLogOut, FiBook, FiSearch } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Swal from 'sweetalert2';

/* ─── Mock data ─────────────────────────────────────────────── */
const MOCK_COURSES = [
    {
        id: 1,
        title: 'Estadística, Ciencia De Datos Y Análisis De Negocios',
        category: 'Ciencia de Datos',
        rating: 4.5,
        price: 50,
        lessons: 10,
        hours: '19h 30m',
        students: '20+',
        teacher: 'Samantha',
        teacherAvatar: 'https://i.pravatar.cc/40?img=1',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80',
        enrolled: '2024-03-15',
        progress: 65,
    },
    {
        id: 2,
        title: 'Adobe Illustrator Para Diseño Gráfico (De Cero A Pro)',
        category: 'Diseño',
        rating: 4.5,
        price: 50,
        lessons: 12,
        hours: '22h 00m',
        students: '30+',
        teacher: 'Charles',
        teacherAvatar: 'https://i.pravatar.cc/40?img=3',
        image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=500&q=80',
        enrolled: '2024-04-01',
        progress: 30,
    },
    {
        id: 3,
        title: 'SEO Desde Cero: Posiciona Tu Negocio En Google',
        category: 'Marketing Digital',
        rating: 4.0,
        price: 50,
        lessons: 8,
        hours: '14h 15m',
        students: '50+',
        teacher: 'Morgan',
        teacherAvatar: 'https://i.pravatar.cc/40?img=5',
        image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=500&q=80',
        enrolled: '2024-02-20',
        progress: 90,
    },
];

/* ─── Star rating ───────────────────────────────────────────── */
const Stars = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) stars.push(<FaStar key={i} />);
        else if (i === Math.ceil(rating) && rating % 1 !== 0) stars.push(<FaStarHalfAlt key={i} />);
        else stars.push(<FaRegStar key={i} />);
    }
    return <div className="sc-stars">{stars}</div>;
};

/* ─── Course Card ───────────────────────────────────────────── */
const CourseCard = ({ course, onUnenroll, onCertificate }) => {
    const progressColor = course.progress >= 80 ? '#22C55E' : course.progress >= 40 ? '#F59E0B' : '#6D5DFD';

    return (
        <div className="sc-card">
            {/* Image */}
            <div className="sc-card__img-wrap">
                <img src={course.image} alt={course.title} className="sc-card__img" />
                <div className="sc-card__category">{course.category}</div>
                {course.progress === 100 && (
                    <div className="sc-card__completed-badge">✓ Completado</div>
                )}
            </div>

            {/* Body */}
            <div className="sc-card__body">
                {/* Rating & price */}
                <div className="sc-card__meta-top">
                    <div className="sc-card__rating">
                        <Stars rating={course.rating} />
                        <span>{course.rating}</span>
                    </div>
                    <span className="sc-card__price">Bs {course.price}.00</span>
                </div>

                {/* Title */}
                <h3 className="sc-card__title">{course.title}</h3>

                {/* Stats */}
                <div className="sc-card__stats">
                    <span><FiFileText size={13} /> Lección {course.lessons}</span>
                    <span><FiClock size={13} /> {course.hours}</span>
                    <span><FiUsers size={13} /> Estudiantes {course.students}</span>
                </div>

                {/* Progress bar */}
                <div className="sc-card__progress-wrap">
                    <div className="sc-card__progress-header">
                        <span>Progreso</span>
                        <span style={{ color: progressColor, fontWeight: 600 }}>{course.progress}%</span>
                    </div>
                    <div className="sc-card__progress-track">
                        <div
                            className="sc-card__progress-fill"
                            style={{ width: `${course.progress}%`, background: progressColor }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="sc-card__footer">
                    <div className="sc-card__teacher">
                        <img src={course.teacherAvatar} alt={course.teacher} />
                        <span>{course.teacher}</span>
                    </div>
                    <div className="sc-card__actions">
                        {course.progress >= 80 && (
                            <button
                                className="sc-btn sc-btn--cert"
                                onClick={() => onCertificate(course)}
                                title="Solicitar certificado"
                            >
                                <FiAward size={13} /> Certificado
                            </button>
                        )}
                        <button
                            className="sc-btn sc-btn--unenroll"
                            onClick={() => onUnenroll(course)}
                            title="Desinscribirse"
                        >
                            <FiLogOut size={13} /> Salir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Main Component ────────────────────────────────────────── */
const StudentCourses = () => {
    const [courses, setCourses] = useState(MOCK_COURSES);
    const [search,  setSearch]  = useState('');

    const filtered = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleUnenroll = async (course) => {
        const res = await Swal.fire({
            title: 'Desinscribirse',
            html: `<div style="color:#5A6676;font-size:14px;line-height:1.5;margin-top:6px">
                     ¿Seguro que deseas salir del curso<br/>
                     <strong style="color:#1A1F36">"${course.title}"</strong>?<br/>
                     <span style="opacity:.8">Perderás tu progreso actual.</span>
                   </div>`,
            icon: 'warning',
            width: 400,
            showCancelButton: true,
            confirmButtonText: 'Sí, desinscribirme',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#98A2B3',
            didOpen: (popup) => {
                popup.style.borderRadius = '16px';
                const icon = popup.querySelector('.swal2-icon');
                if (icon) { icon.style.transform = 'scale(0.78)'; icon.style.margin = '0 auto 6px'; }
                const title = popup.querySelector('.swal2-title');
                if (title) { title.style.fontSize = '18px'; title.style.fontWeight = '800'; }
            },
        });
        if (res.isConfirmed) {
            setCourses(cs => cs.filter(c => c.id !== course.id));
            Swal.fire({
                title: '¡Listo!',
                text: 'Te has desinscrito del curso correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                didOpen: (popup) => { popup.style.borderRadius = '16px'; },
            });
        }
    };

    const handleCertificate = async (course) => {
        await Swal.fire({
            title: '¡Solicitud enviada!',
            html: `<div style="color:#5A6676;font-size:14px;line-height:1.5;margin-top:6px">
                     Tu certificado para el curso<br/>
                     <strong style="color:#1A1F36">"${course.title}"</strong><br/>
                     ha sido solicitado. Lo recibirás en tu correo pronto.
                   </div>`,
            icon: 'success',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#6D5DFD',
            didOpen: (popup) => {
                popup.style.borderRadius = '16px';
                const icon = popup.querySelector('.swal2-icon');
                if (icon) { icon.style.transform = 'scale(0.78)'; icon.style.margin = '0 auto 6px'; }
                const title = popup.querySelector('.swal2-title');
                if (title) { title.style.fontSize = '18px'; title.style.fontWeight = '800'; }
            },
        });
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');

                .sc-root {
                    min-height: 100%;
                    padding: 36px 32px;
                    background: #EDEEF5;
                    font-family: 'DM Sans', sans-serif;
                    box-sizing: border-box;
                }

                /* Header */
                .sc-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 14px;
                    margin-bottom: 28px;
                }
                .sc-header__left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .sc-header__pill {
                    width: 8px; height: 24px;
                    background: #6D5DFD;
                    border-radius: 4px;
                }
                .sc-header__title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 22px;
                    color: #1A1F36;
                    margin: 0;
                }
                .sc-header__count {
                    background: #EEF0FB;
                    color: #6D5DFD;
                    font-size: 12px;
                    font-weight: 700;
                    padding: 3px 10px;
                    border-radius: 99px;
                }

                /* Search */
                .sc-search {
                    position: relative;
                    width: 240px;
                }
                .sc-search input {
                    width: 100%;
                    box-sizing: border-box;
                    border: 1.5px solid #DDE0EF;
                    border-radius: 10px;
                    padding: 8px 12px 8px 34px;
                    font-size: 13px;
                    font-family: 'DM Sans', sans-serif;
                    background: #fff;
                    color: #1A1F36;
                    outline: none;
                    transition: border-color .15s, box-shadow .15s;
                }
                .sc-search input:focus {
                    border-color: #6D5DFD;
                    box-shadow: 0 0 0 3px rgba(109, 93, 253, 0.12);
                }
                .sc-search__icon {
                    position: absolute;
                    left: 10px; top: 50%;
                    transform: translateY(-50%);
                    color: #9FA8C7;
                }

                /* Empty state */
                .sc-empty {
                    text-align: center;
                    padding: 60px 20px;
                    color: #9FA8C7;
                }
                .sc-empty svg { margin-bottom: 12px; opacity: .4; }
                .sc-empty p { margin: 0; font-size: 15px; }

                /* Grid */
                .sc-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                }

                /* Card */
                .sc-card {
                    background: #fff;
                    border-radius: 16px;
                    border: 1.5px solid #E8EAF5;
                    overflow: hidden;
                    transition: transform .2s, box-shadow .2s;
                    position: relative;
                }
                .sc-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 36px rgba(109, 93, 253, 0.12);
                }

                /* Watermark */
                .sc-card::before {
                    content: '';
                    position: absolute;
                    right: -20px; bottom: 60px;
                    width: 120px; height: 120px;
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z' fill='none' stroke='%236D5DFD' stroke-width='3' opacity='0.08'/%3E%3Cpath d='M50 25 L75 37.5 L75 62.5 L50 75 L25 62.5 L25 37.5 Z' fill='none' stroke='%236D5DFD' stroke-width='2' opacity='0.06'/%3E%3C/svg%3E") no-repeat center/contain;
                    pointer-events: none;
                    z-index: 0;
                }

                .sc-card__img-wrap {
                    position: relative;
                    height: 190px;
                    overflow: hidden;
                }
                .sc-card__img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    transition: transform .4s;
                }
                .sc-card:hover .sc-card__img { transform: scale(1.04); }

                .sc-card__category {
                    position: absolute;
                    bottom: 12px; left: 12px;
                    background: rgba(26, 31, 54, 0.82);
                    backdrop-filter: blur(6px);
                    color: #fff;
                    font-size: 12px;
                    font-weight: 600;
                    padding: 5px 12px;
                    border-radius: 6px;
                    letter-spacing: .3px;
                }
                .sc-card__completed-badge {
                    position: absolute;
                    top: 10px; right: 10px;
                    background: #22C55E;
                    color: #fff;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 4px 10px;
                    border-radius: 99px;
                    letter-spacing: .3px;
                }

                .sc-card__body {
                    padding: 16px 18px 18px;
                    position: relative;
                    z-index: 1;
                }

                .sc-card__meta-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                .sc-card__rating {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #1A1F36;
                }
                .sc-stars {
                    display: flex;
                    gap: 2px;
                    color: #F59E0B;
                    font-size: 13px;
                }
                .sc-card__price {
                    color: #6D5DFD;
                    font-weight: 700;
                    font-size: 14px;
                }

                .sc-card__title {
                    font-size: 15px;
                    font-weight: 700;
                    color: #1A1F36;
                    margin: 0 0 12px;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .sc-card__stats {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    background: #F7F8FC;
                    border-radius: 9px;
                    padding: 9px 12px;
                    margin-bottom: 14px;
                }
                .sc-card__stats span {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 12px;
                    color: #5A6676;
                    font-weight: 500;
                }

                /* Progress */
                .sc-card__progress-wrap { margin-bottom: 14px; }
                .sc-card__progress-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: #9FA8C7;
                    font-weight: 600;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                    letter-spacing: .4px;
                }
                .sc-card__progress-track {
                    height: 6px;
                    background: #EEF0FB;
                    border-radius: 99px;
                    overflow: hidden;
                }
                .sc-card__progress-fill {
                    height: 100%;
                    border-radius: 99px;
                    transition: width .6s cubic-bezier(.4,0,.2,1);
                }

                /* Footer */
                .sc-card__footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .sc-card__teacher {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #1A1F36;
                }
                .sc-card__teacher img {
                    width: 32px; height: 32px;
                    border-radius: 50%;
                    border: 2px solid #E8EAF5;
                    object-fit: cover;
                }

                /* Action buttons */
                .sc-card__actions {
                    display: flex;
                    gap: 6px;
                }
                .sc-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 7px 13px;
                    border-radius: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    transition: all .18s;
                    white-space: nowrap;
                }
                .sc-btn--cert {
                    background: #6D5DFD;
                    color: #fff;
                    box-shadow: 0 3px 10px rgba(109, 93, 253, 0.3);
                }
                .sc-btn--cert:hover {
                    background: #5A4AE8;
                    transform: translateY(-1px);
                    box-shadow: 0 5px 14px rgba(109, 93, 253, 0.38);
                }
                .sc-btn--unenroll {
                    background: transparent;
                    color: #EF4444;
                    border: 1.5px solid #FCA5A5;
                }
                .sc-btn--unenroll:hover {
                    background: #FEF2F2;
                    border-color: #EF4444;
                }

                /* Responsive */
                @media (max-width: 600px) {
                    .sc-root { padding: 20px 14px; }
                    .sc-grid { grid-template-columns: 1fr; }
                    .sc-search { width: 100%; }
                    .sc-header { flex-direction: column; align-items: flex-start; }
                }
            `}</style>

            <div className="sc-root">
                {/* Header */}
                <div className="sc-header">
                    <div className="sc-header__left">
                        <div className="sc-header__pill" />
                        <h1 className="sc-header__title">Mis Cursos</h1>
                        <span className="sc-header__count">{courses.length} inscritos</span>
                    </div>
                    <div className="sc-search">
                        <FiSearch size={14} className="sc-search__icon" />
                        <input
                            type="text"
                            placeholder="Buscar curso..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="sc-empty">
                        <FiBook size={48} />
                        <p>{search ? 'No se encontraron cursos con ese criterio.' : 'No estás inscrito en ningún curso.'}</p>
                    </div>
                ) : (
                    <div className="sc-grid">
                        {filtered.map(course => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                onUnenroll={handleUnenroll}
                                onCertificate={handleCertificate}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default StudentCourses;