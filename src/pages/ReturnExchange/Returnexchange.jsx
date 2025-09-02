import React, { useState } from "react";
import "./ReturnExchange.css";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../app/api";

const ReturnExchange = () => {
  const [option, setOption] = useState("return");
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item;
  const orderNo = state?.orderNo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(option == "return"){  // Return API Call
      try {
        const res = await API.put(
          `/orders/${orderNo}/return`,
          {
            item_ids: [item.itemId],     // e.g. ["item123", "item456"]
            reason_id: reason,   // e.g. 123
            remarks: comments || "return items",
          }
        );

        if (res.data.success) {
          toast.success("Order Returned successfully!", {
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
          err.response?.data?.msg || "Order Return failed!",
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
    }else{   // Exchange API Call
      try {
        const res = await API.put(
          `/orders/${orderNo}/exchange`,
          {
            item_ids: [item.itemId],     // e.g. ["item123", "item456"]
            reason_id: reason,   // e.g. 123
            remarks: comments || "exchange items",
          }
        );

        if (res.data.success) {
          toast.success("Order Exchanged successfully!", {
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
          err.response?.data?.msg || "Order Exchange failed!",
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
    }
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
            {item.allow_return && (
              <label>
                <input
                  type="radio"
                  value="return"
                  checked={option === "return"}
                  onChange={(e) => setOption(e.target.value)}
                />
                &nbsp; Return
              </label>
            )}
            {item.allow_exchange  && (
              <label>
                <input
                  type="radio"
                  value="exchange"
                  checked={option === "exchange"}
                  onChange={(e) => setOption(e.target.value)}
                />
                &nbsp; Exchange
              </label>
            )}
          </div>

          <label>
            Reason for Exchange <span className="required">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          >
            <option value="">Select Reason</option>
            <option value="1">No longer needed</option>
            <option value="2">Received defective product</option>
            <option value="3">Wrong item received</option>
            <option value="4">Other</option>
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
            {option} Order
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

export default ReturnExchange;
