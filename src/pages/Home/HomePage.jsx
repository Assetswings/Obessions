import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./HomePage.css";
import BestsellersSlider from "../../components/slider/BestsellersSlider";
import VideoSection from "../../components/InstaVideo/VideoSection";
import Footer from "../../components/Footer/Footer";
import obslogo from "../../assets/icons/Obslogo.png";
// import { search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData } from "./homeSlice";
import { fetchSearchResults, clearSearchResults } from "./searchSlice";
import emtyimage from "../../assets/images/empty.jpg";
import ProductQuickViewModal from "../Products/ProductQuickViewModal";
import { useNavigate, useLocation, Link } from "react-router-dom";

// Dynamic image
import aniimage1 from "../../assets/icons/icon_box_ dynamic.png";
import aniimage2 from "../../assets/icons/icon_home_dynamic.png";
import aniimage3 from "../../assets/icons/icon_love_dynamic.png";

// video section
import videoimage from "../../assets/images/videoimage.png";
import { Search } from "lucide-react";
import useMeta from "../../app/useMeta";
import { useHeader } from "../../app/CartWishlistContext";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);



const items = [
  {
    icon: aniimage1,
    text: "Good design doesn’t ask for attention; it earns it.",
  },
  {
    icon: aniimage2,
    text: "Every corner deserves a little love.",
  },
  {
    icon: aniimage3,
    text: "Home isn’t built; it’s curated.",
  },
];


const HomePage = () => {
  const token = localStorage.getItem("token");
  const [active, setActive] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const homepageURL = `${window.location.origin}${location.pathname}`;
  useMeta(homepageURL);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [query, setQuery] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [shopByItems, setShopByItems] = useState([]);
  const [randomSet, setRandomSet] = useState(null);
  const [currentSet, setCurrentSet] = useState(null);
  const [nextSet, setNextSet] = useState(null);
  const [setIndex, setSetIndex] = useState(null);


  const [fade, setFade] = useState(false);
  const { data } = useSelector((state) => state.home);
  const searchState = useSelector((state) => state.search || {});
  const { results = [], loading, error } = searchState;
  const [currentIndex, setCurrentIndex] = useState(0);
  const searchSectionRef = useRef(null);
  const { setShowSearchIcon } = useHeader();
  const centerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const topRef = useRef(null);


    useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When section is visible => hide icon
        // When not visible => show icon
        setShowSearchIcon(!entry.isIntersecting);
      }, {
      threshold: 0.1, // triggers when 10% of element is visible
    }
    );
    if (searchSectionRef.current) {
      observer.observe(searchSectionRef.current);
    }
    return () => {
      if (searchSectionRef.current) {
        observer.unobserve(searchSectionRef.current);
      }
    };
  }, [setShowSearchIcon]);


  useEffect(() => {
    document.title = "Obsession - Home";
    if (!query.trim()) {
      dispatch(clearSearchResults());
      return;
    }
    dispatch(fetchSearchResults({ query }));
  }, [query, dispatch]);


  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

