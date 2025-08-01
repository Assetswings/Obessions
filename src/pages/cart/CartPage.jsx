import React, { useEffect, useState } from "react";
import "./CartPage.css";
import { Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartDetails,
  removeCartItem,
  updateCartItem,
} from "./cartSlice";
import Footer from "../../components/Footer/Footer";

const CartPage = () => {
  const dispatch = useDispatch();
  const [token] = useState(localStorage.getItem("token"));
  const { cartItems, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (token) {
      dispatch(fetchCartDetails());
    }
  }, [dispatch, token]);

  const handleRemoveItem = async (cartId) => {
    await dispatch(removeCartItem(cartId));
    dispatch(fetchCartDetails()); // Refresh cart after removal
  };

  const handleUpdateQty = async (product_id, qtn) => {
    await dispatch(updateCartItem({ product_id, qtn }));
    dispatch(fetchCartDetails()); // Refresh cart after update
  };

  const items = cartItems?.items ?? [];
  const total = cartItems?.total ?? 0;

  if (!token) {
    return (
      <p style={{ padding: "2rem", textAlign: "center" }}>
        ⚠️ Please login to view your cart.
      </p>
    );
  }

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="root-title-chk">
        <h2 className="title_chk">My Cart</h2>
      </div>

      <div className="cart-container">
        <div className="cart-left">
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="item-image">
                  <img
                    className="img-cart-page"
                    src={item.product?.media}
                    alt={item.product?.name || "product"}
                  />
                </div>

                <div className="item-details">
                  <h4 className="item-title">{item.product?.name}</h4>
                  <p className="price_details">
                    ₹{item.product?.selling_price}
                    <span className="sub-1">
                      <del>₹{item.product?.mrp}</del> &nbsp;
                      <span className="dis-sub">
                        (-{item.product?.discount}%)
                      </span>
                    </span>
                  </p>

                  <div className="root_qtn_cart">
                    <div className="subroot_sector_qtn">
                      <div>
                        <p>Quantity:</p>
                      </div>
                      <div className="quantity">
                        <button
                          className="tracker-btn"
                          onClick={() =>
                            handleUpdateQty(item.product_id, Math.max(1, item.cart_qty - 1))
                          }
                        >
                          <Minus size={20} strokeWidth={1.25} />
                        </button>
                        <span className="qtn_track">{item.cart_qty}</span>

                        <button
                          className="tracker-btn"
                          onClick={() =>
                            handleUpdateQty(item.product_id, item.cart_qty + 1)
                          }
                        >
                          <Plus size={20} strokeWidth={1.25} />
                        </button>
                      </div>
                    </div>

                    <div className="actions">
                      <span
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </span>
                      <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                        Move to Wishlist
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-right">
          <div className="summary">
            <div className="summary-row total">
              <span>ORDER TOTAL</span>
              <span>₹{total}</span>
            </div>

            <p className="terms-text">
              Before proceed further you can review{" "}
              <a href="#" className="tc_1">
                Terms & Conditions of Sale
              </a>{" "}
              and{" "}
              <a href="#" className="tc_2">
                Privacy Policy
              </a>
            </p>

            <button className="checkout">CHECKOUT</button>
            <button className="continue_shoping">CONTINUE SHOPPING</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;
