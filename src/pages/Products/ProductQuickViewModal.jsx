import React, { useState, useEffect, useRef } from "react";
import "./ProductQuickViewModal.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetail,
  clearProductDetail,
} from "../Productdetails/productDetailSlice";
import Skeleton from "react-loading-skeleton";
import { Heart } from "lucide-react";
import { addToCart } from "../cart/cartSlice";
import { ToastContainer, toast } from "react-toastify";
import LoginPromptModal from "../../components/LoginModal/LoginPromptModal";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../components/Wishtlist/WishlistSlice";
import { Player } from "@lottiefiles/react-lottie-player";
import heartAnimation from "../../assets/icons/Heart.json";
import {
  checkPincode,
  resetPincodeState,
} from "../Productdetails/pincodeSlice";

const ProductQuickViewModal = ({ show, product, onHide }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("highlights");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [animatedWish, setAnimatedWish] = useState(null);
  const [pincode, setPincode] = useState("");
  const [pincodeChecked, setPincodeChecked] = useState(false);

  const modalRef = useRef();
  const sectionsRef = useRef({});
  const dispatch = useDispatch();
  const actionurl = product?.action_url ? product?.action_url : product?.slug;
  const { data, loading, error } = useSelector((state) => state.productDetail);
  const pincodeset = useSelector((state) => state.pincode);
  const wishlist = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (actionurl) {
      setLocalLoading(true);
      setSelectedImage(null);
      setSelectedSize(null);
      dispatch(clearProductDetail());
      dispatch(fetchProductDetail(actionurl));
    }
  }, [dispatch, actionurl]);
  // Set image when data loads
  useEffect(() => {
    // if (data?.product_images?.length > 0) {
    //   setSelectedImage(data.product_images[0].media);
    //   setLocalLoading(false);
    // }
    if (data?.product_sizes.length > 0) {
      setSelectedSize(data?.product_sizes[0]);
      setSelectedColor(data.product_sizes[0].product_colors[0]);
      setSelectedImage(data?.product_sizes[0].product_colors[0].product_media[0]?.media);
      setLocalLoading(false);
    }
  }, [data]);

  // Scroll tracking (for highlights/description tabs)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );
    Object.values(sectionsRef.current).forEach((section) =>
      observer.observe(section)
    );
    return () => observer.disconnect();
  }, []);

  // Price dynamics solution
  const currentPrice = selectedSize ? selectedSize.price : data?.selling_price;
  const productId = data?.id;

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  // Close when clicking outside modal
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onHide();
    }
  };

  // Don't render if not shown
  if (!show || !product) return null;
  const handleCheck = () => {
    if (pincode.trim()) {
      dispatch(checkPincode(pincode)).then(() => {
        setPincodeChecked(true);
      });
    }
  };

  const handleReset = () => {
    dispatch(resetPincodeState());
    setPincode("");
    setPincodeChecked(false);
  };

  // ADD TO CART FUNCTION (restricted until pincode check success)
  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    if (!pincodeChecked || !pincodeset.pinset?.is_active) {
      toast.error("Please check delivery availability before adding to cart", {
        style: {
          background: "#1f1f1f",
          color: "#fff",
          borderRadius: "0px",
          padding: "12px 16px",
          fontSize: "14px",
          zIndex: 999999,
        },
        hideProgressBar: true,
        closeButton: false,
        icon: true,
      });
      return;
    }

    dispatch(addToCart({ product_id: productId, quantity }))
      .unwrap()
      .then(() => {
        toast.success("Product added to cart successfully!", {
          style: {
            background: "#1f1f1f",
            color: "#fff",
            borderRadius: "0px",
            padding: "12px 16px",
            fontSize: "14px",
          },
          hideProgressBar: true,
          closeButton: false,
          icon: true,
        });
      })
      .catch((error) => {
        toast.error("Failed to add to cart");
        console.error(error);
      });
  };

  const toggleWishlist = async (e, product) => {
    e.stopPropagation();

    // 🔑 check login first
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    const isInWishlist = wishlist.productIds.includes(product.id);

    try {
      if (isInWishlist) {
        const wishlistItem = wishlist.items.find(
          (item) => item.product_id === product.id
        );
        if (wishlistItem?.id) {
          await dispatch(removeFromWishlist(wishlistItem.id)).unwrap();
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
          });
          dispatch(fetchWishlist());
        }
      } else {
        await dispatch(addToWishlist({ product_id: product.id })).unwrap();
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
        });
        setAnimatedWish(product.id);
        dispatch(fetchWishlist());
        setTimeout(() => setAnimatedWish(null), 1500);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const selectionColor = (color) => {
    setSelectedColor(color);
    setLocalLoading(true);
    setSelectedImage(null);
    setSelectedSize(null);
    dispatch(clearProductDetail());
    dispatch(fetchProductDetail(color.action_url));
  }
  return (
    <>
      <ToastContainer
        position="top-right"
        style={{ zIndex: 99999 }}
        autoClose={3000}
      />
      <div className="quickview-modal-overlay" onClick={handleOutsideClick}>
        <div className="quickview-modal" ref={modalRef}>
          <div className="quickview-header">
            <div></div>
            <div className="close-icon" onClick={onHide}>
              ×
            </div>
          </div>

          <div className="product-page">
            {/* Main Product Image */}
            <div className="product-gallery">
              <div className="sector_quick">
                <div
                  className="image_track_quick"
                  style={{ width: "100%", minHeight: "536px" }}
                >
                  {loading || !selectedImage ? (
                    <div style={{ width: "100%", height: "100%" }}>
                      <Skeleton
                        height={630}
                        width="100%"
                        baseColor="#e0e0e0"
                        highlightColor="#f5f5f5"
                      />
                    </div>
                  ) : (
                    <img
                      src={selectedImage}
                      alt="Main Product"
                      className="main-image"
                      style={{
                        height: "auto",
                        mixBlendMode: "darken",
                        objectFit: "cover",
                        // transition: "opacity 0.3s ease-in-out",
                      }}
                    />
                  )}
                </div>

                {/* Thumbnails */}
                <div className="thumbnail-row">
                  {localLoading
                    ? Array(4)
                        .fill(0)
                        .map((_, index) => (
                          <Skeleton
                            key={index}
                            height={70}
                            width={70}
                            style={{ marginRight: 10 }}
                          />
                        ))
                    : selectedColor?.product_media?.map((img, index) => (
                        <img
                          key={index}
                          src={img.media}
                          alt={`Thumbnail ${index + 1}`}
                          className={`thumbnail ${
                            selectedImage === img.media ? "selected-thumb" : ""
                          }`}
                          onClick={() => setSelectedImage(img.media)}
                        />
                      ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              <h1 className="title_details">
                {loading ? <Skeleton width={200} /> : data?.name}
              </h1>

              <p className="price_details">
                {loading ? (
                  <Skeleton width={120} />
                ) : (
                  <>
                    ₹{currentPrice}{" "}
                    {data?.mrp && (
                      <span className="sub-1">
                        <del>₹{data?.mrp}</del> &nbsp;
                        <span className="dis-sub">
                          (
                          {Math.round(
                            ((data?.mrp - currentPrice) / data?.mrp) * 100
                          )}
                          % OFF)
                        </span>{" "}
                        (Inclusive of all taxes)
                      </span>
                    )}
                  </>
                )}
              </p>

              <p className="id_tracker">
                {loading ? <Skeleton width={100} /> : `SKU: ${data?.sku}`}
              </p>
              <div className="size-selector">
                {loading ? (
                  <>
                    <p>
                      <Skeleton width={150} />
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                      {Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} width={60} height={60} />
                        ))}
                    </div>
                  </>
                ) : (
                  data?.product_sizes?.length > 0 && (
                    <>
                      <p className="selected-size-label">
                        CHOOSE A SIZE:
                        {selectedSize && <strong>{selectedSize.size}</strong>}
                      </p>

                      <div className="size-options">
                        {data.product_sizes.map((size) => (
                          <div
                            key={size.id}
                            className={`size-btn ${
                              selectedSize?.id === size.id ? "active-size" : ""
                            }`}
                            onClick={() => {setSelectedSize(size); selectionColor(size)}}
                          >
                            <div className="set_btn_trcak">
                              <img
                                src="https://i.ibb.co/x86bSjV6/Frame-7.png"
                                className="size-image"
                                alt={size.size}
                              />
                            </div>
                            <div className="lbl-track">{size.size}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                )}
              </div>

              <div className="color-selector">
                {loading ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    {Array(5)
                      .fill(0)
                      .map((_, idx) => (
                        <Skeleton key={idx} square height={30} width={30} />
                      ))}
                  </div>
                ) : (
                  <>
                    <div>
                      <p>CHOOSE A COLOR:</p>
                    </div>
                    <div className="color-options">
                      {selectedSize?.product_colors?.map((color, idx) => (
                        <div className={`selected-color ${
                            selectedColor?.id === color.id ? "active-size" : ""
                          }`}
                          key={idx}
                          onClick={() => selectionColor(color)}
                        >
                          <div className="color-circle">
                            <img
                              src={color.color_media}
                              alt={color.color}
                              height={60}
                              width={60}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="quantity-selector">
                <p>QUANTITY</p>
                <div className="qty-control">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)}>+</button>
                </div>
              </div>

              {/* Pincode Check */}
              <div className="pincode-check">
                <p className="check-heading">CHECK AVAILABILITY</p>
                <div className="input-wrapper-quick">
                  <input
                    className="checkup_track_txt"
                    type="text"
                    placeholder="Enter Delivery Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                  <button onClick={handleCheck} className="check-btn">
                    Check
                  </button>
                  {pincodeChecked && (
                    <button onClick={handleReset} className="check-btn">
                      Reset
                    </button>
                  )}
                </div>

                {/* Show pincode info */}
                {pincodeset.loading && <p>Checking...</p>}
                {pincodeset.error && (
                  <p style={{ color: "red", marginTop: "15px" }}>
                    Not serviceable for your area
                  </p>
                )}
                {pincodeset.pinset?.pincode && pincodeset.pinset?.is_active && (
                  <p style={{ color: "green", marginTop: "15px" }}>
                    ✅ Delivery available at {pincodeset.pinset.city},{" "}
                    {pincodeset.pinset.state} ({pincodeset.pinset.delivery_tat})
                  </p>
                )}
              </div>

              {/* Cart & Wishlist */}
              <div className="add-cart-section">
                <button
                  className="add-to-cart-btn_qucick"
                  onClick={handleAddToCart}
                >
                  ADD TO CART
                </button>
                <div
                  className="wst_box_quick"
                  onClick={(e) => toggleWishlist(e, data)}
                >
                  {animatedWish === data?.id ? (
                    <Player
                      autoplay
                      keepLastFrame
                      src={heartAnimation}
                      style={{ width: 102, height: 102 }}
                    />
                  ) : (
                    <Heart
                      size={27}
                      color={
                        wishlist.productIds.includes(data?.id)
                          ? "#FF0000"
                          : "#000"
                      }
                      fill={
                        wishlist.productIds.includes(data?.id)
                          ? "#FF0000"
                          : "none"
                      }
                    />
                  )}
                </div>
              </div>

              {/* Return Info */}
              <div className="root_return_details">
                <div className="details_flx">
                  <div>
                    <img
                      src="https://i.ibb.co/twnnXYxQ/truck.png"
                      className="img-truck"
                      alt="Free Shipping"
                    />
                    <span className="txt-sub-info-pdp">Free Shipping</span>
                  </div>
                  <div>
                    <img
                      src="https://i.ibb.co/SDsg21mX/Frame-2763.png"
                      className="img-ruppee"
                      alt="Prepaid only"
                    />
                    <span className="txt-sub-info-pdp">
                      Prepaid orders only
                    </span>
                  </div>
                </div>
                <div className="txt-exchange">
                  <img
                    src="https://i.ibb.co/PsNnXB2G/package.png"
                    className="img-exchange"
                    alt="Returns"
                  />
                  <span className="txt-sub-info-pdp">
                    5 days return and exchange available
                  </span>
                </div>
                <p className="txt-Carpet-Finder">
                  Not sure which carpet fits your space? Try our{" "}
                  <span className="txt_crp">Carpet Finder</span>
                </p>
              </div>

              {/* Description */}
              <div className="product-description">
                <h3 className="txt-des">PRODUCT DESCRIPTION</h3>
                <p>
                  {loading ? (
                    <Skeleton count={3} />
                  ) : (
                    data?.product_info?.description
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}
    </>
  );
};

export default ProductQuickViewModal;
