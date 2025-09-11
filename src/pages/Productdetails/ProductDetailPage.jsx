import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./ProductDetailPage.css";
import { Heart } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import { fetchProductDetail, clearProductDetail } from "./productDetailSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { addToCart } from "../cart/cartSlice";
import LoginPromptModal from "../../components/LoginModal/LoginPromptModal";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../components/Wishtlist/WishlistSlice";
import { Player } from "@lottiefiles/react-lottie-player";
import heartAnimation from "../../assets/icons/Heart.json";
import { checkPincode, resetPincodeState } from "./pincodeSlice";

const ProductDetailPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("highlights");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [animatedWish, setAnimatedWish] = useState(null);
  const [pincode, setPincode] = useState("");
  const [pincodeChecked, setPincodeChecked] = useState(false);

  const dispatch = useDispatch();
  const sectionsRef = useRef({});
  const location = useLocation();
  const navigate = useNavigate();

  const productSlug = location.state?.product;
  const { data, loading, error } = useSelector((state) => state.productDetail);
  const wishlist = useSelector((state) => state.wishlist);
  const pincodeset = useSelector((state) => state.pincode);

  // Scroll instantly to top before anything renders
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [productSlug]);

  // Fetch product on slug change
  useEffect(() => {
    if (productSlug) {
      setLocalLoading(true);
      setSelectedImage(null);
      setSelectedSize(null);
      dispatch(clearProductDetail());
      dispatch(fetchProductDetail(productSlug));
    }
    return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch, productSlug]);

  // Set image when data loads
  useEffect(() => {
    if (data?.product_sizes.length > 0) {
      setSelectedSize(data?.product_sizes[0]);
      setSelectedColor(data?.product_sizes[0].product_colors[0]);
      setSelectedImage(
        data?.product_sizes[0].product_colors[0].product_media[0]?.media
      );
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

  // add To cart
  // const handleAddToCart = () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     setShowLoginPrompt(true);
  //     return;
  //   }

  //   dispatch(addToCart({ product_id: productId, quantity }))
  //     .unwrap()
  //     .then(() => {
  //       toast.success("Product added to cart successfully!", {
  //         style: {
  //           background: "#1f1f1f",
  //           color: "#fff",
  //           borderRadius: "0px",
  //           padding: "12px 16px",
  //           fontSize: "14px",
  //         },
  //         hideProgressBar: true,
  //         closeButton: false,
  //         icon: true,
  //       });
  //     })
  //     .catch((error) => {
  //       toast.error("Failed to add to cart");
  //       console.error(error);
  //     });
  // };
  // ADD TO CART FUNCTION (restricted until pincode check success);

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

  // Price dynamics solution
  const currentPrice = selectedSize ? selectedSize.price : data?.selling_price;
  const productId = data?.id || productSlug;

  // ping the wishlist
  const handleSimilarProductClick = (slug) => {
    navigate("/productsdetails", { state: { product: slug } });
  };

  const toggleWishlist = async (e, product) => {
    e.stopPropagation();
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

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

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
  const selectionColor = (color) => {
    // setSelectedColor(color);
    setSelectedImage(color?.product_media[0]?.media);
  };
  const sizeSelection = (size) => {
    setSelectedColor(size?.product_colors[0]);
    setSelectedImage(size?.product_colors[0]?.product_media[0]?.media);
  };
 
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="product-page">
        {/* Main Product Image */}
        <div className="product-gallery">
        <div
            className="image_track"
            style={{ width: "100%", minHeight: "750px" }}
          >
            {loading || !selectedImage ? (
              <div style={{ width: "100%", height: "100%" }}>
                <Skeleton
                  height="100%"
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
                  width: "100%",
                  height: "auto",
                  mixBlendMode: "darken",
                  objectFit: "cover",
                }}
              />
            )}
        </div>
          <div
            className="image_track_mobile"
            style={{ width: "100%", minHeight: "250px" }}>
            {loading || !selectedImage ? (
              <div style={{ width: "100%", height: "100%" }}>
                <Skeleton
                  height="100%"
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
                  width: "100%",
                  height: "auto",
                  mixBlendMode: "darken",
                  objectFit: "cover",
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
                    <del>₹{selectedSize?.mrp}</del> &nbsp;
                    <span className="dis-sub">
                      {selectedSize?.discount}% OFF
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

          {/* Size Selector */}
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
                        onClick={() => {
                          setSelectedSize(size);
                          sizeSelection(size);
                        }
                        }>
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
                    <div
                      className={`selected-color ${
                        selectedColor?.id === color.id ? "active-size" : ""
                      }`}
                      key={idx}
                      onClick={() => {
                        setSelectedColor(color);
                        selectionColor(color);
                      }}
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
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
          </div>

          {/* Pincode Check */}
          <div className="pincode-check">
            <p className="check-heading">CHECK AVAILABILITY</p>
            <div className="input-wrapper">
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
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              ADD TO CART
            </button>
            <div className="wst_box" onClick={(e) => toggleWishlist(e, data)}>
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
                  color={data?.is_wishlisted ? "#FF0000" : "#000"}
                  fill={data?.is_wishlisted ? "#FF0000" : "none"}
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
                <span className="txt-sub-info-pdp">Prepaid orders only</span>
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

      {/* Similar Products */}
      <div className="similar-styles-section">
        <h2>Discover Similar Styles</h2>
        {loading ? (
          <div className="product-grid">
            {Array(4)
              .fill(0)
              .map((_, idx) => (
                <div className="product-card-dtl" key={idx}>
                  <Skeleton height={200} />
                  <Skeleton height={20} width={150} style={{ marginTop: 10 }} />
                  <Skeleton height={20} width={100} />
                </div>
              ))}
          </div>
        ) : (
          <div className="product-grid">
            {data?.discover_similar_styles?.slice(0, 10).map((item) => {
              const isWishlisted = wishlist.productIds.includes(item.id);

              return (
                <div
                  className="product-card-dtl"
                  key={item.id}
                  onClick={() => handleSimilarProductClick(item.action_url)}
                >
                  <div className="product-img-box">
                    <img src={item?.media_list?.main?.file} alt={item.name} />
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
                          color={isWishlisted ? "#FF0000" : "#000"}
                          fill={isWishlisted ? "#FF0000" : "none"}
                          size={20}
                          strokeWidth={2}
                        />
                      )}
                    </button>
                  </div>
                  <p className="product-title">{item.name}</p>
                  <div className="product-price">
                    <span>₹{item.selling_price}</span>
                    {item.mrp && item.mrp !== item.selling_price && (
                      <>
                        <span className="original">₹{item.mrp}</span>
                        <span className="discount">({item.discount}% OFF)</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Don’t Miss the product */}
      <div className="similar-styles-section">
        <h2 className="txt_head_list">Don’t Miss These Matching Finds</h2>
        {loading ? (
          <div className="product-grid">
            {Array(4)
              .fill(0)
              .map((_, idx) => (
                <div className="product-card-dtl" key={idx}>
                  <Skeleton height={200} />
                  <Skeleton height={20} width={150} style={{ marginTop: 10 }} />
                  <Skeleton height={20} width={100} />
                </div>
              ))}
          </div>
        ) : (
          <div className="product-grid">
            {data?.dont_miss_these_matching_finds?.slice(0, 10).map((item) => {
              const isWishlisted = wishlist.productIds.includes(item.id);
              return (
                <div
                  className="product-card-dtl"
                  key={item.id}
                  onClick={() => handleSimilarProductClick(item.action_url)}
                >
                  <div className="product-img-box">
                    <img src={item?.media_list?.main?.file} alt={item.name} />
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
                          color={isWishlisted ? "#FF0000" : "#000"}
                          fill={isWishlisted ? "#FF0000" : "none"}
                          size={20}
                          strokeWidth={2}
                        />
                      )}
                    </button>
                  </div>

                  <p className="product-title">{item.name}</p>
                  <div className="product-price">
                    <span>₹{item.selling_price}</span>
                    {item.mrp && item.mrp !== item.selling_price && (
                      <>
                        <span className="original">₹{item.mrp}</span>
                        <span className="discount">({item.discount}% OFF)</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}
    </>
  );
};

export default ProductDetailPage;
