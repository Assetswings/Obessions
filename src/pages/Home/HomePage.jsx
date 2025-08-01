import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./HomePage.css";
import BestsellersSlider from "../../components/slider/BestsellersSlider";
import VideoSection from "../../components/InstaVideo/VideoSection";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData } from "./homeSlice";

/* ─── Hero + Collection assets ─── */
import image1 from "../../assets/images/Maskgroup-1.png";
import image2 from "../../assets/images/Maskgroup-2.png";
import image3 from "../../assets/images/Maskgroup-3.png";
import image4 from "../../assets/images/Maskgroup.png";
import livingroomLeft from "../../assets/images/livingroomLeft.png";
import livingroomRight from "../../assets/images/livingroomRight.png";

/* ─── Shop-By thumbnails (replace with your own) ─── */
import shopThumb1 from "../../assets/images/shopthump.png";
import shopThumb2 from "../../assets/images/shopthump.png";
import shopThumb3 from "../../assets/images/shopthump.png";
import shopThumb4 from "../../assets/images/shopthump.png";
import shopThumb5 from "../../assets/images/shopthump.png";
import shopThumb6 from "../../assets/images/shopthump.png";
import Tableimage from "../../assets/images/Kitchen1.png";

// image for table_flat_overview
import flat1 from "../../assets/images/Table_image1.png";
import flat2 from "../../assets/images/Table_image2.png";
import flat3 from "../../assets/images/Table_image3.png";

//Carpet_teack
import carpet1 from "../../assets/images/carpet1.png";
import carpet2 from "../../assets/images/carpet2.png";
import carpet3 from "../../assets/images/carpet3.png";
import carpet4 from "../../assets/images/carpet4.png";
import carpet5 from "../../assets/images/carpet5.png";
import carpet6 from "../../assets/images/carpet6.png";
import carpet7 from "../../assets/images/carpet7.png";
import carpet8 from "../../assets/images/carpet8.png";

//image for floorsection
import FloorDesign1 from "../../assets/images/FloorDesign1.png";
import FloorDesign2 from "../../assets/images/FloorDesign2.png";
import FloorDesign3 from "../../assets/images/FloorDesign3.png";
import FloorDesign4 from "../../assets/images/FloorDesign4.png";
import FloorDesign5 from "../../assets/images/FloorDesign5.png";
import FloorDesign6 from "../../assets/images/FloorDesign6.png";

// image of Obsessed
import obsimage1 from "../../assets/images/Obsessed1.png";
import obsimage2 from "../../assets/images/Obsessed2.png";
import obsimage3 from "../../assets/images/Obsessed3.png";
import obsimage4 from "../../assets/images/Obsessed4.png";
import obsimage5 from "../../assets/images/Obsessed5.png";
import obsimage6 from "../../assets/images/Obsessed6.png";
import obsimage7 from "../../assets/images/Obsessed7.png";
import obsimage8 from "../../assets/images/Obsessed8.png";

// video section
import videoimage from "../../assets/images/videoimage.png";
import { Search } from "lucide-react";



const shopByItems = [
  {
    label: "Design",
    thumbs: [shopThumb1, shopThumb2, shopThumb3],
    url: "/category",
  },
  {
    label: "Dustbins",
    thumbs: [shopThumb4, shopThumb5, shopThumb6],
    url: "/room",
  },
  { label: "Bath Care", thumbs: [shopThumb1, shopThumb4, shopThumb2] },
  { label: "Bestsellers", thumbs: [shopThumb2, shopThumb5, shopThumb3] },
  { label: "New Arrivals", thumbs: [shopThumb3, shopThumb6, shopThumb4] },
  {
    label: "End of Seasonal Sale",
    thumbs: [shopThumb1, shopThumb2, shopThumb3],
    sale: true,
    url: "/sale",
  },
];



  const floatingImages = [
  { id: 1, src: FloorDesign1, className: "imgf1" },
  { id: 2, src: FloorDesign2, className: "imgf2" },
  { id: 3, src: FloorDesign3, className: "imgf3" },
  { id: 4, src: FloorDesign4, className: "imgf4" },
  { id: 5, src: FloorDesign5, className: "imgf5" },
  { id: 6, src: FloorDesign6, className: "imgf6" },
];



