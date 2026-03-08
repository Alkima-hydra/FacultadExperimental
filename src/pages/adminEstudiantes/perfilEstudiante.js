import React, { useEffect, useMemo, useState } from 'react';
import {
  FiEdit2,
  FiSave,
  FiX,
  FiUser,
  FiMail,
  FiMapPin,
  FiBook,
  FiCalendar,
  FiHash,
  FiShield,
  FiLock,
  FiCheckCircle,
  FiCircle,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import {
  selectUserId,
  selectIsAuthenticated,
} from '../signin/slices/loginSelectors';

import {
  fetchPerfil,
  updatePerfilEditable,
  changePasswordPerfil,
} from './slicesPerfil/PerfilThunk';

import {
  selectPerfil,
  selectPerfilLoading,
  selectPerfilError,
  selectPerfilSuccess,
  selectEditForm,
  selectPerfilSavingProfile,
  selectPasswordForm,
  selectPerfilChangingPassword,
  setEditField,
  resetEditForm,
  updatePasswordField,
  resetPasswordForm,
  clearPerfilError,
  clearPerfilSuccess,
} from './slicesPerfil/PerfilSlice';

const swalTheme = {
  confirmButtonColor: '#704FE6',
  cancelButtonColor: '#4D5756',
  customClass: { popup: 'it-cadm-swal-popup' },
  didOpen: () => {
    const container = document.querySelector('.swal2-container');
    if (container) container.style.zIndex = '99999';
  },
};

const toastConfig = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2400,
  timerProgressBar: true,
  ...swalTheme,
};

const ReadOnlyField = ({ icon: Icon, label, value, muted = false, onBlocked }) => (
  <button
    type="button"
    className={`it-sp-field it-sp-field--readonly${muted ? ' is-muted' : ''}`}
    onClick={() => onBlocked(label)}
  >
    <div className="it-sp-field__label">
      <Icon size={13} />
      <span>{label}</span>
    </div>
    <p className="it-sp-field__value">{value || '—'}</p>
  </button>
);

const EditableField = ({
  icon: Icon,
  label,
  value,
  name,
  onChange,
  type = 'text',
  placeholder = '',
}) => (
  <div className="it-sp-field it-sp-field--editable">
    <div className="it-sp-field__label">
      <Icon size={13} />
      <span>{label}</span>
      <small>editable</small>
    </div>
    <input
      className={`it-sp-field__input${type === 'date' ? ' it-sp-field__input--date' : ''}`}
      type={type}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete="off"
    />
  </div>
);

const CheckItem = ({ ok, text }) => (
  <div className={`it-sp-check-item${ok ? ' is-ok' : ''}`}>
    {ok ? <FiCheckCircle size={15} /> : <FiCircle size={15} />}
    <span>{text}</span>
  </div>
);

