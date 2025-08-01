import React from "react";
import "./Footer.css";
import marstrcards from "../../assets/images/Footer_image_track.png";
import { RiFacebookCircleFill } from "react-icons/ri";
import { BsYoutube } from "react-icons/bs";
import { RiInstagramLine } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="newsletter">
        <h2>
          Your Home Just Got <em>More Interesting</em>
        </h2>
        <p className="sub_text">
          Get updates on new collections, trending products, and curated content
          you'll love.
        </p>
        <div className="email-signup">
          <input type="email" placeholder="ENTER EMAIL ADDRESS" />
          <button>SIGN UP →</button>
        </div>
        <p className="terms_footer">
          By signing up you agree with our <a href="#">Terms & Conditions</a>.
        </p>
      </div>

      <div className="footer-links">
        <div>
          <h4>SHOP</h4>
          <ul>
            <li>Dining Room</li>
            <li>Bedroom</li>
            <li>Living Room</li>
            <li>Kitchen</li>
            <li>Entryway</li>
            <li>Outdoor</li>
            <li>Bathroom</li>
          </ul>
        </div>
        <div>
          <ul>
            <li>Kids room</li>
            <li>Bath Care</li>
            <li>Kitchen & Dining</li>
            <li>Dustbins</li>
            <li>Floor Coverings</li>
            <li>Storage & Organization</li>
            <li>Tableware</li>
            <li>Yoga & Fitness</li>
          </ul>
        </div>

        <div>
          <h4>COMPANY</h4>
          <ul>
            <li>About Us</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Cancellation Policy</li>
            <li>Return & Refund Policy</li>
            <li>Fees & Payments Policy</li>
          </ul>
        </div>

        <div>
          <h4>RESOURCES</h4>
          <ul>
            <li>Blog</li>
            <li>Size Guide</li>
            <li>Style Guide</li>
            <li>Carpet Finder</li>
            <li>Track Order</li>
          </ul>
        </div>

        <div className="contact">
          <div className="ctn_txt">
            <h4>CONTACT US</h4>
            <p>
              A, Plot No. D3, Basement, Pusa Road,
              <br />
              Karol Bagh, New Delhi - 110005, India
            </p>
            <p>T. +91 9311342200</p>
            <p>E. care@obsessions.co.in</p>
          </div>

          <div className="social-icons">
              <div className="sub-icon"> 
              <RiFacebookCircleFill 
                size={24}
                color="#BDBDBD"
              />
            <BsYoutube
                  size={24}
                  color="#BDBDBD"
             />
            <RiInstagramLine 
                    size={24}
                    color="#BDBDBD"
            />
              </div>
         
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 obsessions.co.in | All Rights Reserved</p>
        <div className="payments">
          {/* Replace with image logos or use <i> with FontAwesome or other icon libs */}
          <img src={marstrcards} alt="Visa" />
          {/* Add other payment logos as needed */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
