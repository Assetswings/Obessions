import { XCircle } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

const Failedpage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Obsession - Payment Failed";
  })
  return (
    <>
      <div className="success-container">
        {/* ✅ Success Icon */}
        {/* <XCircle className="error-icon" /> */}
        <XCircle
          style={{
            color: "#ef4444", // red-500
            width: "60px",
            height: "60px",
            marginBottom: "20px",
          }}
        />

        {/* ✅ Title */}
        <h2 className="success-title">Something Went Wrong</h2>
        <p className="success-subtitle">
          Something went wrong while Processing your Order <br/>
          Please try again or Contact Support.</p>

        {/* ✅ Estimated Arrival */}
        {/* <div className="arrival-box">
          <h3 className="arrival-title">Estimated arrival</h3>
          <p className="arrival-date">---</p>
          <p className="arrival-id">
            Order ID : <span>{verifyResponse?.data?.order_no}</span>
          </p>
        </div> */}

        {/* ✅ Buttons */}
        <div className="button-group">
          <button onClick={() => navigate("/")} className="btn-outline">
            CONTACT US
          </button>
          <button onClick={() => navigate("/")} className="btn-primary">
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
      {/* Fotter section  */}
      <Footer />
    </>
  );
};

export default Failedpage;
