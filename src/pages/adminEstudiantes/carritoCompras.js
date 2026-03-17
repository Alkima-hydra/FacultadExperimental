import React, { useEffect, useState } from 'react';
import {
  FiShoppingCart,
  FiTrash2,
  FiBookOpen,
  FiClock,
  FiUser,
  FiCalendar,
  FiArrowRight,
  FiChevronLeft,
  FiAlertCircle,
  FiXCircle,
  FiCreditCard,
  FiDollarSign,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { selectUserId } from '../signin/slices/loginSelectors';

import {
  fetchCarritoByUsuarioId,
  removeItemCarrito,
  cancelarCarrito,
} from './slicesCarrito/CarritoThunk';

import {
  selectCarrito,
  selectCarritoLoading,
  selectCarritoRemoving,
  selectCarritoCanceling,
  selectCarritoError,
  selectCarritoSuccess,
  clearCarritoError,
  clearCarritoSuccess,
} from './slicesCarrito/CarritoSlice';

import CheckoutEstudiante from './checkoutEstudiante';
import {
  clearCheckout,
  setCompraActual,
} from './slicesCheckout/CheckoutSlice';

const swalTheme = {
  confirmButtonColor: '#704FE6',
  cancelButtonColor: '#4D5756',
  customClass: { popup: 'it-cadm-swal-popup' },
  didOpen: () => {
    const container = document.querySelector('.swal2-container');
    if (container) container.style.zIndex = '99999';
  },
};

const formatMoney = (amount, currency = 'BOB') => {
  const prefix = currency === 'BOB' ? 'Bs.' : currency;
  return `${prefix} ${Number(amount || 0).toFixed(2)}`;
};

const buildTeacherName = (usuarioDocente) => {
  if (!usuarioDocente) return 'Docente no disponible';

  return (
    usuarioDocente.nombre_completo ||
    [
      usuarioDocente.nombres,
      usuarioDocente.apellido_paterno,
      usuarioDocente.apellido_materno,
    ]
      .filter(Boolean)
      .join(' ')
      .trim() ||
    'Docente no disponible'
  );
};

const buildSchedule = (curso) => {
  if (!curso) return 'Horario no disponible';

  const dias = curso.dias_de_clases || 'Sin días';
  const inicio = curso.hora_inicio ? String(curso.hora_inicio).slice(0, 5) : '--:--';
  const fin = curso.hora_fin ? String(curso.hora_fin).slice(0, 5) : '--:--';

  return `${dias} · ${inicio} - ${fin}`;
};

const CartItem = ({ item, onRemove, isRemoving }) => {
  const materia = item.materia || {};
  const curso = item.curso || {};
  const usuarioDocente = item.usuario_docente || {};

  return (
    <div className="cartx-item">
      <div className="cartx-item__main">
        <div className="cartx-item__badge">{materia.codigo || 'CUR'}</div>

        <div className="cartx-item__content">
          <div className="cartx-item__top">
            <div>
              <p className="cartx-item__sigla">{materia.codigo || 'Sin sigla'}</p>
              <h3 className="cartx-item__title">{materia.nombre || 'Curso sin nombre'}</h3>
            </div>

            <div className="cartx-item__price">{formatMoney(item.precio_item)}</div>
          </div>

          <div className="cartx-item__meta">
            <span>
              <FiUser size={14} />
              {buildTeacherName(usuarioDocente)}
            </span>

            <span>
              <FiClock size={14} />
              {buildSchedule(curso)}
            </span>

            <span>
              <FiCalendar size={14} />
              {curso.periodo || 'Sin período'}
            </span>

            <span>
              <FiBookOpen size={14} />
              {curso.lecciones ?? 0} lecciones
            </span>
          </div>
        </div>
      </div>

      <div className="cartx-item__actions">
        <button
          className="cartx-remove-btn"
          type="button"
          onClick={() => onRemove(item)}
          disabled={isRemoving}
        >
          <FiTrash2 size={15} />
          <span>{isRemoving ? 'Eliminando...' : 'Quitar'}</span>
        </button>
      </div>
    </div>
  );
};

const CarritoCompras = ({ onGoToOffer }) => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState('cart');

  const userId = useSelector(selectUserId);

  const carrito = useSelector(selectCarrito);
  const loading = useSelector(selectCarritoLoading);
  const isRemoving = useSelector(selectCarritoRemoving);
  const isCanceling = useSelector(selectCarritoCanceling);
  const error = useSelector(selectCarritoError);
  const successMessage = useSelector(selectCarritoSuccess);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCarritoByUsuarioId(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
        ...swalTheme,
        showCancelButton: false,
      });
      dispatch(clearCarritoError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      Swal.fire({
        icon: 'success',
        title: 'Listo',
        text: successMessage,
        timer: 1800,
        showConfirmButton: false,
        ...swalTheme,
      });
      dispatch(clearCarritoSuccess());
    }
  }, [successMessage, dispatch]);

  const handleRemove = async (item) => {
    const materiaNombre = item?.materia?.nombre || 'este curso';

    const confirm = await Swal.fire({
      title: '¿Quitar del carrito?',
      text: `Se eliminará "${materiaNombre}" del carrito.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar',
      ...swalTheme,
      confirmButtonColor: '#EF4444',
    });

    if (!confirm.isConfirmed) return;

    dispatch(removeItemCarrito(item.id_compra_curso));
  };

  const handleCancelarTodo = async () => {
    if (!carrito?.id_compra_total) return;

    const confirm = await Swal.fire({
      title: '¿Vaciar carrito?',
      text: 'El carrito completo se marcará como CANCELADO.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
      ...swalTheme,
      confirmButtonColor: '#EF4444',
    });

    if (!confirm.isConfirmed) return;

    dispatch(cancelarCarrito(carrito.id_compra_total));
  };

  const handleContinuarComprando = () => {
    if (typeof onGoToOffer === 'function') {
      onGoToOffer();
      return;
    }

    Swal.fire({
      title: 'Oferta académica',
      text: 'No se configuró la navegación a Oferta Académica.',
      icon: 'info',
      confirmButtonText: 'Entendido',
      ...swalTheme,
      showCancelButton: false,
    });
  };

  const handlePagarAhora = () => {
    if (!carrito?.id_compra_total || !carrito?.items?.length) {
      Swal.fire({
        title: 'Carrito vacío',
        text: 'No hay cursos en el carrito para continuar al pago.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        ...swalTheme,
        showCancelButton: false,
      });
      return;
    }

    dispatch(setCompraActual(carrito));
    setViewMode('checkout');
  };

  const handleBackFromCheckout = async () => {
    setViewMode('cart');

    if (userId) {
      await dispatch(fetchCarritoByUsuarioId(userId));
    }
  };

  const handleCheckoutSuccess = async () => {
    if (userId) {
      await dispatch(fetchCarritoByUsuarioId(userId));
    }

    await Swal.fire({
      icon: 'success',
      title: 'Pago realizado',
      text: 'Tu compra fue confirmada correctamente.',
      confirmButtonText: 'Entendido',
      ...swalTheme,
      showCancelButton: false,
    });

    setViewMode('cart');
    dispatch(clearCheckout());
  };

  const items = Array.isArray(carrito?.items) ? carrito.items : [];
  const cantidadItems = Number(carrito?.cantidad_items || items.length || 0);
  const moneda = carrito?.moneda || 'BOB';

  const subtotalCursos = Number(carrito?.subtotal_cursos || 0);
  const saldoUsado = Number(carrito?.saldo_usado || 0);
  const total = Number(carrito?.total || 0);
  const totalPagadoExterno = Number(carrito?.total_pagado_externo || 0);
  const saldoDisponible = Number(carrito?.saldo_disponible || 0);

  const tieneSaldoAplicado = saldoUsado > 0;
  const requierePagoExterno = totalPagadoExterno > 0;

  if (viewMode === 'checkout') {
    return (
      <CheckoutEstudiante
        onBack={handleBackFromCheckout}
        onSuccess={handleCheckoutSuccess}
      />
    );
  }

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="cartx-root">
          <div className="cartx-loading">
            <div className="cartx-spinner" />
            <p>Cargando carrito...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="cartx-root">
        <div className="cartx-shell">
          <div className="cartx-topbar">
            <div className="cartx-topbar__left">
              <div className="cartx-topbar__accent" />
              <div>
                <h2 className="cartx-topbar__title">Resumen del carrito</h2>
                <p className="cartx-topbar__sub">
                  Revisa tus cursos seleccionados antes de pagar.
                </p>
              </div>
            </div>

            <div className="cartx-topbar__count">
              <FiShoppingCart size={15} />
              <span>{cantidadItems} item{cantidadItems !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="cartx-content">
            {!carrito || items.length === 0 ? (
              <div className="cartx-empty">
                <div className="cartx-empty__icon">
                  <FiShoppingCart size={42} />
                </div>
                <h3>Tu carrito está vacío</h3>
                <p>No tienes cursos agregados por ahora.</p>

                <button
                  className="cartx-btn cartx-btn--primary cartx-btn--empty"
                  type="button"
                  onClick={handleContinuarComprando}
                >
                  <FiArrowRight size={15} />
                  <span>Ir a oferta académica</span>
                </button>
              </div>
            ) : (
              <div className="cartx-layout">
                <section className="cartx-list">
                  {items.map((item) => (
                    <CartItem
                      key={item.id_compra_curso}
                      item={item}
                      onRemove={handleRemove}
                      isRemoving={isRemoving}
                    />
                  ))}
                </section>

                <aside className="cartx-summary">
                  <div className="cartx-summary__card">
                    <h3 className="cartx-summary__title">Resumen de compra</h3>

                    <div className="cartx-summary__rows">
                      <div className="cartx-summary__row">
                        <span>Items</span>
                        <strong>{cantidadItems}</strong>
                      </div>

                      <div className="cartx-summary__row">
                        <span>Moneda</span>
                        <strong>{moneda}</strong>
                      </div>

                      <div className="cartx-summary__row">
                        <span>Estado</span>
                        <strong>{carrito.estado || 'PENDIENTE'}</strong>
                      </div>

                      <div className="cartx-summary__row">
                        <span>Subtotal cursos</span>
                        <strong>{formatMoney(subtotalCursos, moneda)}</strong>
                      </div>

                      <div className="cartx-summary__row">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <FiDollarSign size={14} />
                          Saldo disponible
                        </span>
                        <strong>{formatMoney(saldoDisponible, moneda)}</strong>
                      </div>

                      <div className="cartx-summary__row">
                        <span>Saldo usado</span>
                        <strong>{formatMoney(saldoUsado, moneda)}</strong>
                      </div>

                      <div className="cartx-summary__row">
                        <span>Pago externo</span>
                        <strong>{formatMoney(totalPagadoExterno, moneda)}</strong>
                      </div>
                    </div>

                    <div className="cartx-summary__divider" />

                    <div className="cartx-summary__total">
                      <span>Total a pagar</span>
                      <strong>{formatMoney(total, moneda)}</strong>
                    </div>

                    {(tieneSaldoAplicado || requierePagoExterno) && (
                      <div className="cartx-summary__mini">
                        {tieneSaldoAplicado && (
                          <div className="cartx-summary__mini-row">
                            <span>Parte cubierta con saldo</span>
                            <strong>{formatMoney(saldoUsado, moneda)}</strong>
                          </div>
                        )}

                        {requierePagoExterno && (
                          <div className="cartx-summary__mini-row">
                            <span>Parte a pagar externamente</span>
                            <strong>{formatMoney(totalPagadoExterno, moneda)}</strong>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="cartx-summary__actions">
                      <button
                        className="cartx-btn cartx-btn--ghost"
                        type="button"
                        onClick={handleContinuarComprando}
                      >
                        <FiChevronLeft size={15} />
                        <span>Seguir comprando</span>
                      </button>

                      <button
                        className="cartx-btn cartx-btn--danger"
                        type="button"
                        onClick={handleCancelarTodo}
                        disabled={isCanceling}
                      >
                        <FiXCircle size={15} />
                        <span>{isCanceling ? 'Vaciando...' : 'Vaciar carrito'}</span>
                      </button>

                      <button
                        className="cartx-btn cartx-btn--primary"
                        type="button"
                        onClick={handlePagarAhora}
                      >
                        <FiCreditCard size={15} />
                        <span>
                          {totalPagadoExterno > 0 ? 'Continuar al pago' : 'Confirmar compra'}
                        </span>
                      </button>
                    </div>

                    <div className="cartx-summary__note">
                      <FiAlertCircle size={14} />
                      <span>
                        Verifica tus cursos antes de continuar al proceso de pago.
                      </span>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const styles = `
  .cartx-root{
    min-height:100%;
    padding:16px 18px 22px;
    background:transparent;
    box-sizing:border-box;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  }

  .cartx-shell{
    background:#ffffff;
    border:1px solid #e7edf5;
    border-radius:22px;
    box-shadow:0 12px 32px rgba(15, 23, 42, 0.05);
    overflow:hidden;
  }

  .cartx-topbar{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:18px;
    flex-wrap:wrap;
    padding:18px 20px 16px;
    border-bottom:1px solid #eef2f7;
    background:#ffffff;
  }

  .cartx-topbar__left{
    display:flex;
    align-items:flex-start;
    gap:14px;
  }

  .cartx-topbar__accent{
    width:8px;
    height:40px;
    border-radius:999px;
    background:linear-gradient(180deg,#7c5cff 0%, #6d5dfd 100%);
    margin-top:2px;
    flex-shrink:0;
  }

  .cartx-topbar__title{
    margin:0;
    font-size:20px;
    line-height:1.12;
    font-weight:900;
    color:#111827;
  }

  .cartx-topbar__sub{
    margin:5px 0 0;
    color:#667085;
    font-size:13px;
    line-height:1.55;
    font-weight:700;
  }

  .cartx-topbar__count{
    display:inline-flex;
    align-items:center;
    gap:8px;
    padding:10px 14px;
    border-radius:999px;
    background:#f8fafc;
    border:1px solid #e6ebf2;
    color:#475467;
    font-size:13px;
    font-weight:800;
  }

  .cartx-content{
    padding:20px;
    background:#ffffff;
  }

  .cartx-layout{
    display:grid;
    grid-template-columns:minmax(0, 1fr) 340px;
    gap:24px;
    align-items:start;
  }

  .cartx-list{
    display:flex;
    flex-direction:column;
    gap:16px;
  }

  .cartx-item{
    background:#fff;
    border:1px solid #e7edf5;
    border-radius:22px;
    box-shadow:0 10px 24px rgba(15,23,42,.05);
    padding:20px;
    display:flex;
    justify-content:space-between;
    gap:18px;
    align-items:flex-start;
  }

  .cartx-item__main{
    display:flex;
    gap:16px;
    min-width:0;
    flex:1;
  }

  .cartx-item__badge{
    width:66px;
    height:66px;
    border-radius:18px;
    display:flex;
    align-items:center;
    justify-content:center;
    background:#eef2ff;
    color:#5a55d6;
    font-weight:900;
    font-size:13px;
    letter-spacing:.3px;
    border:1px solid #e1e7ff;
    flex-shrink:0;
  }

  .cartx-item__content{
    min-width:0;
    flex:1;
  }

  .cartx-item__top{
    display:flex;
    justify-content:space-between;
    gap:16px;
    align-items:flex-start;
    margin-bottom:10px;
  }

  .cartx-item__sigla{
    margin:0 0 4px;
    color:#7f88a7;
    font-size:11px;
    font-weight:900;
    letter-spacing:.6px;
    text-transform:uppercase;
  }

  .cartx-item__title{
    margin:0;
    color:#101828;
    font-size:18px;
    line-height:1.35;
    font-weight:900;
  }

  .cartx-item__price{
    color:#6a50e7;
    font-weight:900;
    font-size:18px;
    white-space:nowrap;
  }

  .cartx-item__meta{
    display:flex;
    flex-wrap:wrap;
    gap:10px;
  }

  .cartx-item__meta span{
    display:inline-flex;
    align-items:center;
    gap:6px;
    padding:8px 10px;
    border-radius:12px;
    background:#f8fafc;
    border:1px solid #edf2f7;
    color:#5f6781;
    font-size:12px;
    font-weight:700;
  }

  .cartx-item__actions{
    flex-shrink:0;
  }

  .cartx-remove-btn{
    display:inline-flex;
    align-items:center;
    gap:7px;
    border:none;
    cursor:pointer;
    border-radius:12px;
    padding:10px 14px;
    font-size:12px;
    font-weight:800;
    background:#fff1f1;
    color:#d14343;
    border:1px solid #ffd5d5;
    transition:all .16s ease;
  }

  .cartx-remove-btn:hover{
    background:#ffe7e7;
  }

  .cartx-remove-btn:disabled{
    opacity:.7;
    cursor:not-allowed;
  }

  .cartx-summary__card{
    background:#fff;
    border:1px solid #e7edf5;
    border-radius:22px;
    box-shadow:0 10px 24px rgba(15,23,42,.05);
    padding:22px;
    position:sticky;
    top:20px;
  }

  .cartx-summary__title{
    margin:0 0 18px;
    color:#111827;
    font-size:20px;
    font-weight:900;
  }

  .cartx-summary__rows{
    display:flex;
    flex-direction:column;
    gap:12px;
  }

  .cartx-summary__row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:12px;
    color:#66708c;
    font-size:14px;
    font-weight:700;
  }

  .cartx-summary__row strong{
    color:#111827;
  }

  .cartx-summary__divider{
    height:1px;
    background:#edf0f7;
    margin:18px 0;
  }

  .cartx-summary__total{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:12px;
    margin-bottom:14px;
  }

  .cartx-summary__total span{
    color:#4f5874;
    font-size:14px;
    font-weight:800;
  }

  .cartx-summary__total strong{
    color:#6a50e7;
    font-size:24px;
    font-weight:900;
  }

  .cartx-summary__mini{
    display:flex;
    flex-direction:column;
    gap:8px;
    margin-bottom:20px;
    padding:12px;
    border-radius:14px;
    background:#f8fafc;
    border:1px solid #edf0f7;
  }

  .cartx-summary__mini-row{
    display:flex;
    justify-content:space-between;
    gap:12px;
    font-size:13px;
    color:#66708c;
    font-weight:700;
  }

  .cartx-summary__mini-row strong{
    color:#111827;
  }

  .cartx-summary__actions{
    display:flex;
    flex-direction:column;
    gap:10px;
  }

  .cartx-btn{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    border:none;
    cursor:pointer;
    border-radius:14px;
    padding:12px 16px;
    font-size:13px;
    font-weight:900;
    transition:all .18s ease;
    min-height:46px;
    width:100%;
  }

  .cartx-btn--primary{
    background:linear-gradient(135deg,#7c5cff 0%, #6d5dfd 100%);
    color:#fff;
    box-shadow:0 8px 18px rgba(109,93,253,.22);
  }

  .cartx-btn--primary:hover{
    background:#6242da;
    transform:translateY(-1px);
  }

  .cartx-btn--ghost{
    background:#fff;
    color:#55607d;
    border:1px solid #e4e8f1;
  }

  .cartx-btn--ghost:hover{
    background:#f8f9fd;
  }

  .cartx-btn--danger{
    background:#fff1f1;
    color:#d14343;
    border:1px solid #ffd5d5;
  }

  .cartx-btn--danger:hover{
    background:#ffe7e7;
  }

  .cartx-btn:disabled{
    opacity:.7;
    cursor:not-allowed;
  }

  .cartx-summary__note{
    margin-top:16px;
    display:flex;
    gap:8px;
    align-items:flex-start;
    color:#7a839d;
    font-size:12px;
    line-height:1.5;
    font-weight:700;
    padding:12px 13px;
    border-radius:14px;
    background:#f8fafc;
    border:1px solid #edf0f7;
  }

  .cartx-empty{
    background:#ffffff;
    border:1px dashed #d9e2ef;
    border-radius:24px;
    padding:54px 24px;
    text-align:center;
    color:#6f7894;
  }

  .cartx-empty__icon{
    width:82px;
    height:82px;
    border-radius:24px;
    margin:0 auto 16px;
    display:flex;
    align-items:center;
    justify-content:center;
    background:#eef2ff;
    color:#7c86aa;
  }

  .cartx-empty h3{
    margin:0 0 8px;
    color:#101828;
    font-size:22px;
    font-weight:900;
  }

  .cartx-empty p{
    margin:0 0 20px;
    color:#6f7894;
    font-size:14px;
    line-height:1.6;
    font-weight:700;
  }

  .cartx-btn--empty{
    max-width:320px;
  }

  .cartx-loading{
    min-height:68vh;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    color:#5f6781;
    font-weight:800;
    gap:14px;
  }

  .cartx-spinner{
    width:42px;
    height:42px;
    border-radius:50%;
    border:4px solid #e8eafb;
    border-top-color:#704fe6;
    animation:cartx-spin .8s linear infinite;
  }

  @keyframes cartx-spin{
    to{ transform:rotate(360deg); }
  }

  @media (max-width: 1100px){
    .cartx-layout{
      grid-template-columns:1fr;
    }

    .cartx-summary__card{
      position:static;
    }
  }

  @media (max-width: 760px){
    .cartx-root{
      padding:12px;
    }

    .cartx-topbar,
    .cartx-content{
      padding-left:14px;
      padding-right:14px;
    }

    .cartx-topbar__title{
      font-size:18px;
    }

    .cartx-item{
      flex-direction:column;
    }

    .cartx-item__main{
      width:100%;
    }

    .cartx-item__top{
      flex-direction:column;
      align-items:flex-start;
    }

    .cartx-item__actions{
      width:100%;
    }

    .cartx-remove-btn{
      width:100%;
      justify-content:center;
    }

    .cartx-summary__card{
      padding:18px 16px;
      border-radius:20px;
    }
  }
`;

export default CarritoCompras;