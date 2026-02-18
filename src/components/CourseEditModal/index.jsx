import React, { useState, useEffect } from 'react';

const CourseEditModal = ({ isOpen, onClose, course, onSave }) => {
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
      setFormData({ name: '', descripcion: '', instructor: '', price: '' });
    }
  }, [course]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...course, ...formData, price: parseFloat(formData.price) });
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
          background: 'rgba(10, 10, 20, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 1040,
          animation: 'fadeIn .2s ease',
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
          animation: 'slideUp .25s ease',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #6c3fc5 0%, #9b59b6 100%)',
              padding: '22px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h5 style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: 18 }}>
                {course?.id ? '✏️ Editar Curso' : '➕ Nuevo Curso'}
              </h5>
              <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: 13 }}>
                {course?.id ? `ID: #${course.id}` : 'Completa los datos del nuevo curso'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                cursor: 'pointer',
                color: '#fff',
                fontSize: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background .2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} style={{ padding: '28px 28px 24px' }}>
            <div style={{ display: 'grid', gap: 18 }}>
              {[
                { label: 'Nombre del curso', name: 'name', type: 'text', placeholder: 'Ej: Curso de React' },
                { label: 'Descripción', name: 'descripcion', type: 'text', placeholder: 'Breve descripción del curso' },
                { label: 'Instructor', name: 'instructor', type: 'text', placeholder: 'Nombre del instructor' },
                { label: 'Precio (USD)', name: 'price', type: 'number', placeholder: '0.00', step: '0.01', min: '0' },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#444',
                      marginBottom: 6,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    step={field.step}
                    min={field.min}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: 8,
                      fontSize: 14,
                      color: '#333',
                      outline: 'none',
                      transition: 'border-color .2s, box-shadow .2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6c3fc5';
                      e.target.style.boxShadow = '0 0 0 3px rgba(108,63,197,0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Footer buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 22px',
                  border: '1.5px solid #ddd',
                  borderRadius: 8,
                  background: '#fff',
                  color: '#666',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all .2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#999';
                  e.currentTarget.style.color = '#333';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ddd';
                  e.currentTarget.style.color = '#666';
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 26px',
                  border: 'none',
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #6c3fc5, #9b59b6)',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'opacity .2s, transform .15s',
                  boxShadow: '0 4px 14px rgba(108,63,197,0.35)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {course?.id ? 'Guardar cambios' : 'Crear curso'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 20px)) } to { opacity: 1; transform: translate(-50%, -50%) } }
      `}</style>
    </>
  );
};

export default CourseEditModal;