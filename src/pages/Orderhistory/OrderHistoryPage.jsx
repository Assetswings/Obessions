import React, { useEffect, useState } from "react";
import "./OrderHistoryPage.css";
import { ChevronRight } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderHistory } from "./orderhistorySlice";
import { useNavigate } from "react-router-dom";
import { fetchMoreLike } from "../Products/otherproductSlice";

const STATUS_OPTIONS = [
  { key: "ORDER_PLACED", label: "Order Placed" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "RETURNED", label: "Returned" },
];

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("ORDER_PLACED");
  const { results, loading, error } = useSelector((state) => state.orders);
  const { moreLike } = useSelector((state) => state.toppick);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [showcnModal, setShowcnModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchMoreLike());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStatus) {
      dispatch(fetchOrderHistory({ status: selectedStatus }));
    } else {
      dispatch(fetchOrderHistory({}));
    }
  }, [dispatch, selectedStatus]);

  useEffect(() => {
    if (showModal || showcnModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal, showcnModal]);

  const handleStatusChange = (statusKey) => {
    setSelectedStatus((prev) => (prev === statusKey ? "" : statusKey));
  };

  const handleClearAll = (e) => {
    e.preventDefault();
    setSelectedStatus("");
  };

  const handleProceed = () => {
    setShowModal(false);
    if (selectedItem) {
      navigate("/returnexchange", {
        state: { item: selectedItem, orderNo: selectedOrder },
      });
    }
  };

  const handleProceedcn = () => {
    setShowcnModal(false);
    if (selectedItem) {
      navigate("/cancelorder", {
        state: { item: selectedItem, orderNo: selectedOrder },
      });
    }
  };

  const handleSimilarProductClick = (slug) => {
    navigate("/productsdetails", { state: { product: slug } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.msg}</p>;

  return (
    <div className="order-history">
      <aside className="sidebar">
        {/* <h2>Order History</h2> */}
        <div className="filters">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h4>Filters</h4>
            </div>
            <div>
              {selectedStatus.length > 0 && (
                <a href="#" className="clear-all" onClick={handleClearAll}>
                  Clear all
                </a>
              )}
            </div>
          </div>
          <p>ORDER STATUS</p>

          {STATUS_OPTIONS.map((status) => (
            <label key={status.key}>
              <input
                type="checkbox"
                checked={selectedStatus === status.key}
                onChange={() => handleStatusChange(status.key)}
              />
              <span className="status_key">{status.label}</span>
            </label>
          ))}
        </div>
      </aside>

      {/* Order list */}
      <main className="order-list">
        {results.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          results.map((order, idx) => (
            <div className="order-card" key={idx}>
              <div className="order-header">
                <div>
                  {/* <strong>{order.status}</strong> */}
                  <div>
                    <div> Estimated Delivery</div>
                    <div>
                      {/* {new Date(order.order_placed_at).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          timeZone: "Asia/Kolkata",
                        }
                      )} */}
                    </div>
                  </div>
                </div>
                <div className="trac">
                  <div>
                    <div>Order ID </div>
                    {order.order_no}{" "}
                  </div>
                </div>
                <div className="order-actions">
                  <span
                    className="pointer-crusser"
                    style={{ color: "#1B170E" }}
                    onClick={() =>
                      navigate("/OrderTrackingPage", {
                        state: { order_no: order.order_no },
                      })
                    }
                  >
                    Track Order
                  </span>
                  <div>
                    <span style={{ color: "#1B170E" }}>View Invoice</span>
                  </div>
                </div>
              </div>

              {order?.order_items?.map((item, i) => (
                <div className="order-item" key={i}>
                  <img src={item.product_media} alt={item.product_name} />
                  <div className="item-info">
                    <p>{item.product_name}</p>
                    {item.allow_cancellation && (
                      <div
                        className="link-btn"
                        onClick={() => {
                          setSelectedItem({
                            itemId: item.id,
                            product_name: item.product_name,
                            product_media: item.product_media,
                            price: item.mrp,
                            qty: item.quantity,
                            order_no: order.order_no,
                            action_url: item.action_url,
                            size: item.size,
                            color: item.color
                          });
                          setSelectedOrder(order.order_no);
                          setShowcnModal(true);
                        }}
                      >
                        <p className="cancel-order">Cancel Order</p>
                      </div>
                    )}
                    {(item.allow_exchange || item.allow_return) && (
                      <div className="actions">
                        <div className="link-btn">
                          <p
                            className="cancel-order"
                            onClick={() =>
                              handleSimilarProductClick(item.action_url)
                            }
                          >
                            Buy Again
                          </p>
                        </div>
                        <div
                          className="link-btn"
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
                              action_url: item.action_url,
                              size: item.size,
                              color: item.color
                            });
                            setSelectedOrder(order.order_no);
                            setShowModal(true);
                          }}
                        >
                          <span className="cancel-order">
                            Return / Exchange
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="arrow">
                    <ChevronRight size={24} onClick={() =>
                      navigate("/OrderTrackingPage", {
                        state: { order_no: order.order_no },
                      })
                    } />
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </main>

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

      {/*Cancel Modal */}
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
                  setSelectedItem(null);
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
    </div>
  );
};

export default OrderHistoryPage;
