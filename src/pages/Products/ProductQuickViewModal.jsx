import React, { useState, useEffect, useRef } from "react";
import "./ProductQuickViewModal.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import CartToast from "../../components/AddtoCartToster/CartToast";
import { useCartWishlist } from "../../app/CartWishlistContext";
import { LocationTick } from "iconsax-react";

const ProductQuickViewModal = ({ show, product, onHide }) => {
  const { getCartWishlistCount } = useCartWishlist();
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
  const [productDetails, setProductsDetails] = useState([]);
  const [similarStyle, setSimilarStyle] = useState([]);
  const [matchingFound, setMatchingFound] = useState([]);
  const [pincodeDetails, setPincodeDetails] = useState({});
  const [unit, setUnit] = useState("cm");

  const modalRef = useRef();
  const sectionsRef = useRef({});
  const dispatch = useDispatch();
  const actionurl = product?.action_url ? product?.action_url : product?.slug;
  const { data, loading, error } = useSelector((state) => state.productDetail);
  const { pinset, pinloading, pinerror } = useSelector(
    (state) => state.pincode
  );
  const wishlist = useSelector((state) => state.wishlist);

  useEffect(() => {
    let storagePin = localStorage.getItem('pincode');
    if (actionurl) {
      setLocalLoading(true);
      setSelectedImage(null);
      setSelectedSize(null);
      setSelectedColor([]);
      setProductsDetails([]);
      setSimilarStyle([]);
      setMatchingFound([]);
      dispatch(clearProductDetail());
      dispatch(fetchProductDetail(actionurl));
    }
    if (storagePin) {
      setPincode(storagePin);
      dispatch(checkPincode(storagePin));
      // handleCheck();
    }
  }, [dispatch, actionurl]);
  // Set image when data loads
  useEffect(() => {
    setProductsDetails(data);
    setSimilarStyle(data?.discover_similar_styles?.slice(0, 10));
    setMatchingFound(data?.dont_miss_these_matching_finds?.slice(0, 10));
    if (data?.product_sizes.length > 0) {
      setSelectedSize(data?.product_sizes[0]);
      setSelectedColor(data?.product_sizes[0].product_colors[0]);
      setSelectedImage(
        data?.product_sizes[0].product_colors[0].product_media[0]?.media
      );
      setLocalLoading(false);
      setAnimatedWish(
        data?.product_sizes[0]?.is_wishlisted
          ? data?.product_sizes[0]?.id
          : null
      );
    }
  }, [data]);

  useEffect(() => {
    if (pinset) {
      setPincodeChecked(true);
      setPincodeDetails(pinset);
    }
  }, [pinset]);

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
      setPincodeDetails({});
      setPincode("");
      setPincodeChecked(false);
      onHide();
    }
  };
  const closediloug = () => {
    setPincodeDetails({});
    setPincode("");
    setPincodeChecked(false);
  };
  // Don't render if not shown
  if (!show || !product) return null;
  const handleCheck = () => {
    if (pincode.trim()) {
      dispatch(checkPincode(pincode));
      localStorage.setItem('pincode', pincode);
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

    if (!pincodeChecked || !pincodeDetails?.is_active) {
      toast.error("Verify delivery pincode before adding this item.", {
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
    let product = { ...selectedColor };
    product["quantity"] = quantity;
    product["name"] = selectedSize?.name;
    product["image"] = selectedImage;
    product["price"] = selectedSize?.price;
    dispatch(addToCart({ product_id: selectedColor.id, quantity }))
      .unwrap()
      .then(() => {
        const id = toast(
          <CartToast
            product={product}
            onViewCart={() => console.log("Go to cart")}
            onCheckout={() => console.log("Go to checkout")}
            onClose={() => toast.dismiss(id)}
          />,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeButton: false, // custom close already inside
            style: {
              padding: "12px",
              background: "#fff",
              color: "#000",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
            icon: false,
          }
        );
        getCartWishlistCount(); // refresh count after add
      })
      .catch((error) => {
        toast.error(error?.error || "Failed to add to cart");
      });
  };

  const toggleWishlist = async (e, product) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
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
            autoClose: 3000,
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
          getCartWishlistCount(); // refresh count after add
          setSelectedSize((prev) =>
            prev.id === product.id
              ? { ...prev, is_wishlisted: 0, wishlist: [] }
              : prev
          );
          setProductsDetails((prev) => ({
            ...prev,
            product_sizes: prev?.product_sizes?.map((p) =>
              p.id === product.id
                ? {
                  ...p,
                  is_wishlisted: 0,
                  wishlist: [],
                }
                : p
            ),
          }));
        }
      } else {
        const addedWishlistItem = await dispatch(
          addToWishlist({ product_id: product.id })
        ).unwrap();
        toast.success("Added to wishlist", {
          autoClose: 3000,
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
        getCartWishlistCount(); // refresh count after add
        setAnimatedWish(product.id);
        const wishlist = Array.isArray(addedWishlistItem)
          ? addedWishlistItem.find((w) => w.product_id === product.id)
          : addedWishlistItem;

        setSelectedSize((prev) =>
          prev.id === product.id
            ? {
              ...prev,
              is_wishlisted: 1,
              wishlist: [{ wishlist_id: wishlist.id }],
            }
            : prev
        );
        setProductsDetails((prev) => ({
          ...prev,
          product_sizes: prev?.product_sizes?.map((p) =>
            p.id === product.id
              ? {
                ...p,
                is_wishlisted: 1,
                wishlist: wishlist ? [{ wishlist_id: wishlist.id }] : [],
              }
              : p
          ),
        }));
        setTimeout(() => setAnimatedWish(null), 1500);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
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
      {/* <ToastContainer
        position="top-right"
        style={{ zIndex: 9999999999999 }}
        autoClose={3000}
      /> */}
      <div className="quickview-modal-overlay" onClick={handleOutsideClick}>
        <div className="quickview-modal" ref={modalRef}>
          <div className="quickview-header">
            <div></div>
            <div
              className="close-icon"
              onClick={() => {
                onHide();
                closediloug();
              }}
            >
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
                        className={`thumbnail ${selectedImage === img.media ? "selected-thumb" : ""
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
                {loading ? <Skeleton width={200} /> : selectedSize?.name}
              </h1>

              <p className="price_details">
                {loading ? (
                  <Skeleton width={120} />
                ) : (
                  <>
                    ₹{currentPrice}{" "}
                    {selectedSize?.mrp && (
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
                {loading ? (
                  <Skeleton width={100} />
                ) : (
                  `SKU: ${selectedSize?.sku}`
                )}
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
                  productDetails?.product_sizes?.length > 0 && (
                    <>
                      {productDetails?.category_action_url === "dustbins" ? (
                        <p className="selected-size-label">
                          CHOOSE A Capacity:&nbsp;
                          {selectedSize && <strong>{selectedSize.capacity}</strong>}
                        </p>
                      ) : (
                        <p className="selected-size-label">
                          CHOOSE A SIZE:
                          {selectedSize && <strong>{selectedSize.size}</strong>}
                        </p>
                      )}
                      {productDetails?.sub_category_action_url === "carpet" ? (
                        <div className="unit-toggle mt-2">
                          <button
                            className={unit === "cm" ? "active" : ""}
                            onClick={() => setUnit("cm")}
                          >
                            Cm
                          </button>

                          <button
                            className={unit === "ft" ? "active" : ""}
                            onClick={() => setUnit("ft")}
                          >
                            Feet
                          </button>
                        </div>
                      ) : (
                        <></>
                      )}

                      <div className="size-options">
                        {productDetails.product_sizes.map((size) => (
                          <div
                            key={size.id}
                            className={`size-btn ${selectedSize?.id === size.id ? "active-size" : ""
                              }`}
                            onClick={() => {
                              setSelectedSize(size);
                              sizeSelection(size);
                              setQuantity(1);
                            }}
                          >
                            <div className="set_btn_trcak">
                              {size?.size_vector_media ? (
                                <img
                                  src={size?.size_vector_media}
                                  className="size-image"
                                  alt={size.size}
                                />
                              ) : (
                                <></>
                              )}
                            </div>
                            {productDetails?.category_action_url === "dustbins" ? (
                              <div className="lbl-track">{size.capacity}</div>
                            ) : (
                              <div className="lbl-track">{size.size}</div>
                            )}
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
                          className={`selected-color ${selectedColor?.id === color.id ? "active-size" : ""
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

              {/* 🟡 Quantity Selector */}
              <div className="quantity-selector">
                {loading ? (
                  <>
                    <Skeleton height={18} width={100} style={{ marginBottom: 10 }} />
                    <div className="qty-control">
                      <Skeleton height={35} width={100} borderRadius={8} />
                    </div>
                  </>
                ) : (
                  <>
                    <p>QUANTITY</p>
                    <div className="qty-control">
                      <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                      <span className="order_track_count">{quantity}</span>
                      <button onClick={() => setQuantity((q) => q + 1)}>+</button>
                    </div>
                  </>
                )}
              </div>

              {/* 🟡 Pincode Check */}
              <div className={`pincode-check ${loading ? "no-border" : ""}`}>
                {loading ? (
                  <>
                    <Skeleton height={18} width={160} style={{ marginBottom: 10 }} />
                  </>
                ) : (
                  <>
                    <p className="check-heading">CHECK AVAILABILITY</p>
                    <div className="input-wrapper-quick-2">
                      <input
                        className="checkup_track_txt"
                        type="text"
                        placeholder="Enter Delivery Pincode"
                        value={pincode}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/\D/g, '');
                          setPincode(onlyNums);
                        }}
                        onKeyDown={(e) => {
                          const onlyNums = e.target.value.replace(/\D/g, '');
                          if (e.key === "Enter" && onlyNums.trim()) {
                            handleCheck();
                          }
                        }}
                      />

                      <div className="btn-group">
                        {pincode && (
                          <button onClick={handleReset} className="rest-btn">
                            Reset
                          </button>
                        )}

                        {!pincodeDetails?.is_active && (
                          <button onClick={handleCheck} className="check-btn-2">
                            Check
                          </button>
                        )}
                      </div>
                    </div>
                    {pinloading && <p>Checking...</p>}
                    {pinerror && (
                      <p style={{ color: "red", marginTop: "15px" }}>
                        Not serviceable for your area
                      </p>
                    )}
                    {pincodeDetails?.pincode && pincodeDetails?.is_active && (
                      <p style={{ color: "green", marginTop: "15px" }}>
                        <span style={{ position: 'relative', bottom: '4px' }}>   <LocationTick
                          size="24"
                          color="green"
                          variant="Bold"
                        /></span> Delivery available at {pincodeDetails?.city}, {pincodeDetails?.state} (
                        {pincodeDetails?.delivery_tat})
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* 🟡 Cart & Wishlist */}
              <div className="add-cart-sticky-wrapper">
                <div className="add-cart-section">
                  {loading ? (
                    <>
                      <Skeleton height={45} width={180} borderRadius={8} style={{ marginRight: 20 }} />
                    </>
                  ) : (
                    <>
                      <button className="add-to-cart-btn_qucick" onClick={handleAddToCart}>
                        ADD TO CART
                      </button>
                      <div className="wst_box_quick pointer-crusser" onClick={(e) => toggleWishlist(e, selectedSize)}>
                        {selectedSize?.is_wishlisted == 1 ? (
                          <Player
                            autoplay
                            keepLastFrame
                            src={heartAnimation}
                            style={{ width: 102, height: 102 }}
                          />
                        ) : (
                          <Heart
                            size={27}
                            color={selectedSize?.is_wishlisted ? "#FF0000" : "#000"}
                            fill={selectedSize?.is_wishlisted ? "#FF0000" : "none"}
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>


              {/* 🟡 Return Info */}
              <div className="root_return_details">
                {loading ? (
                  <>
                    <Skeleton height={50} width={"100%"} style={{ marginBottom: 10 }} />
                    <Skeleton height={20} width={"80%"} />
                  </>
                ) : (
                  <>
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
                          src="https://i.ibb.co/PsNnXB2G/package.png"
                          className="img-exchange"
                          alt="Returns"
                        />
                        <span className="txt-sub-info-pdp">
                          {productDetails?.return_exchange_days}
                        </span>
                      </div>
                    </div>
                    {productDetails?.sub_category_action_url === "carpet" ? (
                      <p className="txt-Carpet-Finder">
                        Not sure which carpet fits your space? Try our{" "}
                        <span className="txt_crp">
                          <Link to='/carpet-finder' target="_blank" rel="noopener noreferrer">Floor Matcher</Link>
                        </span>
                      </p>
                    ) : null}
                  </>
                )}
              </div>

              {/* 🟡 Product Description */}
              {/* <div className="product-description">
                {loading ? (
                  <>
                    <Skeleton height={20} width={180} style={{ marginBottom: 10 }} />
                    <Skeleton count={3} />
                  </>
                ) : (
                  <>
                    <h3 className="txt-des">PRODUCT DESCRIPTION</h3>
                    <p>{data?.product_info?.description}</p>
                  </>
                )}
              </div> */}
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
