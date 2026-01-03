import React, { useState, useEffect, useRef } from "react";
import "./Faq.css";
import { FiPlus, FiMinus } from "react-icons/fi";
import Footer from "../../components/Footer/Footer";
import { fetchFaqs } from "./faqSlice";
import { useDispatch, useSelector } from "react-redux";
import API from "../../app/api";
import helprightimg from "../../assets/images/need-help-right.jpg";
import helpleftimg from "../../assets/images/need-help-left.jpg";

const SCROLL_OFFSET = 120;

const Faq = () => {
  const [activeSection, setActiveSection] = useState("");
  const [bannerimg, setBannerimg] = useState(null);

  // 👉 TRACK OPEN FAQ PER CATEGORY
  const [openFaqs, setOpenFaqs] = useState({});

  const dispatch = useDispatch();
  const { faqs, loading, error } = useSelector((state) => state.faq);

  const sectionRefs = useRef({});
  const isManualScroll = useRef(false);

  useEffect(() => {
    document.title = "Obsession - FAQ";
    dispatch(fetchFaqs());
    getBanner();
  }, [dispatch]);

  // 👉 SET DEFAULT OPEN FAQ (FIRST ONE)
  useEffect(() => {
    if (faqs?.length) {
      setActiveSection(faqs[0].title);

      const defaults = {};
      faqs.forEach((item) => {
        defaults[item.title] = 0;
      });
      setOpenFaqs(defaults);
    }
  }, [faqs]);

  // 👉 TAB CLICK SCROLL
  const handleTabClick = (title) => {
    setActiveSection(title);
    isManualScroll.current = true;

    const target = sectionRefs.current[title];
    if (!target) return;

    const top =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      SCROLL_OFFSET;

    window.scrollTo({ top, behavior: "smooth" });

    setTimeout(() => {
      isManualScroll.current = false;
    }, 500);
  };

  // 👉 SCROLL SPY
  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll.current) return;

      const scrollPosition = window.scrollY + SCROLL_OFFSET + 10;
      let current = activeSection;

      faqs.forEach((item) => {
        const el = sectionRefs.current[item.title];
        if (!el) return;

        if (
          scrollPosition >= el.offsetTop &&
          scrollPosition < el.offsetTop + el.offsetHeight
        ) {
          current = item.title;
        }
      });

      if (current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [faqs, activeSection]);

  const getBanner = async () => {
    try {
      const res = await API.get("/pages/faq-banners");
      if (res.data.success) {
        setBannerimg(res.data.data);
      }
    } catch {
      console.log("banner not coming");
    }
  };

  // 👉 FAQ TOGGLE (ACCORDION)
  const handleFaqToggle = (sectionTitle, index) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [sectionTitle]:
        prev[sectionTitle] === index ? null : index,
    }));
  };

  if (loading) return <p>Loading FAQs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {/* Hero */}
      <section className="faq-hero">
        <img src={bannerimg?.left} alt="" className="faq-decor left" />
        <div className="faq-content">
          <h1>How can we help you today?</h1>
          <p>Browse our most frequently asked questions.</p>
        </div>
        <img src={bannerimg?.right} alt="" className="faq-decor right" />
      </section>

      {/* Tabs */}
      <section className="faq-scroll-page">
        <div className="faq-tab-buttons">
          {faqs.map((item, index) => (
            <button
              key={index}
              className={activeSection === item.title ? "active" : ""}
              onClick={() => handleTabClick(item.title)}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Sections */}
        <div className="faq-sections">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="faq-category"
              ref={(el) => (sectionRefs.current[item.title] = el)}
            >
              <h2 className="faq-category-title">{item.title}</h2>

              {item.faqs.map((data, i) => (
                <details
                  key={i}
                  className="faq-item"
                  open={openFaqs[item.title] === i}
                  onClick={(e) => {
                    e.preventDefault();
                    handleFaqToggle(item.title, i);
                  }}
                >
                  <summary>
                    <span>{data.question}</span>
                    <span className="faq-icon-wrapper">
                      <FiPlus className="faq-icon plus" />
                      <FiMinus className="faq-icon minus" />
                    </span>
                  </summary>
                  <p className="ans_">{data.answer}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Help */}
      <section className="faq-help-section">
        <div className="faq-help-container">
          <div className="faq-help-img-1">
            <img src={helpleftimg} alt="" />
          </div>

          <div className="faq-help-content">
            <h3>Still need help?</h3>
            <p>
              Check out our above FAQs for quick answers to common questions.
              <br />
              Still need assistance? Feel free to email us at:
            </p>
            <a href="mailto:care@obsessions.co.in">
              care@obsessions.co.in
            </a>
          </div>

          <div className="faq-help-img-2">
            <img src={helprightimg} alt="" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Faq;
