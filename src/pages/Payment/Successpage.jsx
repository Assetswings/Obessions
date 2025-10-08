import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Successpage.css"; // ✅ import CSS file
import { useDispatch, useSelector } from "react-redux";
import { fetchAddOns } from "../Products/otherproductSlice";
import { UseDispatch } from "react-redux";
import Footer from "../../components/Footer/Footer";
import SuccessIcon from "../../assets/icons/Success-Icon.png";
const Successpage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { verifyResponse } = location.state || {};
  const { addOns } = useSelector((state) => state.toppick);

  useEffect(() => {
    dispatch(fetchAddOns());
  }, [dispatch]);

  const redirectProduct = (action_url) => {
    const parts = action_url.replace(/^\/+/, "").split("/");

    const categorySlug = parts[0];      // "bath Care"
    const subcategorySlug = parts[1];   // "bath Set"

    // Navigate with state
    navigate("/products", { state: { category: categorySlug, subcategory: subcategorySlug } });
  }

  return (
    <>
      <div className="success-container">
        {/* ✅ Success Icon */}
        {/* <CheckCircle className="success-icon" /> */}
        <div className="mb-4">
          <img src={SuccessIcon} alt="success" />
        </div>

        {/* ✅ Title */}
        <h2 className="success-title">Order placed Successfully</h2>
        <p className="success-subtitle">Thanks for shopping with us!</p>

        {/* ✅ Estimated Arrival */}
        <div className="arrival-box">
          <h3 className="arrival-title">Estimated arrival</h3>
          <p className="arrival-date">--</p>
          <p className="arrival-id">
            Order PLACED : <span>{new Date(verifyResponse?.data?.created_at).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}</span>
          </p>
          <p className="arrival-id">
            Order ID : <span>{verifyResponse?.data?.order_no}</span>
          </p>
        </div>

        {/* ✅ Buttons */}
        <div className="button-group">
          <button
            onClick={() =>
              navigate("/OrderTrackingPage", {
                state: { order_no: verifyResponse?.data?.order_no },
              })
            }
            className="btn-outline"
          >
            TRACK ORDER
          </button> &nbsp;
          <button onClick={() => navigate("/")} className="btn-primary">
            CONTINUE SHOPPING
          </button>
        </div>
      </div>

      {/* <section className="top-picks-section">
        <h2 className="top-picks-heading">Don’t miss these top picks.</h2>
        <div className="top-picks-slider">
          {addOns?.map((item) => (
            <div key={item.id} className="top-pick-card">
              <img
                src={item.media}
                alt={item.name}
                className="top-pick-image"
              />
              <p className="top-pick-title">{item.name}</p>
            </div>
          ))}
        </div>
      </section> */}
      <section className="top-picks-section">
        <h2 className="top-picks-heading">Perfect Add-ons for Your Order</h2>
        <div className="top-picks-grid">
          {addOns?.map((item) => (
            <div key={item.id} className="top-pick-card pointer-crusser">
              <img
                src={item.media}
                alt={item.name}
                className="top-pick-image"
                onClick={() => redirectProduct(item.action_url)}
              />
              <p className="top-pick-title" onClick={() => redirectProduct(item.action_url)}>{item.name}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Fotter section  */}
      <Footer />
    </>
  );
};

export default Successpage;
