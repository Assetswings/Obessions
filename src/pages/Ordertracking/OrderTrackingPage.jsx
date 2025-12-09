import React, { useEffect, useState } from "react";
import "./OrderTrackingPage.css";
import { Check, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { fetchOrderHistory } from "../Orderhistory/orderhistorySlice";
import API from "../../app/api";
import Footer from "../../components/Footer/Footer";
import Breadcrumbs from "../../components/Breadcum/Breadcrumbs";

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [option, setOption] = useState();
  const [trackingData, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showcnModal, setShowcnModal] = useState(false);
  const { orderNo: order_no } = useParams();
  // const { order_no } = orderNo || null;
  const { results, loading, error } = useSelector((state) => state.orders);
  // console.log('url order no',orderNo, order_no);

  const order = results[0]; // ✅ take first order safely
  const trackingUpdates = [
    { label: "Order Placed", time: null, status: "done", type: "major" },
    // {
    //   label: "Preparing Your Order",
    //   time: null,
    //   status: "done",
    //   type: "major",
    // },
  ];
  useEffect(() => {
    document.title = "Obsession - Order Tracking";
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

  const handleProceed = () => {
    setShowModal(false);
    if (selectedItem) {
      navigate("/returnexchange", {
        state: { item: selectedItem, orderNo: selectedOrder, selectOption: option },
      });
    }
  };
  const handleProceedcn = () => {
    setShowcnModal(false);
    // return false
    if (selectedItem) {
      navigate("/cancelorder", {
        state: { item: selectedItem, orderNo: selectedOrder },
      });
    }
  };

  const allReturnable = selectedItem.length > 0 && selectedItem.every(item => item.allow_return);
  const allExchangeable = selectedItem.length > 0 && selectedItem.every(item => item.allow_exchange);
  const allCancelable = selectedItem.length > 0 && selectedItem.every(item => item.allow_cancellation);


  if (loading) return <p>Loading order details...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!order) return <p>No order found.</p>;
  const breadcrumbPaths = [
    { label: "Orders", to: "/ProfilePage" },
    { label: "Order Tracking", to: "" }, // last one (no link)
  ];
  return (
    <>
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="order-tracking-container">
        <div className="order-left">
          <div className="order-track-head">
            <div className="root_tracker_dtl">
              <div>
                <h2>Order Details</h2>
              </div>
              <div>
                <div className="track-head-button-group">

                  {allReturnable &&
                    <button className="continue_shoping_track" onClick={() => { setShowModal(true); setOption('exchange'); }}>
                      RETURN
                    </button>
                  }

                  {allExchangeable &&
                    <button className="continue_shoping_track" onClick={() => { setShowModal(true); setOption('return'); }}>
                      EXCHANGE
                    </button>
                  }

                  {allCancelable &&
                    <button
                      className="continue_shoping_track" onClick={() => setShowcnModal(true)}>
                      CANCEL
                    </button>
                  }
                </div>
              </div>

            </div>
          </div>
          <hr />

          <div className="order-info-2">
            <div>
              <p>
                Order Placed
              </p>
            </div>
            {" "}
            <div style={{ fontSize: "12px" }}>
              : {new Date(order.order_placed_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="order-info-trck">
            <div>
              <p>
                Order ID
              </p>
            </div>
            {" "}
            <div>
              : <span style={{ fontSize: "12px" }}>{order_no}</span>
            </div>
          </div>

          <div className="mobileview order-right">
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

          {order.order_items?.map((item, i) => (
            <div className="product-item" key={i}>
              <div className="track_checkbox">
                <input
                  type="checkbox"
                  checked={selectedItem.some((it) => it.itemId === item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // If different order is selected, reset previous selection
                      if (selectedOrder && selectedOrder !== order.order_no) {
                        setSelectedItem([
                          {
                            itemId: item.id,
                            product_name: item.product_name,
                            product_media: item.product_media,
                            price: item.mrp,
                            qty: item.quantity,
                            order_no: order.order_no,
                            action_url: item.action_url,
                            size: item.size,
                            color: item.color,
                            allow_exchange: item.allow_exchange,
                            allow_return: item.allow_return,
                            allow_cancellation: item.allow_cancellation
                          },
                        ]);
                        setSelectedOrder(order.order_no);
                      } else {
                        // Same order, add item
                        setSelectedItem((prev) => [
                          ...prev,
                          {
                            itemId: item.id,
                            product_name: item.product_name,
                            product_media: item.product_media,
                            price: item.mrp,
                            qty: item.quantity,
                            order_no: order.order_no,
                            action_url: item.action_url,
                            size: item.size,
                            color: item.color,
                            allow_exchange: item.allow_exchange,
                            allow_return: item.allow_return,
                            allow_cancellation: item.allow_cancellation
                          },
                        ]);
                        setSelectedOrder(order.order_no);
                      }
                    } else {
                      // Remove item if unchecked
                      setSelectedItem((prev) =>
                        prev.filter((it) => it.itemId !== item.id)
                      );
                      if (selectedItem.length === 1) setSelectedOrder(null); // reset if last removed
                    }
                  }}
                />
              </div>

              <img src={item.product_media} alt={item.product_name} />
              <div className="product-details">
                <p>{item.product_name}</p>
                <p>Color : {item.color}</p>
                <p>Size : {item.size}</p>
                <p>₹{item.mrp}</p>
                <p>Quantity : {item.quantity}</p>
                <div className="actions">
                  <Link to={`/productsdetails/${item.action_url}`} target="_blank" rel="noopener noreferrer">
                    <span >Buy Again </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Exchange Modal */}
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
                      setSelectedItem([]);
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

          {/* Cancel Modal */}
          {showcnModal && (
            <div className="modal-overlay-history">
              <div className="modal-box">
                <h3>Cancel Order</h3>
                <p>Are you sure you want to cancel this order?</p>
                <div className="modal-actions">
                  <button
                    className="go-back"
                    onClick={() => {
                      setShowcnModal(false);
                      setSelectedItem([]);
                    }}
                  >
                    DON'T CANCEL
                  </button>
                  <button className="proceed" onClick={handleProceedcn}>
                    CANCEL ORDER
                  </button>
                </div>
              </div>
            </div>
          )}
          <div style={{ padding: "10px", display:"flex", justifyContent:"space-between" }}>
            <div>
              <span>
                View Invoice
              </span>
            </div>
            <div>
              <ChevronRight />
            </div>
          </div>
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
            <hr />
            <div className="total">
              <strong>Total</strong>
              <strong>₹{order.total_amount}</strong>
            </div>
          </div>
        </div>

        <div className="webview order-right">
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
      <Footer />
    </>
  );
};

export default OrderTrackingPage;
