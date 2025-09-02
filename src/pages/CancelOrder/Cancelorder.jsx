import React, { useState } from "react";
import "./CancelOrder.css";
import { useLocation, useNavigate } from "react-router-dom";

const CancelOrder = () => {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item; 

 

    const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reason:", reason, "Comments:", comments, "Item:", item);
    alert("Order cancellation request submitted!");
    navigate("/orderhistory");
  };

  return (
    <div className="cancel-order-container">
      {/* Left Section */}
      <div className="cancel-order-form">
        <h2>Cancel Order</h2>
        <p className="note">
          <i>ℹ Orders can only be cancelled until they are dispatched.</i>
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Reason for cancellation <span className="required">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          >
            <option value="">Select Reason</option>
            <option value="not_needed">No longer needed</option>
            <option value="found_cheaper">Found cheaper elsewhere</option>
            <option value="delay">Delivery taking too long</option>
            <option value="wrong_item">Ordered wrong item</option>
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
              By clicking “Cancel Order”, I agree to{" "}
              <a href="#">Terms and Condition</a> of refunds
            </small>
          </div>
          <button  className="cancel-btn">
          Cancel Order
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

export default CancelOrder;
