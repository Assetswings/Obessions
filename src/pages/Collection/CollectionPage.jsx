import React, { useEffect, useState } from "react";
import "./CollectionPage.css";
import Footer from "../../components/Footer/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCollections } from "./collectionsSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CollectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [expandedCats, setExpandedCats] = useState({});
  const slug = location.state?.slug;
  const { items: collections, loading, error } = useSelector(
    (state) => state.collections
  );

  useEffect(() => {
    if (slug) {
      dispatch(fetchCollections(slug));
    } else {
      dispatch(fetchCollections());
    }
  }, [dispatch, slug]);

  const handleCategoryClick = (categorySlug, subcategoryslug) => {
    navigate("/products", {
      state: { category: categorySlug, subcategory: subcategoryslug },
    });
  };

  const toggleShowMore = (catIdx) => {
    setExpandedCats((prev) => ({
      ...prev,
      [catIdx]: !prev[catIdx],
    }));
  };

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <>
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
                    onClick={() => handleCategoryClick(cat.action_url, null)}
                  >
                    <h4>{cat.name}</h4>
                    <ul>
                      {subcategories?.map((item, i) => (
                        <li
                          key={item.id || i}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(cat.action_url, item.action_url);
                          }}
                        >
                          {item.name}
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
                  onClick={() => handleCategoryClick(product.action_url)}
                >
                  <img src={product.uploaded_media} alt={product.name} />
                  <p>{product.name}</p>
                </div>
              ))}
          <div className="mb-4"></div>
        </main>
      </div>

      {/* 🔻 Footer Section */}
      <Footer />
    </>
  );
};

export default CollectionPage;
