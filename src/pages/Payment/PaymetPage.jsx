import React, { useState } from "react";
import "./PaymentPage.css";
import Footer from "../../components/Footer/Footer";
import { Info } from "lucide-react";

const cartItems = [
  {
    id: 1,
    title: "GRACIE HAMPTON SOFT BLUE TUFTED RUG",
    size: "3' X 5'",
    color: "Blue",
    price: 1755,
    image: "https://i.ibb.co/zWv3LyCV/image-387.png",
  },
  {
    id: 2,
    title: "CASSIA CLASSIC CHECKERED RUG",
    size: "3' X 5'",
    color: "Blue",
    price: 1755,
    image: "https://i.ibb.co/rfZnnjVz/image-5.png",
  },
];

  const PaymentPage = () => {
  const [selectedPayment, setSelectedPayment] = useState("razorpay");

  return (
    <>
      <div className="checkout-container">
        {/* LEFT SIDE: PRODUCTS */}
        <div className="checkout-left">
          <h2>Checkout</h2>

          {cartItems.map((item) => (
            <div className="item-summary" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div>
                <h5>{item.title}</h5>
                <p>Size: <u>{item.size}</u></p>
                <p>Color: <span className="color-blue">{item.color}</span></p>
                <div className="qty">
                  <button className="tracker-btn">-</button>
                  <span>1</span>
                  <button className="tracker-btn">+</button>
                </div>
              </div>
              <p className="price">₹{item.price}</p>
            </div>
          ))}

          <div className="price-summary">
            <div className="trackvel">
              <div>Total MRP</div>
              <div>₹3510</div>
            </div>
            <div className="trackvel">
              <div>Coupon [ <span className="coupon">OBSFLAT10</span> ]</div>
              <div className="discount">-₹351</div>
            </div>
            <div className="trackvel">
              <div>Promo Code [ <span className="coupon">PAYTM100</span> ]</div>
              <div className="discount">-₹100</div>
            </div>
            <div className="trackvel">
              <div>Round Off</div>
              <div>₹0</div>
            </div>
            <div className="trackvel">
              <div>Shipping Charges</div>
              <div>₹0</div>
            </div>
            <br />
            <div className="breaker_global"></div>
            <div className="trackvel total">
              <div>Order Total</div>
              <div>₹3059</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: PAYMENT DETAILS */}
        <div className="checkout-right">

          <div className="section">
            <h6>DELIVERY ADDRESS</h6>
            <p>John Doe</p>
            <p>john.doe@gmail.com</p>
            <p>+91 98765 43211</p>
            <p>Plot No. 20. Basement, Pusa Road, Karol</p>
            <p>New Delhi, India, 110005</p>
          </div>

          <div className="section">
            <h6>SELECT A PAYMENT METHOD</h6>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={selectedPayment === "razorpay"}
                  onChange={() => setSelectedPayment("razorpay")}
                />
                <img  
                  className="payment-logo"
                src="https://i.ibb.co/WNNPP6Rr/image-453.png" alt="Razorpay" />
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="phonepe"
                  checked={selectedPayment === "phonepe"}
                  onChange={() => setSelectedPayment("phonepe")}
                />
                <img 
                   className="payment-logo"
                src="https://i.ibb.co/SXt8YbVk/image-454.png" alt="PhonePe" />
              </label>
            </div>
          </div>

          <p className="terms">
            Before proceed further you can review{" "}
            <a href="#">Terms & Conditions of Sale</a> and{" "}
            <a href="#">Privacy Policy</a>
          </p>

          <button className="payment-btn">CONTINUE TO PAYMENT</button>

          <p className="info-note">
            <span><Info
              size={18}
            /></span> &nbsp;If a product doesn’t meet your expectations, we’re happy to offer a refund for the product value. <br />
            Please note, a 5% deduction will be made from the total invoice value to cover partial freight and packaging costs.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;
