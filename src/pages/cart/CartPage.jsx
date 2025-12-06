import React, { useEffect, useState, useRef } from "react";
import "./CartPage.css";
import { Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartDetails, removeCartItem, updateCartItem } from "./cartSlice";
import { addToWishlist } from "../../components/Wishtlist/WishlistSlice";
import Footer from "../../components/Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import blankcart from "../../assets/images/blank-cart.png";
import { fetchTopPicks } from "../Products/otherproductSlice";
import { ToastContainer, toast } from "react-toastify";
import rightarrawwhite from "../../assets/icons/rightarrawwhite.png";
import { checkPincode } from "../Productdetails/pincodeSlice";
import Breadcrumbs from "../../components/Breadcum/Breadcrumbs";
import { useCartWishlist } from "../../app/CartWishlistContext";

const CartPage = () => {
  const dispatch = useDispatch();
  const { countData } = useCartWishlist();
  const { getCartWishlistCount } = useCartWishlist();
  const [token] = useState(localStorage.getItem("token"));
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();
  const { items: toppickItems } = useSelector((state) => state.toppick);
  const { pinset, pinloading, pinerror } = useSelector(
    (state) => state.pincode
  );

  const lastErrorRef = useRef(null);

  useEffect(() => {
    document.title = "Obsession - Cart";
    if (!token) {
      navigate("/login");
    }
    dispatch(fetchTopPicks());
    let storagePin = localStorage.getItem("pincode");
    if (storagePin) {
      dispatch(checkPincode(storagePin));
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCartDetails());
    }
  }, [dispatch, token, ]);

  useEffect(() => {
    dispatch(fetchCartDetails());
  }, [countData,dispatch]);

  // 🔹 Show toast on error only once
  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      const msg =
        typeof error === "string"
          ? error
          : error.error || error.error || "Something went wrong";

      // toast.error(msg, {
      //   style: {
      //     background: "#1f1f1f",
      //     color: "#fff",
      //     borderRadius: "0px",
      //     padding: "12px 16px",
      //     fontSize: "14px",
      //   },
      //   hideProgressBar: true,
      //   closeButton: true,
      //   icon: true,
      // });

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
        getCartWishlistCount(); // refresh count after add
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
    getCartWishlistCount();
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
  const breadcrumbPaths = [
    { label: "Cart", to: "" }, // last one (no link)
  ];
  return (
    <>
      <ToastContainer
        style={{ zIndex: 9999999999999 }}
        position="top-right"
        autoClose={3000}
      />

      <Breadcrumbs paths={breadcrumbPaths} />

      <div className="root-title-chk">
        <span className="title_chk">My Cart <span className="wishlist-header-count-cart"> ({items?.length}) </span> </span>
      </div>

      <div className="cart_mlb">
        <span className="txt_mlb_my"> My Cart <span className="wishlist-header-count-cart"> ({items?.length}) </span></span>
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
                EXPLORE &nbsp;{" "}
                <img src={rightarrawwhite} height={25} width={25} />
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="item-image">
                  <Link
                    to={`/productsdetails/${item.product?.action_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="img-cart-page pointer-crusser"
                      src={item.product?.media}
                      alt={item.product?.name || "product"}
                    />
                  </Link>
                </div>

                <div className="item-details">
                  <h4 className="item-title pointer-crusser">
                    <Link
                      to={`/productsdetails/${item.product?.action_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="product-name-span">{item.product?.name}</span>
                    </Link>
                  </h4>
                  <span className="price_details_cart">
                    ₹{item.product?.selling_price}
                    {item.product?.mrp &&
                      item.product?.mrp !== item.product?.selling_price && (
                        <>
                          <span className="sub-1">
                            <del>₹{item.product?.mrp}</del> &nbsp;
                            <span className="dis-sub">
                              (-{item.product?.discount}%)
                            </span>
                          </span>
                        </>
                      )}
                  </span>
                  <p className="item-size">Size : {item.product?.size}</p>
                  <p>
                    Color : <span>{item.product?.color}</span>{" "}
                  </p>
                  <p>
                    {" "}
                    Return & Exchange day :{" "}
                    <span>
                      {item.product?.return_non_return_days_label}
                    </span>{" "}
                  </p>
                  <p>
                    {" "}
                    TAT Delivery : <span>{pinset?.delivery_tat}</span>{" "}
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
                <span>Sub Total</span>
                <span>₹{total}</span>
              </div>

              <p className="terms-text">
                Before proceed further you can review{" "}
                <a href="/tc-of-sale" style={{ fontWeight: "500" }}>
                  <u style={{color:"#1B170E"}}>Terms & Conditions of Sale</u>
                </a>{" "}
                and{" "}
                <a href="/privacy-policy" style={{ fontWeight: "500" }}>
                  <u style={{color:"#1B170E"}}>Privacy Policy</u>
                </a>
              </p>
              <button onClick={handleCheckout} className="checkout">
                CHECKOUT
              </button>
              <button
                className="continue_shoping"
                onClick={() => navigate("/")}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        )}
      </div>

      {items.length === 0 && (
        // <section className="top-picks-section">
        //   <h2 className="top-picks-heading">Don’t miss these top picks.</h2>
        //   <div className="top-picks-grid">
        //     {toppickItems?.map((item) => (
        //       <div key={item.id} className="top-pick-card">
        //         <Link to={`/products${item.action_url}`}>
        //           <img
        //             src={item.media}
        //             alt={item.name}
        //             className="top-pick-image"
        //           />
        //           <p className="top-pick-title">{item.name}</p>
        //         </Link>
        //       </div>
        //     ))}
        //   </div>
        // </section>
        <section className="top-picks-section">
          <h2 className="top-picks-heading">Don’t miss these top picks.</h2>
          <div className="desk-top-picks">
            <div className="top-picks-grid">
              {toppickItems.map((item) => (
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
          </div>


          <div className="mlb-top-picks">
            <section className="flat_overview">
              <div className="promo-section">
                {toppickItems.map((item) => (
                  <div
                    className="promo-card"
                    key={item.id}
                  >

                    <Link to={`/products${item.action_url}`}>
                      <img
                        src={item.media}
                        alt={item.name}
                        className="promo-image pointer-crusser"
                      />
                      <p className="promo-title pointer-crusser">{item.name}</p>

                    </Link>
                  </div >
                ))}
              </div >
            </section >
          </div>


        </section>
      )}
      <Footer />
    </>
  );
};

export default CartPage;
