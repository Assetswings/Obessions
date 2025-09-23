import React, { useState, useEffect ,useRef} from "react";
import { FaSearch } from "react-icons/fa";
import "./HomePage.css";
import BestsellersSlider from "../../components/slider/BestsellersSlider";
import VideoSection from "../../components/InstaVideo/VideoSection";
import Footer from "../../components/Footer/Footer";
// import { search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData } from "./homeSlice";
import { fetchSearchResults, clearSearchResults } from "./searchSlice";
import emtyimage from "../../assets/images/empty.jpg";
import ProductQuickViewModal from "../Products/ProductQuickViewModal";
import { useNavigate, useLocation } from "react-router-dom";

/* ─── Hero + Collection assets ─── */
import image1 from "../../assets/images/Maskgroup-1.png";
import image2 from "../../assets/images/Maskgroup-2.png";
import image3 from "../../assets/images/Maskgroup-3.png";
import image4 from "../../assets/images/Maskgroup.png";
import logo from "../../assets/icons/Obslogo.png";
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

//image for floorsection
import FloorDesign1 from "../../assets/images/FloorDesign1.png";
import FloorDesign2 from "../../assets/images/FloorDesign2.png";
import FloorDesign3 from "../../assets/images/FloorDesign3.png";
import FloorDesign4 from "../../assets/images/FloorDesign4.png";
import FloorDesign5 from "../../assets/images/FloorDesign5.png";
import FloorDesign6 from "../../assets/images/FloorDesign6.png";

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
  const token = localStorage.getItem("token");
  // console.log("token----->", token);
  const [active, setActive] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [query, setQuery] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [shopByItems, setShopByItems] = useState([]);
  const [randomSet, setRandomSet] = useState(null);
  const [currentSet, setCurrentSet] = useState(null);
  const [nextSet, setNextSet] = useState(null);
  const [setIndex, setSetIndex] = useState(null);
  console.log("mmmmmm---->", setIndex);
  // console.log("query---->", query);
  // 🏠 Home Data Fetching
  const { data } = useSelector((state) => state.home);
  const searchState = useSelector((state) => state.search || {});
  const { results = [], loading, error } = searchState;

  // console.log("🔥fffffff::::::::", results);
  // Pick random hero set whenever HomePage mounts

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
    dispatch(fetchHomeData());
  }, [dispatch]);

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(fetchSearchResults(query));
    } else {
      dispatch(clearSearchResults());
    }
  };

  useEffect(() => {
    if (data) {
      if (data.shop_by) {
        const formattedItems = Object.entries(data.shop_by).map(
          ([key, value]) => {
            return {
              label: formatLabel(key),
              thumbs: value.map((v) => v.media),
              url: value[0]?.action_url ? `${value[0].action_url}` : null,
              sale: key.toLowerCase().includes("sale"),
            };
          }
        );
        setShopByItems(formattedItems);
      }
    }
  }, [data]);

  function formatLabel(key) {
    return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // 🧭 Navigation Page
  const handleNavigate = () => {
    navigate("/collections");
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
  const carpetCategories =
    data?.banners?.CARPET_FOR_EVERY_SPOT?.map((item) => ({
      id: item.id,
      title: item.name,
      image: item.media,
      link: item.action_url,
    })) || [];

  //OBSESSED_RIGHT_NOW section
  const obsessedItems =
    data?.banners?.OBSESSED_RIGHT_NOW?.map((item) => ({
      id: item.id,
      src: item.media,
      title: item.name || "",
      url: item.action_url,
    })) || [];

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setShowModal(true);
  };

  const handelpdp = (categorySlug) => {
    if (categorySlug) {
      navigate("/products", {
        state: {
          category: categorySlug,
        },
      });
    }
  };

  const handelcollectionDetails = (categorySlug) => {
    if (!categorySlug) return;
    // remove leading slash just in case
    const cleanSlug = categorySlug.startsWith("/")
      ? categorySlug.slice(1)
      : categorySlug;

    if (cleanSlug === "collections") {
      // case: only /collections
      navigate("/collections");
    } else if (cleanSlug.startsWith("collections/")) {
      // case: /collections/some-slug
      const slug = cleanSlug.split("/")[1];
      navigate("/collections", { state: { slug: slug } });
    } else {
      // fallback if anything unexpected
      navigate("/collections");
    }
  };

  const handelcarpet = () => {
    navigate("/carpet-finder");
  };

  useEffect(() => {
    if (data?.hero_banners) {
      const sets = Object.values(data.hero_banners);
      const randomIndex = Math.floor(Math.random() * sets.length);
      const chosenSet = sets[randomIndex];

      setSetIndex(randomIndex);
      setNextSet(chosenSet); // load into nextSet

      const timer = setTimeout(() => {
        setCurrentSet(chosenSet);
        setNextSet(null);
      }, 600); // must match CSS animation time

      return () => clearTimeout(timer);
    }
  }, [data, location.pathname]); // runs when data loads or you come back

  const renderImages = (set, extraClass = "") => {
    if (!set) return null;

    const centerImg = set.find((img) => img.sequence === 1)?.media;
    const leftImg = set.find((img) => img.sequence === 2)?.media;
    const rightImg = set.find((img) => img.sequence === 3)?.media;
    const topImg = set.find((img) => img.sequence === 4)?.media;

    return (
      <>
        {centerImg && (
          <img
            src={centerImg}
            className={`floating-img img-center ${extraClass}`}
            alt="center"
          />
        )}
        {leftImg && (
          <img
            src={leftImg}
            className={`floating-img img-left ${extraClass}`}
            alt="left"
          />
        )}
        {rightImg && (
          <img
            src={rightImg}
            className={`floating-img img-right ${extraClass}`}
            alt="right"
          />
        )}
        {topImg && (
          <img
            src={topImg}
            className={`floating-img img-top ${extraClass}`}
            alt="top"
          />
        )}
      </>
    );
  };

   useEffect(() => {
  if (isSearchActive) {
    // 🔒 Lock scroll when search is active
    document.body.style.overflow = "hidden";
  } else {
    // 🔓 Unlock scroll when search is closed
    document.body.style.overflow = "";
  }

  // cleanup just in case
  return () => {
    document.body.style.overflow = "";
  };
}, [isSearchActive]);

  const handleFocus = () => {
    setIsSearchActive(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
  
        const rect = inputRef.current.getBoundingClientRect();
        const scrollY =
          window.scrollY + rect.top - window.innerHeight / 3;
  
        window.scrollTo({
          top: scrollY,
          behavior: "smooth",
        });
      }
    }, 300);
  };


  return (
    <>
      {/* ───────────────────── HERO ───────────────────── */}
      <div className="homepage container-fluid position-relative p-5">
        <img src={logo} className="floating-img img-left-logo" alt="" />
        <h1 className="display-1 bold position-absolute obsessions-text">
          obsessions
        </h1>
        {/* Current visible set */}
        <div className={`${setIndex !== null ? `set-${setIndex}` : ""}`}>
          {renderImages(currentSet, "fade-in")}
          {renderImages(nextSet, "fade-out")}
        </div>

        <ul className="list-unstyled position-absolute category-list text-uppercase">
          {data?.hero_banner_categories?.map((item) => (
            <li
              key={item.id}
              onClick={() => handleCategoryClick(item.action_url)}>
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

        {/* <div
          className={`search-wrapper bg-white rounded shadow ${
            isSearchActive ? "active" : ""
          }`}
        >
          <div className="d-flex">
            <input
              type="text"
              className="form-control border-0 rounded-5 input_home"
              placeholder="WHAT ARE YOU LOOKING FOR?"
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsSearchActive(true)}
              value={query}
            />
            <button
              className="btn btn-dark rounded-5 button_search"
              disabled={!query?.trim()}
              onClick={() =>
                navigate("/searchlist", {
                  state: { query: query },
                })
              }
            >
              <Search strokeWidth={1.25} />
            </button>
          </div>
          {isSearchActive && Array.isArray(results) && results.length > 0 && (
            <>
              <div className="search-results-grid">
                {results.slice(0, 8).map((item, index) => (
                  <div
                    key={index}
                    className="search-card"
                    onClick={(e) => {
                      navigate("/productsdetails", {
                        state: { product: item.action_url },
                      });
                    }}
                  >
                    <img
                      src={item.media_list?.main?.file}
                      alt={item.name}
                      className="search-card-img"
                    />
                    <div className="search-card-body">
                      <h6 className="search-card-title">
                        {" "}
                        {item.name.split(" ").slice(0, 5).join(" ")}
                      </h6>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div> */}

<div
      className={`search-wrapper bg-white rounded shadow ${
        isSearchActive ? "active" : ""
      }`}
    >
      <div className="d-flex">
        <input
          ref={inputRef}
          type="text"
          className="form-control border-0 rounded-5 input_home"
          placeholder="WHAT ARE YOU LOOKING FOR?"
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          value={query}
        />
        <button
          className="btn btn-dark rounded-5 button_search"
          disabled={!query?.trim()}
          onClick={() =>
            navigate("/searchlist", {
              state: { query: query },
            })
          }
        >
          <Search strokeWidth={1.25} />
        </button>
      </div>

      {isSearchActive && Array.isArray(results) && results.length > 0 && (
        <div className="search-results-grid">
          {results.slice(0, 8).map((item, index) => (
            <div
              key={index}
              className="search-card"
              onClick={() =>
                navigate("/productsdetails", {
                  state: { product: item.action_url },
                })
              }
            >
              <img
                src={item.media_list?.main?.file}
                alt={item.name}
                className="search-card-img"
              />
              <div className="search-card-body">
                <h6 className="search-card-title">
                  {item.name.split(" ").slice(0, 5).join(" ")}
                </h6>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  

        {/* Overlay */}
        {isSearchActive && (
          <div
            className="search-overlay"
            onClick={() => setIsSearchActive(false)}
          />
        )}

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
      <section className="shopby ">
        <p className="shopby-title text-uppercase mb-4 txt_shopby">Shop by</p>

        <ul className="shopby-list">
          {shopByItems?.map((item, i) => (
            <li
              key={item.label}
              className={`
                shopby-item
                ${item.sale ? "sale" : ""}
                ${active === i ? "is-active" : ""}
              `}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => handelcollectionDetails(item.url)}
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
              <span
                className="view-tag"
                onClick={() => handelcollectionDetails(item.url)}
              >
                View
              </span>
            </li>
          ))}
        </ul>
      </section>
      {/* ────────────────── 🥀💎💎 🐉 BestsellersSlider BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section className="bestsellersSlider">
        <BestsellersSlider onQuickView={handleQuickView} />
      </section>
      {/* ────────────────── 🥀💎💎 🐉 Tablesection BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section className="tabletop">
        <div className="hero-container">
          <div className="hero-text">
            <h1>SALE ON THE TABLE</h1>
            <p>
              Stylish tabletop finds now discounted for meals & special moments.
            </p>
            <button
              className="hero-button"
              onClick={() =>
                navigate("/products", {
                  state: { category: tableSectionImage?.action_url },
                })
              }
            >
              ELEVATE YOUR TABLETOP
            </button>
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
            <div
              className="promo-card"
              key={item.id}
              onClick={() => handelpdp(item.action_url)}
            >
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
                onClick={() => handelpdp(item.link)}
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
          <button className="matcher-btn" onClick={handelcarpet}>
            TRY FLOOR MATCHER
          </button>
        </div>
      </section>

      {/* ────────────────── 🥀💎💎 🐉 Floor BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section className="obsessed-section">
        <h2>
          <em>Obsessed</em> Right Now
        </h2>
        <div className="obsessed-grid">
          {obsessedItems.map((item, idx) => (
            <div
              className="obsessed-card"
              key={idx}
              onClick={() =>
                navigate("/products", { state: { category: item.url } })
              }
            >
              <img className="img_right_now" src={item.src} alt={item.title} />
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
            <button
              className="matcher-btn"
              onClick={() => navigate("/about-us")}
            >
              MORE ABOUT US
            </button>
          </div>
        </div>
      </section>

      {/* Footer setction  */}
      <Footer />
      <ProductQuickViewModal
        show={showModal}
        onHide={() => setShowModal(false)}
        product={quickViewProduct}
      />
    </>
  );
};

export default HomePage;
