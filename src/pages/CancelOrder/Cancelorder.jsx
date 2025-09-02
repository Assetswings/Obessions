import React, { useState } from "react";
import "./CancelOrder.css";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../app/api";
import toast from "react-hot-toast";

const CancelOrder = () => {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item;
  const orderNo = state?.orderNo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Reason:", reason, "Comments:", comments, "Item:", item,"orderNo", orderNo);
    // alert("Order cancellation request submitted!");
    // navigate("/orderhistory");
      try {
        const res = await API.put(
          `/orders/${orderNo}/cancel`,
          {
            item_ids: [item.itemId],     // e.g. ["item123", "item456"]
            reason_id: reason,   // e.g. 123
            remarks: comments || "Cancel items",
          }
        );

        if (res.data.success) {
          toast.success("Order cancelled successfully!", {
            style: {
              border: "1px solid black",
              padding: "16px",
              color: "black",
            },
            iconTheme: {
              primary: "black",
              secondary: "white",
            },
          });
          navigate("/orderhistory");
        }
      } catch (err) {
        console.error("Cancel error:", err);
        toast.error(
          err.response?.data?.msg || "Order cancellation failed!",
          {
            style: {
              border: "1px solid #FF0000",
              padding: "16px",
              color: "#FF0000",
            },
            iconTheme: {
              primary: "#FF0000",
              secondary: "#FFFAEE",
            },
          }
        );
        navigate("/orderhistory");
      }
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
            <option value="1">No longer needed</option>
            <option value="2">Found cheaper elsewhere</option>
            <option value="3">Delivery taking too long</option>
            <option value="4">Ordered wrong item</option>
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
          <button className="cancel-btn">Cancel Order</button>
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
              src={item.product_media}
              alt={item.product_name}
            />
          </div>
        ) : (
          <p>No item details found.</p>
        )}
      </div>
    </div>
  );
};

export default CancelOrder;
