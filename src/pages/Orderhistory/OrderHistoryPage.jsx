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

  const handleStatusChange = (statusKey) => {
    setSelectedStatus((prev) => (prev === statusKey ? "" : statusKey));
  };

  const handleClearAll = () => {
    setSelectedStatus(""); // clear filter
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="order-history">
      <aside className="sidebar">
        <h2>Order History</h2>
        <div className="filters">
          <h4>Filters</h4>
          <p>ORDER STATUS</p>

          {STATUS_OPTIONS.map((status) => (
            <label key={status.key}>
              <input
                type="checkbox" // ✅ now checkboxes, not radios
                checked={selectedStatus === status.key}
                onChange={() => handleStatusChange(status.key)}
              />
              {status.label}
            </label>
          ))}

          <a href="#" className="clear-all" onClick={handleClearAll}>
            Clear all
          </a>
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
                  <strong>{order.status}</strong>
                  <br />
                  <span>{order.order_placed_at}</span>
                </div>
                <div>
                  <span>Order ID: {order.order_no}</span>
                  <div className="order-actions">
                    <p
                      onClick={() =>
                        navigate("/OrderTrackingPage", {
                          state: { order_no: order.order_no },
                        })
                      }
                    >
                      Track Order
                    </p>
                    <p>View Invoice</p>
                  </div>
                </div>
              </div>

              {order?.order_items?.map((item, i) => (
                <div className="order-item" key={i}>
                  <img src={item.product_media} alt={item.product_name} />
                  <div className="item-info">
                    <p>{item.product_name}</p>
                    <a href="#">Cancel Order</a>
                    <div className="actions">
                      <a href="#">Buy Again</a>
                      <a href="#">Return / Exchange</a>
                    </div>
                  </div>
                  <div className="arrow">
                    <ChevronRight size={24} />
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default OrderHistoryPage;
