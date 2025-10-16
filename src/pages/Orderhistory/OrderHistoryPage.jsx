import React, { useEffect, useState } from "react";
import "./OrderHistoryPage.css";
import { ChevronRight } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderHistory } from "./orderhistorySlice";
import { Link, useNavigate } from "react-router-dom";
import { fetchMoreLike, fetchTopPicks } from "../Products/otherproductSlice";
import blankcart from "../../assets/images/empty-order-history.png";
import rightarrawwhite from "../../assets/icons/rightarrawwhite.png";

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
  const { items } = useSelector((state) => state.toppick);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [showcnModal, setShowcnModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    document.title = "Obsession - Order History";
    dispatch(fetchTopPicks());
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.msg}</p>;

  return (
    <>
      <div className="order-history">
        {results.length === 0 ? (
          <>
            <div className="empty-orderhistory">
              <img
                src={blankcart}
                alt="Empty cart"
                className="empty-cart-image"
              />
              <h3 className="empty-cart-title">
                You haven't placed any orders yet.
              </h3>
              <p className="empty-cart-subtitle">
                Find something that feels like home shop your first piece today.
              </p>
              <button
                className="empty-cart-btn"
                onClick={() => navigate("/")} // ✅ send user back to home/shop
              >
                EXPLORE &nbsp; <img src={rightarrawwhite} height={25} width={25} />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Sidebar Filters */}
            <aside className="sidebar">
              <div className="filters">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h4>Filters</h4>
                  {selectedStatus.length > 0 && (
                    <a href="#" className="clear-all" onClick={handleClearAll}>
                      Clear all
                    </a>
                  )}
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

            {/* Order List */}
            <main className="order-list">
              {results.map((order, idx) => (
                <div className="order-card" key={idx}>
                  <div className="order-header">
                    <div>
                      <div>Estimated Delivery</div>
                      <div>
                        {/* Format date here if needed */}
                        {/* {new Date(order.order_placed_at).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    timeZone: "Asia/Kolkata",
                  })} */}
                      </div>
                    </div>

                    <div className="trac">
                      <div>
                        <div>Order ID</div>
                        {order.order_no}
                      </div>
                    </div>

                    <div className="order-actions">
                      <Link to={`/OrderTrackingPage/${order.order_no}`}>
                        <span
                          className="pointer-crusser"
                          style={{ color: "#1B170E" }}
                        >
                          Track Order
                        </span>
                      </Link>
                      <div>
                        <span style={{ color: "#1B170E" }}>View Invoice</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order?.order_items?.map((item, i) => (
                    <div className="order-item" key={i}>
                      <img src={item.product_media} alt={item.product_name} />
                      <div className="item-info">
                        <p>{item.product_name}</p>

                        {/* Cancel Option */}
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
                                color: item.color,
                              });
                              setSelectedOrder(order.order_no);
                              setShowcnModal(true);
                            }}
                          >
                            <p className="cancel-order">Cancel Order</p>
                          </div>
                        )}

                        {/* Return / Exchange Option */}
                        {(item.allow_exchange || item.allow_return) && (
                          <div className="actions">
                            <div className="link-btn">
                              <p
                                className="cancel-order"
                              >
                                <Link to={`/productsdetails/${item.action_url}`} target="_blank" rel="noopener noreferrer">Buy Again</Link>
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
                                  color: item.color,
                                });
                                setSelectedOrder(order.order_no);
                                setShowModal(true);
                              }}
                            >
                              <span className="cancel-order">Return / Exchange</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="arrow">
                        <Link to={`/OrderTrackingPage/${order.order_no}`}>
                          <ChevronRight
                            size={24}
                          />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </main>
          </>
        )}

        {/* Return / Exchange Modal */}
        {showModal && (
          <div className="modal-overlay-history">
            <div className="modal-box">
              <h3>Return / Exchange Order</h3>
              <p>Are you sure you want to return/exchange this order?</p>
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
      {results.length === 0 && (
        <section className="top-picks-section">
          <h2 className="top-picks-heading">Don’t miss these top picks.</h2>
          <div className="top-picks-grid">
            {items.map((item) => (
              <div key={item.id} className="top-pick-card">
                <Link to={`/products${item.action_url}`}>
                  <img
                    src={item.media}
                    alt={item.name}
                    className="top-pick-image pointer-crusser"
                  />
                  <p
                    className="top-pick-title pointer-crusser"
                  >
                    {item.name}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default OrderHistoryPage;
