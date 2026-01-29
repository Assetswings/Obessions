import React, { useState } from "react";
import { MdLocalShipping, MdCheckCircle, MdOutlineAccessTime } from "react-icons/md";
import "./TrackOrder.css";
import Footer from "../../components/Footer/Footer";
import API from "../../app/api";
import tickicon from "../../assets/icons/tick-Icons.svg";
import { Slide, ToastContainer, toast } from "react-toastify";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // ✅ NEW

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!orderId.trim()) {
      setErrorMsg("Please enter the Order ID / Tracking ID / AWB");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await API.get(
        `/services/track/shipments?trackingId=${orderId}`
      );

      if (res.data.status === 200) {
        const parsed = JSON.parse(res.data.data?.remarks);
        setOrderData(parsed.data);
        setOrderId("");
      }
    } catch (err) {
      toast.error("Failed to fetch tracking info");
      setOrderId("");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOrderData(null);
    setOrderId("");
    setErrorMsg("");
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        style={{ zIndex: 9999999999999 }}
        autoClose={3000}
        hideProgressBar
        transition={Slide}
      />

      <div className="track-container">
        {!orderData ? (
          <div className="track-box">
            <h2 className="track-title">
              Track By: Order ID / Tracking ID / AWB
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="track-input"
                placeholder="Enter your Order ID"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  setErrorMsg(""); // ✅ clear error on typing
                }}
              />

              {/* ✅ ERROR MESSAGE */}
              {errorMsg && (
                <p style={{ color: "red", marginTop: "6px", fontSize: "13px" }}>
                  {errorMsg}
                </p>
              )}

              <button type="submit" className="track-btn" disabled={loading}>
                {loading ? "Loading..." : "TRACK YOUR ORDER"}
              </button>
            </form>

            <div className="track-benefits">
              <h4>Key Benefits</h4>
              <ul>
                <li>
                  <img src={tickicon} alt="tick" /> Track in real time without
                  logging in
                </li>
                <li>
                  <img src={tickicon} alt="tick" /> Get an update in one click on
                  the homepage
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="track-result-box">
            <div className="track-header">
              <h2>Tracking Details</h2>
              <button className="reset-btn" onClick={handleReset}>
                ← Back
              </button>
            </div>

            <div className="order-summary">
              <p>
                <strong>Order No:</strong> {orderData.order_number}
              </p>
              <p>
                <strong>Courier:</strong> {orderData.courier_name}
              </p>
              <p>
                <strong>AWB:</strong> {orderData.awb_number}
              </p>
              <p>
                <strong>Payment:</strong> {orderData.payment_type}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${orderData.status}`}>
                  {orderData.status}
                </span>
              </p>
            </div>

            <h3 className="timeline-title">Shipment Timeline</h3>
            <div className="timeline">
              {orderData.history.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-icon">
                    {item.status_code === "DL" ? (
                      <MdCheckCircle color="green" />
                    ) : item.status_code === "OFD" ? (
                      <MdLocalShipping color="#f59e0b" />
                    ) : (
                      <MdOutlineAccessTime color="#6b7280" />
                    )}
                  </div>
                  <div className="timeline-content">
                    <p className="message">{item.message}</p>
                    <p className="time">{item.event_time}</p>
                    <p className="location">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default TrackOrder;
