import React, { useEffect, useState } from "react";
import "./ReturnExchange.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../app/api";
import Footer from "../../components/Footer/Footer";
import Breadcrumbs from "../../components/Breadcum/Breadcrumbs";

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
  const selectOption = state?.selectOption;

  useEffect(() => {
    document.title = "Obsession - Return / Exchange";
    getReason("return");
  }, []);
  useEffect(() => {
    setOption(selectOption);
  }, [selectOption]);
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
    const item_ids = [];
    item.forEach(element => {
      if (element.itemId) {
        item_ids.push(element.itemId);
      }
    });
    if (item_ids.length === 0) {
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
    if (option == "return") { // Return API Call
      try {
        const res = await API.put(`/orders/${orderNo}/return`, {
          item_ids: item_ids, // e.g. ["item123", "item456"]
          reason_id: reason, // e.g. 123
          remarks: comments || "return items",
        });

        if (res.data.success) {
          navigate("/Return-Success", {
            state: {
              orderNo: orderNo,
              page:"Return"
            },
          });
        }
      } catch (err) {
        console.error("Cancel error:", err);
        navigate("/ProfilePage");
      }
    } else { // Exchange API Call
      try {
        const res = await API.put(`/orders/${orderNo}/exchange`, {
          item_ids: item_ids, // e.g. ["item123", "item456"]
          reason_id: reason, // e.g. 123
          remarks: comments || "exchange items",
        });

        if (res.data.success) {
          navigate("/Exchange-Success", {
            state: {
              orderNo: orderNo,
              page:"Exchange"
            },
          });
        }
      } catch (err) {
        console.error("Cancel error:", err);
        navigate("/ProfilePage");
      }
    }
  };
  const breadcrumbPaths = [
    { label: "orders", to: "/profilepage" },
    { label: "Return / Exchange Order", to: "" }, // last one (no link)
  ];
  return (
    <>
      <Breadcrumbs paths={breadcrumbPaths} />
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
            {/* <div className="radio-options">
              {item[0].allow_return && (
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
              {item[0].allow_exchange && (
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
            </div> */}
            <span style={{ textTransform: "capitalize" }}><b>{option} Order</b></span>

            <label>
              Reason for {option} <span className="required">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Select {option}</option>
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
                <Link to={`/tc-of-sale`}>Terms of Service</Link> of refunds
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
          {item.length > 0 ? (
            item.map((order, idx) => (
              <div className="order-box" key={idx}>
                <div className="order-info">
                  <p className="order-title pointer-crusser" >
                    <Link to={`/productsdetails/${order.action_url}`} target="_blank" rel="noopener noreferrer">
                      <b>  {order.product_name.length > 30 ? order.product_name.slice(0, 30) + "..." : order.product_name}</b>
                    </Link>
                  </p>
                  <p><b>Qty</b> : {order.qty}</p>
                  <p><b>Size</b> : {order.size}</p>
                  <p><b>Color</b> : {order.color}</p>
                  <p className="order-price"><b>Price</b> : ₹{order.price}</p>
                </div>
                <img
                  className="img_cancel"
                  src={order.product_media}
                  alt={order.product_name}
                />
              </div>
            ))
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
