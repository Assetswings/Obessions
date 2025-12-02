import React, { useEffect, useRef, useState } from "react";
import "../Products/ProductsPage.css";
import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "../Products/productsSlice";
import { Expand, Heart, SlidersHorizontal, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductQuickViewModal from "../Products/ProductQuickViewModal";

import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "../../components/Wishtlist/WishlistSlice";
import { Player } from "@lottiefiles/react-lottie-player";
import heartAnimation from "../../assets/icons/Heart.json";
import { fetchProducts } from "../Products/productsSlice";
import { filterCarpet } from "./carpetFinderSlice";
import LoginPromptModal from "../../components/LoginModal/LoginPromptModal";
import Footer from "../../components/Footer/Footer";
import { fetchTopPicks } from "../Products/otherproductSlice";
import Breadcrumbs from "../../components/Breadcum/Breadcrumbs";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../../components/Pagination/Pagination";
import emptyproduct from "../../assets/images/empty-product.png";

const Carpetfinderserch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [animatedWish, setAnimatedWish] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false); // NEW: mobile filter modal state
  const [tempMobileFilters, setTempMobileFilters] = useState({});
  const filtercarpetdata = location.state;
  const { filteredData, filters, pagination, loading, error } = useSelector(
    (state) => state.carpetFinder
  );
  const { items } = useSelector((state) => state.toppick);
  const [currentPage, setCurrentPage] = useState(1);

  const total = pagination?.total || 0;
  const limit = pagination?.limit || 40;
  const totalPages = Math.ceil(total / limit);

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const rangeEnd = Math.min(currentPage * limit, total);
  useEffect(() => {
    if (filtercarpetdata) {
      dispatch(filterCarpet(filtercarpetdata));
    }
    dispatch(fetchTopPicks());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      setProducts(Array.isArray(filteredData) ? filteredData : []);
    }
  }, [filteredData, loading]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isFilterOpen]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);

      // 👇 Scroll smoothly to the top after changing page
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 200);
    }
  };

  // ✅ Load filters from localStorage on page load
  useEffect(() => {
    const savedFilters = localStorage.getItem("selectedFilters");
    if (savedFilters) {
      try {
        setSelectedFilters(JSON.parse(savedFilters));
        setTempMobileFilters(JSON.parse(savedFilters));
      } catch (e) {
        console.error("Error parsing filters:", e);
        localStorage.removeItem("selectedFilters");
      }
    }
  }, []);

  // ✅ Clear filters when leaving page or navigating away
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    const prevPath = prevPathRef.current;
    return () => {
      // Only clear if navigating away from this page
      // if (prevPath === "/products" && location.pathname !== "/products") {
      localStorage.removeItem("selectedFilters");
      // }
    };
  }, [location.pathname]);

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters((prev) => {
      const current = prev[filterKey] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [filterKey]: updated };
    });
  };

  const toggleWishlist = async (e, product) => {
      toast.dismiss();
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
            autoClose: 1500,
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
          // dispatch(
          //   fetchProducts({ category, subcategory, page: 1, limit: 20 })
          // );
          dispatch(filterCarpet(filtercarpetdata));
        }
      } else {
        await dispatch(addToWishlist({ product_id: product.id })).unwrap();
        toast.success("Added to wishlist", {
          autoClose:1500,
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
        dispatch(filterCarpet(filtercarpetdata));
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"   // remove "smooth" if you want instant scroll
    });
  };
  const handleMobileFilterChange = (filterKey, value) => {
    setTempMobileFilters((prev) => {
      const current = prev[filterKey] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      // return { ...prev, [filterKey]: updated };
      const newFilters = { ...prev, [filterKey]: updated };
      // Save to localStorage
      localStorage.setItem("selectedFilters", JSON.stringify(newFilters));
      return newFilters;
    });
  };

  const renderFilterGroup = (title, options, key, isMobile = false) => {
    const isExpanded = expandedGroups[key] || false;
    const visibleOptions = isExpanded ? options : options?.slice(0, 5);
    const hiddenCount = options.length - visibleOptions.length;

    const currentFilters = isMobile ? tempMobileFilters : selectedFilters;
    const onChangeHandler = isMobile
      ? handleMobileFilterChange
      : handleFilterChange;

    return (
      <div className="custom-filter-group" key={key}>
        <h4>{title}</h4>

        {visibleOptions.map((opt, i) => (
          <label key={i}>
            <input
              type="checkbox"
              checked={currentFilters[key]?.includes(opt) || false}
              onChange={() => { scrollToTop(); onChangeHandler(key, opt) }}
            />
            <span className="txt_checkbox">{opt.trim()}</span>
          </label>
        ))}

        {/* Show More / Show Less row */}
        {options.length > 5 && (
          <div
            className="show-more-row"
            onClick={() =>
              setExpandedGroups((prev) => ({
                ...prev,
                [key]: !isExpanded,
              }))
            }
          >
            {isExpanded ? "− Show Less" : `+ Show More (${hiddenCount})`}
          </div>
        )}
      </div>
    );
  };

  // Render category filters (with subcategories)
  const renderCategoryFilter = (categories, isMobile = false) => {
    const currentFilters = isMobile ? tempMobileFilters : selectedFilters;
    const onChangeHandler = isMobile
      ? handleMobileFilterChange
      : handleFilterChange;

    return (
      <div className="custom-filter-group" key="categories">
        <h4>Other Categories</h4>
        {/* <label>
          <span className="txt_checkbox">{categories.name}</span>
        </label> */}

        <div className="subcategory-list">
          {categories.subcategories.map((sub) => (
            <label key={sub.id}>
              <input
                type="checkbox"
                checked={
                  currentFilters.categories?.includes(sub.name) || false
                }
                onChange={() => { scrollToTop(); onChangeHandler("categories", sub.name) }}
              />
              <span className="txt_checkbox">{sub.name}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  // Render price range filter
  const renderPriceFilter = (priceFilter, isMobile = false) => {
    const currentFilters = isMobile ? tempMobileFilters : selectedFilters;
    const onChangeHandler = isMobile ? handleMobileFilterChange : handleFilterChange;

    const handlePriceChange = (filterValue) => {
      onChangeHandler("price_filter", filterValue);
    };

    return (
      <></>
      // <div className="custom-filter-group" key="price_filter">
      //   <h4>Price Range</h4>
      //   {priceFilter.map((price, i) => (
      //     <label key={i}>
      //       <input
      //         type="checkbox"
      //         checked={
      //           currentFilters.price_filter?.includes(price.filter_value) || false
      //         }
      //         onChange={() => {scrollToTop(); handlePriceChange(price.filter_value)}}
      //       />
      //       <span className="txt_checkbox">{price.range_lebel}</span>
      //     </label>
      //   ))}
      // </div>
    );
  };

  // Render discount filters
  const renderDiscountFilter = (discounts, isMobile = false) => {
    const currentFilters = isMobile ? tempMobileFilters : selectedFilters;
    const onChangeHandler = isMobile
      ? handleMobileFilterChange
      : handleFilterChange;

    return (
      <div className="custom-filter-group" key="discount_filter">
        <h4>Discount</h4>
        {discounts.map((disc, i) => (
          <label key={i}>
            <input
              type="checkbox"
              checked={
                currentFilters.discount_filter?.includes(disc.discount_range) ||
                false
              }
              onChange={() => { scrollToTop(); onChangeHandler("discount_filter", disc.discount_range) }}
            />
            <span className="txt_checkbox">
              {disc.discount_range}% Off ({disc.total_items})
            </span>
          </label>
        ))}
      </div>
    );
  };
  const breadcrumbPaths = [
    { label: "Floor Matcher Result", to: "" }, // last one (no link)
  ];
  return (
    <>
      <ToastContainer style={{ zIndex: 9999999999999 }} position="top-right" autoClose={3000} />
      <Breadcrumbs paths={breadcrumbPaths} />
      {products.length > 0 &&
        <div className="track_filter">
          <div className="title_hader_filter">
            {/* <h2 className="title_prd_roots">
              {loading ? (
                <Skeleton height={28} width={180} style={{ marginBottom: 10 }} />
              ) : subcategory ? (
                formatTitle(subcategory)
              ) : (
                formatTitle(category)
              )}
            </h2> */}
          </div>

          <div className="root_btn_filter_hader">
            <div
              className="mobile-filter-btn"
              onClick={() => setIsFilterOpen(true)}
            >
              FILTERS
            </div>
            {/* shop by */}
            {/* <div className="sortby-container">
              <div className="dropdown">
                <div
                  className="dropdown-toggle sortby-btn"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  SORT BY
                </div>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {Object.entries(sorting).map(([key, label]) => (
                    <li key={key}>
                      <button
                        className={`dropdown-item ${selected === key ? "active-option" : ""}`}
                        onClick={() => handleSelect(key, label)}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
          </div>
        </div>
      }
      <div className="custom-products-page">
        <aside className="custom-filters">
          <h2 className="title_prd_roots">Carpet finder Result</h2>
          <div className="root_devider_flt">
            <h2>Filters</h2>
            {selectedFilters && Object.keys(selectedFilters).length > 0 ? (
              <p className="clr-all" onClick={() => { setSelectedFilters({}); localStorage.removeItem("selectedFilters"); }}>
                Clear all
              </p>
            ) : null}
          </div>

          {loading ? (
            // 🔄 Skeleton loader while fetching data
            <>
              <Skeleton height={24} width={140} style={{ marginBottom: 10 }} />

              {Array.from({ length: 3 }).map((_, i) => (
                <div className="custom-filter-group" key={i}>
                  <Skeleton height={14} width={100} style={{ marginBottom: 10 }} />
                  <Skeleton count={4} height={16} width={120} style={{ marginBottom: 8 }} />
                </div>
              ))}
            </>
          ) : filters && Object.keys(filters).length > 0 ? (
            // ✅ Render filters when available
            <>
              {/* 1️⃣ Category Filter */}
              {filters.categories && renderCategoryFilter(filters.categories)}

              {/* 2️⃣ Price Filter */}
              {filters.price_filter && renderPriceFilter(filters.price_filter)}

              {/* 3️⃣ Discount Filter */}
              {filters.discount_filter && renderDiscountFilter(filters.discount_filter)}

              {/* 4️⃣ Product Filters */}
              {filters.product_filter &&
                Object.entries(filters.product_filter)
                  .filter(([key, values]) => Array.isArray(values) && values.length > 0)
                  .map(([key, values]) =>
                    renderFilterGroup(key.replace(/_/g, " "), values, key)
                  )}
            </>
          ) : (
            // ❌ No filters found
            <p className="no-filters">No filters available.</p>
          )}
        </aside>

        <main className="custom-product-list">
          {products.length > 0 &&
            <>
              <div className="sortby-container-mlb">
                <div>
                  <span style={{ fontWeight: "bold" }} className="track_contuing">
                    {`Showing ${rangeStart} to ${rangeEnd} of ${total} items`}
                  </span>

                </div>
                {/* <div className="dropdown" style={{ display: "flex", gap: "10px" }}>
                  <div
                    className="dropdown-toggle sortby-btn"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    SORT BY
                  </div>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {Object.entries(sorting).map(([key, label]) => (
                      <li key={key}>
                        <button
                          className={`dropdown-item ${selected === key ? "active-option" : ""}`}
                          onClick={() => handleSelect(key, label)}
                        >
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="sort-name">
                    {showShort}
                  </div>
                </div> */}
              </div>

            </>
          }
          <div className="mb-6">
            {loading ? (  // Loading State
              <div className="product-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="product-card-dtl">
                    <Skeleton height={200} />
                    <Skeleton height={20} width={150} />
                    <Skeleton height={20} width={100} />
                  </div>
                ))}
              </div>
            ) : products?.length > 0 ? (  // Product State
              <div className="product-grid">
                {products.map((item) => {
                  const isWishlisted = item.is_wishlisted;
                  return (

                    <div
                      key={item.id}
                      className="product-card-dtl pointer-crusser"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="product-img-box">
                        <Link
                          to={`/productsdetails/${item.action_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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

                        {/* Wishlist Button */}
                        <button
                          className="wishlist-btn_products pointer-crusser"
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

                        {/* Quick View */}
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
                            <Expand color="#000000" size={15} strokeWidth={1.25} />
                          </span>
                        </div>
                      </div>

                      {/* Product Title */}
                      <p className="product-title truncate pointer-crusser">
                        <Link
                          to={`/productsdetails/${item.action_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.name}
                        </Link>
                      </p>

                      {/* Product Price */}
                      <Link
                        to={`/productsdetails/${item.action_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="product-price">
                          <span>₹{item.selling_price}</span>
                          {item.mrp && item.mrp !== item.selling_price && (
                            <>
                              <span className="original">₹{item.mrp}</span>
                              <span className="discount">
                                ({item.discount_percent}% OFF)
                              </span>
                            </>
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : products?.length == 0 ? (  // Empty Product State
              <div className="empty-product">
                <img
                  src={emptyproduct}
                  alt="Empty cart"
                  className="empty-cart-image"
                />
                <p className="empty-cart-subtitle">
                  We couldn’t find a match, but there’s more waiting to be discovered.
                </p>
                <button
                  className="empty-cart-btn"
                  onClick={() => navigate("/")} // ✅ send user back to home/shop
                >
                  EXPLORE &nbsp;
                </button>
              </div>
            ) : (<></>)}
          </div>
          <div className="pagination_track">
            <Pagination
              className="mt-6"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalitems={products.length}
            />
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
        <div className="desk-top-picks">
          <div className="top-picks-grid">
            {items.map((item) => (
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
              {items.map((item) => (
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
      {/* SLIDE FILTER MODAL (Mobile) */}
      <div className={`mobile-filter-modal ${isFilterOpen ? "open" : ""}`}>
        <div className="mobile-filter-header">
          <h3>Filters</h3>
          <X size={20} onClick={() => setIsFilterOpen(false)} />
        </div>

        <div className="mobile-filter-body">
          <div className="track-lock">
            <p className="clr-all" onClick={() => { setTempMobileFilters({}); localStorage.removeItem("selectedFilters"); }}>
              clear all
            </p>
          </div>

          {filters && (
            <>
              {filters.categories &&
                renderCategoryFilter(filters.categories, true)}

              {filters.price_filter &&
                renderPriceFilter(filters.price_filter, true)}

              {filters.discount_filter &&
                renderDiscountFilter(filters.discount_filter, true)}

              {filters.product_filter &&
                Object.entries(filters.product_filter)
                  .filter(([key, values]) => Array.isArray(values) && values.length > 0)
                  .map(([key, values]) =>
                    renderFilterGroup(key.replace(/_/g, " "), values, key, true)
                  )}
            </>
          )}
        </div>
        {/* ✅ Sticky Footer Apply Button */}
        <div className="mobile-filter-footer">
          <button
            className="apply-filter-btn-clr"
            onClick={() => { setTempMobileFilters({}); localStorage.removeItem("selectedFilters"); }}
          >
            CLEAR ALL
          </button>
          <button
            className="apply-filter-btn"
            onClick={() => {
              setSelectedFilters(tempMobileFilters);
              setIsFilterOpen(false);
            }}
          >
            APPLY
          </button>
        </div>
      </div>
      {/* Fotter section  */}
      <Footer />
    </>
  );
};

export default Carpetfinderserch;
