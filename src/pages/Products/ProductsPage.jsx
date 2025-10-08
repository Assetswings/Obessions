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
import plpone from "../../assets/images/plp-01.png";
import plptwo from "../../assets/images/plp-02.png";

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
  const [tempMobileFilters, setTempMobileFilters] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
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
      setProducts([]);
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
  }, [dispatch, category, subcategory, selectedFilters]);

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
          <input
            type="checkbox"
            checked={
              currentFilters.categories?.includes(categories.name) || false
            }
            onChange={() => onChangeHandler("categories", categories.name)}
          />
          <span className="txt_checkbox">{categories.name}</span>
        </label>

        <div className="subcategory-list">
          {categories.subcategories.map((sub) => (
            <label key={sub.id}>
              <input
                type="checkbox"
                checked={
                  currentFilters.subcategories?.includes(sub.name) || false
                }
                onChange={() => onChangeHandler("subcategories", sub.name)}
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
    // setMinPrice(priceFilter.min_price);
    // setMaxPrice(priceFilter.max_price);
    const onApplyPrice = () => {
      const onChangeHandler = isMobile
        ? handleMobileFilterChange
        : handleFilterChange;
      onChangeHandler("price_min", minPrice);
      onChangeHandler("price_max", maxPrice);
    };

    return (
      <div className="custom-filter-group" key="price_filter">
        <h4>Price</h4>
        <div className="price-inputs">
          <input
            type="number"
            min={priceFilter.min_price}
            max={priceFilter.max_price}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span> - </span>
          <input
            type="number"
            min={priceFilter.min_price}
            max={priceFilter.max_price}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button onClick={onApplyPrice}>Apply</button>
        </div>
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

  const handleMobileFilterChange = (filterKey, value) => {
    setTempMobileFilters((prev) => {
      const current = prev[filterKey] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [filterKey]: updated };
    });
  };

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
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isFilterOpen]);
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
            {selectedFilters && Object.keys(selectedFilters).length > 0 ? (
              <p className="clr-all" onClick={() => setSelectedFilters({})}>
                Clear all
              </p>
            ) : null}
          </div>

          {/* {loading ? (
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
          )} */}
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
                Object.entries(filters.product_filter).map(([key, values]) =>
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
              onClick={() => setIsFilterOpen(true)}
            >
              <span>
                {" "}
                <SlidersHorizontal size={20} />
              </span>{" "}
              Filters
            </button>
          </div>
          <div className="custom-products-grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="custom-product-card">
                  <div className="custom-product-image">
                    <Skeleton height={250} width={275} />
                  </div>
                  <p className="custom-product-title">
                    <Skeleton width={180} height={16} />
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
                    {/* <p className="custom-product-title">{item.name}</p>
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
                      </p> */}

                    <p className="product-title">{item.name}</p>
                    <div className="product-price">
                      <span>₹{item.selling_price}</span>
                      {item.mrp && item.mrp !== item.selling_price && (
                        <>
                          <span className="original">₹{item.mrp}</span>
                          <span className="discount">({item.discount_percent}% OFF)</span>
                        </>
                      )}
                    </div>
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
            <div key={item.id} className="top-pick-card">
              <img
                src={item.media}
                alt={item.name}
                className="top-pick-image pointer-crusser"
                onClick={() => handleProductClick(item.action_url)}
              />
              <p
                className="top-pick-title pointer-crusser"
                onClick={() => handleProductClick(item.action_url)}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="obsession-section-pd">
        <div className="obsession-content-pd">
          <div className="obsession-text-pd">
            <h2>
              What makes Obsessions <br /> a customer <em>favourite</em>.
            </h2>
            <div className="obsession-columns">
              <div className="obsession-col">
                <h4>CRAFT</h4>
                <p>
                  It’s never just about products it’s about how they make our
                  customers feel.
                </p>
              </div>
              <div className="obsession-col">
                <h4>PURPOSE</h4>
                <p>
                  From elegant design to practical use, every detail is
                  obsessively crafted for the life you love living.
                </p>
              </div>
              <div className="obsession-col">
                <h4>STYLE</h4>
                <p>
                  We design with empathy; for how people live, love, and gather.
                </p>
              </div>
            </div>
          </div>

          <div className="obsession-images">
            <div className="obsession-img-wrapper">
              <img className="on-image-one" src={plpone} alt="Laundry" />
              <span className="obsession-tag top-left">Designed for life</span>
              <span className="obsession-tag top-right">Usability</span>
            </div>
            <div className="obsession-img-wrapper">
              <img className="on-image-two" src={plptwo} alt="Cooking" />
              <span className="obsession-tag bottom">Effortless function</span>
            </div>
          </div>
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
            <p className="clr-all" onClick={() => setTempMobileFilters({})}>
              clear all
            </p>
          </div>

          {/* {filters &&
            Object.entries(filters).map(([filterKey, values]) =>
              renderFilterGroup(
                filterKey.replace(/_/g, " "),
                values,
                filterKey,
                true
              )
            )} */}
          {filters && (
            <>
              {filters.categories &&
                renderCategoryFilter(filters.categories, true)}

              {filters.price_filter &&
                renderPriceFilter(filters.price_filter, true)}

              {filters.discount_filter &&
                renderDiscountFilter(filters.discount_filter, true)}

              {filters.product_filter &&
                Object.entries(filters.product_filter).map(([key, values]) =>
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

export default ProductsPage;
