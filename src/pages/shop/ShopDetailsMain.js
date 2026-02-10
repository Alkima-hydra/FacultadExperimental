import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Breadcrumb from '../../components/Breadcrumb';

import shopImg from '../../assets/img/shop/shop-details.jpg';
import reviewerImg from '../../assets/img/shop/reviewer.png';

const ShopDetailsMain = () => {
  const [quantity, setQuantity] = useState(1);
  const formRef = useRef();

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  //EmailJs Setup
  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formRef.current, {
        publicKey: 'YOUR_PUBLIC_KEY',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        }
      );
  };

  return (
    <main>
      <Breadcrumb title="Shop Details" subTitle="shop" />

      <div className="it-shop-details__area pt-120 pb-120">
        <div className="container">
          <div className="it-shop-details__top-wrap">
            <div className="row">
              <div className="col-xl-6 col-lg-6">
                <div className="it-shop-details__thumb-box">
                  <img src={shopImg} alt="" />
                </div>
              </div>
              <div className="col-xl-6 col-lg-6">
                <div className="it-shop-details__right-wrap">
                  <h3 className="it-shop-details__title-sm">
                    Ux mind seter Book
                  </h3>
                  <div className="it-shop-details__price">
                    <div className="it-shop-details__ratting">
                      <span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99725 13.695L3.7075 16.656L4.88875 10.71L0.4375 6.594L6.45775 5.88L8.99725 0.375L11.5368 5.88L17.557 6.594L13.1058 10.71L14.287 16.656L8.99725 13.695Z"
                            fill="currentcolor"
                          ></path>
                        </svg>
                      </span>
                      <span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99725 13.695L3.7075 16.656L4.88875 10.71L0.4375 6.594L6.45775 5.88L8.99725 0.375L11.5368 5.88L17.557 6.594L13.1058 10.71L14.287 16.656L8.99725 13.695Z"
                            fill="currentcolor"
                          ></path>
                        </svg>
                      </span>
                      <span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99725 13.695L3.7075 16.656L4.88875 10.71L0.4375 6.594L6.45775 5.88L8.99725 0.375L11.5368 5.88L17.557 6.594L13.1058 10.71L14.287 16.656L8.99725 13.695Z"
                            fill="currentcolor"
                          ></path>
                        </svg>
                      </span>
                      <span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99725 13.695L3.7075 16.656L4.88875 10.71L0.4375 6.594L6.45775 5.88L8.99725 0.375L11.5368 5.88L17.557 6.594L13.1058 10.71L14.287 16.656L8.99725 13.695Z"
                            fill="currentcolor"
                          ></path>
                        </svg>
                      </span>
                      <span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99725 13.695L3.7075 16.656L4.88875 10.71L0.4375 6.594L6.45775 5.88L8.99725 0.375L11.5368 5.88L17.557 6.594L13.1058 10.71L14.287 16.656L8.99725 13.695Z"
                            fill="currentcolor"
                          ></path>
                        </svg>
                      </span>
                      <span className="review-text">(25 Customer reviews)</span>
                    </div>
                    <span>$19.99</span>
                  </div>
                  <div className="it-shop-details__text pb-20">
                    <p>
                      In today’s online world, a brand’s success lies in
                      combining <br />
                      technological planning and social strategies to draw{' '}
                      <br />
                      customers in–and keep them coming back
                    </p>
                  </div>
                  <div className="it-shop-details__quantity-wrap">
                    <div className="it-shop-details__quantity-box d-flex align-items-center">
                      <span>Quantity</span>
                      <div className="it-shop-details__quantity">
                        <div className="cart-minus" onClick={handleDecrement}>
                          <i className="fal fa-minus"></i>
                        </div>
                        <input type="text" value={quantity} readOnly />
                        <div className="cart-plus" onClick={handleIncrement}>
                          <i className="fal fa-plus"></i>
                        </div>
                      </div>
                      <div className="it-shop-details__btn">
                        <Link className="ed-btn-square purple-4" to="/cart">
                          Add To Cart
                        </Link>
                      </div>
                    </div>
                    <div className="it-shop-details__text-2 pb-15">
                      <span>
                        <strong>SKU:</strong> 124224
                      </span>
                      <span>
                        <strong>Category: </strong>Crux Indoor Fast and Easy
                      </span>
                      <span>
                        <strong>Tag: </strong>accessories, business
                      </span>
                    </div>
                    <div className="it-shop-details__social">
                      <span>Share:</span>
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-pinterest-p"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-xl-12">
              <div className="it-shop-details__text-box grey-bg-4 mb-50">
                <h5 className="it-section-title-sm">Our Description</h5>
                <p className="pt-10 pb-20">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias excepturi sint occaecati cupiditate
                  non provident, similique sunt in culpa qui officia deserunt
                  mollitia animi, id est laborum et dolorum fuga. Et harum
                  quidem rerum facilis est et expedita distinctio.
                </p>
                <p className="mb-0">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias excepturi sint occaecati cupiditate
                  non provident, similique sunt in culpa qui officia deserunt
                  mollitia animi, id est laborum et dolorum fuga similique sunt
                  in culpa qui officia deserunt
                </p>
              </div>
            </div>
            <div className="col-xl-12">
              <div className="it-shop-details__review-box mb-50">
                <h4 className="postbox__details-title">Client Reviews</h4>
                <div className="it-shop-details__review pt-10 d-flex align-items-start">
                  <div className="it-shop-details__review-thumb">
                    <img src={reviewerImg} alt="" />
                  </div>
                  <div className="it-shop-details__author-info">
                    <span>
                      <strong>by David Parker / </strong>March 28, 2024
                    </span>
                    <div className="it-shop-details__star">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <p>
                      Elementum tempus egestas sed sed risus pretium quam
                      vulputate dignissim. Dictum at tempor commodo ullamcorper.
                      Sed risus pretium quam vulputate dignissim suspendisse.
                      Habitasse platea dictumst quisque{' '}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-12">
              <div className="it-shop-details-contact-wrap">
                <div className="it-contact-wrap2">
                  <h4 className="postbox__details-title mb-20">
                    Add Your Review
                  </h4>
                  <div className="it-contact-form-box">
                    <form ref={formRef} onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-xl-6 col-lg-6 col-12 mb-20">
                          <div className="it-contact-input">
                            <input type="text" placeholder="Your Name*" />
                          </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-12 mb-20">
                          <div className="it-contact-input">
                            <input type="email" placeholder="Email Address*" />
                          </div>
                        </div>
                        <div className="col-12 mb-20">
                          <div className="it-contact-input it-shop-input">
                            <textarea placeholder="Write Your Message*"></textarea>
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="ed-btn-square purple-4">
                        <span>Send Message</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default ShopDetailsMain;
