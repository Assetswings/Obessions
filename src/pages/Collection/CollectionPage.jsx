import React, { useEffect } from "react";
import "./CollectionPage.css";
import Footer from "../../components/Footer/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCollections } from "./collectionsSlice";

const CollectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const location = useLocation();
    const slug = location.state?.slug;
  const {items: collections,loading,error,} = useSelector((state) => state.collections);
  useEffect(() => {
    console.log(slug);
    
    if(slug){
      dispatch(fetchCollections(slug));
    }else{
      dispatch(fetchCollections());
    }
  }, [dispatch,slug]);
  
  const handleCategoryClick = (categorySlug) => {
    navigate("/products", { state: { category: categorySlug } });
  };

  if (loading) return <p>Loading collections...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  return (
    <>
      <div className="collection-container">
        <aside className="sidebar">
          <h3>COLLECTIONS</h3>
          {collections?.categories?.map((cat, idx) => (
            <div key={idx} className="category-group" onClick={() => handleCategoryClick(cat.action_url)}>
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
        </aside>
        <main className="products-grid">
          {collections?.collections?.map((product, index) => (
            <div className="product-card" key={index} onClick={() => handleCategoryClick(product.action_url)}>
              <img src={product.uploaded_media} alt={product.name} />
              <p>{product.name}</p>
            </div>
          ))}
        </main>
      </div>
      {/* Fotter section  */}
      <Footer />
    </>
  );
};

export default CollectionPage;
