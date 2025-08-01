import React from "react";
import "./ContactUs.css";
import Footer from "../../components/Footer/Footer";
import { Clock4, Mail, MapPinned, Phone } from 'lucide-react';

const ContactUs = () => {
  return (
      <>
      <div className="contact-page">
        {/* Banner Section */}
        <section className="contact-hero" />

        {/* Main Content */}
        <section className="contact-section">
          {/* Left Side */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Your thoughts matter to us — whether it’s about our products,
              website experience, or anything else you’d like to share.
            </p>

            <div className="info-item">
              <span><Phone /></span>
              <div>
                <strong>Call Us</strong>
                <p>+91 9311342200</p>
              </div>
            </div>

            <div className="info-item">
              <span><Mail /></span>
              <div>
                <strong>Send Us a Mail</strong>
                <p>care@obsessions.co.in</p>
              </div>
            </div>

            <div className="info-item">
              <span><Clock4 /></span>
              <div>
                <strong>Opening Time</strong>
                <p>11:00 am to 6:00 pm (Mon-Sat)</p>
              </div>
            </div>

            <div className="info-item">
              <span><MapPinned /></span>
              <div>
                <strong>Address</strong>
                <p>
                  Plot No. 20, Basement, Pusa Road, Karol Bagh, New Delhi - 110005,
                  India
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="contact-form">
            <h2>Send Us a Message</h2>
            <form>
              <div className="form-row two-column">
                <input type="text" placeholder="First name" />
                <input type="text" placeholder="Last name" />
              </div>
              <div className="form-row two-column">
                <input type="email" placeholder="E-mail" />
                <input type="text" placeholder="Phone Number" />
              </div>
              <div className="form-row full-width">
                <select>
                  <option value="">Country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                </select>
              </div>
              <div className="form-row full-width">
                <textarea placeholder="Message"></textarea>
              </div>
              <button type="submit">SEND MESSAGE</button>
            </form>
          </div>
        </section>

        {/* Help Guides Section */}
        <section className="help-guides">
          <h2>Instant Help Guides</h2>
          <div className="guides-container">
            <div className="guide-item">
              <img src="https://i.ibb.co/1Yv02ntL/Help-Chat-2-Streamline-Core.png" alt="FAQ Icon" />
              <p>FAQ’s</p>
            </div>
            <div className="guide-item">
              <img src="https://i.ibb.co/nMD1WLd6/Vector-1.png" alt="Size Guide Icon" />
              <p>SIZE GUIDE</p>
            </div>
            <div className="guide-item">
              <img src="https://i.ibb.co/5x1GQCvB/Product-Icons.png" alt="Style Guide Icon" />
              <p>STYLE GUIDE</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
