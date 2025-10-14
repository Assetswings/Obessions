import React, { useState,useEffect} from "react";
import "./Faq.css";
import { FiSearch, FiPlus } from "react-icons/fi";
import Footer from "../../components/Footer/Footer";
import { fetchFaqs } from "./faqSlice";
import { useDispatch, useSelector } from "react-redux";
import API from "../../app/api";
import helprightimg from "../../assets/images/need-help-right.jpg";
import helpleftimg from "../../assets/images/need-help-left.jpg";

const Faq = () => {
  const [activeSection, setActiveSection] = useState();
  const [searchText, setSearchText] = useState();
  const [bannerimg, setBannerimg] = useState();
  const dispatch = useDispatch();
  const { faqs, loading, error } = useSelector((state) => state.faq);
  useEffect(() => {
    document.title = "Obsession - FAQ";
    dispatch(fetchFaqs()); 
    getBaner();
  }, [dispatch]);

      useEffect(() => {
      if (faqs && faqs.length > 0) {
      setActiveSection(faqs[0].title);
    }
  }, [faqs]);

  const handleTabClick = (key) => {
    setActiveSection(key);
  };

  const faqSearch = () => {
    console.log(searchText);
    dispatch(fetchFaqs(searchText)); 
  }

    // Send OTP API
  const  getBaner = async () => {
    try {
      const res = await API.get("/pages/faq-banners", {});
      if (res.data.success) {
        setBannerimg(res.data.data);
      }
    } catch (err) {
      console.log("banner not comming.");
    }
  };

  if (loading) return <p>Loading FAQs...</p>;
  if (error) return <p>Error: {error}</p>;


  return (
    <>
      {/* Hero Section */}
      <section className="faq-hero">
        <img
          src={bannerimg?.left}
          alt="Soap Decor"
          className="faq-decor left"
        />
        <div className="faq-content">
          <h1>How can we help you today?</h1>
          <p>Browse our most frequently asked questions.</p>
          {/* <div className="faq-search-bar">
            <input
              type="text"
              onChange={(e)=>{setSearchText(e.target.value)}}
              placeholder='Search Topics'
            />
            <button onClick={faqSearch}>
              <FiSearch size={18} />
            </button>
          </div> */}
        </div>
        <img
          src={bannerimg?.right}
          alt="Tissue Decor"
          className="faq-decor right"
        />
      </section>

      {/* Tab Navigation */}
      <section className="faq-scroll-page">
        <div className="faq-tab-buttons">
          {faqs.map((item,index) => (
            <button
              key={index}
              className={activeSection === item.title ? "active" : ""}
              onClick={() => handleTabClick(item.title)}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Selected FAQ Section */}
        <div className="faq-sections">
          {faqs.map((item,index) => (
            <div
              key={index}
              className="faq-category"
              style={{ display: activeSection === item.title ? "block" : "none" }}>
              {/* <h3>{item.title}</h3> */}
              {item.faqs.map((data, i) => (
                <details key={i} className="faq-item">
                  <summary>
                    <span>{data.question}</span>
                    <FiPlus className="faq-icon" />
                  </summary>
                  <p className="ans_">{data.answer}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Help Section */}
      <section className="faq-help-section">
        <div className="faq-help-container">
          <div className="faq-help-img-1">
            <img src={helpleftimg} alt="Help Left" />
          </div>

          <div className="faq-help-content">
            <h3>Still need help?</h3>
            <p>
              Check out our above FAQs for quick answers to common questions.
              <br />
              Still need assistance? Feel free to email us at:
            </p>
            <a href="mailto:care@obsessions.co.in">care@obsessions.co.in</a>
          </div>

          <div className="faq-help-img-2">
            <img src={helprightimg} alt="Help Right" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Faq;
