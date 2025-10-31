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
import Pagination from "../../components/Pagination/Pagination";

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
  const [option, setOption] = useState();
  const { results, pagination, loading, error } = useSelector(
    (state) => state.orders
  );
  const { items } = useSelector((state) => state.toppick);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [showcnModal, setShowcnModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const total = pagination?.total || 0;
  const limit = pagination?.limit || 20;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);

      // 👇 Scroll smoothly to the top after changing page
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 200);
    }
  };
  useEffect(() => {
    document.title = "Obsession - Order History";
    dispatch(fetchTopPicks());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStatus) {
      dispatch(
        fetchOrderHistory({
          status: selectedStatus,
          page: currentPage,
          limit: 10,
        })
      );
    } else {
      dispatch(fetchOrderHistory({}));
    }
  }, [dispatch, selectedStatus, currentPage]);

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
        state: { item: selectedItem, orderNo: selectedOrder, selectOption: option },
      });
    }
  };

  const handleProceedcn = () => {
    setShowcnModal(false);
    console.log(selectedItem, selectedOrder);
    // return false
    if (selectedItem) {
      navigate("/cancelorder", {
        state: { item: selectedItem, orderNo: selectedOrder },
      });
    }
  };

  const allExchangeable = selectedItem.length > 0 && selectedItem.every(item => item.allow_exchange);
  const allReturnable = selectedItem.length > 0 && selectedItem.every(item => item.allow_return);
  const allCancellable = selectedItem.length > 0 && selectedItem.every(item => item.allow_cancellation);


  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error.msg}</p>;

  return (
    <>
      <div className="order-history">
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
                EXPLORE &nbsp;{" "}
                <img src={rightarrawwhite} height={25} width={25} />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Order List */}
            <main className="order-list">
              {results.map((order, idx) => {
                // ✅ Check if this order is the currently selected one
                const isCurrentOrderSelected = selectedOrder === order.order_no;

                // ✅ Filter selected items for this specific order
                const selectedItemsForThisOrder = selectedItem.filter(
                  (item) => item.order_no === order.order_no
                );

                // ✅ Define per-order conditions
                const allExchangeable =
                  isCurrentOrderSelected &&
                  selectedItemsForThisOrder.length > 0 &&
                  selectedItemsForThisOrder.every((item) => item.allow_exchange);

                const allReturnable =
                  isCurrentOrderSelected &&
                  selectedItemsForThisOrder.length > 0 &&
                  selectedItemsForThisOrder.every((item) => item.allow_return);

                const allCancellable =
                  isCurrentOrderSelected &&
                  selectedItemsForThisOrder.length > 0 &&
                  selectedItemsForThisOrder.every((item) => item.allow_cancellation);

                return (
                  <div className="order-card" key={idx}>
                    <div className="root_new">
                      <div className="order-header">
                        <div>
                          <div>Order Placed</div>
                          <div>
                            {/* Format date here if needed */}
                            {new Date(order.order_placed_at).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                day: "2-digit",
                                month: "short",
                                timeZone: "Asia/Kolkata",
                              }
                            )}
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
                              className="txt_cation"
                              style={{ color: "#1B170E" }}
                            >
                              Track Order
                            </span>
                          </Link>
                          <div>
                            <span
                              className="txt_cation"
                              style={{ color: "#1B170E" }}
                            >
                              View Invoice
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="order-header_2">
                        <div>
                          <div
                            className={`txt_cation ${!allExchangeable ? "disabled" : ""}`}
                            onClick={() => {
                              if (allExchangeable) setShowModal(true); setOption('exchange');
                            }}
                            style={{
                              cursor: allExchangeable ? "pointer" : "not-allowed",
                              opacity: allExchangeable ? 1 : 0.5,
                            }}
                          >
                            <u>Exchange</u>
                          </div>
                        </div>

                        <div className="trac">
                          <div
                            onClick={() => {
                              if (allReturnable) setShowModal(true); setOption('return');
                            }}
                            style={{
                              cursor: allReturnable ? "pointer" : "not-allowed",
                              opacity: allReturnable ? 1 : 0.5,
                            }}
                          >
                            <u>Return</u>
                          </div>
                        </div>

                        <div className="order-actions">
                          <p
                            className="cancel-order"
                            onClick={() => {
                              if (allCancellable) setShowcnModal(true);
                            }}
                            style={{
                              cursor: allCancellable ? "pointer" : "not-allowed",
                              opacity: allCancellable ? 1 : 0.5,
                            }}
                          >
                            <u>Cancel Order</u>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    {order?.order_items?.map((item, i) => (
                      <div className="order-item" key={i}>
                        <input
                          type="checkbox"
                          checked={selectedItem.some(
                            (it) => it.itemId === item.id
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // If different order is selected, reset previous selection
                              if (
                                selectedOrder &&
                                selectedOrder !== order.order_no
                              ) {
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
                              if (selectedItem.length === 1)
                                setSelectedOrder(null); // reset if last removed
                            }
                          }}
                        />
                        <img src={item.product_media} alt={item.product_name} />
                        <div className="item-info">
                          <p>{item.product_name}</p>
                          <div className="link-btn">
                            <p className="cancel-order">
                              <Link
                                to={`/productsdetails/${item.action_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Buy Again
                              </Link>
                            </p>
                          </div>
                        </div>

                        <div className="arrow">
                          <Link to={`/OrderTrackingPage/${order.order_no}`}>
                            <ChevronRight size={24} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalitems={results.length}
              />
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
                  <p className="top-pick-title pointer-crusser">{item.name}</p>
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
