import React, { useEffect, useState } from "react";
import "./Footer.css";
import marstrcards from "../../assets/images/Mastercardimage.svg";
import { RiFacebookCircleFill } from "react-icons/ri";
import { BsYoutube } from "react-icons/bs";
import { RiInstagramLine } from "react-icons/ri";
import API from "../../app/api";
import { Link, useNavigate } from "react-router-dom";
import rightarrow from "../../assets/icons/Vector.svg";

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
        const res = await API.get("/footer-links");
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

  if (loading) return null;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!footerData) return null;

  const { SHOP, COMPANY, RESOURCES, CONTACT_US, SOCIAL_MEDIA } = footerData;

  // social icons
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

  // email validation
  const handleSubscribe = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      setMessage("");
      const res = await API.post("/forms/newsletter-subscribe", { email });

      if (res.data) {
        setMessage("Subscribed successfully!");
        setEmail("");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again later.");
    }
  };

  // detect error msg
  const isError =
    message.includes("Please enter") ||
    message.includes("Something went wrong");

  return (
    <footer className="footer">
      <div className="newsletter">
        <h2>
          Your Home Just Got <em>More Interesting</em>
        </h2>
        <p className="sub_text">
          Get updates on new collections, trending products, and curated content you'll love.
        </p>

        <div className="email-signup">
          <input
            type="email"
            placeholder="ENTER EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button
            className="button_fag"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? (
              "Signing up..."
            ) : (
              <>
                SIGN UP
                <img
                  src={rightarrow}
                  alt="arrow"
                  style={{ width: "16px", marginLeft: "6px", paddingBottom: "4%" }}
                />
              </>
            )}
          </button>
        </div>
        {/* 
        {message && (
          <div className="response-container">
            <div className="sub-track-res">
              <p
                className="response-message"
                style={{
                  color: isError ? "red" : "inherit",
                
                }}
              >
                {message}
              </p>
            </div>
          </div>
        )} */}

        {message && (
          <div className="response-container">
            <div className="sub-track-res">
              <p
                className="response-message"
                style={{
                  color: isError ? "red" : "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {!isError && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2ecc71"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
                {message}
              </p>
            </div>
          </div>
        )}


        <Link to={`/tc-of-sale`}>
          <p className="sub_text mt-2">
            By signing up you agree with our <u className="pointer-crusser">Terms & Conditions</u>.
          </p>
        </Link>
      </div>

      {/* Footer Links */}
      <div className="footer-links">
        {/* SHOP mobile */}
        <div className="footer-col shop-col mllbb-shp">
          <h4>SHOP</h4>
          <ul className="shop-grid-3">
            {SHOP?.map((item, idx) => (
              <li key={idx}>
                <Link to={`/products/${item.action_url}`}>
                  {item.title.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SHOP desktop */}
        <div className="desk-foot">
          <h4>SHOP</h4>
          <ul>
            {SHOP?.slice(0, 7).map((item, idx) => (
              <li style={{ textTransform: "capitalize" }} key={idx}>
                <Link to={`/products/${item.action_url}`}>{item.title.toLowerCase()}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="desk-foot">
          <br />
          <ul>
            {SHOP?.slice(7, 15).map((item, idx) => (
              <li style={{ textTransform: "capitalize" }} key={idx}>
                <Link to={`/products/${item.action_url}`}>{item.title.toLowerCase()}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h4>COMPANY</h4>
          <ul>
            {COMPANY?.map((item, idx) => (
              <li key={idx}>
                <Link to={`/${item.action_url}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* RESOURCES */}
        <div>
          <h4>RESOURCES</h4>
          <ul>
            {RESOURCES?.map((item, idx) => (
              <li key={idx}>
                <Link to={`/${item.action_url}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div className="contact">
          <div className="ctn_txt">
            <h4>CONTACT US</h4>
            <p>A. {CONTACT_US?.address}</p>
            <p>
              T. <a href={`tel:${CONTACT_US?.phone}`}>{CONTACT_US?.phone}</a>
            </p>
            <p>
              E. <a href={`mailto:${CONTACT_US?.email}`}>{CONTACT_US?.email}</a>
            </p>
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
                  style={{ color: "#BDBDBD", marginRight: "10px" }}
                >
                  {renderIcon(item.title)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2025 obsessions.co.in | All Rights Reserved</p>
        <div className="payments">
          <img className="img_tracker_footer" src={marstrcards} alt="Visa" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
