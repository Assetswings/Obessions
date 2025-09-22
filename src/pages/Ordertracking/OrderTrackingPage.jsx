import React, { useEffect, useState } from "react";
import "./OrderTrackingPage.css";
import { Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchOrderHistory } from "../Orderhistory/orderhistorySlice";
import API from "../../app/api";

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [trackingData, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { order_no } = location.state || {};
  const { results, loading, error } = useSelector((state) => state.orders);

  const order = results[0]; // ✅ take first order safely
  const trackingUpdates = [
    { label: "Order Placed", time: null, status: "done", type: "major" },
    {
      label: "Preparing Your Order",
      time: null,
      status: "done",
      type: "major",
    },
  ];
  useEffect(() => {
    if (order_no) {
      console.log("calling useEffect with order_no:", order_no);
      dispatch(fetchOrderHistory({ order_no }));
      setData(trackingUpdates);
      getTrackingDetails(order_no);
    }
  }, [dispatch, order_no]);

  const getTrackingDetails = async (order_no) => {
    try {
      const res = await API.get(`/orders/${order_no}/tracking`);
      if (res.data.status === 200) {
        const apiData =
          JSON.parse(res.data?.data?.tracking_history[0].activities)?.data
            ?.history ?? [];
        console.log(
          "apilog",
          JSON.parse(res.data?.data?.tracking_history[0].activities)?.data
            ?.history
        );

        const dynamicUpdates = apiData.map((element) => ({
          label: `${element.message} ${element.location ?? ""}`,
          time: new Date(element.event_time).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: "done",
          type: "minor",
        }));

        // Final merged array
        const trackingUpdatesdata = [...trackingUpdates, ...dynamicUpdates];
        setData(trackingUpdatesdata);
        console.log("trackingUpdates >>>", trackingUpdatesdata);
      }
    } catch (err) {
      // toast.error(err.response?.data?.message || "Failed to send OTP");
      console.log(err);
    }
  };

  const handleSimilarProductClick = (slug) => {
    navigate("/productsdetails", { state: { product: slug } });
  };

  const handleProceed = () => {
    setShowModal(false);
    if (selectedItem) {
      navigate("/returnexchange", {
        state: { item: selectedItem, orderNo: selectedOrder },
      });
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div className="order-tracking-container">
      <div className="order-left">
        <h2>Order Details</h2>
        <p className="delivered-msg">Order was delivered on 06th May 2025</p>

        <div className="order-info">
          <p>
            Order Placed :{" "}
            <strong>
              {new Date(order.order_placed_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </p>
          <p>
            Order ID : <strong>{order_no}</strong>
          </p>
        </div>

        {order.order_items?.map((item, i) => (
          <div className="product-item" key={i}>
            <img src={item.product_media} alt={item.product_name} />
            <div className="product-details">
              <p>{item.product_name}</p>
              <p>Color :--</p>
              <p>₹{item.mrp}</p>
              <p>Quantity : {item.quantity}</p>
              <div className="actions">
                <span
                  onClick={() => handleSimilarProductClick(item.action_url)}
                >
                  Buy Again
                </span>
                <span
                  onClick={() => {
                    setSelectedItem({
                      itemId: item.id,
                      product_name: item.product_name,
                      product_media: item.product_media,
                      price: item.mrp,
                      qty: item.quantity,
                      order_no: order.order_no,
                      allow_exchange: item.allow_exchange,
                      allow_return: item.allow_return,
                    });
                    setSelectedOrder(order.order_no);
                    setShowModal(true);
                  }}
                >
                  Exchange / Return
                </span>
              </div>
            </div>
          </div>
        ))}

        {/*Exchange Modal */}
        {showModal && (
          <div className="modal-overlay-history">
            <div className="modal-box">
              <h3>Return / Exchange Order</h3>
              <p>Are you sure you want to return/cancel this order?</p>
              <div className="modal-actions">
                <button
                  className="go-back"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedItem(null);
                  }}
                >
                  GO BACK
                </button>
                <button className="proceed" onClick={handleProceed}>
                  YES, PROCEED
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="price-details">
          <div>
            <span>Sub Total</span>
            <span>₹{order.actual_order_values}</span>
          </div>
          <div>
            <span>
              COUPON{" "}
              <span className="coupon">[ {order.first_coupon_code} ]</span>
            </span>
            <span className="discount">-₹{order.first_coupon_discount}</span>
          </div>
          <div>
            <span>Shipping Charges</span>
            <span>₹{order.shipping_charges}</span>
          </div>
          <div className="total">
            <strong>Total</strong>
            <strong>₹{order.total_amount}</strong>
          </div>
        </div>
      </div>

      <div className="order-right">
        <h3>Updates :</h3>
        <div className="timeline">
          {trackingData?.map((step, index) => (
            <div
              className={`timeline-step ${step.type} ${step.status}`}
              key={index}
            >
              <div className="dot">
                {step.type === "major" && step.status === "done" ? (
                  <Check size={30} strokeWidth={1.5} />
                ) : (
                  ""
                )}
              </div>
              <div className="line" />
              <div className="content">
                <p>{step.label}</p>
                {step.time && <span>{step.time}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
