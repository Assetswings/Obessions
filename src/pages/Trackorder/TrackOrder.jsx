import React, { useState } from "react";
import { FaCheckSquare } from "react-icons/fa";
import "./TrackOrder.css";
import Footer from "../../components/Footer/Footer";

const TrackOrder = () => {
    const [orderId, setOrderId] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (orderId.trim()) {
            alert(`Tracking Order: ${orderId}`);
            // here you can call your tracking API
        }
    };

    return (
        <>
            <div className="track-container">
                <div className="track-box">
                    <h2 className="track-title">Track By: Order ID/ Tracking ID/ AWB</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="track-input"
                            placeholder="1234567890"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        />
                        <button type="submit" className="track-btn">
                            TRACK YOUR ORDER
                        </button>
                    </form>

                    <div className="track-benefits">
                        <h4>Key Benefits</h4>
                        <ul>
                            <li><FaCheckSquare /> Track in real time without logging in</li>
                            <li><FaCheckSquare /> Get an update in one click on the homepage</li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TrackOrder;
