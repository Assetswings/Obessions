import React, { useEffect, useState } from "react";
import "./SizeGuide.css";
import Footer from "../../components/Footer/Footer";
import setone from "../../assets/images/image_set1.png";

import API from "../../app/api";
import Skeleton from "react-loading-skeleton";


const SizeGuide = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);

  const handleTerms = async () => {
    try {
      const res = await API.get("/pages/style-guide");
      if (res.data.status === 200) {
        // Simulate delay only if you really want it
        setTimeout(() => {
          setData(res.data?.data);
          setLoading(false); // stop loader when content is ready
        }, 1000); // reduce delay (10s is too long for UX)
      }
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Obsession - Style Guide";
    handleTerms();
  }, []);
  return (
    <>
      {loading ? (
        <div className="sizeguide-skeleton">
          {/* ---------- HERO SKELETON ---------- */}
          <div className="hero-skeleton" style={{ position: "relative", height: "471px", marginBottom: "50px" }}>
            <Skeleton width="100%" height="100%" />
            <div style={{ position: "absolute", bottom: 50, left: 70, maxWidth: 600 }}>
              <Skeleton width="70%" height={40} style={{ marginBottom: 15 }} />
              <Skeleton width="90%" height={20} count={2} style={{ marginBottom: 10 }} />
            </div>
          </div>

          {/* ---------- STEPS SKELETON ---------- */}
          <div className="steps-skeleton" style={{ marginBottom: "60px" }}>
            <Skeleton width="30%" height={28} style={{ marginBottom: 30 }} /> {/* Steps heading */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "60px 100px" }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="step-item-skeleton" style={{ display: "flex", gap: "20px" }}>
                  <Skeleton width={50} height={50} />
                  <div>
                    <Skeleton width={120} height={20} style={{ marginBottom: 8 }} />
                    <Skeleton width={180} height={16} count={2} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- STYLE BLOCKS SKELETON ---------- */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className={`style-block-skeleton ${index % 2 !== 0 ? "reverse-layout" : ""}`} style={{ display: "flex", gap: 60, marginBottom: 60 }}>
              <Skeleton width={600} height={600} /> {/* Style Image */}
              <div style={{ flex: 1, maxWidth: 500 }}>
                <Skeleton width="60%" height={24} style={{ marginBottom: 16 }} /> {/* Title */}
                <Skeleton width="100%" height={16} count={3} style={{ marginBottom: 20 }} /> {/* Description */}
                <Skeleton width="40%" height={20} style={{ marginBottom: 12 }} /> {/* Recommends Title */}
                <div style={{ display: "flex", gap: 16 }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i}>
                      <Skeleton width={55} height={70} />
                      <Skeleton width={50} height={12} style={{ marginTop: 4 }} />
                    </div>
                  ))}
                </div>
                <Skeleton width={120} height={36} style={{ marginTop: 20 }} /> {/* Explore Button */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="sizeguide-container">
          {/* ---------- HERO SECTION ---------- */}
          <section className="hero-section">
            <img src={data?.style_guide_banners?.media} alt="Carpet Style" className="hero-image" />
            <div className="hero-text-sz">
              <h1>{data?.style_guide_banners?.title}</h1>
              <p>{data?.style_guide_banners?.description}</p>
            </div>
          </section>

          {/* ---------- STEPS SECTION ---------- */}
          <section className="steps-section">
            <h2>Steps to Find Your Perfect Carpet</h2>

            <div className="steps-grid">
              {data?.setup_find_your_perfect.map((item, index) => {
                return (
                  <div className="step-item" key={index}>
                    <div className="track_sub_ot">
                      <div className="img_buster">
                        <img
                          src={item?.media}
                          alt={item?.name}
                          className="img_icon_fcar"
                        />
                      </div>

                      <div>
                        <h3>{item?.name}</h3>
                        <p>{item?.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="know-style-container">
            <h2 className="section-title">Know Your Style</h2>
            <p className="section-subtitle">
              Every home tells a story, and the right carpet is the finishing
              touch that ties it together adding style, comfort, and character to
              your space.
            </p>
            {data?.content?.map((style, index) => (
              <div
                key={style.id}
                className={`style-block ${index % 2 !== 0 ? "reverse-layout" : ""
                  }`}
              >
                <div className="style-image">
                  <img src={style?.main_media} alt={style.name} />
                </div>

                <div className="style-content">
                  <h3 className="style-title">{style.name}</h3>
                  <p className="style-description">{style.description}</p>

                  <div className="recommend-title">Obsessions Recommends:</div>
                  <div className="recommend-grid">
                    {style.media_gallery.map((rec, i) => (
                      <div key={i} className="recommend-item">
                        <img src={rec.media} alt={rec.name} />
                        <p>{rec.label}</p>
                      </div>
                    ))}
                  </div>

                  <button className="explore-btn">{style.button_styles}</button>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
      <Footer />
    </>
  );
};

export default SizeGuide;
