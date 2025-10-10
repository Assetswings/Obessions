import React, { useEffect, useState } from "react";
import "./CollectionPage.css";
import Footer from "../../components/Footer/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCollections } from "./collectionsSlice";

const CollectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [expandedCats, setExpandedCats] = useState({});
  const slug = location.state?.slug;
  const { items: collections, loading, error, } = useSelector((state) => state.collections);
  useEffect(() => {
    if (slug) {
      dispatch(fetchCollections(slug));
    } else {
      dispatch(fetchCollections());
    }
  }, [dispatch, slug]);

  const handleCategoryClick = (categorySlug, subcategoryslug) => {
    navigate("/products", { state: { category: categorySlug, subcategory: subcategoryslug } });
  };

  const redirectProduct = (action_url) => {
    const parts = action_url.replace(/^\/+/, "").split("/");

    const categorySlug = parts[0];      // "bath Care"
    const subcategorySlug = parts[1];   // "bath Set"

    // Navigate with state
    navigate("/products", { state: { category: categorySlug, subcategory: subcategorySlug } });
  }

  const toggleShowMore = (catIdx) => {
    setExpandedCats((prev) => ({
      ...prev,
      [catIdx]: !prev[catIdx],
    }));
  };

  if (loading) return <p>Loading collections...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  return (
    <>
      <div className="collection-container">
        <aside className="sidebar">
          <h3>COLLECTIONS</h3>

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
                        <span className="symbol">+</span> Show More ({hiddenCount})
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </aside>
        {/* <aside className="sidebar">
          <h3>COLLECTIONS</h3>
          {collections?.categories?.map((cat, idx) => (
            <div key={idx} className="category-group pointer-crusser" onClick={() => handleCategoryClick(cat.action_url)}>
              <h4>{cat.name}</h4>
              <ul>
                {cat.subcategories?.map((item, i) => (
                  <li
                    key={item.id || i}
                    onClick={() => handleCategoryClick(item.action_url)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside> */}
        <main className="products-grid">
          {collections?.collections?.map((product, index) => (
            <div className="product-card pointer-crusser" key={index} onClick={() => redirectProduct(product.action_url)}>
              <img src={product.uploaded_media} alt={product.name} />
              <p>{product.name}</p>
            </div>
          ))}
          <div className="mb-4">

          </div>
        </main>
      </div>
      {/* Fotter section  */}
      <Footer />
    </>
  );
};

export default CollectionPage;