useEffect(() => {
  if (!data?.hero_banners) return;

  const setsFromAPI = Object.values(data.hero_banners);

  // Keep only sets that have all 4 sequences
  const validSets = setsFromAPI.filter((set) => {
    if (!Array.isArray(set)) return false;
    const sequences = set.map(img => img.sequence);
    return sequences.includes(1) && sequences.includes(2) && sequences.includes(3) && sequences.includes(4);
  });

  console.log("✅ Valid hero sets saved:", validSets.length);

  if (validSets.length) {
    localStorage.setItem("hero_all_sets", JSON.stringify(validSets));
  }
}, [data]);


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
      if (data?.hero_banner_categories) {
        localStorage.setItem('hero_banner_categories', JSON.stringify(data?.hero_banner_categories));
      }
      if (data?.logo_content) {
        localStorage.setItem('logo', data?.logo_content?.logo);
        localStorage.setItem('favicon', data?.logo_content?.favicon);
        setFavicon(data?.logo_content?.favicon);
      }
    }
  }, [data]);




  // scale image
  useEffect(() => {
    // ✅ disable on tablet & mobile
    if (window.innerWidth < 992) return;
    const obsessionSection = document.querySelector(".obsession-section");
    const obsessionImage = document.querySelector(".obsession-image img");
    if (!obsessionSection || !obsessionImage) return;
    const START_WIDTH = 75;  // %
    const END_WIDTH = 135;   // %
      const onScroll = () => {
      const rect = obsessionSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      let progress =
    (windowHeight - rect.top) / (windowHeight + rect.height);


      progress = Math.max(0, Math.min(1, progress));


      const width =
        START_WIDTH + (END_WIDTH - START_WIDTH) * progress;


      obsessionImage.style.width = `${width}%`;
    };


    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();


    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // parallax
  useEffect(() => {
    const images = document.querySelectorAll(".collection-img");


    let lastScrollY = window.scrollY;
    let currentOffset = 0;


    const MAX_OFFSET = 18;   // max px up/down
    const SPEED = 0.05;     // smaller = slower


    const onScroll = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY;


      // accumulate offset slowly
      currentOffset -= delta * SPEED;


      // clamp movement
      currentOffset = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, currentOffset));


      images.forEach((img) => {
        img.style.transform = `translateY(${currentOffset}px)`;
      });


      lastScrollY = scrollY;
    };


    window.addEventListener("scroll", onScroll, { passive: true });


    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);


      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 300); // fade-out before content changes


      setTimeout(() => {
        setFade(false);
      }, 600); // fade-in after content changes
    }, 5000);


    return () => clearInterval(interval);
  }, []);
  const setFavicon = (url) => {
    localStorage.setItem("favicon_url", url);


    const existingLink = document.querySelector("link[rel='icon']");
    if (existingLink) existingLink.remove();


    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = url;
    console.log(link);
    document.head.appendChild(link);
    console.log(document.head);
  };


  function formatLabel(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  
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

useEffect(() => {
  const cachedSets = localStorage.getItem("hero_all_sets");
  if (!cachedSets) return;

  const sets = JSON.parse(cachedSets);
  if (!sets.length) return;

  // pick a random set every time you enter the page
  let index = Math.floor(Math.random() * sets.length);
  localStorage.setItem("hero_set_index", index);

  setSetIndex(index);
  setCurrentSet(sets[index]);
}, [location.key]); // reruns whenever you navigate pages

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
            ref={centerRef}
            src={centerImg}
            className={`floating-img img-center ${extraClass}`}
            alt="center"
          />
        )}
        {leftImg && (
          <img
            ref={leftRef}
            src={leftImg}
            className={`floating-img img-left ${extraClass}`}
            alt="left"
          />
        )}
        {rightImg && (
          <img
            ref={rightRef}
            src={rightImg}
            className={`floating-img img-right ${extraClass}`}
            alt="right"
          />
        )}
        {topImg && (
          <img
            ref={topRef}
            src={topImg}
            className={`floating-img img-top ${extraClass}`}
            alt="top"
          />
        )}
      </>
    );
  };

  useLayoutEffect(() => {
    if (!centerRef.current) return;
    // Center card → goes up **and slightly right**
    gsap.to(centerRef.current, {
      y: -480,
      // x: 60,
      // rotate: 15,
      scale: 1.32,
      ease: "power3.out",
      scrollTrigger: {

        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });


    // Left card → goes up and **more left**, rotates opposite
    gsap.to(leftRef.current, {
      y: -420,
      // x: -130,
      // rotate: -28,
      scale: 1.25,
      ease: "power2.out",
      scrollTrigger: {

        start: "top 30%",
        end: "bottom top",
        scrub: 2.4,
      },
    });


    // Right card → goes up and **more right**
    gsap.to(rightRef.current, {
      y: -380,
      // x: 140,
      // rotate: 32,
      scale: 1.27,
      ease: "power4.out",
      scrollTrigger: {

        start: "top 15%",
        end: "bottom top",
        scrub: 1.8,
      },
    });


    // Top card → goes up **and slightly left**, most dramatic movement
    gsap.to(topRef.current, {
      y: -620,
      // x: -40,
      // rotate: -12,
      scale: 1.45,
      ease: "expo.out",
      scrollTrigger: {

        start: "top -5%",
        end: "bottom top",
        scrub: 3.1,
      },
    });
    return () => ScrollTrigger.killAll();
  }, [currentSet]);


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
        const scrollY = window.scrollY + rect.top - window.innerHeight / 3;
        window.scrollTo({
          top: scrollY,
          behavior: "smooth",
        });
      }
    }, 300);
  };


  const FloorDesign1 = data?.banners?.LETS_FIND_YOUR_FLOORS_BEST_FRIEND?.[0]?.media || "";
  const FloorDesign2 = data?.banners?.LETS_FIND_YOUR_FLOORS_BEST_FRIEND?.[1]?.media || "";
  const FloorDesign3 = data?.banners?.LETS_FIND_YOUR_FLOORS_BEST_FRIEND?.[2]?.media || "";
  const FloorDesign4 = data?.banners?.LETS_FIND_YOUR_FLOORS_BEST_FRIEND?.[3]?.media || "";
  const FloorDesign5 = data?.banners?.LETS_FIND_YOUR_FLOORS_BEST_FRIEND?.[4]?.media || "";
  const FloorDesign6 = data?.banners?.LETS_FIND_YOUR_FLOORS_BEST_FRIEND?.[5]?.media || "";
  const floatingImages = [
    { id: 1, src: FloorDesign1, className: "imgf1" },
    { id: 2, src: FloorDesign2, className: "imgf2" },
    { id: 3, src: FloorDesign3, className: "imgf3" },
    { id: 4, src: FloorDesign4, className: "imgf4" },
    { id: 5, src: FloorDesign5, className: "imgf5" },
    { id: 6, src: FloorDesign6, className: "imgf6" },
  ];


  return (
    <>
      <div className="spacer_track"></div>
      {/* ───────────────────── HERO ───────────────────── */}
      <div className="homepage container-fluid position-relative p-5">
        <img src={data?.logo_content?.logo} className="img-left-logo" alt="Obesession" />
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
            <li key={item.id} >
              <Link to={`/products/${item.action_url}`}>{item.name}</Link>
              {/* target="_blank" rel="noopener noreferrer" */}
            </li>
          ))}
        </ul>


        {/* Description */}
        <div className="position-absolute description-hero text-secondary">
          <p>
            We believe home is more than just a place. It's a feeling. That’s
            why we design enduring products that strike the perfect balance
            between charm and practicality.
          </p>
        </div>


        <div ref={searchSectionRef}
          className={`search-wrapper bg-white rounded shadow ${isSearchActive ? "active" : ""
            }`}
        >
          <div className="d-flex">
            <input
              ref={inputRef}
              type="text"
              className="form-control border-0 input_home"
              placeholder="WHAT ARE YOU LOOKING FOR?"
              value={query}
              onFocus={handleFocus}
              onChange={(e) => {
                // Allow only letters, numbers, and spaces (no special characters)
                let value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");


                // Remove leading spaces
                value = value.replace(/^\s+/, "");


                setQuery(value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  navigate("/searchlist", { state: { query } });
                }
              }}
            />
            {loading && (
              <div className="sarchlader">
                <div
                  className="spinner-border text-secondary"
                  style={{ width: "20px", height: "20px" }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <button
              className="btn btn-dark button_search"
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


          {isSearchActive && Array.isArray(results) && (
            <>
              {results.length > 0 ? (
                <div className="search-results-grid">
                  {results.slice(0, 8).map((item, index) => (
                    <div
                      key={index}
                      className="search-card"
                    >
                      <Link to={`/productsdetails/${item.action_url}`} target="_blank" rel="noopener noreferrer">
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
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                // ✅ No Data Found message
                !loading && query?.trim() && (
                  <div className="search-results-grid" style={{ display: "flex", justifyContent: "center", padding: "150px" }}>
                    <p>No Result found</p>
                  </div>
                )
              )}
            </>
          )}
        </div>


        {/* Overlay */}
        {isSearchActive && (
          <div
            className="search-overlay"
            onClick={() => { setIsSearchActive(false); setQuery(""); }}
          />
        )}

        <section>
          <div className="slogan_part">
            <p
              className={`position-absolute footer-note small ${fade ? "fade-out" : "fade-in"
                }`}>
              <span>
                <img src={items[currentIndex].icon} className="img_turner" />
                &nbsp;
              </span>
              {items[currentIndex].text}
            </p>
          </div>
        </section>


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
            Every room tells a story, and the pieces you bring into it become part of the narrative. At Obsessions, we believe home is more than just a place; it’s a feeling. That’s why we design and curate products that strike the perfect balance between charm and practicality.
          </p>


          <Link to={`/collections`}>
            <button className="hero-button">CHECK OUR COLLECTIONS</button>
          </Link>


        </div>
        <div className="collection-img-wrap img-left">
          <img src={leftImage} className="collection-img " alt="" />
        </div>


        <div className="collection-img-wrap img-right">
          <img src={rightImage} className="collection-img" alt="" />


        </div>
      </section>


      {/* ────────────────── 🥀💎💎 🐉 SHOP BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section className="shopby ">
        <p className="shopby-title text-uppercase mb-4 txt_shopby">Shop by</p>


        <ul className="shopby-list">
          {shopByItems?.map((item, i) => (
            <Link to={item.url}>
              <li
                key={item.label}
                className={`
               shopby-item
               ${item.sale ? "sale" : ""}
               ${active === i ? "is-active" : ""}
             `}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              // onClick={() => handelcollectionDetails(item.url)}
              >
                {/* Thumbnails */}
                <div className="thumb-bar">
                  {item.thumbs.map((src, idx) => (
                    <div>
                      <img src={src} alt="" key={idx} />
                    </div>
                  ))}
                </div>
                {/* Text label */}
                <span className="shopby-label">{item.label}</span>
                {/* VIEW tag */}
                <span
                  className="view-tag"
                // onClick={() => handelcollectionDetails(item.url)}
                >
                  View
                </span>
              </li>
            </Link>
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
          <div className="hero-text-table">
            <h1>SALE ON THE TABLE</h1>
            <p>
              Stylish tabletop finds now discounted for meals & special moments.
            </p>
            <Link to={`/products/${tableSectionImage?.action_url}`}>
              <button className="hero-button-table" >
                ELEVATE YOUR TABLETOP
              </button>
            </Link>
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
            >


              <Link to={item.action_url}>
                <img
                  src={item.media}
                  alt={item.name}
                  className="promo-image pointer-crusser"
                />
                <p className="promo-title pointer-crusser">{item.name}</p>


              </Link>
            </div >
          ))}
        </div >
      </section >


      {/* ────────────────── 🥀💎💎 🐉 Carpet BY SECTION 🐉 💎💎🥀 ────────────────── */}
      <section section >
        <div className="carpet-section">
          <h2 className="carpet-heading">
            Carpet for <em>Every Spot</em>
          </h2>
          <div className="carpet-grid">
            {carpetCategories.map((item) => (
              <>
                <Link to={`/products/${item.link}`}>
                  <div
                    key={item.id}
                    className="carpet-tile"
                    style={{ backgroundImage: `url(${item.image})` }}
                  >
                    {/* <div className="carpet-label">{item.title}</div> */}
                  </div>
                </Link>
              </>
            ))}
          </div>
        </div>
      </section >
      {/* ────────────────── 🥀💎💎 🐉 Floor BY SECTION 🐉 💎💎🥀 ────────────────── */}
      < section className="floor-matcher" >
        {
          floatingImages.map((img) => (
            <img
              key={img.id}
              src={img.src}
              className={`floating-imgf ${img.className}`}
              alt=""
            />
          ))
        }
        < div className="matcher-content" >
          <h2>
            Let’s Find Your <br /> <em>Floor’s Best Friend</em>
          </h2>
          <p>
            Your style, your space, your vibe. We’ll help you match it with the
            right floor covering.
          </p>
          <Link to={`/floor-matcher`}>
            <button className="hero-button" >
              TRY FLOOR MATCHER
            </button>
          </Link>
        </div >
      </section >


      {/* ────────────────── 🥀💎💎 🐉 Floor BY SECTION 🐉 💎💎🥀 ────────────────── */}
      < section className="obsessed-section" >
        <h2>
          <em>Obsessed</em> <span className="track_obsd">Right Now</span>
        </h2>
        <div className="obsessed-grid">
          {obsessedItems.map((item, idx) => (
            <div
              className="obsessed-card"
              key={idx}
            >
              <Link to={`/products${item.url}`}>
                <img className="img_right_now" src={item.src} alt={item.title} />
                <p className="obs_track_text">{item.title?.toLowerCase()}</p>
              </Link>


            </div>
          ))}
        </div>
      </section >
      {/* ────────────────── 🥀💎💎 🐉 video BY SECTION 🐉 💎💎🥀 ────────────────── */}
      < section >
        <VideoSection />
      </section >


      {/* ────────────────── 🥀💎💎 🐉 OUR OBSESSIONS BY SECTION 🐉 💎💎🥀 ────────────────── */}
      < section className="obsession-section" >
        <div className="txt_root_warp">
          <h2 className="obsession-title web">OUR OBSESSIONS</h2>
          <div style={{ marginBottom: "35px" }}>
            <h2 className="obsession-title mob">OUR</h2>
            <h2 className="obsession-title mob">OBSESSIONS</h2>
          </div>
        </div>


        <div className="obsession-content">
          <div className="obsession-image">
            <img src={data?.bottom_content?.media} className="img_video_track" alt="Our team" />
            {/* <img src={videoimage} className="img_video_track" alt="Our team" /> */}
          </div>
          <div className="obsession-text">
            <div dangerouslySetInnerHTML={{ __html: data?.bottom_content?.content }} />


            <Link to={data?.bottom_content?.action_url}>
              <button
                className="hero-button"
              >
                MORE ABOUT US
              </button>
            </Link>


            <div className="obsession-image_mlb">
              <img src={data?.bottom_content?.media} className="img_video_track" alt="Our team" />
              {/* <img src={videoimage} className="img_video_track" alt="Our team" /> */}
            </div>
          </div>
        </div>
      </section >


      {/* Footer setction  */}
      < Footer />
      <ProductQuickViewModal
        show={showModal}
        onHide={() => setShowModal(false)}
        product={quickViewProduct}
      />
    </>
  );
};


export default HomePage;



