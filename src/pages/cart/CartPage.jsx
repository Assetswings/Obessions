import React, { useEffect, useState } from "react";
import "./CartPage.css";
import { Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartDetails, removeCartItem, updateCartItem } from "./cartSlice";
import { addToWishlist } from "../../components/Wishtlist/WishlistSlice";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import blankcart from "../../assets/images/blank-cart.png";
import { fetchAddOns } from "../Products/otherproductSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const [token] = useState(localStorage.getItem("token"));
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const { addOns } = useSelector((state) => state.toppick);
  console.log("====================================");
  console.log("Top_picks cart page---->", addOns);
  console.log("====================================");

  useEffect(() => {
    dispatch(fetchAddOns());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCartDetails());
    }
  }, [dispatch, token]);

  const handleRemoveItem = async (cartId) => {
    await dispatch(removeCartItem(cartId));
  };

  const handleUpdateQty = async (product_id, newQty) => {
    if (newQty < 1) return;
    setUpdatingId(product_id);
    await dispatch(updateCartItem({ product_id, quantity: newQty }));
    setUpdatingId(null);
  };

  const handleMoveToWishlist = async (item) => {
    await dispatch(addToWishlist({ product_id: item.product.id }));
    await dispatch(removeCartItem(item.id));
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

  const handleCheckout = () => {
    navigate("/checkout");
  };

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
            <div className="empty-cart">
              <img
                src={blankcart} // ✅ replace with your rug+box image path
                alt="Empty cart"
                className="empty-cart-image"
              />
              <h3 className="empty-cart-title">
                Your cart is feeling a little empty
              </h3>
              <p className="empty-cart-subtitle">
                Discover our curated collection of premium rugs that transform
                any space into a sanctuary of elegance and comfort.
              </p>
              <button
                className="empty-cart-btn"
                onClick={() => navigate("/")} // ✅ send user back to home/shop
              >
                EXPLORE →
              </button>
            </div>
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
                            handleUpdateQty(item.product_id, item.cart_qty - 1)
                          }
                          disabled={updatingId === item.product_id}
                        >
                          <Minus size={20} strokeWidth={1.25} />
                        </button>

                        <span className="qtn_track">
                          {updatingId === item.product_id ? "" : item.cart_qty}
                        </span>

                        <button
                          className="tracker-btn"
                          onClick={() =>
                            handleUpdateQty(item.product_id, item.cart_qty + 1)
                          }
                          disabled={updatingId === item.product_id}
                        >
                          <Plus size={20} strokeWidth={1.25} />
                        </button>
                      </div>
                    </div>

                    <div className="actions">
                      <span
                        style={{ color: "black", cursor: "pointer" }}
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </span>
                      <span
                        style={{
                          marginLeft: "10px",
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() => handleMoveToWishlist(item)}
                      >
                        Move to Wishlist
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="cart-right sticky-summary">
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

              <button onClick={handleCheckout} className="checkout">
                CHECKOUT
              </button>
              <button className="continue_shoping">CONTINUE SHOPPING</button>
            </div>
          </div>
        )}
      </div>
      {items.length === 0 && (
        <section className="top-picks-section">
          <h2 className="top-picks-heading">Don’t miss these top picks.</h2>
          <div className="top-picks-grid">
            {addOns?.map((item) => (
              <div key={item.id} className="top-pick-card">
                <img
                  src={item.media}
                  alt={item.name}
                  className="top-pick-image"
                />
                <p className="top-pick-title">{item.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <Footer />
    </>
  );
};

export default CartPage;
