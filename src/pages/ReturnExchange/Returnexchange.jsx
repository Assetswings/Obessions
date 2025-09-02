import React, { useState } from "react";
import "./ReturnExchange.css";
import { useLocation, useNavigate } from "react-router-dom";

  const ReturnExchange = () => {
  const [option, setOption] = useState("return");
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item; 


  console.log('====================================');
  console.log("The track from return--->",item);
  console.log('====================================');
 

    const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Option:", option, "Reason:", reason, "Comments:", comments);
    alert("Return/Exchange request submitted!");
  };

  return (
    <div className="return-exchange-container">
      {/* Left Section */}
      <div className="return-exchange-form">
        <h2>RETURN AND EXCHANGE</h2>
        <p className="note">
          <i>
            ℹ After delivery, you're eligible for return or exchange within 5
            days.
          </i>
        </p>
        <p className="charge-note">
          Please note: A logistics charge of 5% will be applied and deducted
          from your refund.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Radio Buttons */}
       <div className="radio-options">
               <label>
              <input
                 type="radio"
                 value="return"
                 checked={option === "return"}
                 onChange={(e) => setOption(e.target.value)}
              />
             &nbsp; Return
            </label>
            <label>
              <input
                type="radio"
                value="exchange"
                checked={option === "exchange"}
                onChange={(e) => setOption(e.target.value)}
              />
              &nbsp; Exchange
            </label>
          </div>

          <label>
            Reason for return <span className="required">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          >
            <option value="">Select Reason</option>
            <option value="not_needed">No longer needed</option>
            <option value="defective">Received defective product</option>
            <option value="wrong_item">Wrong item received</option>
            <option value="other">Other</option>
          </select>

          <label>
            Comments <span className="required">*</span>
          </label>
          <textarea
            placeholder="Eg: Size is not as expected"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            required
          />

          <div className="refund-info">
            <p>Refund will be processed to your original payment method.</p>
            <small>
              By clicking “Return Order”, I agree to{" "}
              <a href="#">Terms and Condition</a> of refunds
            </small>
          </div>

          <button type="submit" className="return-btn">
            Return Order
          </button>
        </form>
      </div>

     {/* Right Section */}
     <div className="cancel-order-details">
        <h3>Order Details</h3>
        {item ? (
          <div className="order-box">
            <div className="order-info">
              <p className="order-title">{item.product_name}</p>
              <p>Qty : {item.qty}</p>
              <p className="order-price">₹{item.price}</p>
            </div>
            <img 
            className="img_cancel"
            src={item.product_media} alt={item.product_name} />
          </div>
        ) : (
    <p>No item details found.</p>
        )}
      </div>
    </div>
  );
};

export default ReturnExchange;
