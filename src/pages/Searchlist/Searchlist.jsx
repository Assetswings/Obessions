import React, { useEffect, useState } from "react";
// import "./ProductsPage.css";
import "../Products/ProductsPage.css";
import { useDispatch, useSelector } from "react-redux";
import productsSlice, { fetchProducts } from "../Products/productsSlice";
import { Expand, Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductQuickViewModal from "../Products/ProductQuickViewModal";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "../../components/Wishtlist/WishlistSlice";
import { fetchSearchResults, clearSearchResults } from "../Home/searchSlice";
import { toast } from "react-hot-toast";
import { Player } from "@lottiefiles/react-lottie-player";
import heartAnimation from "../../assets/icons/Heart.json";
import LoginPromptModal from "../../components/LoginModal/LoginPromptModal";
import Footer from "../../components/Footer/Footer";
import { fetchTopPicks } from "../Products/otherproductSlice";

const Searchlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category;
  const query = location.state?.query;
  const subcategory = location.state?.subcategory;
  console.log("the query come from---->", query);

  const searchState = useSelector((state) => state.search || {});
  const { results = [], filters, loading } = searchState;
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [animatedWish, setAnimatedWish] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { items } = useSelector((state) => state.toppick);

  useEffect(() => {
    document.title = "Obsession - Search Item List";
    dispatch(fetchTopPicks());
  }, [dispatch]);

  useEffect(() => {
    if (!query.trim()) {
      dispatch(clearSearchResults());
      return;
    }
    const timeoutId = setTimeout(() => {
      dispatch(fetchSearchResults(query));
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query, dispatch]);

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
          dispatch(
            fetchProducts({ category, subcategory, page: 1, limit: 20 })
          );
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
          hideProgressBar: true,
          closeButton: true,
          icon: true,
        });
        setAnimatedWish(product.id);
        dispatch(fetchProducts({ category, subcategory, page: 1, limit: 20 }));
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

  return (
    <>
      <div className="custom-products-page">
        {(loading || results?.length > 0) && (
          <aside className="custom-filters">
            <h2 className="title_prd_roots">
              {/* {subcategory ? formatTitle(subcategory) : formatTitle(category)} */}
            </h2>
            <div className="root_devider_flt">
              <h2>Filters</h2>
              <p className="clr-all" onClick={() => setSelectedFilters({})}>
                clear all
              </p>
            </div>

            {loading ? (
              <>
                <Skeleton
                  height={24}
                  width={140}
                  style={{ marginBottom: 10 }}
                />
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
                renderFilterGroup(
                  filterKey.replace(/_/g, " "),
                  values,
                  filterKey
                )
              )
            )}
          </aside>
        )}

        <main className="custom-product-list">
          {Array.isArray(results) && (
            <div className="custom-products-grid">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
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
              ) : results?.length === 0 ? (
                <div className="no-results">
                  <p>No results found</p>
                </div>
              ) : (
                results.map((item) => {
                  const isWishlisted = item.is_wishlisted;
                  return (
                    <div
                      key={item.id}
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

                        {/* wishlist_track */}
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
                })
              )}
            </div>
          )}
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

      {/* <section className="top-picks-section">
        <h2 className="top-picks-heading">Don’t miss these top picks.</h2>
        <div className="top-picks-grid">
          {items.map((item) => (
            <div key={item.id} className="top-pick-card">
              <img
                src={item.media}
                alt={item.name}
                className="top-pick-image"
              />
              <p className="top-pick-title">{item.name}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* Fotter section  */}
      <Footer />
    </>
  );
};

export default Searchlist;
