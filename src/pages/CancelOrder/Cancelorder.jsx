import React, { useEffect, useState } from "react";
import "./CancelOrder.css";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../app/api";
import { ToastContainer, toast } from "react-toastify";
import Footer from "../../components/Footer/Footer";

const CancelOrder = () => {
  const [reason, setReason] = useState("");
  const [reasonList, setReasonList] = useState([]);
  const [comments, setComments] = useState("");
  const [showcnModal, setShowcnModal] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item;
  const orderNo = state?.orderNo;

  useEffect(() => {
    gerReason();
  }, []);
  const gerReason = async () => {
    try {
      const res = await API.get("/reasons/cancellation");
      if (res.data.status === 200) {
        setReasonList(res.data?.data);
      }
    } catch (err) {
      // toast.error(err.response?.data?.message || "Failed to send OTP");
      setReasonList([]);
      console.log(err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation errors
    const errors = {};

    if (!item?.itemId) {
      errors.itemId = "Item is required";
    }

    if (!reason) {
      errors.reason = "Please select a reason";
    }

    if (!comments?.trim()) {
      errors.comments = "Comments are required";
    } else if (comments.length < 5) {
      errors.comments = "Comments should be at least 5 characters long";
    }

    // If there are validation errors, stop execution
    if (Object.keys(errors).length > 0) {
      console.log("Validation Errors:", errors);
      setShowcnModal(false);
      toast.error(
        errors?.reason || errors?.comments || "Order Return failed!",
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
      return;
    }
    try {
      const res = await API.put(`/orders/${orderNo}/cancel`, {
        item_ids: [item.itemId], // e.g. ["item123", "item456"]
        reason_id: reason, // e.g. 123
        remarks: comments || "Cancel items",
      });

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
      toast.error(err.response?.data?.msg || "Order cancellation failed!", {
        style: {
          border: "1px solid #FF0000",
          padding: "16px",
          color: "#FF0000",
        },
        iconTheme: {
          primary: "#FF0000",
          secondary: "#FFFAEE",
        },
      });
      navigate("/orderhistory");
    }
  };

  return (
    <>
      <ToastContainer style={{zIndex:9999999999999}}  position="top-right" autoClose={3000} />
      <div className="cancel-order-container">
        {/* Left Section */}
        <div className="cancel-order-form">
          <h2>Cancel Order</h2>
          <p className="note">
            <i>ℹ Orders can only be cancelled until they are dispatched.</i>
          </p>

          <form onSubmit={(e) => {
            e.preventDefault(); // stop default page reload
            setShowcnModal(true);
          }}>
            <label>
              Reason for cancellation <span className="required">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Select Reason</option>
              {reasonList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.reason}
                </option>
              ))}
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
                <a href="/tc-of-sale">Terms and Condition</a> of refunds
              </small>
            </div>
            <button className="cancel-btn">Cancel Order</button>
          </form>
        </div>
        {/*Cancel Modal */}
        {showcnModal && (
          <div className="modal-overlay-history">
            <div className="modal-box">
              <h3>Cancel Order</h3>
              <p>Are you sure you want to cancel this order?</p>
              <div className="modal-actions">
                <button
                  className="go-back"
                  onClick={() => setShowcnModal(false)}
                >
                  DON'T CANCEL
                </button>
                <button className="proceed" onClick={handleSubmit}>
                  CANCEL ORDER
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="cancel-order-details">
          <h3>Order Details</h3>
          {item ? (
            <div className="order-box">
              <div className="order-info">
                <p className="order-title pointer-crusser" onClick={()=>navigate("/productsdetails", { state: { product: item.action_url } })}>{item.product_name}</p>
                <p>Qty : {item.qty}</p>
                <p>Size : {item.size}</p>
                <p>Color : {item.color}</p>
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
      <Footer />
    </>
  );
};

export default CancelOrder;
