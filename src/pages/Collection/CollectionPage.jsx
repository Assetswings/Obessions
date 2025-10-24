import React, { useEffect, useState } from "react";
import "./CollectionPage.css";
import Footer from "../../components/Footer/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCollections } from "./collectionsSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Breadcrumbs from "../../components/Breadcum/Breadcrumbs";
import { SlidersHorizontal, X } from "lucide-react";

const CollectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [expandedCats, setExpandedCats] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false); // NEW: mobile filter modal state
  const [tempMobileFilters, setTempMobileFilters] = useState({});
  const slug = location.state?.slug;
  const { items: collections, loading, error } = useSelector(
    (state) => state.collections
  );

  useEffect(() => {
    document.title = "Obsession - Collections";
    if (slug) {
      dispatch(fetchCollections(slug));
    } else {
      dispatch(fetchCollections());
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isFilterOpen]);
  const toggleShowMore = (catIdx) => {
    setExpandedCats((prev) => ({
      ...prev,
      [catIdx]: !prev[catIdx],
    }));
  };

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  const breadcrumbPaths = [
    { label: "Collections", to: "" }, // last one (no link)
  ];
  return (
    <>
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="collection-container">
        {/* 🧱 Sidebar */}
        <aside className="sidebar">
          <h3>
            {loading ? <Skeleton height={24} width={120} /> : "COLLECTIONS"}
          </h3>

          {loading
            ? // 🟡 Sidebar Skeleton
            Array.from({ length: 5 }).map((_, idx) => (
              <div className="category-group" key={idx}>
                <Skeleton height={18} width={150} style={{ marginBottom: 10 }} />
                <ul>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i}>
                      <Skeleton height={14} width={120} style={{ marginBottom: 6 }} />
                    </li>
                  ))}
                </ul>
                <Skeleton height={14} width={100} style={{ marginTop: 6 }} />
              </div>
            ))
            : // 🟢 Actual Sidebar Data
            collections?.categories?.map((cat, idx) => {
              const showAll = expandedCats[idx] || false;
              const totalSubcats = cat.subcategories?.length || 0;
              const subcategories = showAll
                ? cat.subcategories
                : cat.subcategories?.slice(0, 5);
              const hiddenCount = totalSubcats > 5 ? totalSubcats - 5 : 0;
              return (
                <div
                  key={idx}
                  className="category-group pointer-crusser"
                >
                  <Link to={`/products/${cat.action_url}`}>
                    <h4>{cat.name}</h4>
                  </Link>
                  <ul>
                    {subcategories?.map((item, i) => (
                      <li
                        key={item.id || i}
                      >
                        <Link to={`/products/${cat.action_url}/${item.action_url}`}>{item.name}</Link>
                      </li>
                    ))}
                  </ul>
                  {hiddenCount > 0 && (
                    <div
                      className="show-more-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleShowMore(idx);
                      }}
                    >
                      {showAll ? (
                        <>
                          <span className="symbol">−</span> Show Less
                        </>
                      ) : (
                        <>
                          <span className="symbol">+</span> Show More (
                          {hiddenCount})
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </aside>

        {/* 🖼️ Main Products Grid */}
        <main className="products-grid">
          {/* <div className="track_filter">
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
          </div> */}
          {loading
            ? // 🔄 Product Grid Skeleton
            Array.from({ length: 8 }).map((_, idx) => (
              <div className="product-card" key={idx}>
                <Skeleton height={480} style={{ marginBottom: 10 }} />
                <Skeleton height={16} width={140} />
              </div>
            ))
            : // ✅ Actual Products
            collections?.collections?.map((product, index) => (
              <div
                className="product-card pointer-crusser"
                key={index}
              >
                <Link to={`/products/${product.action_url}`}>
                  <img src={product.uploaded_media} alt={product.name} />
                  <p>{product.name}</p>
                </Link>
              </div>
            ))}
          <div className="mb-4"></div>
        </main>
      </div>

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
          {collections?.categories?.map((cat, idx) => {
            const showAll = expandedCats[idx] || false;
            const totalSubcats = cat.subcategories?.length || 0;
            const subcategories = showAll
              ? cat.subcategories
              : cat.subcategories?.slice(0, 5);
            const hiddenCount = totalSubcats > 5 ? totalSubcats - 5 : 0;
            return (
              <div
                key={idx}
                className="category-group pointer-crusser"
              >
                <Link to={`/products/${cat.action_url}`}>
                  <h4>{cat.name}</h4>
                </Link>
                <ul>
                  {subcategories?.map((item, i) => (
                    <li
                      key={item.id || i}
                    >
                      <Link to={`/products/${cat.action_url}/${item.action_url}`}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
                {hiddenCount > 0 && (
                  <div
                    className="show-more-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleShowMore(idx);
                    }}
                  >
                    {showAll ? (
                      <>
                        <span className="symbol">−</span> Show Less
                      </>
                    ) : (
                      <>
                        <span className="symbol">+</span> Show More (
                        {hiddenCount})
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {/* {filters && (
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
          )} */}
        </div>
        {/* ✅ Sticky Footer Apply Button */}
        <div className="mobile-filter-footer">
          <button
            className="apply-filter-btn"
          // onClick={() => {
          //   setSelectedFilters(tempMobileFilters);
          //   setIsFilterOpen(false);
          // }}
          >
            APPLY
          </button>
        </div>
      </div>

      {/* 🔻 Footer Section */}
      <Footer />
    </>
  );
};

export default CollectionPage;
