import React, { useEffect, useState } from "react";
import "./Footer.css";
import marstrcards from "../../assets/images/Footer_image_track.png";
import { RiFacebookCircleFill } from "react-icons/ri";
import { BsYoutube } from "react-icons/bs";
import { RiInstagramLine } from "react-icons/ri";
import API from "../../app/api";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // fetch footer links
  useEffect(() => {
    const fetchFooterLinks = async () => {
      try {
        const res = await API.get("/footer-links"); // baseURL is already in API.js
        if (res.data.success) {
          setFooterData(res.data.data);
        } else {
          setError("Failed to load footer links");
        }
      } catch (err) {
        setError("Something went wrong while fetching footer links.");
      } finally {
        setLoading(false);
      }
    };
    fetchFooterLinks();
  }, []);

  if (loading) return null; // or loader
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!footerData) return null;

  const { SHOP, COMPANY, RESOURCES, CONTACT_US, SOCIAL_MEDIA } = footerData;

  // helper to render social icons
  const renderIcon = (title) => {
    switch (title.toLowerCase()) {
      case "facebook":
        return <RiFacebookCircleFill size={24} />;
      case "youtube":
        return <BsYoutube size={24} />;
      case "instagram":
        return <RiInstagramLine size={24} />;
      default:
        return null;
    }
  };

  // 🧭 Navigation Page
  const handleNavigate = (route) => {
    navigate("/" + route);
  };

  const handleCategoryClick = (categorySlug) => {
    window.scrollTo({ top: 0, behavior: "auto" });
    navigate("/products", { state: { category: categorySlug } });
  };

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await API.post(
        "/forms/newsletter-subscribe",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (res.data) {
        // keep skeleton/loader until data is ready if you want
        setTimeout(() => {
          setMessage("✅ Subscribed successfully!");
          setEmail(""); // clear input
          setLoading(false);
        }, 800); // optional small delay to mimic your pattern
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      {/* Newsletter */}
      {/* <div className="newsletter">
        <h2>
          Your Home Just Got <em>More Interesting</em>
        </h2>
        <p className="sub_text">
          Get updates on new collections, trending products, and curated content
          you'll love.
        </p>
        <div className="email-signup">
          <input
            type="email"
            placeholder="ENTER EMAIL ADDRESS"
            // keep your subscription logic here...
          />
          <button>SIGN UP →</button>
        </div>
      </div> */}
      <div className="newsletter">
        <h2>
          Your Home Just Got <em>More Interesting</em>
        </h2>
        <p className="sub_text">
          Get updates on new collections, trending products, and curated content
          you'll love.
        </p>
        <div className="email-signup">
          <input
            type="email"
            placeholder="ENTER EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleSubscribe} disabled={loading}>
            {loading ? "Signing up..." : "SIGN UP →"}
          </button>
        </div>

        {message && <p className="response-message">{message}</p>}
        <p className="sub_text mt-2">
          By signing up you agree with our <u className="pointer-crusser" onClick={() => handleNavigate('tc-of-sale')}>Terms & Conditions</u>.
        </p>
      </div>

      {/* Dynamic Footer Links */}
      <div className="footer-links">
        {/* SHOP */}
        <div>
          <h4>SHOP</h4>
          <ul>
            {SHOP?.slice(0, 7).map((item, idx) => (
              <li
                key={idx}
                onClick={() => handleCategoryClick(item.action_url)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
        <div><br/>
          <ul>
            {SHOP?.slice(7, 15).map((item, idx) => (
              <li
                key={idx}
                onClick={() => handleCategoryClick(item.action_url)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h4>COMPANY</h4>
          <ul>
            {COMPANY?.map((item, idx) => (
              <li key={idx} onClick={() => handleNavigate(item.action_url)}>
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        {/* RESOURCES */}
        <div>
          <h4>RESOURCES</h4>
          <ul>
            {RESOURCES?.map((item, idx) => (
              <li key={idx} onClick={() => handleNavigate(item.action_url)}>
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div className="contact">
          <div className="ctn_txt">
            <h4>CONTACT US</h4>
            <p>A. {CONTACT_US?.address}</p>
            <p>T. {CONTACT_US?.phone}</p>
            <p>E. {CONTACT_US?.email}</p>
          </div>

          <div className="social-icons">
            <div className="sub-icon">
              {SOCIAL_MEDIA?.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.title}
                  style={{
                    color: "#BDBDBD",
                    marginRight: "10px",
                  }}
                >
                  {renderIcon(item.title)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      {/* <div className="footer-bottom">
        <p>© 2025 obsessions.co.in | All Rights Reserved</p>
        <div className="payments">
          <img src={marstrcards} alt="Visa" />
        </div>
      </div> */}
    </footer>
  );
};

export default Footer;
