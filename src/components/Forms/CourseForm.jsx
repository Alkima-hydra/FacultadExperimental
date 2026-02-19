import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FiX, FiArrowRight  } from 'react-icons/fi';

const CourseForm = ({ isOpen, onClose, course, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    descripcion: '',
    instructor: '',
    price: '',
  });

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || '',
        descripcion: course.descripcion || '',
        instructor: course.instructor || '',
        price: course.price || '',
      });
    } else {
      setFormData({
        name: '',
        descripcion: '',
        instructor: '',
        price: '',
      });
    }
  }, [course]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, descripcion, instructor, price } = formData;

    if (!name || !descripcion || !instructor || !price) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    onSave({
      ...course,
      ...formData,
      price: parseFloat(price),
    });

    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 1040,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1050,
          width: '100%',
          maxWidth: 520,
          padding: '0 16px',
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: 10,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '18px 24px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h5 style={{ margin: 0, fontWeight: 700 }}>
              {course?.id ? 'Editar curso' : 'Nuevo curso'}
            </h5>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
              }}
            >
              <FiX />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} style={{ padding: 24 }}>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label>Nombre del curso</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label>Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label>Instructor</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label>Precio (USD)</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="it-signup-btn d-sm-flex justify-content-between align-items-center mb-40 mt-30">
              <button type="submit" className="ed-btn-theme">
                {course?.id ? 'Guardar cambios' : 'Crear curso'}
                <i>
                  <FiArrowRight />
                </i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CourseForm;
