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
  addToWishlist,
  removeFromWishlist,
} from "../../components/Wishtlist/WishlistSlice";
import { Player } from "@lottiefiles/react-lottie-player";
import heartAnimation from "../../assets/icons/Heart.json";
import { checkPincode, resetPincodeState } from "./pincodeSlice";
import CartToast from "../../components/AddtoCartToster/CartToast";

const tabs = [
  { id: "highlights", label: "HIGHLIGHTS" },
  { id: "care", label: "CARE" },
  { id: "size-guide", label: "SIZE GUIDE" },
];

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
  const [productDetails, setProductsDetails] = useState([]);
  const [similarStyle, setSimilarStyle] = useState([]);
  const [matchingFound, setMatchingFound] = useState([]);
  const dispatch = useDispatch();
  const sectionsRef = useRef({});
  const prevSlugRef = useRef(null);
  const [pincodeDetails, setPincodeDetails] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const productSlug = location.state?.product;
  const { data, loading, error } = useSelector((state) => state.productDetail);
  const { pinset, pinloading, pinerror } = useSelector(
    (state) => state.pincode
  );

  useEffect(() => {
    if (!productSlug) return;
    // Only run when slug actually changes
    if (prevSlugRef.current !== productSlug) {
      prevSlugRef.current = productSlug;
      // Reset only the main product state
      setLocalLoading(true);
      setSelectedImage(null);
      setSelectedSize(null);
      setSelectedColor(null);
      setProductsDetails([]);
      // pincode reset state
      setPincodeDetails({});
      setPincode("");
      setPincodeChecked(false);
      dispatch(fetchProductDetail(productSlug));
      dispatch(resetPincodeState());  
    }
      return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch, productSlug]);

    useEffect(() => {
    if (!data?.id) return;
    // check if product changed
    if (prevSlugRef.current !== data.id) {
      setProductsDetails(data);

      // reset with new product data
      setSimilarStyle(data?.discover_similar_styles?.slice(0, 10) || []);
      setMatchingFound(
        data?.dont_miss_these_matching_finds?.slice(0, 10) || []
      );

      if (data?.product_sizes?.length > 0) {
        setSelectedSize(data.product_sizes[0]);
        setSelectedColor(data.product_sizes[0].product_colors?.[0] || null);
        setSelectedImage(
          data.product_sizes[0].product_colors?.[0]?.product_media?.[0]
           ?.media || null
        );
        setAnimatedWish(
          data.product_sizes[0]?.is_wishlisted ? data.product_sizes[0].id : null
        );
      }
      prevSlugRef.current = data.id;
    }
    setLocalLoading(false);
  }, [data]);

  // Scroll tracking (for highlights/description tabs)
  useEffect(() => {
    setPincodeDetails({});
    setPincode("");
    setPincodeChecked(false);

    if (productDetails?.sub_category_action_url === "carpet") {
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

      Object.values(sectionsRef.current).forEach((section) => {
        if (section) observer.observe(section);
      });

      return () => observer.disconnect();
    }
  }, [productDetails?.sub_category_action_url]);
  useEffect(() => {
    if (pinset) {
      setPincodeChecked(true);
      setPincodeDetails(pinset);
    }
  }, [pinset]);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    if (!pincodeChecked || !pincodeDetails?.is_active) {
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
    let product = { ...selectedColor };
    product["quantity"] = quantity;
    product["name"] = selectedSize?.name;
    product["image"] = selectedImage;
    product["price"] = selectedSize?.price;
    dispatch(addToCart({ product_id: selectedColor?.id, quantity }))
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
            autoClose: 6000,
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
    window.scrollTo({ top: 0, behavior: "auto" });
    navigate("/productsdetails", { state: { product: slug } });
  };

    const handlefinder =()=>{
    navigate("/carpet-finder")
   }
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
          // dispatch(fetchWishlist());
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

  const toggleWishlistReleted = async (e, product, key) => {
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
          if (key === "smiliarstyle") {
            setSimilarStyle((prev) =>
              prev.map((p) =>
                p.id === product.id
                  ? { ...p, is_wishlisted: false, wishlist: [] }
                  : p
              )
            );
          } else {
            setMatchingFound((prev) =>
              prev.map((p) =>
                p.id === product.id
                  ? { ...p, is_wishlisted: false, wishlist: [] }
                  : p
              )
            );
          }
        }
      } else {
        // addToWishlist thunk should return the new wishlist item(s)
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

        // If your API returns the whole wishlist array:
        const wishlist = Array.isArray(addedWishlistItem)
          ? addedWishlistItem.find((w) => w.product_id === product.id)
          : addedWishlistItem;

        // Update local state immutably
        if (key === "smiliarstyle") {
          setSimilarStyle((prev) =>
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
        } else {
          setMatchingFound((prev) =>
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
        }

        setTimeout(() => setAnimatedWish(null), 1500);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const handleCheck = () => {
    if (pincode.trim()) {
      dispatch(checkPincode(pincode));
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
            style={{ width: "100%", minHeight: "250px" }}
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
            {localLoading ? <Skeleton width={200} /> : selectedSize?.name}
          </h1>

          <p className="price_details">
            {localLoading ? (
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
            {localLoading ? (
              <Skeleton width={100} />
            ) : (
              `SKU: ${selectedSize?.sku}`
            )}
          </p>

          {/* Size Selector */}
          <div className="size-selector">
            {localLoading ? (
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
                  <p className="selected-size-label">
                    CHOOSE A SIZE:
                    {selectedSize && <strong>{selectedSize.size}</strong>}
                  </p>

                  <div className="size-options">
                    {productDetails.product_sizes.map((size) => (
                      <div
                        key={size.id}
                        className={`size-btn ${
                          selectedSize?.id === size.id ? "active-size" : ""
                        }`}
                        onClick={() => {
                          setSelectedSize(size);
                          sizeSelection(size);
                        }}
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
                  <p>CHOOSE A COLOR:{selectedColor?.color}</p>
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
              <span className="order_track_count">{quantity}</span>
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

              <button onClick={handleReset} className="rest-btn">
                Reset
              </button>
            </div>

             <div className="root_avl">  
             <div> 
            <p className="avl_trck">Available PAN India. We deliver wherever you call home.</p>   
            </div> 

              <div> 
              <span className="avl_3"> Shipping Charges calculated at checkout.</span>
              </div> 
               </div>  
           

            {/* Show pincode info */}
            {pinloading && <p className="check_test">Checking...</p>}
            {pinerror && (
              <p style={{ color: "red", marginTop: "15px" }}>
                Not serviceable for your area
              </p>
            )}
            {pincodeDetails?.pincode && pincodeDetails?.is_active && (
              <p style={{ color: "green", marginTop: "15px" }}>
                ✅ Delivery available at {pincodeDetails?.city},{" "}
                {pincodeDetails?.state} ({pincodeDetails?.delivery_tat})
              </p>
            )}
          </div>

          {/* Cart & Wishlist */}
          <div className="add-cart-section">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              ADD TO CART
            </button>
            <div
              className="wst_box"
              onClick={(e) => toggleWishlist(e, selectedSize)}
            >
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
              <span 
               onClick={handlefinder}
               className="txt_crp">
                Carpet Finder
              </span>
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

      {productDetails?.sub_category_action_url === "carpet" ? (
        <>
          <div className="product-tabs-container">
            <div className="tabs-bar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  disabled={true}
                  // onClick={() => scrollToSection(tab.id)}
                  className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="track_box_pr">
              <div className="img_section">
                <img
                  src={selectedColor?.product_media[1].media}
                  alt="Product"
                  className="highlight-image"
                />
              </div>

              <div>
                <div
                  className="tab-section"
                  id="highlights"
                  ref={(el) => (sectionsRef.current["highlights"] = el)}
                >
                  <h2 className="tab-section-txt">SPECIFICATIONS:</h2>
                  <div className="section-txt-pdb">
                    <strong>Material:</strong>{" "}
                    <span className="sub-section-pdp">
                      100% Heat-set Polypropylene
                    </span>
                  </div>
                  <div className="section-txt-pdb">
                    <strong>Weave:</strong>{" "}
                    <span className="sub-section-pdp">Power-loomed</span>
                  </div>
                  <div className="section-txt-pdb">
                    <strong>Color:</strong>{" "}
                    <span className="sub-section-pdp">Soft Blue </span>
                  </div>
                  <div className="section-txt-pdb">
                    <strong>Pile Height:</strong>{" "}
                    <span className="sub-section-pdp">
                      {" "}
                      {`Medium (Approx. 0.5")`}
                    </span>
                  </div>
                  <div className="section-txt-pdb">
                    <strong>Backing:</strong>{" "}
                    <span className="sub-section-pdp"> Latex</span>
                  </div>
                  <div className="section-txt-pdb">
                    <strong>Made in:</strong>{" "}
                    <span className="sub-section-pdp">India </span>
                  </div>
                  <div className="section-txt-pdb">
                    <strong>Available Sizes:</strong>{" "}
                    <span className="sub-section-pdp">
                      {" "}
                      2'3"x3', 3'x5', 5'x7'6", 8'x10', and 9'x12'
                    </span>
                  </div>
                  <div className="feature-grid-section">
                    <h3 className="tab-section-txt">FEATURES: </h3>
                    <div className="feature-grid">
                      <div>
                        <img
                          src="https://i.ibb.co/sJWhs530/image-535.png"
                          alt="Easy"
                        />
                        <p className="semi-txt">
                          EASY TO MAINTAIN
                          <br />
                          <span className="sub-text-semi">
                            Resists stains and everyday wear
                          </span>
                        </p>
                      </div>
                      <div>
                        <img
                          src="https://i.ibb.co/4w7V4QqL/Snowflake-Streamline-Solar-Linear.png"
                          alt="Soft"
                        />
                        <p className="semi-txt">
                          SOFT UNDERFOOT
                          <br />
                          <span className="sub-text-semi">
                            Comfortable, medium-pile texture{" "}
                          </span>
                        </p>
                      </div>
                      <div>
                        <img
                          src="https://i.ibb.co/6R3CR6DS/Water-Streamline-Solar-Linear.png"
                          alt="Design"
                        />
                        <p className="semi-txt">
                          VERSATILE DESIGN
                          <br />
                          <span className="sub-text-semi">
                            Blends with modern, classic, or coastal interiors
                          </span>
                        </p>
                      </div>
                      <div>
                        <img
                          src="https://i.ibb.co/6JDjbYsZ/solar-crown-star-linear.png"
                          alt="Allergy"
                        />
                        <p className="semi-txt">
                          ALLERGY FRIENDLY
                          <br />
                          <span className="sub-text-semi">
                            Synthetic fibers resist dust and allergens{" "}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-section"
                  id="care"
                  ref={(el) => (sectionsRef.current["care"] = el)}
                >
                  <h2 className="tab-section-txt">CARE INSTRUCTIONS:</h2>
                  <ul className="section_care">
                    <li>Vacuum regularly (avoid beater bar)</li>
                    <li>Spot clean with mild detergent and water</li>
                    <li>Avoid soaking for excessive moisture</li>
                    <li>Rotate every few months for even wear</li>
                    <li>Safe for homes with children and pets</li>
                  </ul>
                </div>

                <div
                  className="tab-section"
                  id="size-guide"
                  ref={(el) => (sectionsRef.current["size-guide"] = el)}
                >
                  <h2 className="tab-section-txt">SIZE GUIDE:</h2>

                  <div className="size-guide-block">
                    {/* Living Room */}
                    <div className="size_sction_root">
                      <div>
                        <img
                          className="img-guild-section"
                          src="https://i.ibb.co/C3hfGFfT/l-room.png"
                          alt="living-room"
                        />
                      </div>
                      <div className="sector_group_txt">
                        <h4 className="title-size-gid">LIVING ROOM</h4>
                        <div>
                          <span className="txt-ft">Medium (5x8 ft):</span>{" "}
                          <span className="txt-ft2">
                            {" "}
                            Front legs of furniture on the carpet
                          </span>
                        </div>
                        <div>
                          <span className="txt-ft">Large (8x10 ft+):</span>{" "}
                          <span className="txt-ft2">
                            {" "}
                            Full furniture fits for a unified look
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bedroom */}
                    <div className="size_sction_root">
                      <div>
                        <img
                          className="img-guild-section"
                          src="https://i.ibb.co/yFB0m3LZ/b-room.png"
                          alt="bedroom"
                        />
                      </div>
                      <div className="sector_group_txt">
                        <h4 className="title-size-gid">BEDROOM</h4>
                        <div>
                          <span className="txt-ft">Medium (5x8 ft):</span>{" "}
                          <span className="txt-ft2"> Covers bedside area</span>
                        </div>
                        <div>
                          <span className="txt-ft">Large (8x10 ft+):</span>{" "}
                          <span className="txt-ft2">
                            {" "}
                            Extends under bed and nightstands{" "}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Kitchen */}
                    <div className="size_sction_root">
                      <div>
                        <img
                          className="img-guild-section"
                          src="https://i.ibb.co/xq3Sx3WB/k-room.png"
                          alt="kitchen"
                        />
                      </div>
                      <div className="sector_group_txt">
                        <h4 className="title-size-gid">KITCHEN</h4>
                        <div>
                          <span className="txt-ft">
                            Runner (2.5x6 ft / 2.5x8 ft):
                          </span>
                          <span className="txt-ft2">
                            {" "}
                            Perfect between counters or alongside islands{" "}
                          </span>
                        </div>
                        <div>
                          <span className="txt-ft">Small (3x5 ft):</span>{" "}
                          <span className="txt-ft2">
                            {" "}
                            Great near the sink or stove to soften
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Entryway & Hallway */}
                    <div className="size_sction_root">
                      <div>
                        <img
                          className="img-guild-section"
                          src="https://i.ibb.co/V03SvfC8/hall-room.png"
                          alt="entryway-hallway"
                        />
                      </div>
                      <div className="sector_group_txt">
                        <h4 className="title-size-gid">ENTRYWAY & HALLWAY</h4>
                        <div>
                          <span className="txt-ft">
                            Runners (2x6 ft or 2.5x8 ft):
                          </span>{" "}
                          <span className="txt-ft2"> Add warmth and flow </span>
                        </div>
                        <div className="txt-ft2">
                          Use anti-slip backings for safety
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="pp-mc-txt">
                        Not sure which size fits best? Explore our{" "}
                        <span className="sub-pp-mc"> Size Guide</span> to find
                        your perfect match.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rec_section">
            <div className="recommend-good-know">
              <div className="recommend-section">
                <h4>RECOMMENDED FOR</h4>
                <ul>
                  <li>Calm, cozy bedrooms or serene living spaces</li>
                  <li>Soft underfoot comfort in nurseries or reading nooks</li>
                  <li>
                    Homes with a neutral, pastel, or coastal-inspired palette
                  </li>
                  <li>Anyone looking to add quiet elegance to their space</li>
                </ul>
              </div>

              <div className="center-image">
                <img
                  src={selectedColor?.product_media[2].media}
                  alt="Room setting"
                />
              </div>

              <div className="good-to-know-section">
                <h4>GOOD TO KNOW</h4>
                <ul>
                  <li>
                    Edges may curl initially; lay flat or reverse-roll to settle
                  </li>
                  <li>Color may look different under various lighting</li>
                  <li>Not recommended for damp areas like bathrooms</li>
                </ul>
              </div>

              <div className="msg_track">
                <p className="carpet-note">
                  <span>
                    <img
                      className="image_good"
                      src="https://i.ibb.co/s9gxd00H/Untitled-Artwork-4-2.png"
                    />
                  </span>{" "}
                  MADE FOR LOW-FUSS LIVING: BECAUSE YOUR CARPET SHOULD WORK WITH
                  YOUR LIFESTYLE, NOT AGAINST IT.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Similar Products */}
      <div className="similar-styles-section">
        <h2>Discover Similar Styles</h2>
        {localLoading ? (
          <div className="product-grid">
            {Array(5)
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
            {similarStyle?.map((item) => {
              const isWishlisted = item.is_wishlisted;

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
                      onClick={(e) =>
                        toggleWishlistReleted(e, item, "smiliarstyle")
                      }
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
      <div className="similar-styles-section-2">
        <h2 className="txt_head_list">Don’t Miss These Matching Finds</h2>
        {localLoading ? (
          <div className="product-grid">
            {Array(5)
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
            {matchingFound?.map((item) => {
              const isWishlisted = item.is_wishlisted;
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
                      onClick={(e) =>
                        toggleWishlistReleted(e, item, "matchingfound")
                      }
                    >
                      {item.is_wishlisted ? (
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
