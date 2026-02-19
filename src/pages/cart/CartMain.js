import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';

import productImg1 from '../../assets/img/cart/cart-1.png';
import productImg2 from '../../assets/img/cart/cart-2.png';
import productImg3 from '../../assets/img/cart/cart-3.png';
import productImg4 from '../../assets/img/cart/cart-4.png';

const items = [
  {
    id: 1,
    name: 'Libro académico',
    price: 180,
    quantity: 1,
    image: productImg1,
  },
  {
    id: 2,
    name: 'Cuaderno universitario',
    price: 90.5,
    quantity: 1,
    image: productImg2,
  },
  {
    id: 3,
    name: 'Diccionario técnico',
    price: 160,
    quantity: 1,
    image: productImg3,
  },
  {
    id: 4,
    name: 'Manual de estudio',
    price: 99.5,
    quantity: 1,
    image: productImg4,
  },
];

const CartMain = () => {
  const [products, setProducts] = useState(items);

  const handleIncrement = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const handleDecrement = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: product.quantity > 1 ? product.quantity - 1 : 1,
            }
          : product
      )
    );
  };

  const subtotal = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  return (
    <main>
      <Breadcrumb title="Carrito de compras" subTitle="Carrito" />

      <section className="cart-area pt-120 pb-120">
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
                        <th className="cart-product-name">Producto</th>
                        <th className="product-price">Precio unitario</th>
                        <th className="product-quantity">Cantidad</th>
                        <th className="product-subtotal">Total</th>
                        <th className="product-remove">Eliminar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
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
                            <span className="amount">
                              Bs. {product.price.toFixed(2)}
                            </span>
                          </td>
                          <td className="product-quantity">
                            <span
                              className="cart-minus"
                              onClick={() => handleDecrement(product.id)}
                            >
                              -
                            </span>
                            <input
                              className="cart-input"
                              type="text"
                              value={product.quantity}
                              readOnly
                            />
                            <span
                              className="cart-plus"
                              onClick={() => handleIncrement(product.id)}
                            >
                              +
                            </span>
                          </td>
                          <td className="product-subtotal">
                            <span className="amount">
                              Bs. {(product.price * product.quantity).toFixed(2)}
                            </span>
                          </td>
                          <td className="product-remove">
                            <a href="#">
                              <i className="fa fa-times"></i>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* CUPÓN */}
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
                        <button
                          className="ed-btn-square purple-4"
                          name="apply_coupon"
                          type="submit"
                        >
                          <span>Aplicar cupón</span>
                        </button>
                      </div>
                      <div className="coupon2">
                        <button
                          className="ed-btn-square purple-4"
                          name="update_cart"
                          type="submit"
                        >
                          <span>Actualizar carrito</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TOTALES */}
                <div className="row justify-content-end">
                  <div className="col-md-5">
                    <div className="cart-page-total">
                      <h2>Totales del carrito</h2>
                      <ul className="mb-20">
                        <li>
                          Subtotal <span>Bs. {subtotal.toFixed(2)}</span>
                        </li>
                        <li>
                          Total <span>Bs. {subtotal.toFixed(2)}</span>
                        </li>
                      </ul>
                      <Link className="ed-btn-square purple-4" to="/checkout">
                        <span>Proceder al pago</span>
                      </Link>
                    </div>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CartMain;