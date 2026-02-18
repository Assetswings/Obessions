import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./BestsellersSlider.css";
import { Expand, Heart } from "lucide-react";
import arrowleft from "../../assets/icons/left_arrow_black.svg";
import arrowright from "../../assets/icons/right_arrow_black.svg";
import arrowhvrleft from "../../assets/icons/left_arrow_red.svg";
import arrowhvrright from "../../assets/icons/right_arrow_red.svg";
import { addToWishlist, removeFromWishlist } from "../Wishtlist/WishlistSlice";
import { Slide, ToastContainer, toast } from "react-toastify";
import { Player } from "@lottiefiles/react-lottie-player";
import heartAnimation from "../../assets/icons/Heart.json";
import LoginPromptModal from "../LoginModal/LoginPromptModal";
import { Link } from "react-router-dom";
import { useCartWishlist } from "../../app/CartWishlistContext";

  const BestsellersSlider = ({ onQuickView }) => {
  const { getCartWishlistCount } = useCartWishlist();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.home);
  const sliderRef = useRef(null);
  const [bestsellers, setBestsellers] = useState([]);
  const [animatedWish, setAnimatedWish] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const visibleCount = 4; // desktop visible cards besides fixed
  const cardWidth = 220;
  const gap = 20;

      // Initialize products & login state
      useEffect(() => {
      const allProducts = data?.bestSellers?.products || [];
      if (allProducts.length > 1) {
      const firstBestseller = allProducts[1];
      const rest = allProducts.filter((_, i) => i !== 1);
      setBestsellers([firstBestseller, ...rest]);
    } else {
      setBestsellers(allProducts);
    }

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [data]);

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Wishlist toggle
  const toggleWishlist = async (e, product) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      if (product.is_wishlisted) {
        const wishlistItem = product.wishlist[0]?.wishlist_id;
        if (wishlistItem) {
          await dispatch(removeFromWishlist(wishlistItem)).unwrap();
          toast.success("Removed from wishlist", {
            autoClose: 3000,
            style: {
              borderRadius:"inherit",
              padding: "16px",
              color: "#713200",
            },
            iconTheme: {
              primary: "#713200",
              secondary: "#FFFAEE",
            },
          });
          getCartWishlistCount();
          setBestsellers((prev) =>
            prev.map((p) =>
              p.id === product.id ? { ...p, is_wishlisted: false, wishlist: [] } : p
            )
          );
        }
      } else {
        const addedWishlistItem = await dispatch(addToWishlist({ product_id: product.id })).unwrap();
        toast.success("Added to wishlist", {
          autoClose: 3000,
          style: {
            borderRadius:"inherit",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        });
        getCartWishlistCount();
        setAnimatedWish(product.id);
        const wishlist = Array.isArray(addedWishlistItem)
          ? addedWishlistItem.find((w) => w.product_id === product.id)
          : addedWishlistItem;
        setBestsellers((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? { ...p, is_wishlisted: true, wishlist: wishlist ? [{ wishlist_id: wishlist.id }] : [] }
              : p
          )
        );
        setTimeout(() => setAnimatedWish(null), 1500);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const slidingProducts = bestsellers.slice(1);
  const totalProducts = [...slidingProducts, ...slidingProducts]; // clone for infinite loop

  // Desktop arrow handlers
  const handlePrev = () => {
    setTransitionEnabled(true);
    setSlideIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setTransitionEnabled(true);
    setSlideIndex((prev) => prev + 1);
  };

  // Infinite loop handling
  useEffect(() => {
    const length = slidingProducts.length;
    if (slideIndex < 0) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setSlideIndex(length - 1);
      }, 600); // match CSS transition
    } else if (slideIndex >= length) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setSlideIndex(0);
      }, 600);
    }
  }, [slideIndex, slidingProducts.length]);

  return (

    <>
      <div className="bestseller-mobile-title">
        <div className="sub-root-mlb">
          <h3> <span style={{ fontWeight: '500' }}>Get the</span> <span style={{fontFamily:"Playfair Display", fontWeight:"500"}}>Bestsellers</span></h3>
        </div>

      </div>

      <div className="bestseller-container">
        <ToastContainer style={{ zIndex: 99999999999 }} position="top-right" autoClose={3000}   limit={1} hideProgressBar={true} transition={Slide} newestOnTop={true} />
        {isMobile ? (
          <>
            {/* ⭐ MOBILE TITLE FIXED ABOVE */}

            <div className="slider-strip">
              {bestsellers?.map((item) => (
                <div className="bestseller-card" key={item.id}>
                  <div className="image-wrapper">
                    <div className="wrp_main">
                      <Link to={`/productsdetails/${item.action_url}`}>
                        <img className="img_main_asp" src={item?.media_list?.main?.file} alt={item.fullname} />
                        <img className="img_main_asp_hvr" src={item?.media_list?.hover?.file} alt={item.fullname} />
                      </Link>
                    </div>

                    <button
                      className="wishlist-btn_products"
                      onClick={(e) => toggleWishlist(e, item)}
                    >
                      {animatedWish === item.id ? (
                        <div style={{
                          width: 20,
                          height: 24,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
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
                    <span className="title">
                      <Link to={`/productsdetails/${item.action_url}`}>{item?.name}
                        {/* {item.fullname.length > 38 ? item.fullname.substring(0, 38) + "..." : item.fullname} */}
                      </Link>
                    </span>
                    <span className="price">₹{item.selling_price}</span>
                    {item.mrp && item.mrp !== item.selling_price && (
                      <>
                        &nbsp;
                        <span className="original"><del>₹{item.mrp}</del></span>
                        <span className="discount">({item?.discount_percent}% OFF)</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // ✅ Desktop: infinite loop slider
          <div className="bestseller-slider">
            <div className="bestseller-fixed-card">
              <h3>Get the <em>Bestsellers</em></h3>
              <div className="arrow-controls">
                <button className="btn_arrow left" onClick={handlePrev}>
                  <img src={arrowleft} alt="prev" className="arrow-img" />
                </button>
                <button className="btn_arrow right" onClick={handleNext}>
                  <img src={arrowright} alt="next" className="arrow-img" />
                </button>
              </div>
            </div>

            <div className="slider-track-wrapper">
              <div
                className="slider-track"
                ref={sliderRef}
                style={{
                  transform: `translateX(-${slideIndex * (cardWidth + gap)}px)`,
                  transition: transitionEnabled ? "transform 0.6s ease" : "none",
                  width: `${totalProducts.length * (cardWidth + gap)}px`,
                }}
              >
                {totalProducts.map((item, idx) => (
                  <div className="bestseller-card" key={idx}>
                    <div className="image-wrapper">
                      <Link to={`/productsdetails/${item.action_url}`}>
                        <img className="img_main_asp" src={item?.media_list?.main?.file} alt={item.fullname} />
                        <img className="img_main_asp_hvr" src={item?.media_list?.hover?.file} alt={item.fullname} />
                      </Link>
                      <div className="order_view_btn">
                        <button className="quick-view" onClick={() => onQuickView && onQuickView(item)}>
                          Quick View <Expand color="#000" size={15} strokeWidth={1.25} />
                        </button>
                      </div>
                      <button
                        className="wishlist-btn_products"
                        onClick={(e) => toggleWishlist(e, item)}
                      >
                        {animatedWish === item.id ? (
                          <div style={{
                            width: 20,
                            height: 24,
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
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
                      <Link to={`/productsdetails/${item.action_url}`}>
                        <span className="title">{item.fullname}</span>
                      </Link>
                      <span className="price">₹{item.selling_price}</span>
                      {item.mrp && item.mrp !== item.selling_price && (
                        <>
                          &nbsp;
                          <span className="original"><del>₹{item.mrp}</del></span>
                          <span className="discount"> {""}({item?.discount_percent}% OFF)</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showLoginPrompt && <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />}
      </div>
    </>

  );
};

export default BestsellersSlider;
