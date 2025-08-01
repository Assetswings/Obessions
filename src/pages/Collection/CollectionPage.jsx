import React from "react";
import "./CollectionPage.css";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    title: "BATH CARE",
    items: ["Bath Mat", "Bath Set", "Shower Curtain", "Soap Dish", "Tumbler", "Soap Dispenser", "Outdoor Mat", "Tray"],
  },
  {
    title: "DUST BINS",
    items: ["Open Bin", "Sensor Bin", "Step Bin", "Commercial Bin", "Kitchen Bin"],
  },
  {
    title: "FLOOR COVERINGS",
    items: ["Runner", "Carpet"],
  },
  {
    title: "KITCHEN",
    items: ["Counter Organizer", "Shelf Liner", "Soap Pump"],
  },
  {
    title: "ORGANISERS",
    items: ["Storage Basket"], 
  },
  {
    title: "TABLEWARE",
    items: ["Airtight Jar", "Fork Holder", "Napkin Holder", "Salt & Pepper", "Sugar Jar", "Toothpick Holder", "Wine Opener"],
  },
  {
    title: "YOGA MAT",
    items: ["Reversible Mat", "Yoga Pedia Mat", "Rejuvenating"],
  },
];

const products = [
  { name: "SHOWER CURTAIN", image: "https://i.ibb.co/C5HVC3t5/Frame-2621.png" },
  { name: "SENSOR BIN", image: "https://i.ibb.co/ZpwLkx5c/image-402.png" },
  { name: "YOGA MATS", image: "https://i.ibb.co/G41nGryv/pexels-elly-fairytale-3823076-1.png" },
  { name: "SOAP DISPENSER", image: "https://i.ibb.co/pB01xVH1/image-404.png" },
  { name: "STORAGE BASKETS", image: "https://i.ibb.co/PsKcJNbm/image-406.png" },
  { name: "CARPET", image: "https://i.ibb.co/pvjnSGQD/image-411.png" }
];

  const CollectionPage = () => {
  const navigate = useNavigate();  

  const handleItemClick = (itemName) => {
  navigate("/products");
    };

    return (
     <> 
      <div className="collection-container">
      <aside className="sidebar">
        <h3>COLLECTIONS</h3>
        {categories.map((cat, idx) => (
          <div key={idx} className="category-group">
            <h4>{cat.title}</h4>
            <ul>
              {cat.items.map((item, i) => (
                <li key={i} onClick={() => handleItemClick(item)} >{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </aside>   
      <main className="products-grid">
        {products.map((product, index) => (
          <div className="product-card" key={index}>
            <img src={product.image} alt={product.name} />
            <p>{product.name}</p>
          </div>
        ))}
      </main>
    </div>
    {/* Fotter section  */}
      <Footer/>  
     </>
  );
};

export default CollectionPage;
 
 