const StudentProfile = () => {
  const dispatch = useDispatch();

  const userId = useSelector(selectUserId);
  const isAuthed = useSelector(selectIsAuthenticated);

  const data = useSelector(selectPerfil);
  const loading = useSelector(selectPerfilLoading);
  const reduxError = useSelector(selectPerfilError);
  const successMessage = useSelector(selectPerfilSuccess);

  const editForm = useSelector(selectEditForm);
  const isSavingProfile = useSelector(selectPerfilSavingProfile);

  const passwordForm = useSelector(selectPasswordForm);
  const isChangingPassword = useSelector(selectPerfilChangingPassword);

  const [editingProfile, setEditingProfile] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [localPasswordError, setLocalPasswordError] = useState('');

  useEffect(() => {
    if (isAuthed && userId) {
      dispatch(fetchPerfil({ userId }));
    }
  }, [dispatch, isAuthed, userId]);

  useEffect(() => {
    if (reduxError) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: reduxError,
        ...toastConfig,
      });
      dispatch(clearPerfilError());
    }
  }, [reduxError, dispatch]);

  useEffect(() => {
    if (successMessage) {
      Swal.fire({
        icon: 'success',
        title: successMessage,
        ...toastConfig,
      });
      dispatch(clearPerfilSuccess());
    }
  }, [successMessage, dispatch]);

  const nombreCompleto = useMemo(() => {
    if (!data) return '—';
    return (
      [data.nombres, data.apellido_paterno, data.apellido_materno]
        .filter(Boolean)
        .join(' ')
        .trim() || '—'
    );
  }, [data]);

  const passwordChecks = useMemo(() => {
    const pwd = passwordForm.newPassword || '';
    return {
      minLen: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      matches:
        pwd.length > 0 &&
        passwordForm.confirmPassword.length > 0 &&
        pwd === passwordForm.confirmPassword,
    };
  }, [passwordForm]);

  const handleBlockedField = (label) => {
    Swal.fire({
      title: 'Campo no editable',
      text: `"${label}" no se puede editar aquí. Contacte a soporte.`,
      icon: 'info',
      confirmButtonText: 'Entendido',
      ...swalTheme,
      showCancelButton: false,
    });
  };

  const handleStartEdit = () => {
    dispatch(resetEditForm());
    setEditingProfile(true);
  };

  const handleCancelEdit = () => {
    dispatch(resetEditForm());
    setEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    if (!data?.id_estudiante) return;

    const result = await dispatch(
      updatePerfilEditable({
        idEstudiante: data.id_estudiante,
        direccion: editForm.direccion,
        fecha_nacimiento: editForm.fecha_nacimiento,
      })
    );

    if (updatePerfilEditable.fulfilled.match(result)) {
      setEditingProfile(false);
    }
  };

  const validatePassword = () => {
    if (!passwordForm.currentPassword.trim()) {
      return 'Debes ingresar tu contraseña actual.';
    }
    if (!passwordForm.newPassword.trim()) {
      return 'Debes ingresar una nueva contraseña.';
    }
    if (passwordForm.newPassword.length < 8) {
      return 'La nueva contraseña debe tener al menos 8 caracteres.';
    }
    if (!/[A-Z]/.test(passwordForm.newPassword)) {
      return 'La nueva contraseña debe incluir al menos una mayúscula.';
    }
    if (!/[a-z]/.test(passwordForm.newPassword)) {
      return 'La nueva contraseña debe incluir al menos una minúscula.';
    }
    if (!/\d/.test(passwordForm.newPassword)) {
      return 'La nueva contraseña debe incluir al menos un número.';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return 'La confirmación no coincide con la nueva contraseña.';
    }
    return '';
  };

  const handleSavePassword = async () => {
    setLocalPasswordError('');

    const validationError = validatePassword();
    if (validationError) {
      setLocalPasswordError(validationError);
      Swal.fire({
        title: 'Revisa la contraseña',
        text: validationError,
        icon: 'warning',
        confirmButtonText: 'Entendido',
        ...swalTheme,
        showCancelButton: false,
      });
      return;
    }

    const confirm = await Swal.fire({
      title: '¿Cambiar contraseña?',
      text: 'Se actualizará tu contraseña de acceso.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      ...swalTheme,
    });

    if (!confirm.isConfirmed) return;

    const result = await dispatch(
      changePasswordPerfil({
        idEstudiante: data?.id_estudiante,
        newPassword: passwordForm.newPassword,
      })
    );

    if (changePasswordPerfil.fulfilled.match(result)) {
      setLocalPasswordError('');
      setPasswordOpen(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="it-sp-root">
          <div className="it-sp-loading-wrap">
            <div className="it-sp-loading-card">
              <div className="it-sp-spinner" />
              <p>Cargando perfil...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <style>{styles}</style>
        <div className="it-sp-root">
          <div className="it-sp-feedback-wrap">
            <div className="it-sp-feedback-card">
              <div className="it-sp-feedback-card__icon">
                <FiUser size={22} />
              </div>
              <h3>Sin datos</h3>
              <p>No hay información de perfil para mostrar.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="it-sp-root">
        <div className="it-sp-header">
          <div className="it-sp-header__left">
            <div className="it-sp-header__accent" />
            <div>

              <p className="it-sp-header__sub">
                Revisa tu información personal. Solo puedes editar tu dirección y tu fecha de nacimiento.
              </p>
            </div>
          </div>
        </div>

        <div className="it-sp-layout">
          <aside className="it-sp-sidebar">
            <div className="it-sp-profile-card">
              <div className="it-sp-profile-card__avatar">
                <FiUser size={42} />
              </div>

              <h3 className="it-sp-profile-card__name">{nombreCompleto}</h3>
              <span className="it-sp-role-badge">Estudiante</span>

              <div className="it-sp-profile-card__info-list">
                <div className="it-sp-mini-info">
                  <FiMail size={15} />
                  <div>
                    <span>Correo</span>
                    <strong>{data.mail || '—'}</strong>
                  </div>
                </div>

                <div className="it-sp-mini-info">
                  <FiMapPin size={15} />
                  <div>
                    <span>Dirección actual</span>
                    <strong>{data.direccion || '—'}</strong>
                  </div>
                </div>

                <div className="it-sp-mini-info">
                  <FiShield size={15} />
                  <div>
                    <span>Estado</span>
                    <strong>{data.estado_usuario ? 'Activo' : 'Inactivo'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="it-sp-main">
            <div className="it-sp-content-card">
              <div className="it-sp-section">
                <div className="it-sp-section__header">
                  <span className="it-sp-section__title">Información personal</span>
                </div>

                <div className="it-sp-fields-grid">
                  <ReadOnlyField icon={FiUser} label="Nombres" value={data.nombres} onBlocked={handleBlockedField} />
                  <ReadOnlyField icon={FiUser} label="Apellido paterno" value={data.apellido_paterno} onBlocked={handleBlockedField} />
                  <ReadOnlyField icon={FiUser} label="Apellido materno" value={data.apellido_materno} onBlocked={handleBlockedField} />
                  <ReadOnlyField icon={FiMail} label="Correo electrónico" value={data.mail} onBlocked={handleBlockedField} />
                  <ReadOnlyField icon={FiHash} label="CI" value={data.ci} onBlocked={handleBlockedField} />
                  <ReadOnlyField icon={FiUser} label="Género" value={data.genero} onBlocked={handleBlockedField} />
                </div>
              </div>

              <div className="it-sp-divider" />

              <div className="it-sp-section">
                <div className="it-sp-section__header">
                  <span className="it-sp-section__title">Perfil de estudiante</span>
                </div>

                <div className="it-sp-fields-grid">
                  <ReadOnlyField icon={FiBook} label="Carrera" value={data.carrera} onBlocked={handleBlockedField} />
                  <ReadOnlyField icon={FiCalendar} label="Semestre de ingreso" value={data.semestre_ingreso} onBlocked={handleBlockedField} />
                  <ReadOnlyField
                    icon={FiShield}
                    label="Estado estudiante"
                    value={data.estado_estudiante ? 'Activo' : 'Inactivo'}
                    onBlocked={handleBlockedField}
                  />
                </div>
              </div>

              <div className="it-sp-divider" />

              <div className="it-sp-section">
                <div className="it-sp-section__header it-sp-section__header--actions">
                  <div>
                    <span className="it-sp-section__title">Datos que sí puedes editar</span>
                  </div>

                  {!editingProfile ? (
                    <button
                      className="it-sp-btn it-sp-btn--outline"
                      type="button"
                      onClick={handleStartEdit}
                    >
                      <FiEdit2 />
                      <span>Editar datos</span>
                    </button>
                  ) : (
                    <div className="it-sp-inline-actions">
                      <button
                        className="it-sp-btn it-sp-btn--ghost"
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isSavingProfile}
                      >
                        <FiX />
                        <span>Cancelar</span>
                      </button>

                      <button
                        className="it-sp-btn it-sp-btn--primary"
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                      >
                        <FiSave />
                        <span>{isSavingProfile ? 'Guardando...' : 'Guardar cambios'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="it-sp-fields-grid">
                  {editingProfile ? (
                    <>
                      <EditableField
                        icon={FiMapPin}
                        label="Dirección"
                        name="direccion"
                        value={editForm.direccion}
                        onChange={(e) =>
                          dispatch(setEditField({ name: 'direccion', value: e.target.value }))
                        }
                        placeholder="Ingresa tu dirección"
                      />

                      <EditableField
                        icon={FiCalendar}
                        label="Fecha de nacimiento"
                        name="fecha_nacimiento"
                        type="date"
                        value={editForm.fecha_nacimiento}
                        onChange={(e) =>
                          dispatch(setEditField({ name: 'fecha_nacimiento', value: e.target.value }))
                        }
                      />
                    </>
                  ) : (
                    <>
                      <div className="it-sp-field it-sp-field--editable-preview">
                        <div className="it-sp-field__label">
                          <FiMapPin size={13} />
                          <span>Dirección</span>
                        </div>
                        <p className="it-sp-field__value it-sp-field__value--boxed is-editable">
                          {data.direccion || '—'}
                        </p>
                      </div>

                      <div className="it-sp-field it-sp-field--editable-preview">
                        <div className="it-sp-field__label">
                          <FiCalendar size={13} />
                          <span>Fecha de nacimiento</span>
                        </div>
                        <p className="it-sp-field__value it-sp-field__value--boxed is-editable">
                          {data.fecha_nacimiento || '—'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="it-sp-divider" />

              <div className="it-sp-section">
                <div className="it-sp-section__header it-sp-section__header--actions">
                  <span className="it-sp-section__title">Seguridad</span>

                  <button
                    className="it-sp-btn it-sp-btn--outline"
                    type="button"
                    onClick={() => {
                      setPasswordOpen((prev) => !prev);
                      setLocalPasswordError('');
                      dispatch(resetPasswordForm());
                    }}
                  >
                    <FiLock />
                    <span>{passwordOpen ? 'Ocultar cambio de contraseña' : 'Cambiar contraseña'}</span>
                    {passwordOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>

                {passwordOpen && (
                  <div className="it-sp-password-box">
                    <div className="it-sp-password-grid">
                      <EditableField
                        icon={FiLock}
                        label="Contraseña actual"
                        name="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          dispatch(
                            updatePasswordField({
                              name: 'currentPassword',
                              value: e.target.value,
                            })
                          )
                        }
                        placeholder="Ingresa tu contraseña actual"
                      />

                      <EditableField
                        icon={FiLock}
                        label="Nueva contraseña"
                        name="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          dispatch(
                            updatePasswordField({
                              name: 'newPassword',
                              value: e.target.value,
                            })
                          )
                        }
                        placeholder="Ingresa tu nueva contraseña"
                      />

                      <EditableField
                        icon={FiLock}
                        label="Confirmar nueva contraseña"
                        name="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          dispatch(
                            updatePasswordField({
                              name: 'confirmPassword',
                              value: e.target.value,
                            })
                          )
                        }
                        placeholder="Confirma la nueva contraseña"
                      />
                    </div>

                    <div className="it-sp-password-rules">
                      <p>La nueva contraseña debe cumplir con lo siguiente:</p>

                      <div className="it-sp-checks-grid">
                        <CheckItem ok={passwordChecks.minLen} text="Mínimo 8 caracteres" />
                        <CheckItem ok={passwordChecks.hasUpper} text="Al menos 1 mayúscula" />
                        <CheckItem ok={passwordChecks.hasLower} text="Al menos 1 minúscula" />
                        <CheckItem ok={passwordChecks.hasNumber} text="Al menos 1 número" />
                        <CheckItem ok={passwordChecks.matches} text="La confirmación coincide" />
                      </div>
                    </div>

                    <div className="it-sp-password-actions">
                      <button
                        className="it-sp-btn it-sp-btn--ghost"
                        type="button"
                        onClick={() => {
                          dispatch(resetPasswordForm());
                          setLocalPasswordError('');
                        }}
                        disabled={isChangingPassword}
                      >
                        <FiX />
                        <span>Limpiar</span>
                      </button>

                      <button
                        className="it-sp-btn it-sp-btn--primary"
                        type="button"
                        onClick={handleSavePassword}
                        disabled={isChangingPassword}
                      >
                        <FiSave />
                        <span>{isChangingPassword ? 'Actualizando...' : 'Guardar contraseña'}</span>
                      </button>
                    </div>

                    {localPasswordError && (
                      <p className="it-sp-inline-error">{localPasswordError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

const styles = `
  .it-sp-root{
    min-height:100%;
    padding:32px;
    background:#f6f7fb;
    box-sizing:border-box;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  }

  .it-sp-header{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:20px;
    margin-bottom:22px;
    flex-wrap:wrap;
  }

  .it-sp-header__left{
    display:flex;
    align-items:flex-start;
    gap:14px;
  }

  .it-sp-header__accent{
    width:8px;
    height:48px;
    border-radius:8px;
    background:linear-gradient(180deg,#704fe6 0%, #4b5fd6 100%);
    flex-shrink:0;
    margin-top:2px;
  }

  .it-sp-header__title{
    margin:0;
    font-size:32px;
    line-height:1.08;
    font-weight:500;
    color:#1a1f36;
    letter-spacing:-0.3px;
  }

  .it-sp-header__sub{
    margin:8px 0 0;
    color:#68708b;
    font-size:14px;
    line-height:1.6;
    max-width:720px;
  }

  .it-sp-layout{
    display:grid;
    grid-template-columns:320px minmax(0, 1fr);
    gap:24px;
    align-items:start;
  }

  .it-sp-sidebar,
  .it-sp-main{
    min-width:0;
  }

  .it-sp-profile-card,
  .it-sp-content-card{
    background:#fff;
    border:1px solid #eceef5;
    border-radius:24px;
    box-shadow:0 10px 30px rgba(40,52,109,.05);
  }

  .it-sp-profile-card{
    padding:24px 22px;
    position:sticky;
    top:20px;
  }

  .it-sp-profile-card__avatar{
    width:92px;
    height:92px;
    border-radius:22px;
    display:flex;
    align-items:center;
    justify-content:center;
    margin:0 auto 16px;
    background:linear-gradient(180deg,#f2f4fb 0%, #e7ebf8 100%);
    border:2px solid #e8ebf4;
    color:#8590b5;
  }

  .it-sp-profile-card__name{
    margin:0;
    color:#1a1f36;
    font-size:24px;
    line-height:1.2;
    font-weight:700;
    letter-spacing:-0.2px;
    text-align:center;
  }

  .it-sp-role-badge{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    margin:12px auto 0;
    background:#eef0fb;
    color:#4b5fd6;
    font-size:11px;
    font-weight:800;
    padding:7px 12px;
    border-radius:999px;
    letter-spacing:.3px;
  }

  .it-sp-profile-card__info-list{
    margin-top:22px;
    display:flex;
    flex-direction:column;
    gap:12px;
  }

  .it-sp-mini-info{
    display:flex;
    gap:10px;
    align-items:flex-start;
    padding:12px 13px;
    border-radius:14px;
    background:#f8f9fd;
    border:1px solid #edf0f7;
    color:#6e7691;
  }

  .it-sp-mini-info > div{
    display:flex;
    flex-direction:column;
    gap:2px;
    min-width:0;
  }

  .it-sp-mini-info span{
    font-size:11px;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.5px;
    color:#96a0be;
  }

  .it-sp-mini-info strong{
    font-size:13px;
    line-height:1.45;
    color:#1f2640;
    word-break:break-word;
  }

  .it-sp-content-card{
    padding:26px 28px;
  }

  .it-sp-section{
    display:flex;
    flex-direction:column;
    gap:16px;
  }

  .it-sp-section__header{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
    flex-wrap:wrap;
  }

  .it-sp-section__header--actions{
    align-items:center;
  }

  .it-sp-section__title{
    font-size:12px;
    font-weight:800;
    color:#95a0be;
    letter-spacing:.8px;
    text-transform:uppercase;
  }

  .it-sp-fields-grid{
    display:grid;
    grid-template-columns:repeat(2, minmax(0, 1fr));
    gap:18px 22px;
  }

  .it-sp-password-grid{
    display:grid;
    grid-template-columns:repeat(2, minmax(0, 1fr));
    gap:18px 22px;
  }

  .it-sp-field{
    min-width:0;
    text-align:left;
    background:none;
    border:none;
    padding:0;
  }

  .it-sp-field__label{
    display:flex;
    align-items:center;
    gap:6px;
    margin-bottom:7px;
    color:#97a1be;
    font-size:11px;
    font-weight:800;
    letter-spacing:.5px;
    text-transform:uppercase;
    flex-wrap:wrap;
  }

  .it-sp-field__label small{
    margin-left:auto;
    font-size:10px;
    font-weight:800;
    letter-spacing:.3px;
    padding:3px 7px;
    border-radius:999px;
    text-transform:none;
  }

  .it-sp-field--editable .it-sp-field__label small,
  .it-sp-field--editable-preview .it-sp-field__label small{
    background:#eef8f1;
    color:#2f7a4f;
    border:1px solid #d9efdf;
  }

  .it-sp-field--readonly{
    cursor:pointer;
  }

  .it-sp-field--readonly .it-sp-field__value{
    padding:13px 14px;
    background:#f4f5f9;
    border:1px solid #e2e6ef;
    border-radius:12px;
    color:#5f667f;
  }

  .it-sp-field--readonly.is-muted .it-sp-field__value{
    background:#eef1f6;
  }

  .it-sp-field--readonly:hover .it-sp-field__value{
    background:#ebeff6;
  }

  .it-sp-field__value{
    margin:0;
    min-height:20px;
    color:#1a1f36;
    font-size:14px;
    font-weight:600;
    line-height:1.5;
    word-break:break-word;
  }

  .it-sp-field__value--boxed{
    padding:13px 14px;
    border-radius:12px;
    border:1px solid #dfe4f0;
    background:#f8f9fd;
  }

  .it-sp-field__value--boxed.is-editable{
    background:#f5fbf7;
    border-color:#dcefe1;
    color:#235a3b;
  }

  .it-sp-field__input{
    width:100%;
    box-sizing:border-box;
    border:1px solid #cfe4d7;
    border-radius:14px;
    background:#fbfffc;
    color:#1a1f36;
    font-size:14px;
    font-weight:500;
    padding:12px 14px;
    outline:none;
    transition:all .16s ease;
    box-shadow:0 0 0 0 rgba(112,79,230,0);
  }

  .it-sp-field__input:focus{
    border-color:#704fe6;
    background:#fff;
    box-shadow:0 0 0 4px rgba(112,79,230,.10);
  }

  .it-sp-field__input--date{
    appearance:none;
    -webkit-appearance:none;
    min-height:48px;
  }

  .it-sp-field__input[type="date"]::-webkit-calendar-picker-indicator{
    opacity:.9;
    cursor:pointer;
    padding:4px;
  }

  .it-sp-divider{
    width:100%;
    height:1px;
    background:#eef1f7;
    margin:22px 0;
  }

  .it-sp-btn{
    display:inline-flex;
    align-items:center;
    gap:8px;
    border:none;
    cursor:pointer;
    border-radius:12px;
    padding:11px 18px;
    font-size:13px;
    font-weight:700;
    transition:all .18s ease;
    min-height:44px;
  }

  .it-sp-btn--primary{
    background:#704fe6;
    color:#fff;
    box-shadow:0 8px 20px rgba(112,79,230,.22);
  }

  .it-sp-btn--primary:hover{
    background:#6242da;
    transform:translateY(-1px);
  }

  .it-sp-btn--outline{
    background:#fff;
    color:#4d5756;
    border:1px solid #e4e7f1;
  }

  .it-sp-btn--outline:hover{
    background:#f9faff;
  }

  .it-sp-btn--ghost{
    background:#fff;
    color:#7d839d;
    border:1px solid #e6e8f2;
  }

  .it-sp-btn--ghost:hover{
    background:#f7f8fc;
  }

  .it-sp-btn:disabled{
    opacity:.7;
    cursor:not-allowed;
    transform:none;
  }

  .it-sp-inline-actions,
  .it-sp-password-actions{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
  }

  .it-sp-password-box{
    display:flex;
    flex-direction:column;
    gap:16px;
    padding:18px;
    border:1px solid #eceef5;
    border-radius:18px;
    background:#fcfcff;
  }

  .it-sp-password-rules{
    padding:14px 16px;
    border-radius:14px;
    background:#f8f9fd;
    border:1px solid #edf0f7;
  }

  .it-sp-password-rules p{
    margin:0 0 10px;
    color:#4a536f;
    font-size:13px;
    font-weight:700;
  }

  .it-sp-checks-grid{
    display:grid;
    grid-template-columns:repeat(2, minmax(0, 1fr));
    gap:10px 14px;
  }

  .it-sp-check-item{
    display:flex;
    align-items:center;
    gap:8px;
    color:#7b839c;
    font-size:13px;
    font-weight:600;
  }

  .it-sp-check-item.is-ok{
    color:#25804a;
  }

  .it-sp-inline-error{
    margin:0;
    color:#b63a3a;
    font-size:13px;
    font-weight:700;
  }

  .it-sp-loading-wrap,
  .it-sp-feedback-wrap{
    min-height:68vh;
    display:flex;
    align-items:center;
    justify-content:center;
  }

  .it-sp-loading-card,
  .it-sp-feedback-card{
    width:min(460px, 100%);
    background:#fff;
    border:1px solid #eceef5;
    border-radius:24px;
    padding:32px 26px;
    text-align:center;
    box-shadow:0 10px 30px rgba(40,52,109,.05);
  }

  .it-sp-feedback-card__icon{
    width:52px;
    height:52px;
    border-radius:16px;
    display:flex;
    align-items:center;
    justify-content:center;
    margin:0 auto 14px;
    background:#f4f6fc;
    color:#5c6788;
  }

  .it-sp-feedback-card h3{
    margin:0 0 8px;
    color:#1a1f36;
    font-size:20px;
    font-weight:700;
  }

  .it-sp-feedback-card p{
    margin:0;
    color:#6f7790;
    font-size:14px;
    line-height:1.6;
  }

  .it-sp-spinner{
    width:42px;
    height:42px;
    border-radius:50%;
    border:4px solid #e8eafb;
    border-top-color:#704fe6;
    margin:0 auto 14px;
    animation:it-sp-spin .8s linear infinite;
  }

  .it-sp-loading-card p{
    margin:0;
    color:#59627f;
    font-weight:700;
    font-size:15px;
  }

  @keyframes it-sp-spin{
    to{ transform:rotate(360deg); }
  }

  @media (max-width: 1100px){
    .it-sp-layout{
      grid-template-columns:1fr;
    }

    .it-sp-profile-card{
      position:static;
    }
  }

  @media (max-width: 760px){
    .it-sp-root{
      padding:18px 12px;
    }

    .it-sp-header__title{
      font-size:28px;
    }

    .it-sp-content-card,
    .it-sp-profile-card{
      padding:18px 16px;
      border-radius:20px;
    }

    .it-sp-fields-grid,
    .it-sp-password-grid,
    .it-sp-checks-grid{
      grid-template-columns:1fr;
      gap:16px;
    }

    .it-sp-section__header,
    .it-sp-section__header--actions{
      align-items:stretch;
      flex-direction:column;
    }

    .it-sp-inline-actions,
    .it-sp-password-actions{
      width:100%;
      flex-direction:column;
    }

    .it-sp-inline-actions .it-sp-btn,
    .it-sp-password-actions .it-sp-btn,
    .it-sp-section__header .it-sp-btn{
      width:100%;
      justify-content:center;
    }
  }
`;

export default StudentProfile;