// import React, { useState } from "react";
// import "./Footer.css";
// import marstrcards from "../../assets/images/Footer_image_track.png";
// import { RiFacebookCircleFill } from "react-icons/ri";
// import { BsYoutube } from "react-icons/bs";
// import { RiInstagramLine } from "react-icons/ri";
// import API from "../../app/api";

// const Footer = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");

//   const subscription = async () => {
//     if (!email) {
//       setMessage("⚠️ Please enter a valid email address.");
//       return;
//     }

//     try {
//       const res = await API.post("/forms/newsletter-subscribe", { email });

//       if (res.data.success) {
//         setMessage("✅ Subscribed successfully!");
//         setEmail(""); // clear input
//       } else {
//         setMessage(`⚠️ ${res.data.msg || "Subscription failed"}`);
//       }
//     } catch (err) {
//       setMessage(
//         `❌ ${
//           err.response?.data?.msg ||
//           err.response?.data?.message ||
//           "Something went wrong"
//         }`
//       );
//     }
//   };

//   const socialLinks = [
//     {
//       name: "Facebook",
//       icon: <RiFacebookCircleFill size={24} />,
//       url: "https://www.facebook.com/yourpage",
//       color: "#1877F2", // optional
//     },
//     {
//       name: "YouTube",
//       icon: <BsYoutube size={24} />,
//       url: "https://www.youtube.com/yourchannel",
//       color: "#FF0000",
//     },
//     {
//       name: "Instagram",
//       icon: <RiInstagramLine size={24} />,
//       url: "https://www.instagram.com/yourprofile",
//       color: "#E4405F",
//     },
//   ];

//   return (
//     <footer className="footer">
//       <div className="newsletter">
//         <h2>
//           Your Home Just Got <em>More Interesting</em>
//         </h2>
//         <p className="sub_text">
//           Get updates on new collections, trending products, and curated content
//           you'll love.
//         </p>
//         <div className="email-signup">
//           <input
//             type="email"
//             placeholder="ENTER EMAIL ADDRESS"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <button onClick={subscription}>SIGN UP →</button>
//         </div>
//         {message && <p className="subscription-message">{message}</p>}
//         <p className="terms_footer">
//           By signing up you agree with our <a href="#">Terms & Conditions</a>.
//         </p>
//       </div>

//       <div className="footer-links">
//         <div>
//           <h4>SHOP</h4>
//           <ul>
//             <li>Dining Room</li>
//             <li>Bedroom</li>
//             <li>Living Room</li>
//             <li>Kitchen</li>
//             <li>Entryway</li>
//             <li>Outdoor</li>
//             <li>Bathroom</li>
//           </ul>
//         </div>
//         <div>
//           <ul>
//             <li>Kids room</li>
//             <li>Bath Care</li>
//             <li>Kitchen & Dining</li>
//             <li>Dustbins</li>
//             <li>Floor Coverings</li>
//             <li>Storage & Organization</li>
//             <li>Tableware</li>
//             <li>Yoga & Fitness</li>
//           </ul>
//         </div>

//         <div>
//           <h4>COMPANY</h4>
//           <ul>
//             <li>About Us</li>
//             <li>Terms & Conditions</li>
//             <li>Privacy Policy</li>
//             <li>Cancellation Policy</li>
//             <li>Return & Refund Policy</li>
//             <li>Fees & Payments Policy</li>
//           </ul>
//         </div>

//         <div>
//           <h4>RESOURCES</h4>
//           <ul>
//             <li>Blog</li>
//             <li>Size Guide</li>
//             <li>Style Guide</li>
//             <li>Carpet Finder</li>
//             <li>Track Order</li>
//           </ul>
//         </div>

//         <div className="contact">
//           <div className="ctn_txt">
//             <h4>CONTACT US</h4>
//             <p>
//               A, Plot No. D3, Basement, Pusa Road,
//               <br />
//               Karol Bagh, New Delhi - 110005, India
//             </p>
//             <p>T. +91 9311342200</p>
//             <p>E. care@obsessions.co.in</p>
//           </div>

//           <div className="social-icons">
//             <div className="sub-icon">
//               {/* <RiFacebookCircleFill size={24} color="#BDBDBD" />
//               <BsYoutube size={24} color="#BDBDBD" />
//               <RiInstagramLine size={24} color="#BDBDBD" /> */}
//               {socialLinks.map((item, index) => (
//                 <a
//                   key={index}
//                   href={item.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   aria-label={item.name}
//                   style={{ color: item.color || "#BDBDBD", marginRight: "10px" }}
//                 >
//                   {item.icon}
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="footer-bottom">
//         <p>© 2025 obsessions.co.in | All Rights Reserved</p>
//         <div className="payments">
//           {/* Replace with image logos or use <i> with FontAwesome or other icon libs */}
//           <img src={marstrcards} alt="Visa" />
//           {/* Add other payment logos as needed */}
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

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
    navigate("/products", { state: { category: categorySlug } });
  };

  return (
    <footer className="footer">
      {/* Newsletter */}
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
            // keep your subscription logic here...
          />
          <button>SIGN UP →</button>
        </div>
      </div>

      {/* Dynamic Footer Links */}
      <div className="footer-links">
        {/* SHOP */}
        <div>
          <h4>SHOP</h4>
          <ul>
            {SHOP?.slice(0, 7).map((item, idx) => (
              <li key={idx} onClick={() => handleCategoryClick(item.action_url)}>
                {item.title}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul>
            {SHOP?.slice(7,15).map((item, idx) => (
              <li key={idx} onClick={() => handleCategoryClick(item.action_url)}>
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
            <p>{CONTACT_US?.address}</p>
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
