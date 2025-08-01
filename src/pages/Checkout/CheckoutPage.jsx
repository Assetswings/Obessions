import React, { useState, useEffect } from "react";
import "./CheckoutPage.css";
import Footer from "../../components/Footer/Footer";
import { IoMdClose } from "react-icons/io";

const cartItems = [
  {
    id: 1,
    image: "https://i.ibb.co/zWv3LyCV/image-387.png",
    title: "GRACIE HAMPTON SOFT BLUE TUFTED RUG",
    size: "3' X 5'",
    color: "Blue",
    quantity: 1,
    price: 1755,
  },
  {
    id: 2,
    image: "https://i.ibb.co/rfZnnjVz/image-5.png",
    title: "ORIENTAL CLASSIC VELVET RUG",
    size: "4' X 6'",
    color: "Green",
    quantity: 1,
    price: 1755,
  },
  {
    id: 3,
    image: "https://i.ibb.co/s9r2vLHV/image-3.png",
    title: "MODERN SCANDI TEXTURED RUG",
    size: "5' X 7'",
    color: "Grey",
    quantity: 1,
    price: 1755,
  },
];

  const CheckoutPage = () => {
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    pin: "",
    state: "",
    city: "",
    flat: "",
    street: "",
    landmark: "",
    lableaddresss:""
  });

     useEffect(() => {
    if ( showAddAddressModal ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [ showAddAddressModal]);

  const handleModalClick = (e, closer) => {
    if (e.target.classList.contains("modal-overlay")) {
      closer();
    }
  };

  const handleNewAddressChange = (e) => {
  const { name, value } = e.target;
  setNewAddress((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <div className="root-title-chk">
        <h2 className="title_chk">Checkout</h2>
      </div>
      <div className="checkout-container_chk">
        <div className="checkout-right_ck">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-image">
                <img className="img-cart-page" src={item.image} alt="product" />
              </div>
              <div className="item-details">
                <h4 className="item-title">{item.title}</h4>
                <p className="price_details">
                  ₹1755{" "}
                  <span className="sub-1">
                    {" "}
                    <del>₹2125</del> &nbsp;
                    <span className="dis-sub">{`(-30%)`}</span>{" "}
                  </span>
                </p>
                <p className="item-size">
                  Size: <u>{item.size}</u>
                </p>
                <p>
                  Color:{" "}
                  <span className={`color-${item.color.toLowerCase()}`}>
                    {item.color}
                  </span>
                </p>
                <div className="root_qtn_cart"></div>
              </div>
            </div>
          ))}

          <div className="price-summary">
            <div className="trackvel">
              <div className="txt_title_cal">TOTAL MRP</div>
              <div>₹3510</div>
            </div>
            <div className="trackvel">
              <div className="txt_title_cal">
                COUPON [ <span className="coupon">OBSFLAT10</span> ]
              </div>
              <div className="discount">-₹351</div>
            </div>

            <div className="trackvel">
              <div className="txt_title_cal">
                PROMO CODE [ <span className="coupon">PAYTM100</span> ]
              </div>
              <div className="discount">-₹100</div>
            </div>
            <div className="trackvel">
              <div className="txt_title_cal">ROUND OFF</div>
              <div>₹0</div>
            </div>
            <div className="trackvel">
              <div className="txt_title_cal">SHIPPING CHARGES</div>
              <div>₹0</div>
            </div>
            <br />
            <div className="breaker_global"> </div>
            <div className="trackvel">
              <div className="txt_title_cal">ORDER TOTAL</div>
              <div>₹3159</div>
            </div> 
          </div>
        </div>
        <div className="checkout-left_ck">
          <div className="section">
            <h4 className="title_roolt_checkout">Personal Information</h4>

            <div className="root_track">
              <div className="row">
                <input
                  type="text"
                  placeholder="John"
                  className="input_checkout"
                />
                <input
                  type="text"
                  placeholder="Doe"
                  className="input_checkout"
                />
              </div>
              <div className="row">
                <input
                  type="email"
                  placeholder="john.doe@gmail.com"
                  className="input_checkout"
                />
                <input
                  type="tel"
                  placeholder="+91 98765 43211"
                  className="input_checkout"
                />
              </div>
            </div>
          </div>

          <div className="section Aaddress-section">
            <div className="sector1">
              <h4 className="ship-info-txt">Shipping Information</h4>
            </div>
            <div className="sector1">
              <span className="sub-title-proced">
                {" "}
                Please add your address to proceed.{" "}
              </span>
            </div>
            <div className="sector1">
              <button 
              onClick={() => setShowAddAddressModal(true)}
              className="add_ads">ADD NEW ADDRESS</button>
            </div>
          </div>

          <div className="section">
            <div className="root_promo_sector">
              <h4 className="prmo-title_roots">Promo Code</h4>
              <div className="root_track">
                <div className="coupon-input-container">
                  <input
                    type="text"
                    value="PAYTM100"
                    readOnly
                    className="coupon-input"
                  />
                  <span className="remove-link">Remove</span>
                </div>
              </div>
            </div>
          </div>

          <div className="root_track">
            <button className="payment-btn">CONTINUE TO PAYMENT</button>
          </div>
          <div className="root_track">
            <p className="info-note">
              ℹ️ If a product doesn’t meet your expectations, we’re happy to
              offer a refund for the product value.Please note,a 5% deduction
              will be made from the total invoice value to cover partial freight
              and packaging costs.
            </p>
          </div>
        </div>
      </div>

      {showAddAddressModal && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            handleModalClick(e, () => setShowAddAddressModal(false))
          }>
          <div className="side-modal">
            <button
              className="close-btn"
              onClick={() => setShowAddAddressModal(false)}
            >
              <IoMdClose />
            </button>
            <h3>Add New Address</h3>
            <form>
              <label>
                PIN Code*
                <input
                  name="pin"
                  value={newAddress.pin}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                State*
                <input
                  name="state"
                  value={newAddress.state}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                City*
                <input
                  name="city"
                  value={newAddress.city}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                Flat Number*
                <input
                  name="flat"
                  value={newAddress.flat}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                Street Address*
                <input
                  name="street"
                  value={newAddress.street}
                  onChange={handleNewAddressChange}
                />
              </label>
              <label>
                Landmark
                <input
                  name="landmark"
                  value={newAddress.landmark}
                  onChange={handleNewAddressChange}
                />
              </label>

              <label>
              LABEL THIS ADDRESS
                <input
                  name="lableaddresss"
                  value={newAddress.lableaddresss}
                  onChange={handleNewAddressChange}
                />
              </label>
              <button type="submit">Add Address</button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default CheckoutPage;
