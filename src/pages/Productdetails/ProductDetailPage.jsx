import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./ProductDetailPage.css";
import { Facebook, Heart, Instagram, MessageCircle, Share2, Twitter } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import { fetchProductDetail, clearProductDetail } from "./productDetailSlice";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Slide, ToastContainer, toast } from "react-toastify";
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
import Breadcrumbs from "../../components/Breadcum/Breadcrumbs";
import { useCartWishlist } from "../../app/CartWishlistContext";
import { LocationTick, Whatsapp } from "iconsax-react";
import { BsWhatsapp } from "react-icons/bs";

const tabs = [
  { id: "highlights", label: "HIGHLIGHTS" },
  { id: "care", label: "CARE" },
  { id: "size-guide", label: "SIZE GUIDE" },
];

const ProductDetailPage = () => {
  const { getCartWishlistCount } = useCartWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("highlights");
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
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
  // const [showSpecs, setShowSpecs] = useState(false);
  // const [showCare, setShowCare] = useState(false);
  // const [showDesc, setShowDesc] = useState(true);
  const [unit, setUnit] = useState("cm");
  const [activeSection, setActiveSection] = useState('description');
  const dispatch = useDispatch();
  const sectionsRef = useRef({});
  const prevSlugRef = useRef(null);
  const [pincodeDetails, setPincodeDetails] = useState({});
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [open, setOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemSlug } = useParams();
  const productSlug = location.state?.product || itemSlug || null;
  const { data, loading, error } = useSelector((state) => state.productDetail);

  const { pinset, pinloading, pinerror } = useSelector(
    (state) => state.pincode
  );

  console.log("selectedColor---->", selectedColor);

  useEffect(() => {
    document.title = "Obsession - Products Details ";
    let storagePin = localStorage.getItem('pincode');
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
    if (storagePin) {
      console.log('pin', storagePin);
      setPincode(storagePin);
      dispatch(checkPincode(storagePin));
      // handleCheck();
    }
    return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch, productSlug]);


  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.85)",
    });
  };
  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center center",
    });
  };

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
  const subCat = productDetails?.sub_category_action_url;

  if (["carpet", "runner"].includes(subCat)) {
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

  useEffect(() => {
    if (pinerror) {
      toast.dismiss();
      toast.error("Invalid or unavailable pincode!");
    }
  }, [pinerror]);

  const handleAddToCart = () => {
    toast.dismiss();
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
            autoClose: 1500,
            hideProgressBar: true,
            closeButton: false, // custom close already inside
            style: {
              padding: "12px",
              background: "#fff",
              color: "#000",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
            icon: false,
            className: "cart-toast-wrapper",
          }
        );
        getCartWishlistCount(); // refresh count after add
      })
      .catch((error) => {
        toast.error(error?.error || "Failed to add to cart");
      });
  };

  // Price dynamics solution
  const currentPrice = selectedSize ? selectedSize.price : data?.selling_price;
  const productId = data?.id || productSlug;

  const toggleWishlist = async (e, product) => {
    toast.dismiss();
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
            hideProgressBar: true,
            autoClose: 1500,
            style: {
              borderRadius: "inherit",
              padding: "16px",
              color: "#713200",
            },
            iconTheme: {
              primary: "#713200",
              secondary: "#FFFAEE",
            },
          });
          getCartWishlistCount(); // refresh count after add
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
          autoClose: 1500,
          hideProgressBar: true,
          style: {
            borderRadius: "inherit",
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

  const toggleWishlistReleted = async (e, product, key) => {
    toast.dismiss();
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
            autoClose: 1500,
            style: {
              borderRadius: "inherit",
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
          getCartWishlistCount(); // refresh count after add
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
          autoClose: 1500,
          style: {
            borderRadius: "inherit",
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
        getCartWishlistCount(); // refresh count after add
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
    toast.dismiss();
    if (pincode.trim()) {
      dispatch(checkPincode(pincode));
      localStorage.setItem('pincode', pincode);
    } else {
      toast.error("Please Enter a Valid Pincode");
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

  const handleToggle = (section) => {
    setActiveSection(prev => (prev === section ? null : section));
  };
  const breadcrumbPaths = [
    { label: data?.sub_category_action_url, to: `/products/${data?.category_action_url}/${data?.sub_category_action_url}` },
    // { label: 'Product Details', to: "" }, // last one (no link)
  ];

  // Build full product URL (works with #/ hash routing)
  const productUrl = window.location.href;
  const encodedUrl = encodeURIComponent(productUrl);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    instagram: `https://www.instagram.com/?url=${encodedUrl}`,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedSize?.name,
          text: `Check out ${selectedSize?.name} on our store!`,
          url: window.location.href,
        });
      } catch (e) {
        console.log("Share cancelled");
      }
    } else {
      alert("Sharing not supported on this browser");
    }
  };

  const handleSwipe = (touchEndX) => {
    const swipeDistance = touchStart - touchEndX;
    const threshold = 50; // minimum distance to trigger swipe

    // Collect all available media (images + video)
    const medias = selectedColor?.product_media?.map(m => m.media) || [];
    if (selectedColor?.video_source) medias.push("video");

    const currentIndex = medias.indexOf(selectedImage);
    if (currentIndex === -1) return;

    if (swipeDistance > threshold) {
      // swipe LEFT → next image
      const next = (currentIndex + 1) % medias.length;
      setSelectedImage(medias[next]);
    } else if (swipeDistance < -threshold) {
      // swipe RIGHT → previous image
      const prev = (currentIndex - 1 + medias.length) % medias.length;
      setSelectedImage(medias[prev]);
    }
  };


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} style={{ zIndex: 9999999999999 }} limit={1} hideProgressBar={true} transition={Slide} newestOnTop={true} />

      <div className="root_br_head">
        {/* Breadcrumbs or Skeleton */}
        <div>
          {localLoading ? (
            <> </>
          ) : (
            <Breadcrumbs paths={breadcrumbPaths} />
          )}
        </div>
        {/* Share Button or Skeleton for Mobile */}
        <div>
          {localLoading ? (
            <>
            </>
            // <Skeleton width={200} />
          ) : (
            <div className="share_btn mobshare" onClick={handleShare}>
              <span><Share2 size={14} /></span>
              <span style={{ fontSize: '13px', paddingLeft: "5px" }}>SHARE</span>
            </div>
          )}
        </div>

        {/* Share Button or Skeleton for Web */}
        {localLoading ? (
          <div className="share_btn"></div>
        ) : (
          !open && (
            <div
              className="share_btn webshare"
              onMouseEnter={() => setOpen(true)}
            >
              <span><Share2 size={14} /></span> <span style={{ fontSize: '13px' }}>SHARE</span>
            </div>
          )
        )}

        {/* Dropdown */}
        {open && !loading && (
          <>
            <div className="relative">
              <div
                className="absolute left-1/2 -translate-x-1/2  shadow-lg rounded-xl p-3 mt-2 flex gap-3 z-999999  track_bound"
                onMouseLeave={() => setOpen(false)}
                onMouseEnter={() => setOpen(true)}>
                {/* WhatsApp */}
                <a
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-gray-100 transition">
                  <BsWhatsapp size={16} className="text-green-600" />
                </a>

                {/* Facebook */}
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Facebook size={16} className="text-blue-600" />
                </a>
                {/* Instagram */}
                <a
                  href={shareLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Instagram size={16} className="text-pink-500" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>


      <div className="product-page">
        {/* Main Product Image */}
        <div className="product-gallery">
          <div className="image_track">
            {loading || !selectedImage ? (
              <Skeleton height="100%" width="100%" />
            ) : selectedImage === "video" ? (
              selectedColor?.video_source?.includes("youtube.com") ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`${selectedColor.video_source}?autoplay=1&mute=1&playsinline=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ width: "100%", height: "100%" }}
                ></iframe>
              ) : (
                <video
                  controls
                  autoPlay
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",

                  }}
                >
                  <source src={selectedColor?.video_source} type="video/mp4" />
                </video>
              )
            ) : (
              <div
                className="zoom-container"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={selectedImage}
                  alt="Main Product"
                  className="main-image zoom-image"
                  style={zoomStyle}
                />
              </div>
            )}
          </div>

          {/* Mobile view */}
          {/* <div className="image_track_mobile" style={{ width: "100%", minHeight: "250px" }}>
            {loading || !selectedImage ? (
              <div style={{ width: "100%", height: "100%" }}>
                <Skeleton
                  height="100%"
                  width="100%"
                  baseColor="#e0e0e0"
                  highlightColor="#f5f5f5"
                />
              </div>
            ) : selectedImage === "video" ? (
              selectedColor?.video_source?.includes("youtube.com") ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`${selectedColor.video_source}?autoplay=1&mute=1&playsinline=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ borderRadius: "10px", width: "100%", height: "100%" }}
                ></iframe>

              ) : (
                <video
                  controls
                  autoPlay
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",

                  }}
                >
                  <source src={selectedColor?.video_source} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )
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
          </div> */}

          {/* Mobile view */}
          <div
            className="image_track_mobile"
            style={{ width: "100%", minHeight: "250px" }}
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleSwipe(e.changedTouches[0].clientX)}
          >
            {loading || !selectedImage ? (
              <div style={{ width: "100%", height: "100%" }}>
                <Skeleton height="100%" width="100%" baseColor="#e0e0e0" highlightColor="#f5f5f5" />
              </div>
            ) : selectedImage === "video" ? (
              selectedColor?.video_source?.includes("youtube.com") ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`${selectedColor.video_source}?autoplay=1&mute=1&playsinline=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ width: "100%", height: "100%" }}
                ></iframe>
              ) : (
                <video autoPlay muted controls style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                  <source src={selectedColor?.video_source} type="video/mp4" />
                </video>
              )
            ) : (
              <img
                src={selectedImage}
                alt="Main Product"
                className="main-image"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  mixBlendMode: "darken",
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
              : (
                <>
                  {selectedColor?.product_media?.map((img, index) => (
                    <img
                      key={index}
                      src={img.media}
                      alt={`Thumbnail ${index + 1}`}
                      className={`thumbnail ${selectedImage === img.media ? "selected-thumb" : ""
                        }`}
                      onClick={() => setSelectedImage(img.media)}
                    />
                  ))}
                  {selectedColor?.video_source && (
                    <div
                      className={`thumbnail video-thumb ${selectedImage === "video" ? "selected-thumb" : ""}`}
                      onClick={() => setSelectedImage("video")}
                    >
                      <img
                        src="https://img.freepik.com/free-vector/play-video-button-design_1017-33889.jpg"
                        alt="Video Thumbnail"
                      />
                      <div className="thumb-overlay">▶</div>
                    </div>
                  )}
                </>
              )}
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
                {selectedSize?.mrp && selectedSize.mrp !== selectedSize.price && (
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
            {localLoading ? <Skeleton width={100} /> : `SKU: ${selectedSize?.sku}`}
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
            ) : productDetails?.product_sizes?.length > 0 && selectedSize.size !== "NA" ? (
              <>
                {productDetails?.category_action_url === "dustbins" ? (
                  <p className="selected-size-label">
                    CHOOSE A CAPACITY:&nbsp;
                    {selectedSize && <strong>{selectedSize.capacity}</strong>}
                  </p>
                ) : productDetails?.category_action_url === "floor-covering" ? (
                  <p className="selected-size-label">
                    CHOOSE A SIZE :&nbsp;
                    {selectedSize && (
                      <strong>
                        {unit === "cm"
                          ? selectedSize.size
                          : unit === "ft"
                            ? selectedSize.size_in_feet
                            : ""}
                      </strong>
                    )}

                  </p>
                ) : (
                  <p className="selected-size-label">
                    CHOOSE A SIZE :&nbsp;
                    {selectedSize && <strong>{selectedSize.size}</strong>}
                  </p>
                )}
                {productDetails?.sub_category_action_url === "carpet" ? (
                  <div className="unit-toggle">
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
                        //  setQuantity(1);
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
                      ) : productDetails?.category_action_url === "floor-covering" ? (
                        selectedSize && (
                          <div className="lbl-track">
                            {unit === "cm"
                              ? size.size
                              : unit === "ft"
                                ? size.size_in_feet
                                : ""}
                          </div>
                        )
                      ) : (
                        <div className="lbl-track">{size.size}</div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // <Skeleton count={2} />
              <></>
            )}
          </div>

          {/* Color Selector */}
          <div className="color-selector">
            {loading ? (
              <div style={{ display: "flex", gap: "10px" }}>
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton key={idx} square height={30} width={30} />
                  ))}
              </div>
            ) : selectedSize?.product_colors?.length > 0 ? (
              <>
                <div>
                  <p>CHOOSE A COLOR :&nbsp;<span style={{ textTransform: "uppercase", fontWeight: "bold" }}>{selectedColor?.color}</span></p>
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
                        // setQuantity(1);
                      }}
                    >
                      <div className="color-circle pointer-crusser">
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
            ) : (
              <Skeleton count={2} />
            )}
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <p>{localLoading ? <Skeleton width={100} /> : "QUANTITY"}</p>
            <div className="qty-control">
              {localLoading ? (
                <Skeleton width={100} height={40} />
              ) : (
                <>
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    −
                  </button>
                  <span className="order_track_count">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)}>+</button>
                </>
              )}
            </div>
          </div>

          {/* Pincode Check */}
          <div className="pincode-check">
            <p className="check-heading">
              {localLoading ? <Skeleton width={180} /> : "CHECK AVAILABILITY"}
            </p>
            {localLoading ? (
              <>
                <Skeleton height={40} width={250} />
                <Skeleton width={200} />
              </>
            ) : (
              <>
                <div className="input-wrapper">
                  <input
                    className="checkup_track_txt"
                    type="text"
                    placeholder="Enter Delivery Pincode"
                    value={pincode}
                    maxLength={6}
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

                <div className="root_avl">
                  <div>
                    <p className="avl_trck">
                      Available PAN India. We deliver wherever you call home.
                    </p>
                  </div>
                  <div>
                    <span className="avl_trck">
                      Shipping Charges calculated at checkout.
                    </span>
                  </div>
                </div>

                {pinloading && <p className="check_test">Checking...</p>}
                {/* {pinerror && (
                  <p style={{ color: "red", marginTop: "15px" }}>
                    Not serviceable for your area
                  </p>
                )} */}
                {!pinloading && pincodeDetails?.pincode && pincodeDetails?.is_active && (
                  <p style={{ color: "green", marginTop: "15px" }}>
                    <span style={{ position: 'relative', bottom: '5px' }}>   <LocationTick
                      size="24"
                      color="green"
                      variant="Bold"
                    /></span> Delivery available at {pincodeDetails?.city},{" "}
                    {pincodeDetails?.state} ({pincodeDetails?.delivery_tat})
                  </p>
                )}
              </>
            )}
          </div>

          {/* Cart & Wishlist */}
          <div className="add-cart-section">
            {localLoading ? (
              <>
                <Skeleton width={150} height={40} />
              </>
            ) : (
              <>
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  ADD TO CART
                </button>
                <div
                  className="wst_box pointer-crusser"
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
              </>
            )}
          </div>

          {/* Return Info */}
          <div className="root_return_details">
            {localLoading ? (
              <>
                <Skeleton height={30} width={250} count={3} />
              </>
            ) : (
              <>
                <div className="details_flx">
                  <div className="fe-mob">
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
                {/* <div className="txt-exchange">
                  <img
                    src="https://i.ibb.co/PsNnXB2G/package.png"
                    className="img-exchange"
                    alt="Returns"
                  />
                  <span className="txt-sub-info-pdp">
                    {productDetails?.return_exchange_days}
                  </span>
                </div> */}
                {productDetails?.sub_category_action_url === "carpet" ? (
                  <p className="txt-Carpet-Finder">
                    Not sure which carpet fits your space? Try our{" "}
                    <span className="txt_crp">
                      <Link to='/floor-matcher' target="_blank" rel="noopener noreferrer">Floor Matcher</Link>
                    </span>
                  </p>
                ) : null}
              </>
            )}
          </div>

          {/* {productDetails?.product_info &&
            Object.keys(productDetails.product_info).length > 0 ? (
            <>
              <div className="pdp-accordion">
                <div
                  className="pdp-accordion-header"
                  onClick={() => setShowDesc((prev) => !prev)}
                >
                  <h3>
                    {localLoading ? <Skeleton width={180} /> : "PRODUCT DESCRIPTION"}
                  </h3>
                  {!localLoading && <span>{showDesc ? "−" : "+"}</span>}
                </div>

                {!localLoading && showDesc && (
                  <div className="pdp-accordion-content">
                    <p className="pdp-care-text">
                      {productDetails?.product_info?.description}
                    </p>
                  </div>
                )}

                {localLoading && (
                  <div className="pdp-accordion-content">
                    <Skeleton count={3} />
                  </div>
                )}
              </div>

              <div className="pdp-accordion">
                <div
                  className="pdp-accordion-header"
                  onClick={() => setShowSpecs((prev) => !prev)}
                >
                  <h3>SPECIFICATIONS</h3>
                  <span>{showSpecs ? "−" : "+"}</span>
                </div>

                {showSpecs && (
                  <div className="pdp-accordion-content">
                    <table className="pdp-specs-table">
                      <tbody>
                        {Object.entries(productDetails.product_info)
                          .filter(([key]) => key !== "description") // Exclude 'description'
                          .map(([key, value]) => (
                            <tr key={key}>
                              <td style={{ textTransform: "capitalize" }}>
                                {key.replace(/_/g, " ")}
                              </td>
                              <td>{value}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="pdp-accordion">
                <div
                  className="pdp-accordion-header"
                  onClick={() => setShowCare((prev) => !prev)}
                >
                  <h3>CARE INSTRUCTIONS</h3>
                  <span>{showCare ? "−" : "+"}</span>
                </div>

                {showCare && (
                  <div className="pdp-accordion-content">
                    <p className="pdp-care-text">
                      Transform your space with our luxurious Chamois Carpet, made from
                      100% premium Acrylic fibers. Designed for both elegance and
                      resilience, this high-quality carpet offers the perfect balance of
                      sophistication and durability, making it an ideal choice for any
                      living room, office, or hallway. Whether you’re looking to enhance
                      your home or workplace, our Chamois Carpet brings timeless style and
                      lasting comfort to any room.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <></>
          )} */}
          {productDetails?.product_info &&
            Object.keys(productDetails.product_info).length > 0 ? (
            <>
              {/* DESCRIPTION */}
              <div className="pdp-accordion">
                <div
                  className="pdp-accordion-header"
                  onClick={() => handleToggle("description")}
                >
                  <h3>
                    {localLoading ? <Skeleton width={180} /> : "PRODUCT DESCRIPTION"}
                  </h3>
                  {!localLoading && <span>{activeSection === "description" ? "−" : "+"}</span>}
                </div>

                {!localLoading && activeSection === "description" && (
                  <div className="pdp-accordion-content">
                    <p className="pdp-care-text">
                      {productDetails?.product_info?.description}
                    </p>
                  </div>
                )}

                {localLoading && (
                  <div className="pdp-accordion-content">
                    <Skeleton count={3} />
                  </div>
                )}
              </div>

              {/* SPECIFICATIONS */}
              <div className="pdp-accordion">
                <div
                  className="pdp-accordion-header"
                  onClick={() => handleToggle("specs")}
                >
                  <h3>SPECIFICATIONS</h3>
                  <span>{activeSection === "specs" ? "−" : "+"}</span>
                </div>

                {activeSection === "specs" && (
                  <div className="pdp-accordion-content">
                    <table className="pdp-specs-table">
                      <tbody>
                        {Object.entries(productDetails.product_info)
                          .filter(([key]) => key !== "description")
                          .map(([key, value]) => (
                            <tr key={key}>
                              <td style={{ textTransform: "capitalize" }}>
                                {key.replace(/_/g, " ")}
                              </td>
                              <td>{value}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* CARE INSTRUCTIONS */}
              <div className="pdp-accordion">
                <div
                  className="pdp-accordion-header"
                  onClick={() => handleToggle("care")}
                >
                  <h3>CARE INSTRUCTIONS</h3>
                  <span>{activeSection === "care" ? "−" : "+"}</span>
                </div>

                {activeSection === "care" && (
                  <div className="pdp-accordion-content">
                    <p className="pdp-care-text">
                      Transform your space with our luxurious Chamois Carpet...
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : null}


        </div>
      </div >





      {["carpet", "runner"].includes(productDetails?.sub_category_action_url) ? (
  <>
     <>
          <div className="product-tabs-container">
            <div className="tabs-bar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn-pdp ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(tab.id);

                    const topOffset = 90; // tweak this as needed
                    const el = sectionsRef.current[tab.id];
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.pageYOffset - topOffset;

                      window.scrollTo({
                        top: y,
                        behavior: "smooth",
                      });
                    }
                  }}
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
                      <div classname="card-non">
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
                      <div className="card-non">
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
                      <div classname="card-non">
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
                      <div classname="card-non">
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
                    {productDetails?.product_other_info[0]?.size_guide.map((det, idx) => (
                      <div className="size_sction_root">
                        <div className="img_track_runner">
                          <img
                            className="img-guild-section"
                            src={det?.media}
                            alt={det?.title}
                          />
                        </div>
                        <div className="sector_group_txt">
                          <h4 className="title-size-gid">{det?.title}</h4>
                          {det?.content?.map((con, idx) => (
                            <div>
                              <span className="txt-ft">{con?.size}:</span>{" "}
                              <span className="txt-ft2">
                                {" "}
                                {con?.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div>
                      <span className="pp-mc-txt">
                        Not sure which size fits best? Explore our{" "}
                        <span className="sub-pp-mc"><Link to="/size-guide" target="_blank" rel="noopener noreferrer">Size Guide</Link></span> to find
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
                <ul className="custom-tick-list">
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

              <div className="msg_track-mlb-main" >
                <div className="msg_track-mlb">

                  <div>
                    <img
                      className="image_good"
                      src="https://i.ibb.co/s9gxd00H/Untitled-Artwork-4-2.png"
                    />
                  </div>{" "}
                  <div>

                    MADE FOR LOW-FUSS LIVING: BECAUSE YOUR CARPET SHOULD WORK WITH
                    YOUR LIFESTYLE, NOT AGAINST IT.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
  </>
) : null}
      {/* Similar Products */}
      <div className="similar-styles-section">
        {localLoading ? (
          <Skeleton width={320} height={28} />
        ) : (
          <div className="in-mlb">
            <h2>Discover Similar Styles</h2>
          </div>
        )}
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
          <div className="product-grid-2">
            {similarStyle?.map((item) => {
              const isWishlisted = item.is_wishlisted;

              return (
                <div
                  className="product-card-dtl pointer-crusser"
                  key={item.id}
                >
                  <div className="product-img-box">
                    <Link to={`/productsdetails/${item.action_url}`} target="_blank" rel="noopener noreferrer">
                      <img
                        src={item.media_list?.main?.file}
                        alt={item.name}
                        title={item.name}
                        className="main_image"
                      />
                      <img
                        src={item.media_list?.hover?.file}
                        alt={item.name}
                        title={item.name}
                        className="hover_image"
                      />
                    </Link>
                    <button
                      className="wishlist-btn_products pointer-crusser"
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
                  <p className="product-title pointer-crusser truncate truncate-similar">
                    <Link to={`/productsdetails/${item.action_url}`} target="_blank" rel="noopener noreferrer">{item.name}</Link>
                  </p>
                  <Link to={`/productsdetails/${item.action_url}`}>
                    <div className="product-price">
                      <span>₹{item.selling_price}</span>
                      {item.mrp && item.mrp !== item.selling_price && (
                        <>
                          <span className="original">₹{item.mrp}</span>
                          <span className="discount">({item.discount}% OFF)</span>
                        </>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Don’t Miss the product */}
      <div className="similar-styles-section-2">
        {localLoading ? (
          <Skeleton width={280} height={32} borderRadius={8} />
        ) : (
          <h2 className="txt_head_list">Don’t Miss These Matching Finds</h2>
        )}
        {localLoading ? (
          <div className="product-grid">
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <div className="product-card-dtl pointer-crusser" key={idx}>
                  <Skeleton height={200} />
                  <Skeleton height={20} width={150} style={{ marginTop: 10 }} />
                  <Skeleton height={20} width={100} />
                </div>
              ))}
          </div>
        ) : (
          <div className="product-grid-2">
            {matchingFound?.map((item) => {
              const isWishlisted = item.is_wishlisted;
              return (
                <div
                  className="product-card-dtl pointer-crusser"
                  key={item.id}
                >
                  <div className="product-img-box">
                    <Link to={`/productsdetails/${item.action_url}`} target="_blank" rel="noopener noreferrer">
                      <img
                        src={item.media_list?.main?.file}
                        alt={item.name}
                        title={item.name}
                        className="main_image"
                      />
                      <img
                        src={item.media_list?.hover?.file}
                        alt={item.name}
                        title={item.name}
                        className="hover_image"
                      />
                    </Link>
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

                  <p className="product-title pointer-crusser truncate truncate-similar">
                    <Link to={`/productsdetails/${item.action_url}`} target="_blank" rel="noopener noreferrer">{item.name}</Link>
                  </p>
                  <Link to={`/productsdetails/${item.action_url}`}>
                    <div className="product-price">
                      <span>₹{item.selling_price}</span>
                      {item.mrp && item.mrp !== item.selling_price && (
                        <>
                          <span className="original">₹{item.mrp}</span>
                          <span className="discount">({item.discount}% OFF)</span>
                        </>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
      {
        showLoginPrompt && (
          <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
        )
      }
    </>
  );
};

export default ProductDetailPage;
