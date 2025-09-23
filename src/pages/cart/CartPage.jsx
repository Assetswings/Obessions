import React, { useEffect, useState, useRef } from "react";
import "./CartPage.css";
import { Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartDetails, removeCartItem, updateCartItem } from "./cartSlice";
import { addToWishlist } from "../../components/Wishtlist/WishlistSlice";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import blankcart from "../../assets/images/blank-cart.png";
import { fetchAddOns } from "../Products/otherproductSlice";
import { ToastContainer, toast } from "react-toastify";

const CartPage = () => {
  const dispatch = useDispatch();
  const [token] = useState(localStorage.getItem("token"));
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();
  const { addOns } = useSelector((state) => state.toppick);

  const lastErrorRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAddOns());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCartDetails());
    }
  }, [dispatch, token]);

  // 🔹 Show toast on error only once
  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      const msg =
        typeof error === "string"
          ? error
          : error.error || error.error || "Something went wrong";

      toast.error(msg, {
        style: {
          background: "#1f1f1f",
          color: "#fff",
          borderRadius: "0px",
          padding: "12px 16px",
          fontSize: "14px",
        },
        hideProgressBar: true,
        closeButton: true,
        icon: true,
      });

      lastErrorRef.current = error;
    }
  }, [error]);

  // const handleRemoveItem = async (cartId) => {
  //   await dispatch(removeCartItem(cartId));
  // };

  const handleRemoveItem = async (cartId) => {
    try {
      const response = await dispatch(removeCartItem(cartId)).unwrap();
      if (response?.success) {
        // dispatch(fetchCartDetails());
        toast.success(response.message || "Item removed from cart!");
      }
    } catch (err) {
      toast.error("Failed to remove item");
    }
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

  const handleCheckout = () => {
    navigate("/checkout");
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

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="root-title-chk">
        <span className="title_chk">My Cart ({items?.length})</span>
      </div>

      <div className="cart_mlb">
        <span className="txt_mlb_my"> My Cart ({items?.length})</span>
      </div>
      <div className="cart-container">
        <div className="cart-left">
          {items.length === 0 ? (
            <div className="empty-cart">
              <img
                src={blankcart}
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
                  <span className="price_details_cart">
                    ₹{item.product?.selling_price}
                    <span className="sub-1">
                      <del>₹{item.product?.mrp}</del> &nbsp;
                      <span className="dis-sub">
                        (-{item.product?.discount}%)
                      </span>
                    </span>
                  </span>
                  <p>
                    {" "}
                    size : <span>{item.product?.size}</span>{" "}
                  </p>
                  <p>
                    {" "}
                    color : <span> {item.product?.color}</span>{" "}
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

                  <div className="actions_mlb">
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
              <button className="continue_shoping" onClick={()=>navigate("/")}>CONTINUE SHOPPING</button>
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
