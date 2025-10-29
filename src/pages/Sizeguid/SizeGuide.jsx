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
        <div className="loading-skeleton" style={{ textAlign: "center" }}>
          {/* Paragraph-style skeleton */}
          <Skeleton width="80%" height={30} style={{ marginBottom: 15 }} />
          <Skeleton count={6} height={18} style={{ marginBottom: 8 }} />
          <Skeleton width="90%" height={18} style={{ marginBottom: 8 }} />
          <Skeleton width="80%" height={18} style={{ marginBottom: 8 }} />
          {/* <Skeleton count={2} height={18} style={{ marginBottom: 8 }} /> */}
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
                  <img src={setone} alt={style.name} />
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
