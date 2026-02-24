import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import FaqTwo from '../../components/Faq/FaqTwo';

const CheckoutMain = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);

  // Initialize Nice Select
  useEffect(() => {
    window.$('select').niceSelect();
  }, []);

  const items = [
    {
      id: 'a',
      btnText: 'Tarjeta (débito/crédito)',
      description:
        'Paga de forma segura con tu tarjeta. Aceptamos tarjetas de débito y crédito.',
    },
    {
      id: 'b',
      btnText: 'Pago por QR',
      description:
        'Escanea el código QR desde tu app bancaria o billetera digital y confirma el pago.',
    },
  ];

  return (
    <main>
      <Breadcrumb title="Finalizar compra" />

      <section className="coupon-area pt-100 pb-30">
        <div className="container">
          <div className="row">
            <div
              className="col-md-6 wow animate__fadeInUp"
              data-wow-duration=".9s"
              data-wow-delay=".3s"
            >
              <div className="coupon-accordion">
                <h3>
                  ¿Ya eres cliente?{' '}
                  <span
                    id="showlogin"
                    onClick={() => setShowLoginForm(!showLoginForm)}
                  >
                    Haz clic aquí para iniciar sesión
                  </span>
                </h3>

                <div
                  id="checkout-login"
                  className={
                    showLoginForm
                      ? 'coupon-content d-block'
                      : 'coupon-content d-none'
                  }
                >
                  <div className="coupon-info">
                    <p className="coupon-text">
                      Ingresa tus datos para acceder a tu cuenta y continuar.
                    </p>

                    <form action="#">
                      <p className="form-row-first">
                        <label>
                          Usuario o correo <span className="required">*</span>
                        </label>
                        <input type="text" />
                      </p>

                      <p className="form-row-last">
                        <label>
                          Contraseña <span className="required">*</span>
                        </label>
                        <input type="text" />
                      </p>

                      <p className="form-row">
                        <button
                          className="ed-btn-square purple-4"
                          type="submit"
                        >
                          Iniciar sesión
                        </button>
                        <label>
                          <input type="checkbox" />
                          Recuérdame
                        </label>
                      </p>

                      <p className="lost-password">
                        <a href="#">¿Olvidaste tu contraseña?</a>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="col-md-6 wow animate__fadeInUp"
              data-wow-duration=".9s"
              data-wow-delay=".5s"
            >
              <div className="coupon-accordion">
                <h3>
                  ¿Tienes un cupón?{' '}
                  <span
                    id="showcoupon"
                    onClick={() => setShowCoupon(!showCoupon)}
                  >
                    Haz clic aquí para ingresar tu código
                  </span>
                </h3>

                <div
                  id="checkout_coupon"
                  className={
                    showCoupon
                      ? 'coupon-checkout-content d-block'
                      : 'coupon-checkout-content'
                  }
                >
                  <div className="coupon-info">
                    <form action="#">
                      <p className="checkout-coupon">
                        <input type="text" placeholder="Código de cupón" />
                        <button
                          className="ed-btn-square purple-4"
                          type="submit"
                        >
                          Aplicar cupón
                        </button>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="checkout-area pb-70">
        <div className="container">
          <form action="#">
            <div className="row">

              {/* Billing */}
              <div className="col-lg-6">
                <div className="checkbox-form">
                  <h3>Detalles de facturación</h3>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="country-select">
                        <label>
                          País <span className="required">*</span>
                        </label>
                        <select>
                          <option value="bolivia">Bolivia</option>
                          <option value="colombia">Colombia</option>
                          <option value="peru">Perú</option>
                          <option value="argentina">Argentina</option>
                          <option value="chile">Chile</option>
                          <option value="ecuador">Ecuador</option>
                          <option value="paraguay">Paraguay</option>
                          <option value="uruguay">Uruguay</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label>
                          Nombres <span className="required">*</span>
                        </label>
                        <input type="text" placeholder="" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label>
                          Apellidos <span className="required">*</span>
                        </label>
                        <input type="text" placeholder="" />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="checkout-form-list">
                        <label>Nombre de la empresa</label>
                        <input type="text" placeholder="" />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="checkout-form-list">
                        <label>
                          Dirección <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Dirección (calle y número)"
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="checkout-form-list">
                        <input
                          type="text"
                          placeholder="Departamento, piso, unidad, etc. (opcional)"
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="checkout-form-list">
                        <label>
                          Ciudad / Localidad <span className="required">*</span>
                        </label>
                        <input type="text" placeholder="Ciudad / Localidad" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label>
                          Estado / Provincia <span className="required">*</span>
                        </label>
                        <input type="text" placeholder="" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label>
                          Código postal <span className="required">*</span>
                        </label>
                        <input type="text" placeholder="Código postal" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label>
                          Correo electrónico <span className="required">*</span>
                        </label>
                        <input type="email" placeholder="" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="checkout-form-list">
                        <label>
                          Teléfono <span className="required">*</span>
                        </label>
                        <input type="text" placeholder="Teléfono" />
                      </div>
                    </div>
                  </div>

                  {/* Quitado: Crear cuenta / Enviar a otra dirección / Notas */}
                </div>
              </div>

              {/* Order */}
              <div className="col-lg-6">
                <div className="your-order mb-30 ">
                  <h3>Tu pedido</h3>

                  <div className="your-order-table table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th className="product-name">Producto</th>
                          <th className="product-total">Total</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr className="cart_item">
                          <td className="product-name">
                            Vestibulum suscipit{' '}
                            <strong className="product-quantity"> × 1</strong>
                          </td>
                          <td className="product-total">
                            <span className="amount">Bs. 165.00</span>
                          </td>
                        </tr>

                        <tr className="cart_item">
                          <td className="product-name">
                            Vestibulum dictum magna{' '}
                            <strong className="product-quantity"> × 1</strong>
                          </td>
                          <td className="product-total">
                            <span className="amount">Bs. 50.00</span>
                          </td>
                        </tr>
                      </tbody>

                      <tfoot>
                        <tr className="cart-subtotal">
                          <th>Subtotal del carrito</th>
                          <td>
                            <span className="amount">Bs.215.00</span>
                          </td>
                        </tr>

                        {/* Quitado: Shipping */}

                        <tr className="order-total">
                          <th>Total del pedido</th>
                          <td>
                            <strong>
                              <span className="amount">Bs.215.00</span>
                            </strong>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="payment-method">
                    <FaqTwo items={items} />
                    <div className="order-button-payment mt-20">
                      <button type="submit" className="ed-btn-square purple-4">
                        Realizar pedido
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default CheckoutMain;