import React, { useState, useEffect } from "react";
import "./PaymentPage.css";
import Footer from "../../components/Footer/Footer";
import { Info } from "lucide-react";
import { useLocation } from "react-router-dom";
import { initiatePayment, verifyPayment } from "./paymentService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderResponse, orderPayload, checkoutData } = location.state || {};
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Default selection logic
  useEffect(() => {
    if (orderResponse?.data?.payment_gateways?.length) {
      const razorpay = orderResponse.data.payment_gateways.find(
        (g) => g.provider === "RAZORPAY"
      );
      if (razorpay) {
        setSelectedPayment("RAZORPAY");
      } else {
        setSelectedPayment(orderResponse.data.payment_gateways[0].provider);
      }
    }
  }, [orderResponse]);

  const startPayment = async () => {
    try {
      if (!selectedPayment) {
        alert("Please select a payment method!");
        return;
      }
      const gateway = orderResponse?.data?.payment_gateways.find(
        (g) => g.provider === selectedPayment
      );
      if (!gateway) {
        alert("Invalid payment method selected!");
        return;
      }

      // Step 1: Call initiate API
      let payload = {
        ref_id: orderResponse?.data?.ref_id,
        provider: gateway.provider,
        secret: gateway.secret,
        redirect_url: `${window.location.origin}/paymentcheck`,
      };

      const orderData = await initiatePayment(payload);
      if (!orderData?.success) {
        toast.error(orderData?.message, {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        });
        return false;
      }
      // Step 2: Razorpay Flow
      if (gateway.provider === "RAZORPAY") {
        if (orderData?.success) {
          // Redirect user to PhonePe payment page
          window.location.href = orderData?.data?.payment_link;
        } else {
          toast.error("Payment initiation failed", {
            style: {
              border: "1px solid #713200",
              padding: "16px",
              color: "#713200",
            },
            iconTheme: {
              primary: "#713200",
              secondary: "#FFFAEE",
            },
          });
        }
      } else if (gateway.provider === "PHONEPE") {
        // Handle PhonePe
        if (orderData?.success) {
          // Redirect user to PhonePe payment page
          window.location.href = orderData?.data?.payment_link;
        } else {
          toast.error("Payment initiation failed", {
            style: {
              border: "1px solid #713200",
              padding: "16px",
              color: "#713200",
            },
            iconTheme: {
              primary: "#713200",
              secondary: "#FFFAEE",
            },
          });
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
    }
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="root-title-chk">
        <h2 className="title_chk">Payment</h2>
      </div>
      <div className="cart_mlb">
        <span className="txt_mlb_my"> Payment</span>
      </div>
      <div className="checkout-container_chk">
        <div className="checkout-right_ck">
          {checkoutData?.data?.items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-image">
                <img
                  className="img-cart-page"
                  src={item.product.media}
                  alt="product"
                />
              </div>
              <div className="item-details">
                <h4 className="item-title">{item.product.name}</h4>
                <p className="price_details">
                  ₹{item.product.selling_price}{" "}
                  <span className="sub-1">
                    {" "}
                    <del>₹{item.product.mrp}</del> &nbsp;
                    <span className="dis-sub">{`(-${item.product.discount}%)`}</span>{" "}
                  </span>
                </p>
                <p className="item-size">
                  Size: <u>{item.product.size}</u>
                </p>
                <p>
                  Color:{" "}
                  <span className={`color-${item.product.color.toLowerCase()}`}>
                    <u>{item.product.color}</u>
                  </span>
                </p>
                <p className="item-qtn">
                  Quantity: <u>{item.cart_qty}</u>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-left_ck">
          <div className="section">
            {/* calculation */}
            <div className="price-summary">
              <div className="trackvel">
                <div className="txt_title_cal">
                  COUPON [{" "}
                  <span className="coupon">
                    {checkoutData?.data?.applied_coupon[0]?.coupon_code}
                  </span>{" "}
                  ]
                </div>
                <div>-₹{checkoutData?.data?.applied_coupon[0]?.discount}</div>
              </div>
              <div className="trackvel">
                <div className="txt_title_cal">SHIPPING CHARGES</div>
                <div>₹{checkoutData?.data?.shipping_charges}</div>
              </div>
              <div className="trackvel">
                <div className="txt_title_cal">ROUND OFF</div>
                <div>₹{checkoutData?.data?.order_total_roundoff}</div>
              </div>
              <div className="trackvel">
                <div className="txt_title_cal">TOTAL MRP</div>
                <div>₹{checkoutData?.data?.subtotal}</div>
              </div>
              <div className="breaker_global">
                <hr />
              </div>
              <div className="trackvel">
                <div className="txt_title_cal">
                  ORDER TOTAL
                </div>
                <div>
                  ₹{checkoutData?.data?.order_total}
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <h6 style={{ fontWeight: "bold" }}>DELIVERY ADDRESS</h6>
            <p style={{color: "#625E55"}}>
              {orderPayload.billing_first_name} {orderPayload.billing_last_name}{" "}
              <br />
              {orderPayload.billing_mobile}
              <br />
              {orderPayload.billing_address}
              <br />
              {orderPayload.billing_address2},{orderPayload.billing_landmark},{" "}
              {orderPayload.billing_pincode}, {orderPayload.billing_city},{" "}
              {orderPayload.billing_state}
            </p>
          </div>

          <div className="section">
            <h6 style={{fontWeight:"bold"}}>SELECT A PAYMENT METHOD</h6>
            {/* <div className="payment-options">
              {orderResponse?.data?.payment_gateways?.map((pg, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name="payment"
                    value={pg.provider}
                    checked={selectedPayment === pg.provider}
                    onChange={() => setSelectedPayment(pg.provider)}
                  />
                  <span style={{ marginLeft: "8px" }}>{pg.provider}</span>
                </label>
              ))}
            </div> */}
            <div className="payment-options">
              {orderResponse?.data?.payment_gateways?.map((pg, idx) => (
                <label key={idx} className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value={pg.provider}
                    checked={selectedPayment === pg.provider}
                    onChange={() => setSelectedPayment(pg.provider)}
                  />
                  <span
                    style={{
                      marginLeft: "8px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {pg.provider === "RAZORPAY" && (
                      <img
                        src={pg.logo}
                        alt="Razorpay"
                        className="payment-logo"
                      />
                    )}
                    {pg.provider === "PHONEPE" && (
                      <img
                        src={pg.logo}
                        alt="PhonePe"
                        className="payment-logo"
                      />
                    )}
                    {/* <span style={{ marginLeft: "8px" }}>{pg.provider}</span> */}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <p className="terms">
            Before proceed further you can review{" "}
            <a href="/tc-of-sale">Terms & Conditions of Sale</a> and{" "}
            <a href="/privacy-policy">Privacy Policy</a>
          </p>
          <div className="root_track">
            <button onClick={startPayment} className="payment-btn">
              CONTINUE TO PAYMENT
            </button>
          </div>
          <div className="root_track">
            <p className="info-note">
              <span>
                <Info size={18} />
              </span>{" "}
              &nbsp;If a product doesn’t meet your expectations, we’re happy to
              offer a refund for the product value. <br />
              Please note, a 5% deduction will be made from the total invoice
              value to cover partial freight and packaging costs.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;
