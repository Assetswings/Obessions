import React, { useState } from "react";
import "./Faq.css";
import { FiSearch, FiPlus } from "react-icons/fi";
import Footer from "../../components/Footer/Footer";

  const faqData = {
  popular: {
    label: "POPULAR FAQS",
    items: [
      "Do I need to open an account in order to shop with you?",
      "How do I create an account?",
      "How do I order?",
      "Is there a showroom I can visit?",
      "What gift options are available?",
    ],
  },
  shipping: {
    label: "SHIPPING AND DELIVERY",
    items: [
      "What are your shipping options?",
      "How long will my order take to arrive?",
      "How much does shipping cost?",
      "Do you ship internationally?",
    ],
  },
  cancellation: {
    label: "ORDER CANCELLATION",
    items: [
      "Can I cancel my order?",
      "How do I cancel an order?",
      "What if my order has already been shipped?",
      "How will I get my refund after cancellation?",
    ],
  },
  return: {
    label: "RETURN POLICY",
    items: [
      "What is your return policy?",
      "How to Initiate a Return?",
    ],
  },
};

const Faq = () => {
  const [activeSection, setActiveSection] = useState("popular");

  const handleTabClick = (key) => {
    setActiveSection(key);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="faq-hero">
        <img
          src="https://i.ibb.co/QF95bwkq/image-330.png"
          alt="Soap Decor"
          className="faq-decor left"
        />
        <div className="faq-content">
          <h1>How can we help you today?</h1>
          <p>Browse our most frequently asked questions.</p>
          <div className="faq-search-bar">
            <input
              type="text"
              placeholder='Search topics like "Return Policy" or "Shipping"'
            />
            <button>
              <FiSearch size={18} />
            </button>
          </div>
        </div>
        <img
          src="https://i.ibb.co/218CG3dP/image-327.png"
          alt="Tissue Decor"
          className="faq-decor right"
        />
      </section>

      {/* Tab Navigation */}
      <section className="faq-scroll-page">
        <div className="faq-tab-buttons">
          {Object.entries(faqData).map(([key, section]) => (
            <button
              key={key}
              className={activeSection === key ? "active" : ""}
              onClick={() => handleTabClick(key)}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Selected FAQ Section */}
        <div className="faq-sections">
          {Object.entries(faqData).map(([key, section]) => (
            <div
              key={key}
              className="faq-category"
              style={{ display: activeSection === key ? "block" : "none" }}>
              <h3>{section.label}</h3>
              {section.items.map((question, i) => (
                <details key={i} className="faq-item">
                  <summary>
                    <span>{question}</span>
                    <FiPlus className="faq-icon" />
                  </summary>
                  <p>This is the answer to: <strong>{question}</strong></p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Faq;