const HomePage = () => {

   const token = localStorage.getItem('token');
    console.log("token----->",token); 
    
  const [active, setActive] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🏠 Home Data Fetching
  const { data, loading, error } = useSelector((state) => state.home);
  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);
  
  useEffect(() => {
    if (data) {
      console.log("📦 Full Home Data:", data);
      console.log("🎯 Hero Banners:", data.hero_banner_categories);
      console.log("🖼️ Banner Sections:", data.banners);
      console.log("🔥 Best Sellers:", data.bestSellers);
    }
  }, [data]);

  // 🧭 Navigation Page
  const handleNavigate = () => {
    navigate("/collection");
  };

         const handleCategoryClick = (categorySlug) => {
         navigate("/products", { state: { category: categorySlug } });
    };
   
  //🖼️ Image fetcing for LIVE_THE_ART_OF_HOME
  const images_live_art = data?.banners?.LIVE_THE_ART_OF_HOME || [];
  const leftImage = images_live_art.find((img) => img.sequence === 1)?.media;
  const rightImage = images_live_art.find((img) => img.sequence === 2)?.media;

  //SALE ON THE TABLE
  const saleTableData = data?.banners?.SALE_ON_THE_TABLE || [];
  const tableSectionImage = saleTableData[0];
  const promoData = saleTableData.slice(1);

  // Carpet BY SECTION
    const carpetCategories = data?.banners?.CARPET_FOR_EVERY_SPOT?.map((item) => ({
    id: item.id,
    title: item.name,
    image: item.media,
    link: item.action_url,
  })) || [];

   //OBSESSED_RIGHT_NOW section 
    const obsessedItems = data?.banners?.OBSESSED_RIGHT_NOW?.map((item) => ({
    id: item.id,
    src: item.media,
    title: item.name || "", 
  })) || [];


  return (
    <>
        {/* ───────────────────── HERO ───────────────────── */}
      <div className="homepage container-fluid position-relative p-5">
        <img src={image4} className="floating-img img-left" alt="" />
        <h1 className="display-1 bold position-absolute obsessions-text">
          obsessions
        </h1>

        {/* Floating Images */}
        <img src={image3} className="floating-img img-top" alt="" />
        <img src={image1} className="floating-img img-center" alt="" />
        <img src={image2} className="floating-img img-right" alt="" />

        {/* Category List */}
        {/* <ul
          onClick={handleNavigateto}
          className="list-unstyled position-absolute category-list text-uppercase small">
          {data?.hero_banner_categories?.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul> */}

<ul className="list-unstyled position-absolute category-list text-uppercase small">
      {data?.hero_banner_categories?.map((item) => (
        <li key={item.id} onClick={() => handleCategoryClick(item.action_url)}>
          {item.name}
        </li>
      ))}
    </ul>
        {/* Description */}
        <div className="position-absolute description text-secondary">
          <p>
            We believe home is more than just a place. It's a feeling. That’s
            why we design enduring products that strike the perfect balance
            between charm and practicality.
          </p>
        </div>

        {/* Search */}
        <div className="position-absolute search-wrapper d-flex bg-white rounded shadow">
          {/* <select className="form-select border-0 rounded-5 sltfector">
            <option>CATEGORY</option>
          </select> */}
          <input
            type="text"
            className="form-control border-0 rounded-5 input_home"
            placeholder="WHAT ARE YOU LOOKING FOR?"
          />
          <button className="btn btn-dark rounded-5 button_search">
            <Search strokeWidth={1.25} />
          </button>
        </div>

        {/* Footer */}
        <div className="txt_dynamic_betlt">
          <p className="position-absolute footer-note text-center small">
            <span>
              <img
                src="https://i.ibb.co/qL71DQj5/icon.png"
                className="img_turner"
              />{" "}
              &nbsp;
            </span>{" "}
            Good design doesn’t ask for attention; it earns it.
          </p>
        </div>
      </div>

      {/* ────────────────── 🐉 💎💎🥀 COLLECTION  🥀💎💎 🐉────────────────── */}
      <section className="section_collection position-relative d-flex justify-content-center align-items-center">
        <div className="collection-content text-center">
          <h2 className="tagline">
            <em>Live the Art</em>
            <br />
            of&nbsp;Home
          </h2>
          <p className="lead-copy">
            Every room tells a story, and the pieces you bring into it become
            part of the narrative. At Obsessions, we design and curate products
            that strike the perfect balance between charm and practicality.
          </p>
          <button onClick={handleNavigate} className="hero-button">
            CHECK OUR COLLECTION
          </button>
        </div>
        <img src={leftImage} className="collection-img img-left" alt="" />
        <img src={rightImage} className="collection-img img-right" alt="" />
      </section>

      {/* ────────────────── 🥀💎💎 🐉 SHOP BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section className="shopby py-5">
        <p className="shopby-title text-uppercase mb-4 txt_shopby">Shop by</p>

        <ul className="shopby-list">
          {shopByItems.map((item, i) => (
            <li
              key={item.label}
              className={`
                shopby-item
                ${item.sale ? "sale" : ""}
                ${active === i ? "is-active" : ""}
              `}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => item.url && (window.location.href = item.url)}
            >
              {/* Thumbnails */}
              <div className="thumb-bar">
                {item.thumbs.map((src, idx) => (
                  <img src={src} alt="" key={idx} />
                ))}
              </div>
              {/* Text label */}
              <span className="shopby-label">{item.label}</span>
              {/* VIEW tag */}
              <span className="view-tag">View</span>
            </li>
          ))}
        </ul>
      </section>
      {/* ────────────────── 🥀💎💎 🐉 BestsellersSlider BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section className="bestsellersSlider">
        <BestsellersSlider />
      </section>
      {/* ────────────────── 🥀💎💎 🐉 Tablesection BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section className="tabletop">
        <div className="hero-container">
          <div className="hero-text">
            <h1>SALE ON THE TABLE</h1>
            <p>
              Stylish tabletop finds now discounted for meals & special moments.
            </p>
            <button className="hero-button">ELEVATE YOUR TABLETOP</button>
          </div>

          <div className="hero-image">
            {tableSectionImage && (
              <img
                src={tableSectionImage.media}
                alt={tableSectionImage.name || "Kitchen Utensils"}
              />
            )}
          </div>
        </div>
      </section>

      {/* ────────────────── 🥀💎💎 🐉 flat_overview BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section className="flat_overview"> 
  <div className="promo-section">
    {promoData.map((item) => (
      <div className="promo-card" key={item.id}>
        <img src={item.media} alt={item.name} className="promo-image" />
        <p className="promo-title">{item.name}</p>
      </div>
    ))}
  </div>
</section>
      {/* ────────────────── 🥀💎💎 🐉 Carpet BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section>
  <div className="carpet-section">
    <h2 className="carpet-heading">
      Carpet for <em>Every Spot</em>
    </h2>
    <div className="carpet-grid">
      {carpetCategories.map((item) => (
        <div
          key={item.id}
          className="carpet-tile"
          style={{ backgroundImage: `url(${item.image})` }}
        >
          <div className="carpet-label">{item.title}</div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ────────────────── 🥀💎💎 🐉 Floor BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section className="floor-matcher">
        {floatingImages.map((img) => (
          <img
            key={img.id}
            src={img.src}
            className={`floating-imgf ${img.className}`}
            alt=""
          />
        ))}
        <div className="matcher-content">
          <h2>
            Let’s Find Your <br /> <em>Floor’s Best Friend</em>
          </h2>
          <p>
            Your style, your space, your vibe. We’ll help you match it with the
            right floor covering.
          </p>
          <button className="matcher-btn">TRY FLOOR MATCHER</button>
        </div>
      </section>

      {/* ────────────────── 🥀💎💎 🐉 Floor BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section className="obsessed-section">
        <h2>
          <em>Obsessed</em> Right Now
        </h2>
        <div className="obsessed-grid">
          {obsessedItems.map((item, idx) => (
            <div className="obsessed-card" key={idx}>
              <img src={item.src} alt={item.title} />
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ────────────────── 🥀💎💎 🐉 video BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section>
        <VideoSection />
      </section>

      {/* ────────────────── 🥀💎💎 🐉 OUR OBSESSIONS BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section className="obsession-section">
        <h2 className="obsession-title">OUR OBSESSIONS</h2>
        <div className="obsession-content">
          <div className="obsession-image">
            <img src={videoimage} className="img_video_track" alt="Our team" />
          </div>
          <div className="obsession-text">
            <p>
              Because your home deserves more than just functional products. It
              deserves thoughtful design, lasting quality, and pieces that
              effortlessly blend into your lifestyle. At the heart of everything
              we offer is a commitment to intentional living; curated
              collections that not only look beautiful but serve a purpose in
              your day-to-day life.
            </p>
            <p>
              From elegant tableware that elevates your hosting game to clever
              storage solutions that bring order to your everyday, our range is
              crafted to add both utility and charm.
            </p>
            <p>
              Whether it’s a cozy carpet underfoot, a yoga mat that centers your
              day, or a waste bin that’s anything but ordinary, each product is
              chosen with care, designed to make your home feel more personal,
              more inspired, and more you.
            </p>
            <button className="matcher-btn">MORE ABOUT US</button>
          </div>
        </div>
      </section>

      {/* Footer setction  */}
      <Footer />
    </>
  );
};

export default HomePage;
