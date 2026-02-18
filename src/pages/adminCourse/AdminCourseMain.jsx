import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import CourseEditModal from '../../components/CourseEditModal'; // ajusta la ruta según tu estructura

import productImg1 from '../../assets/img/cart/cart-1.png';
import productImg2 from '../../assets/img/cart/cart-2.png';
import productImg3 from '../../assets/img/cart/cart-3.png';
import productImg4 from '../../assets/img/cart/cart-4.png';

const initialItems = [
  {
    id: 1,
    name: 'Curso de React',
    descripcion: 'Aprende React desde cero hasta avanzado.',
    instructor: 'Juan Pérez',
    price: 180,
    image: productImg1,
  },
  {
    id: 2,
    name: 'Curso de JavaScript',
    descripcion: 'Domina JavaScript moderno ES6+.',
    instructor: 'María López',
    price: 90.5,
    image: productImg2,
  },
  {
    id: 3,
    name: 'Curso de Python',
    descripcion: 'Programación en Python para todos.',
    instructor: 'Carlos Ramírez',
    price: 160,
    image: productImg3,
  },
  {
    id: 4,
    name: 'Curso de Node.js',
    descripcion: 'Backend con Node y Express.',
    instructor: 'Ana Torres',
    price: 99.5,
    image: productImg4,
  },
];

const AdminCourseMain = () => {
  const [products, setProducts] = useState(initialItems);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Abrir modal para editar un curso existente
  const handleEdit = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  // Abrir modal para agregar un nuevo curso
  const handleAdd = () => {
    setSelectedCourse(null);
    setModalOpen(true);
  };

  // Eliminar curso
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este curso?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Guardar (crear o actualizar)
  const handleSave = (courseData) => {
    if (courseData.id) {
      // Editar existente
      setProducts((prev) =>
        prev.map((p) => (p.id === courseData.id ? { ...p, ...courseData } : p))
      );
    } else {
      // Crear nuevo
      const newId = Math.max(...products.map((p) => p.id), 0) + 1;
      setProducts((prev) => [
        ...prev,
        { ...courseData, id: newId, image: productImg1 },
      ]);
    }
  };

  // Filtrar por búsqueda
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.instructor.toLowerCase().includes(search.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.reduce((acc, p) => acc + p.price, 0);

  return (
    <main>
      <Breadcrumb title="Admin de cursos" subTitle="Panel de administración" />

      {/* ── Panel de control ── */}
      <section style={{ background: '#f8f6fd', borderBottom: '1px solid #ede8f7', padding: '24px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Búsqueda */}
            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 360 }}>
              <span
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9b8ecb',
                  fontSize: 15,
                  pointerEvents: 'none',
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre, instructor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  border: '1.5px solid #ddd6f3',
                  borderRadius: 10,
                  fontSize: 14,
                  color: '#333',
                  background: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color .2s, box-shadow .2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6c3fc5';
                  e.target.style.boxShadow = '0 0 0 3px rgba(108,63,197,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ddd6f3';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#aaa',
                    fontSize: 16,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Contador */}
            <div style={{ color: '#7c6ea5', fontSize: 13, fontWeight: 500 }}>
              {filtered.length} curso{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={handleAdd}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #6c3fc5, #9b59b6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  boxShadow: '0 4px 14px rgba(108,63,197,0.3)',
                  transition: 'opacity .2s, transform .15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.88';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>＋</span> Agregar curso
              </button>

              <button
                style={{
                  padding: '10px 20px',
                  background: '#fff',
                  color: '#6c3fc5',
                  border: '1.5px solid #c2b0e8',
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  transition: 'all .2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f3eeff';
                  e.currentTarget.style.borderColor = '#6c3fc5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#c2b0e8';
                }}
              >
                Borrar
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div
            style={{
              display: 'flex',
              gap: 14,
              marginTop: 18,
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'Total cursos', value: products.length, icon: '📚' },
              { label: 'Resultados', value: filtered.length, icon: '🔎' },
              { label: 'Valor total', value: `$${total.toFixed(2)}`, icon: '💰' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: '#fff',
                  border: '1px solid #ede8f7',
                  borderRadius: 10,
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 1px 4px rgba(108,63,197,0.07)',
                }}
              >
                <span style={{ fontSize: 20 }}>{stat.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: '#9b8ecb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#3d2d6e' }}>
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tabla de cursos ── */}
      <section className="cart-area pt-40 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <form>
                <div
                  className="table-content table-responsive wow animate__fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".3s"
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="product-thumbnail">Imagen</th>
                        <th className="cart-product-name">Curso</th>
                        <th className="product-price">Precio</th>
                        <th className="product-quantity">Descripción</th>
                        <th className="product-subtotal">Instructor</th>
                        <th className="product-remove">Editar</th>
                        <th className="product-remove">Eliminar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: '#aaa' }}>
                            No se encontraron cursos con "{search}".
                          </td>
                        </tr>
                      ) : (
                        filtered.map((product) => (
                          <tr key={product.id}>
                            <td className="product-thumbnail">
                              <Link to="/product-details">
                                <img src={product.image} alt={product.name} />
                              </Link>
                            </td>
                            <td className="product-name">
                              <Link to="/product-details">{product.name}</Link>
                            </td>
                            <td className="product-price">
                              <span className="amount">${product.price.toFixed(2)}</span>
                            </td>
                            <td className="product-quantity">{product.descripcion}</td>
                            <td className="product-subtotal">{product.instructor}</td>

                            {/* Botón Editar */}
                            <td className="product-remove">
                              <button
                                type="button"
                                onClick={() => handleEdit(product)}
                                title="Editar curso"
                                style={{
                                  background: 'linear-gradient(135deg, #6c3fc5, #9b59b6)',
                                  border: 'none',
                                  borderRadius: 6,
                                  padding: '6px 12px',
                                  color: '#fff',
                                  cursor: 'pointer',
                                  fontSize: 13,
                                  fontWeight: 600,
                                  transition: 'opacity .2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                              >
                                ✏️ Editar
                              </button>
                            </td>

                            {/* Botón Eliminar */}
                            <td className="product-remove">
                              <button
                                type="button"
                                onClick={() => handleDelete(product.id)}
                                title="Eliminar curso"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#e74c3c',
                                  cursor: 'pointer',
                                  fontSize: 18,
                                  transition: 'transform .15s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* ── Tabla de pagos askjf ── 
                <div className="row">
                  <div className="col-12">
                    <div className="coupon-all">
                      <div className="coupon">
                        <input
                          id="coupon_code"
                          className="input-text"
                          name="coupon_code"
                          placeholder="Código de cupón"
                          type="text"
                        />
                        <button className="ed-btn-square purple-4" name="apply_coupon" type="submit">
                          <span>Aplicar cupón</span>
                        </button>
                      </div>
                      <div className="coupon2">
                        <button className="ed-btn-square purple-4" name="update_cart" type="submit">
                          <span>Actualizar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-end">
                  <div className="col-md-5">
                    <div className="cart-page-total">
                      <h2>Totales</h2>
                      <ul className="mb-20">
                        <li>
                          Subtotal <span>${total.toFixed(2)}</span>
                        </li>
                        <li>
                          Total <span>${total.toFixed(2)}</span>
                        </li>
                      </ul>
                      <Link className="ed-btn-square purple-4" to="/checkout">
                        <span>Ir al pago</span>
                      </Link>
                    </div>
                  </div>
                </div>
                
                */}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modal de edición / creación ── */}
      <CourseEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        course={selectedCourse}
        onSave={handleSave}
      />
    </main>
  );
};

export default AdminCourseMain;