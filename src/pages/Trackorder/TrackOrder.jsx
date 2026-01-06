import React, { useState } from "react";
import { FaCheckSquare } from "react-icons/fa";
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        try {

            const res = await API.get(`/services/track/shipments?trackingId=${orderId}`);
            if (res.data.status === 200) {
                // Simulate delay only if you really want it
                const parsed = JSON.parse(res.data.data?.remarks);
                setOrderData(parsed.data);
                 setOrderId("")
            }
            // simulate API call
            // const response = {
            //     success: true,
            //     data: {
            //         remarks: `{"status":true,"data":{"id":"34914313","order_id":"64115293","order_number":"OBS-EC-20231100506","created":"2023-11-16","edd":"2023-11-18","pickup_date":"2023-11-16","rto_initiate_date":"","delivered_date":"2023-11-17","shipped_date":"2023-11-16","awb_number":"14355690014261","courier_name":"Xpressbees","status":"delivered","payment_type":"prepaid","history":[{"status_code":"DL","location":"DEL/NDL-EHV, New Delhi, DELHI","event_time":"2023-11-17 10:54:00","message":"Delivered"},{"status_code":"OFD","location":"DEL/NDL-EHV, New Delhi, DELHI","event_time":"2023-11-17 09:27:00","message":"Out For Delivery"},{"status_code":"SPD","location":"DEL/WDL, Delhi NCR, DELHI","event_time":"2023-11-16 20:49:00","message":"Picked"},{"status_code":"PKD","location":"DEL/PC1, Delhi NCR, DELHI","event_time":"2023-11-16 15:14:00","message":"Pickup done"}]}}`
            //     }
            // };

        } catch (err) {
             toast.error("Failed to fetch tracking info");
                  setOrderId("")
        } finally {
            setLoading(false);
        }
      };

        const handleReset = () => {
        setOrderData(null);
        setOrderId("");
    };

    return (
        <>
          <ToastContainer position="top-right" style={{ zIndex: 9999999999999 }} autoClose={3000} limit={1} hideProgressBar={true} transition={Slide} newestOnTop={true} />
            <div className="track-container">
                {!orderData ? (
                    <div className="track-box">
                        <h2 className="track-title">Track By: Order ID / Tracking ID / AWB</h2>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="track-input"
                                placeholder="Enter your Order ID"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                            />
                            <button type="submit" className="track-btn" disabled={loading}>
                                {loading ? "Loading..." : "TRACK YOUR ORDER"}
                            </button>
                        </form>

                        <div className="track-benefits">
                            <h4>Key Benefits</h4>
                            <ul>
                                <li><img src={tickicon} alt="tick" /> Track in real time without logging in</li>
                                <li><img src={tickicon} alt="tick" /> Get an update in one click on the homepage</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="track-result-box">
                        <div className="track-header">
                            <h2>Tracking Details</h2>
                            <button className="reset-btn" onClick={handleReset}>← Back</button>
                        </div>

                        <div className="order-summary">
                            <p><strong>Order No:</strong> {orderData.order_number}</p>
                            <p><strong>Courier:</strong> {orderData.courier_name}</p>
                            <p><strong>AWB:</strong> {orderData.awb_number}</p>
                            <p><strong>Payment:</strong> {orderData.payment_type}</p>
                            <p><strong>Status:</strong> <span className={`status ${orderData.status}`}>{orderData.status}</span></p>
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
