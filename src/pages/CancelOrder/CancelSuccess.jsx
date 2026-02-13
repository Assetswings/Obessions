import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../Payment/Successpage.css"; // ✅ import CSS file
import { useDispatch, useSelector } from "react-redux";
import { fetchAddOns } from "../Products/otherproductSlice";
import { UseDispatch } from "react-redux";
import Footer from "../../components/Footer/Footer";
import SuccessIcon from "../../assets/icons/Success-Icon.png";

const CancelSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { orderNo } = location.state || {};
    const { addOns } = useSelector((state) => state.toppick);
    
    useEffect(() => {
        document.title = "Obsessions- Payment Success";
        dispatch(fetchAddOns());
    }, [dispatch]);
    return (
        <>
            <div className="success-container">
                {/* ✅ Success Icon */}
                {/* <CheckCircle className="success-icon" /> */}
                <div className="mb-4">
                    <img src={SuccessIcon} alt="success" />
                </div>

                {/* ✅ Title */}
                <h2 className="success-title">Your cancellation is confirmed.</h2>
                <p className="success-subtitle">Refund will be processed to your original payment method.</p>

                {/* ✅ Estimated Arrival */}
                <div className="arrival-box">
                    <h3 className="arrival-title">Order Details</h3>
                    {/* <p className="arrival-date">--</p>
                    <p className="arrival-id">
                        Order PLACED : <span>{new Date(orderNo?.data?.created_at).toLocaleDateString(
                            "en-GB",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            }
                        )}</span>
                    </p> */}
                    <p className="arrival-id">
                        Order ID : <span>{orderNo}</span>
                    </p>
                </div>

                {/* ✅ Buttons */}
                <div className="button-group">
                    <Link to={`/OrderTrackingPage/${orderNo}`}>
                        <button
                        className="btn-outline">
                        Track Oder
                        </button>
                    </Link>&nbsp;
                    <button onClick={() => navigate("/")} className="btn-outline-continue">
                        Continue Shopping
                    </button>
                </div>
            </div>
            <section className="top-picks-section">
                <h2 className="top-picks-heading">Perfect Add-ons for Your Order</h2>
                <div className="top-picks-grid">
                    {addOns?.map((item) => (
                        <div key={item.id} className="top-pick-card pointer-crusser">
                            <Link to={`/products${item.action_url}`}>
                                <img
                                    src={item.media}
                                    alt={item.name}
                                    className="top-pick-image"
                                />
                                <p className="top-pick-title" >{item.name}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
            {/* Fotter section  */}
            <Footer />
        </>
    )
}

export default CancelSuccess