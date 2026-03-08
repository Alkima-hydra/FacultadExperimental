import React, { useEffect } from 'react';
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
  const inicio = curso.hora_inicio ? curso.hora_inicio.slice(0, 5) : '--:--';
  const fin = curso.hora_fin ? curso.hora_fin.slice(0, 5) : '--:--';

  return `${dias} · ${inicio} - ${fin}`;
};

const CartItem = ({ item, onRemove, isRemoving }) => {
  const materia = item.materia || {};
  const curso = item.curso || {};
  const usuarioDocente = item.usuario_docente || {};

  return (
    <div className="cartx-item">
      <div className="cartx-item__main">
        <div className="cartx-item__badge">
          {materia.codigo || 'CUR'}
        </div>

        <div className="cartx-item__content">
          <div className="cartx-item__top">
            <div>
              <p className="cartx-item__sigla">{materia.codigo || 'Sin sigla'}</p>
              <h3 className="cartx-item__title">{materia.nombre || 'Curso sin nombre'}</h3>
            </div>

            <div className="cartx-item__price">
              {formatMoney(item.precio_item)}
            </div>
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

const CarritoCompras = () => {
  const dispatch = useDispatch();

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

  const handleContinuarComprando = async () => {
    await Swal.fire({
      title: 'Aún no disponible',
      text: 'La navegación para seguir comprando todavía no fue implementada.',
      icon: 'info',
      confirmButtonText: 'Entendido',
      ...swalTheme,
      showCancelButton: false,
    });
  };

  const handlePagarAhora = async () => {
    await Swal.fire({
      title: 'Pago aún no disponible',
      text: 'La pantalla de pago todavía no fue implementada.',
      icon: 'info',
      confirmButtonText: 'Entendido',
      ...swalTheme,
      showCancelButton: false,
    });
  };

  const items = carrito?.items || [];
  const total = carrito?.total || 0;
  const cantidadItems = carrito?.cantidad_items || 0;
  const moneda = carrito?.moneda || 'BOB';

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
        <div className="cartx-header">
          <div className="cartx-header__left">
            <div className="cartx-header__pill" />
            <div>
              <h1 className="cartx-header__title">Carrito de compras</h1>
              <p className="cartx-header__sub">
                Revisa tus cursos antes de continuar al pago.
              </p>
            </div>
          </div>

          <div className="cartx-header__count">
            <FiShoppingCart size={15} />
            <span>{cantidadItems} item{cantidadItems !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {!carrito || items.length === 0 ? (
          <div className="cartx-empty">
            <div className="cartx-empty__icon">
              <FiShoppingCart size={42} />
            </div>
            <h3>Tu carrito está vacío</h3>
            <p>No tienes cursos agregados por ahora.</p>

            <button
              className="cartx-btn cartx-btn--primary"
              type="button"
              onClick={handleContinuarComprando}
            >
              <FiArrowRight size={15} />
              <span>Continuar comprando</span>
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
                </div>

                <div className="cartx-summary__divider" />

                <div className="cartx-summary__total">
                  <span>Total</span>
                  <strong>{formatMoney(total, moneda)}</strong>
                </div>

                <div className="cartx-summary__actions">
                  <button
                    className="cartx-btn cartx-btn--ghost"
                    type="button"
                    onClick={handleContinuarComprando}
                  >
                    <FiChevronLeft size={15} />
                    <span>Continuar comprando</span>
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
                    <span>Pagar ahora</span>
                  </button>
                </div>

                <div className="cartx-summary__note">
                  <FiAlertCircle size={14} />
                  <span>Verifica tus cursos antes de continuar al proceso de pago.</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
};

const styles = `
  .cartx-root{
    min-height:100%;
    padding:32px;
    background:#f6f7fb;
    box-sizing:border-box;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  }

  .cartx-header{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:20px;
    margin-bottom:24px;
    flex-wrap:wrap;
  }

  .cartx-header__left{
    display:flex;
    align-items:flex-start;
    gap:14px;
  }

  .cartx-header__pill{
    width:8px;
    height:48px;
    border-radius:8px;
    background:linear-gradient(180deg,#704fe6 0%, #4b5fd6 100%);
    flex-shrink:0;
    margin-top:2px;
  }

  .cartx-header__title{
    margin:0;
    font-size:32px;
    line-height:1.08;
    font-weight:500;
    color:#1a1f36;
    letter-spacing:-0.3px;
  }

  .cartx-header__sub{
    margin:8px 0 0;
    color:#68708b;
    font-size:14px;
    line-height:1.6;
  }

  .cartx-header__count{
    display:inline-flex;
    align-items:center;
    gap:8px;
    padding:10px 14px;
    border-radius:999px;
    background:#ffffff;
    border:1px solid #e6e9f2;
    color:#4d5673;
    font-size:13px;
    font-weight:700;
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
    border:1px solid #eceef5;
    border-radius:22px;
    box-shadow:0 10px 30px rgba(40,52,109,.05);
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
    background:linear-gradient(180deg,#f2f4fb 0%, #e8ecfb 100%);
    color:#5a55d6;
    font-weight:800;
    font-size:13px;
    letter-spacing:.3px;
    border:1px solid #e3e7f6;
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
    font-weight:800;
    letter-spacing:.6px;
    text-transform:uppercase;
  }

  .cartx-item__title{
    margin:0;
    color:#1a1f36;
    font-size:18px;
    line-height:1.35;
    font-weight:700;
  }

  .cartx-item__price{
    color:#6a50e7;
    font-weight:800;
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
    background:#f8f9fd;
    border:1px solid #edf0f7;
    color:#5f6781;
    font-size:12px;
    font-weight:600;
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
    font-weight:700;
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
    border:1px solid #eceef5;
    border-radius:22px;
    box-shadow:0 10px 30px rgba(40,52,109,.05);
    padding:22px;
    position:sticky;
    top:20px;
  }

  .cartx-summary__title{
    margin:0 0 18px;
    color:#1a1f36;
    font-size:20px;
    font-weight:800;
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
  }

  .cartx-summary__row strong{
    color:#1a1f36;
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
    margin-bottom:20px;
  }

  .cartx-summary__total span{
    color:#4f5874;
    font-size:14px;
    font-weight:700;
  }

  .cartx-summary__total strong{
    color:#6a50e7;
    font-size:24px;
    font-weight:800;
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
    font-weight:800;
    transition:all .18s ease;
    min-height:46px;
    width:100%;
  }

  .cartx-btn--primary{
    background:#704fe6;
    color:#fff;
    box-shadow:0 8px 20px rgba(112,79,230,.22);
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
    padding:12px 13px;
    border-radius:14px;
    background:#f8f9fd;
    border:1px solid #edf0f7;
  }

  .cartx-empty{
    background:#fff;
    border:1px solid #eceef5;
    border-radius:24px;
    box-shadow:0 10px 30px rgba(40,52,109,.05);
    padding:48px 24px;
    text-align:center;
  }

  .cartx-empty__icon{
    width:82px;
    height:82px;
    border-radius:24px;
    margin:0 auto 16px;
    display:flex;
    align-items:center;
    justify-content:center;
    background:linear-gradient(180deg,#f2f4fb 0%, #e8ecfb 100%);
    color:#7c86aa;
  }

  .cartx-empty h3{
    margin:0 0 8px;
    color:#1a1f36;
    font-size:22px;
    font-weight:800;
  }

  .cartx-empty p{
    margin:0 0 20px;
    color:#6f7894;
    font-size:14px;
    line-height:1.6;
  }

  .cartx-loading{
    min-height:68vh;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    color:#5f6781;
    font-weight:700;
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
      padding:18px 12px;
    }

    .cartx-header__title{
      font-size:28px;
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