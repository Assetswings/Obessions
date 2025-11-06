import React, { useEffect, useRef, useState } from "react";
import "../Products/ProductsPage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchOtherProducts } from "./Otherpageslice";
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
import LoginPromptModal from "../../components/LoginModal/LoginPromptModal";
import Footer from "../../components/Footer/Footer";
import { fetchTopPicks } from "../Products/otherproductSlice";
import { toast, ToastContainer } from "react-toastify";
import { Expand, Heart, SlidersHorizontal, X } from "lucide-react";
import Breadcrumbs from "../../components/Breadcum/Breadcrumbs";
import Pagination from "../../components/Pagination/Pagination";
import { useCartWishlist } from "../../app/CartWishlistContext";

const Otherpage = () => {
  const { getCartWishlistCount } = useCartWishlist();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/").filter(Boolean).pop();
  const slug =
    path == "new-arrivals"
      ? "new-arrivals"
      : path == "bestseller"
        ? "bestsellers"
        : path == "offer-spot"
          ? "offer-spots"
          : "";

  const Titelslug =
    path == "new-arrivals"
      ? "New Arrivals"
      : path == "bestseller"
        ? "Bestsellers"
        : path == "offer-spot"
          ? "Offer Spots"
          : "";

  const { data: otherproduct, filters, pagination, loading, } = useSelector((state) => state.otherproduct);
  // const wishlist = useSelector((state) => state.wishlist);
  const [products, setProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [animatedWish, setAnimatedWish] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { items } = useSelector((state) => state.toppick);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // NEW: mobile filter modal state
  const [expandedGroups, setExpandedGroups] = useState({});
  const [tempMobileFilters, setTempMobileFilters] = useState({});
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const total = pagination?.total || 0;
  const limit = pagination?.limit || 20;
  const totalPages = Math.ceil(total / limit);

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const rangeEnd = Math.min(currentPage * limit, total);

  useEffect(() => {
    document.title = `Obsession - ${Titelslug}`;
    if (!loading) {
      setProducts(Array.isArray(otherproduct) ? otherproduct : []);
    }
  }, [otherproduct, loading]);

  useEffect(() => {
    dispatch(fetchTopPicks());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (slug) {
      dispatch({ type: "otherproduct/clear" });
      setProducts([]);
      dispatch(
        fetchOtherProducts({
          slug,
          page: currentPage,
          limit: 20,
          filters: selectedFilters,
        })
      );
    }
  }, [dispatch, slug, selectedFilters, currentPage]);

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
      // return { ...prev, [filterKey]: updated };
      const newFilters = { ...prev, [filterKey]: updated };
      // Save to localStorage
      localStorage.setItem("selectedFilters", JSON.stringify(newFilters));
      return newFilters;
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
          getCartWishlistCount(); // refresh count after add
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
        getCartWishlistCount(); // refresh count after add
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
              onChange={() => onChangeHandler(key, opt)}
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
        <h4>Categories</h4>
        <label>
          <span className="txt_checkbox">{categories.name}</span>
        </label>

        <div className="subcategory-list">
          {categories.subcategories.map((sub) => (
            <label key={sub.id}>
              <input
                type="checkbox"
                checked={
                  currentFilters.categories?.includes(sub.name) || false
                }
                onChange={() => onChangeHandler("categories", sub.name)}
              />
              <span className="txt_checkbox">{sub.name}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (filters?.price_filter) {
      setMinPrice(filters.price_filter.min_price);
      setMaxPrice(filters.price_filter.max_price);
    }
  }, [filters?.price_filter]);

  // Render price range filter
  const renderPriceFilter = (priceFilter, isMobile = false) => {
    const currentFilters = isMobile ? tempMobileFilters : selectedFilters;
    const onChangeHandler = isMobile ? handleMobileFilterChange : handleFilterChange;

    const handlePriceChange = (filterValue) => {
      onChangeHandler("price_filter", filterValue);
    };

    return (
      <div className="custom-filter-group" key="price_filter">
        <h4>Price Range</h4>
        {priceFilter.map((price, i) => (
          <label key={i}>
            <input
              type="checkbox"
              checked={
                currentFilters.price_filter?.includes(price.filter_value) || false
              }
              onChange={() => handlePriceChange(price.filter_value)}
            />
            <span className="txt_checkbox">{price.range_lebel}</span>
          </label>
        ))}
      </div>
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
              onChange={() => onChangeHandler("discount_filter", disc.discount_range)}
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
    { label: Titelslug, to: "" }, // last one (no link)
  ];
  return (
    <>
      <ToastContainer style={{ zIndex: 9999999999999 }} position="top-right" autoClose={3000} />
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="custom-products-page">
        <aside className="custom-filters">
          <h2 className="title_prd_roots">{slug ? formatTitle(slug) : ""}</h2>
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
          <div className="track_filter">
            <button
              className="mobile-filter-btn"
              onClick={() => setIsFilterOpen(true)}>
              <span>
                {" "}
                <SlidersHorizontal />
              </span>{" "}
              Filters
            </button>
          </div>
          <p style={{fontWeight:"bold"}}>
            {`Showing ${rangeStart} to ${rangeEnd} of ${total} items`}
          </p>
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
              : products.map((item) => {
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalitems={products.length}
      />

      <section className="top-picks-section">
        <h2 className="top-picks-heading">Don’t miss these top picks.</h2>
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

export default Otherpage;
