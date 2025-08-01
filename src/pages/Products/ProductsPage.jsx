import React, { useEffect, useState } from "react";
import "./ProductsPage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./productsSlice";
import { Expand, Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductQuickViewModal from "./ProductQuickViewModal";
import { addToWishlist } from "../../components/Wishtlist/WishlistSlice";


const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const category = location.state?.category;
  const subcategory = location.state?.subcategory;

  const {
    data: products,
    filters,
    loading,
  } = useSelector((state) => state.products);

  const wishlist = useSelector((state) => state.wishlist);

  const [selectedFilters, setSelectedFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Fetch products
  useEffect(() => {
    if (category) {
      dispatch(fetchProducts({ category, subcategory, page: 1, limit: 20 }));
    }
  }, [dispatch, category, subcategory]);

  // Fetch products with filters
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

  // // Fetch wishlist
  // useEffect(() => {
  //   dispatch(fetchWishlist());
  // }, [dispatch]);

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters((prev) => {
      const current = prev[filterKey] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [filterKey]: updated };
    });
  };

  const formatTitle = (text) => {
    return text
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
    <div className="custom-products-page">
      {/* Filters Sidebar */}
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

      {/* Product Grid */}
      <main className="custom-product-list">
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
            : products.map((item) => (
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
                    <img src={item.media} alt={item.name} />
                    <button
                      className="wishlist-btn_products"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(addToWishlist({ product_id: item.id }));
                      }}
                    >
                      <Heart
                        color={
                          wishlist.productIds.includes(item.id)
                            ? "red"
                            : "#000000"
                        }
                        fill={
                          wishlist.productIds.includes(item.id)
                            ? "red"
                            : "none"
                        }
                        size={20}
                        strokeWidth={2}
                      />
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
                        <Expand color="#000000" size={15} strokeWidth={1.25} />
                      </span>
                    </div>
                  </div>
                  <p className="custom-product-title">{item.name}</p>
                  <p className="custom-product-price">
                    ₹{item.selling_price}
                    {item.mrp && item.mrp !== item.selling_price && (
                      <>
                        <span className="custom-old-price">₹{item.mrp}</span>
                        <span className="custom-discount">
                          (-{item.discount_percent}%)
                        </span>
                      </>
                    )}
                  </p>
                </div>
              ))}
        </div>
      </main>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        show={showModal}
        onHide={() => setShowModal(false)}
        product={quickViewProduct}
      />
    </div>
  );
};

export default ProductsPage;
