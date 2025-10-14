import React, { useEffect, useState } from "react";
import "./ReturnExchange.css";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../app/api";
import Footer from "../../components/Footer/Footer";

const ReturnExchange = () => {
  const [option, setOption] = useState("return");
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [reasonList, setReasonList] = useState([]);
  const [showcnModal, setShowcnModal] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item;
  const orderNo = state?.orderNo;

  useEffect(() => {
    document.title = "Obsession - Return / Exchange";
    getReason("return");
  }, []);
  const getReason = async (option) => {
    if (option == "return") {
      try {
        const res = await API.get("/reasons/return");
        if (res.data.status === 200) {
          setReasonList(res.data?.data);
        }
      } catch (err) {
        // toast.error(err.response?.data?.message || "Failed to send OTP");
        setReasonList([]);
        console.log(err);
      }
    } else {
      try {
        const res = await API.get("/reasons/exchange");
        if (res.data.status === 200) {
          setReasonList(res.data?.data);
        }
      } catch (err) {
        // toast.error(err.response?.data?.message || "Failed to send OTP");
        setReasonList([]);
        console.log(err);
      }
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
      toast.error(errors || "Order Return failed!", {
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
      return;
    }
    if (option == "return") {
      // Return API Call
      try {
        const res = await API.put(`/orders/${orderNo}/return`, {
          item_ids: [item.itemId], // e.g. ["item123", "item456"]
          reason_id: reason, // e.g. 123
          remarks: comments || "return items",
        });

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
        toast.error(err.response?.data?.msg || "Order Return failed!", {
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
    } else {
      // Exchange API Call
      try {
        const res = await API.put(`/orders/${orderNo}/exchange`, {
          item_ids: [item.itemId], // e.g. ["item123", "item456"]
          reason_id: reason, // e.g. 123
          remarks: comments || "exchange items",
        });

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
        toast.error(err.response?.data?.msg || "Order Exchange failed!", {
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
    }
  };

  return (
    <>
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

          <form onSubmit={(e) => {
            e.preventDefault(); // stop default page reload
            setShowcnModal(true);
          }}>
            {/* Radio Buttons */}
            <div className="radio-options">
              {item.allow_return && (
                <label>
                  <input
                    type="radio"
                    value="return"
                    checked={option === "return"}
                    onChange={(e) => {
                      setOption(e.target.value);
                      getReason(e.target.value);
                    }}
                  />
                  &nbsp; Return
                </label>
              )}
              {item.allow_exchange && (
                <label>
                  <input
                    type="radio"
                    value="exchange"
                    checked={option === "exchange"}
                    onChange={(e) => {
                      setOption(e.target.value);
                      getReason(e.target.value);
                    }}
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
                By clicking “Return Order”, I agree to{" "}
                <a href="/tc-of-sale">Terms and Condition</a> of refunds
              </small>
            </div>

            <button type="submit" className="return-btn">
              {option} Order
            </button>
          </form>
          {showcnModal && (
            <div className="modal-overlay-history">
              <div className="modal-box">
                <h3>Cancel Order</h3>
                <p>{`Are you sure you want to ${option} this order?`}</p>
                <div className="modal-actions">
                  <button
                    className="go-back"
                    onClick={() => setShowcnModal(false)}
                  >
                    {`DON'T ${option}`}
                  </button>
                  <button className="proceed" onClick={handleSubmit}>
                    {`${option} ORDER`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="cancel-order-details">
          <h3>Order Details</h3>
          {item ? (
            <div className="order-box">
              <div className="order-info">
                <p className="order-title pointer-crusser" onClick={() => navigate("/productsdetails", { state: { product: item.action_url } })}>{item.product_name}</p>
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

export default ReturnExchange;
