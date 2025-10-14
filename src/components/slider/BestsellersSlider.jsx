import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./BestsellersSlider.css";
import { Expand, Heart } from "lucide-react";
import arrowleft from "../../assets/icons/ArrowLeft.png";
import arrowright from "../../assets/icons/ArrowRight.png";
import { addToWishlist, removeFromWishlist } from "../Wishtlist/WishlistSlice";
import { ToastContainer, toast } from "react-toastify";
import { Player } from "@lottiefiles/react-lottie-player";
import heartAnimation from "../../assets/icons/Heart.json";
import LoginPromptModal from "../LoginModal/LoginPromptModal";
import { Link, useNavigate } from "react-router-dom";

const BestsellersSlider = ({ onQuickView }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.home);
  const [startIndex, setStartIndex] = useState(0);
  const [animatedWish, setAnimatedWish] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [bestsellers, setBestsellers] = useState([]);

  useEffect(() => {
    setBestsellers(data?.bestSellers?.products || []);
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [data]);

  // ✅ Infinite left scroll
  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(bestsellers.length - 5, 0) : prev - 1
    );
  };

  // ✅ Infinite right scroll
  const handleNext = () => {
    setStartIndex((prev) =>
      prev + 1 >= bestsellers.length - 4 ? 0 : prev + 1
    );
  };

  const LogsIcon = (data) => {
    if (onQuickView) onQuickView(data);
  };

  const toggleWishlist = async (e, product) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    const isInWishlist = product.is_wishlisted;
    try {
      if (isInWishlist) {
        const wishlistItem = product.wishlist[0].wishlist_id;
        if (wishlistItem) {
          await dispatch(removeFromWishlist(wishlistItem)).unwrap();
          toast.success("Removed from wishlist", {
            style: {
              border: "1px solid #713200",
              padding: "16px",
              color: "#713200",
            },
            iconTheme: {
              primary: "#713200",
              secondary: "#FFFAEE",
            },
            hideProgressBar: true,
            closeButton: true,
            icon: true,
          });
          setBestsellers((prev) =>
            prev.map((p) =>
              p.id === product.id
                ? { ...p, is_wishlisted: false, wishlist: [] }
                : p
            )
          );
        }
      } else {
        const addedWishlistItem = await dispatch(
          addToWishlist({ product_id: product.id })
        ).unwrap();
        toast.success("Added to wishlist", {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
          hideProgressBar: true,
          closeButton: true,
          icon: true,
        });
        setAnimatedWish(product.id);

        const wishlist = Array.isArray(addedWishlistItem)
          ? addedWishlistItem.find((w) => w.product_id === product.id)
          : addedWishlistItem;

        setBestsellers((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? {
                ...p,
                is_wishlisted: true,
                wishlist: wishlist ? [{ wishlist_id: wishlist.id }] : [],
              }
              : p
          )
        );
        setTimeout(() => setAnimatedWish(null), 1500);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="bestseller-fixed-card-mlb">
        <div>
          <h2 className="txt_mlb_haed">
            Get the <em>Bestsellers</em>
          </h2>
        </div>
        <div className="arrow-controls">
          <button onClick={handlePrev}>
            <img className="btn_left_arrow" src={arrowleft} alt="prev" />
          </button>
          <button onClick={handleNext}>
            <img className="btn_right_arrow" src={arrowright} alt="next" />
          </button>
        </div>
      </div>

      <div className="bestseller-container">
        <ToastContainer style={{ zIndex: 9999999999999 }} position="top-right" autoClose={3000} />
        <div className="bestseller-slider">
          {/* Left Card */}
          <div className="slider-strip">
            {bestsellers?.slice(startIndex, startIndex + 1).map((item) => (
              <div className="bestseller-card" key={item.id}>
                <div
                  className="image-wrapper"
                >
                  <Link to={`/productsdetails/${item.action_url}`}>
                    <img src={item?.media_list?.main?.file} alt={item.name} />
                  </Link>
                  <div className="order_view_btn">
                    <button
                      className="quick-view"
                      onClick={(e) => {
                        e.stopPropagation();
                        LogsIcon(item);
                      }}
                    >
                      Quick View&nbsp;
                      <span>
                        <Expand color="#000000" size={15} strokeWidth={1.25} />
                      </span>
                    </button>
                  </div>
                  <button
                    className="wishlist-btn_products"
                    onClick={(e) => toggleWishlist(e, item)}
                  >
                    {animatedWish === item.id ? (
                      <div
                        style={{
                          width: 20,
                          height: 24,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Player
                          autoplay
                          keepLastFrame
                          src={heartAnimation}
                          style={{
                            width: 139,
                            height: 139,
                            transform: "scale(0.5)",
                            transformOrigin: "center",
                          }}
                        />
                      </div>
                    ) : (
                      <Heart
                        color={item.is_wishlisted ? "#FF0000" : "#000"}
                        fill={item.is_wishlisted ? "#FF0000" : "none"}
                        size={20}
                        strokeWidth={2}
                      />
                    )}
                  </button>
                </div>
                <div className="product-info">
                  <span className="title"><Link to={`/productsdetails/${item.action_url}`}>{item.name}</Link></span>
                  <span className="price">₹{item.selling_price}</span>
                  {item.mrp && item.mrp !== item.selling_price && (
                    <>
                      <span className="original">
                        <del>₹{item.mrp}</del>{" "}
                      </span>
                      <span className="discount">
                        ({item?.discount_percent}% OFF)
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Center Fixed Card */}
          <div className="bestseller-fixed-card">
            <h3>
              Get the <em>Bestsellers</em>
            </h3>
            <div className="arrow-controls">
              <button onClick={handlePrev}>
                <img className="btn_left_arrow" src={arrowleft} alt="prev" />
              </button>
              <button onClick={handleNext}>
                <img className="btn_right_arrow" src={arrowright} alt="next" />
              </button>
            </div>
          </div>

          {/* Right Cards */}
          <div className="slider-strip">
            {bestsellers
              ?.concat(bestsellers) // ✅ duplicate for smooth looping
              .slice(startIndex + 1, startIndex + 6)
              .map((item, index) => (
                <div className="bestseller-card" key={`${item.id}-${index}`}>
                  <div
                    className="image-wrapper"
                  >
                    <Link to={`/productsdetails/${item.action_url}`}>
                      <img src={item?.media_list?.main?.file} alt={item.name} />
                    </Link>
                    <button
                      className="quick-view"
                      onClick={(e) => {
                        e.stopPropagation();
                        LogsIcon(item);
                      }}
                    >
                      Quick View&nbsp;
                      <span>
                        <Expand color="#000000" size={15} strokeWidth={1.25} />
                      </span>
                    </button>
                    <button
                      className="wishlist-btn_products"
                      onClick={(e) => toggleWishlist(e, item)}
                    >
                      {animatedWish === item.id ? (
                        <div
                          style={{
                            width: 20,
                            height: 24,
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Player
                            autoplay
                            keepLastFrame
                            src={heartAnimation}
                            style={{
                              width: 139,
                              height: 139,
                              transform: "scale(0.5)",
                              transformOrigin: "center",
                            }}
                          />
                        </div>
                      ) : (
                        <Heart
                          color={item.is_wishlisted ? "#FF0000" : "#000"}
                          fill={item.is_wishlisted ? "#FF0000" : "none"}
                          size={20}
                          strokeWidth={2}
                        />
                      )}
                    </button>
                  </div>
                  <div className="product-info">
                    <span className="title"><Link to={`/productsdetails/${item.action_url}`}>{item.name}</Link></span>
                    <span className="price">₹{item.selling_price}</span>
                    {item.mrp && item.mrp !== item.selling_price && (
                      <>
                        <span className="original">
                          <del>₹{item.mrp}</del>{" "}
                        </span>
                        <span className="discount">
                          ({item?.discount_percent}% OFF)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {showLoginPrompt && (
          <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
        )}
      </div>
    </>
  );
};

export default BestsellersSlider;
