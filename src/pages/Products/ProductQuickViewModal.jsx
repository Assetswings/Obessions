import React, {useState, useEffect, useRef } from "react";
import "./ProductQuickViewModal.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail , clearProductDetail} from "../Productdetails/productDetailSlice";
import Skeleton from "react-loading-skeleton";
import { Heart } from "lucide-react";

   const ProductQuickViewModal = ({ show, product, onHide }) => {

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("highlights");

    const modalRef = useRef();
    const sectionsRef = useRef({});
    const dispatch = useDispatch();
    const actionurl = product?.action_url

    console.log("url_trck----->",actionurl ); 
    const { data, loading, error } = useSelector((state) => state.productDetail);
  
        useEffect(() => {
        if (actionurl) {
        setLocalLoading(true);
        setSelectedImage(null);
        setSelectedSize(null);
        dispatch(clearProductDetail());
        dispatch(fetchProductDetail(actionurl));
        }
        }, [dispatch, actionurl]);
        console.log(" data_comming form details----->",data)


     // Set image when data loads
    useEffect(() => {
    if (data?.product_images?.length > 0) {
      setSelectedImage(data.product_images[0].media);
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
  console.log("Current Product ID:------->", productId);

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

  return (
    <div className="quickview-modal-overlay" onClick={handleOutsideClick}>
      <div className="quickview-modal" ref={modalRef}>
        {/* <div className="quickview-header">
          <h3></h3>
          <span className="close-icon" onClick={onHide}>×</span>
        </div> */}
   
        <div className="product-page">
        {/* Main Product Image */}
        <div className="product-gallery">

             <div className="sector_quick"> 
             <div
            className="image_track_quick"
            style={{ width: "100%", minHeight: "420px" }}
          >
            {loading || !selectedImage ? (
              <div style={{ width: "100%", height: "100%" }}>
                <Skeleton
                  height={620}
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
                  width: "80%",
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
              : data?.product_images?.map((img, index) => (
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
                  {selectedSize && (
                    <p className="selected-size-label">
                      CHOOSE A SIZE: <strong>{selectedSize.size}</strong>
                    </p>
                  )}
                  <div className="size-options">
                    {data.product_sizes.map((size) => (
                      <div
                        key={size.id}
                        className={`size-btn ${
                          selectedSize?.id === size.id ? "active-size" : ""
                        }`}
                        onClick={() => setSelectedSize(size)}
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
            <p>CHOOSE A COLOR:</p>
            {loading ? (
              <div style={{ display: "flex", gap: "10px" }}>
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton key={idx} square height={30} width={30} />
                  ))}
              </div>
            ) : (
              <div className="color-options">
                {["#3d3d3d", "#2f4f4f", "#8b0000", "#5f4b8b", "#5e412f"].map(
                  (color, idx) => (
                    <div className="selected-color" key={idx}>
                      <div
                        className="color-circle"
                        style={{ backgroundColor: color }}
                      ></div>
                    </div>
                  )
                )}
              </div>
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
              />
              <button className="check-btn">Check</button>
            </div>
            <p className="delivery-info">
              Available PAN India. We deliver wherever you call home.
            </p>
          </div>

          {/* Cart & Wishlist */}
          <div className="add-cart-section">
            <button className="add-to-cart-btn">ADD TO CART</button>
            <div className="wst_box">
              <p className="wishlist">
                <Heart size={27} />
              </p>
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



      </div>
    </div>
  );
};

export default ProductQuickViewModal;
