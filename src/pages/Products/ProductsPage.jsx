import React, { useEffect, useState } from "react";
import "./ProductsPage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./productsSlice";
import { Expand, Heart, SlidersHorizontal, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductQuickViewModal from "./ProductQuickViewModal";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "../../components/Wishtlist/WishlistSlice";
import { ToastContainer, toast } from "react-toastify";
import { Player } from "@lottiefiles/react-lottie-player";
import heartAnimation from "../../assets/icons/Heart.json";
import LoginPromptModal from "../../components/LoginModal/LoginPromptModal";
import Footer from "../../components/Footer/Footer";
import { fetchTopPicks } from "./otherproductSlice";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category;
  const subcategory = location.state?.subcategory;

  // const { data: products,filters,loading} = useSelector((state) => state.products);
  const [products, setProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [animatedWish, setAnimatedWish] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { items } = useSelector((state) => state.toppick);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // NEW: mobile filter modal state
  const { data, filters, loading } = useSelector((state) => state.products);

  useEffect(() => {
    setProducts(Array.isArray(data) ? data : []);
  }, [data]);
  // const products = Array.isArray(data) ? data : [];

  useEffect(() => {
    dispatch(fetchTopPicks()); //
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (category) {
      dispatch(fetchProducts({ category, subcategory, page: 1, limit: 20 }));
    }
  }, [dispatch, category, subcategory]);

  useEffect(() => {
    if (category) {
      dispatch(
        fetchProducts({
          category,
          subcategory,
          page: 1,
          limit: 20,
          filters: selectedFilters,
        })
      );
    }
  }, [selectedFilters]);

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters((prev) => {
      const current = prev[filterKey] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [filterKey]: updated };
    });
    setIsFilterOpen(false); 
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
          setProducts((prev) =>
            prev.map((p) =>
              p.id === product.id
                ? { ...p, is_wishlisted: false, wishlist: [] }
                : p
            )
          );
        }
      } else {
        // addToWishlist thunk should return the new wishlist item(s)
        const addedWishlistItem = await dispatch(addToWishlist({ product_id: product.id })).unwrap();
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
        setProducts((prev) =>
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

  const formatTitle = (text) =>
    text
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const renderFilterGroup = (title, options, key) => (
    <div className="custom-filter-group" key={key}>
      <h4>{title}</h4>
      {options.map((opt, i) => (
        <label key={i}>
          <input
            type="checkbox"
            checked={selectedFilters[key]?.includes(opt) || false}
            onChange={() => handleFilterChange(key, opt)}
          />
          <span className="txt_checkbox">{opt}</span>
        </label>
      ))}
    </div>
  );

  const handleProductClick = (slug) => {
    if (slug) {
      navigate("/products", {
        state: {
          category: slug,
        },
      });
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
        {/* MOBILE FILTER BUTTON */}
      

        <div className="custom-products-page">
        <aside className="custom-filters">
          <h2 className="title_prd_roots">
            {subcategory ? formatTitle(subcategory) : formatTitle(category)}
          </h2>
          <div className="root_devider_flt">
            <h2>Filters</h2>
            <p className="clr-all" onClick={() => setSelectedFilters({})}>
              clear all
            </p>
          </div>

          {loading ? (
            <>
               <Skeleton height={24} width={140} style={{ marginBottom: 10 }} />
               {Array.from({ length: 3 }).map((_, i) => (
                <div className="custom-filter-group" key={i}>
                  <Skeleton
                    height={14}
                    width={100}
                    style={{ marginBottom: 10 }}
                  />
                  <Skeleton
                    count={4}
                    height={16}
                    width={120}
                    style={{ marginBottom: 8 }}
                  />
                </div>
              ))}
            </>
          ) : (
            filters &&
            Object.entries(filters).map(([filterKey, values]) =>
              renderFilterGroup(filterKey.replace(/_/g, " "), values, filterKey)
            )
          )}
        </aside>

          <main className="custom-product-list">
           <div className="track_filter"> 
           <button className="mobile-filter-btn" onClick={() => setIsFilterOpen(true)}>
          <span> <SlidersHorizontal/></span> Filters
         </button>
           </div>
          <div className="custom-products-grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="custom-product-card">
                    <div className="custom-product-image">
                      <Skeleton height={250} width={230} />
                    </div>
                    <p className="custom-product-title">
                      <Skeleton width={180} height={16} />
                    </p>
                    <p className="custom-product-price">
                      <Skeleton width={100} height={16} />
                    </p>
                  </div>
                ))
              : products?.map((item, index) => {
                  const isWishlisted = item.is_wishlisted;
                  return (
                    <div
                      key={item.index}
                      className="custom-product-card"
                      onClick={(e) => {
                        const isQuickView = e.target.closest(".qucick_dv");
                        const isWishlist = e.target.closest(
                          ".wishlist-btn_products"
                        );
                        if (!isQuickView && !isWishlist) {
                          navigate("/productsdetails", {
                            state: { product: item.action_url },
                          });
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="custom-product-image">
                        <img
                          src={item.media_list?.main?.file}
                          alt={item.name}
                        />

                        {/* wishliat_track */}
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

                        <div className="qucick_dv">
                          <span
                            className="quick-view_pd"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewProduct(item);
                              setShowModal(true);
                            }}
                          >
                            Quick View &nbsp;
                            <Expand
                              color="#000000"
                              size={15}
                              strokeWidth={1.25}
                            />
                          </span>
                        </div>
                      </div>
                      <p className="custom-product-title">{item.name}</p>
                      <p className="custom-product-price">
                        ₹{item.selling_price}
                        {item.mrp && item.mrp !== item.selling_price && (
                          <>
                            <span className="custom-old-price">
                              ₹{item.mrp}
                            </span>
                            <span className="custom-discount">
                              (-{item.discount_percent}%)
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  );
                })}
          </div>
        </main>

        <ProductQuickViewModal
          show={showModal}
          onHide={() => setShowModal(false)}
          product={quickViewProduct}
        />
      </div>

      {/* login modal */}
      {showLoginPrompt && (
        <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />
      )}

      <section className="top-picks-section">
        <h2 className="top-picks-heading">Don’t miss these top picks.</h2>
        <div className="top-picks-grid">
          {items.map((item) => (
            <div
              key={item.id}
              className="top-pick-card"
              onClick={() => handleProductClick(item.action_url)}
            >
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

       {/* SLIDE FILTER MODAL (Mobile) */}
      <div className={`mobile-filter-modal ${isFilterOpen ? "open" : ""}`}>
        <div className="mobile-filter-header">

          <h3>Filters</h3>
          <X size={20} onClick={() => setIsFilterOpen(false)} /> 
        </div>

        <div className="mobile-filter-body">
          {filters &&
            Object.entries(filters).map(([filterKey, values]) =>
              renderFilterGroup(filterKey.replace(/_/g, " "), values, filterKey)
            )}
        </div>
      </div>
      {/* Fotter section  */}
      <Footer />
    </>
  );
};

export default ProductsPage;
