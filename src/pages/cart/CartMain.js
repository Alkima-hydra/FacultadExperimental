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
    name: 'Book',
    price: 180,
    quantity: 1,
    image: productImg1,
  },
  {
    id: 2,
    name: 'Note Book',
    price: 90.5,
    quantity: 1,
    image: productImg2,
  },
  {
    id: 3,
    name: 'Dictionary',
    price: 160,
    quantity: 1,
    image: productImg3,
  },
  {
    id: 4,
    name: 'Book',
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

  return (
    <main>
      <Breadcrumb title="Cart page" subTitle="cart" />

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
                        <th className="product-thumbnail">Images</th>
                        <th className="cart-product-name">Product</th>
                        <th className="product-price">Unit Price</th>
                        <th className="product-quantity">Quantity</th>
                        <th className="product-subtotal">Total</th>
                        <th className="product-remove">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="product-thumbnail">
                            <Link to="/product-details">
                              <img src={product.image} alt="" />
                            </Link>
                          </td>
                          <td className="product-name">
                            <Link to="/product-details">{product.name}</Link>
                          </td>
                          <td className="product-price">
                            <span className="amount">
                              ${product.price.toFixed(2)}
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
                              ${(product.price * product.quantity).toFixed(2)}
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
                <div className="row">
                  <div className="col-12">
                    <div className="coupon-all">
                      <div className="coupon">
                        <input
                          id="coupon_code"
                          className="input-text"
                          name="coupon_code"
                          placeholder="Coupon code"
                          type="text"
                        />
                        <button
                          className="ed-btn-square purple-4"
                          name="apply_coupon"
                          type="submit"
                        >
                          <span>Apply coupon</span>
                        </button>
                      </div>
                      <div className="coupon2">
                        <button
                          className="ed-btn-square purple-4"
                          name="update_cart"
                          type="submit"
                        >
                          <span>Update cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-end">
                  <div className="col-md-5 ">
                    <div className="cart-page-total">
                      <h2>Cart totals</h2>
                      <ul className="mb-20">
                        <li>
                          Subtotal <span>$250.00</span>
                        </li>
                        <li>
                          Total <span>$250.00</span>
                        </li>
                      </ul>
                      <Link className="ed-btn-square purple-4" to="/checkout">
                        <span>Proceed to checkout</span>
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
