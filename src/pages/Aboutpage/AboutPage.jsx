import React from "react";
import "./AboutPage.css";
import { FaGem } from "react-icons/fa";
import { FaAward } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";
const AboutPage = () => {
  return (
    <>
      <div className="about-wrapper">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-overlay">
            <h1>
              Our <span className="italic">passion</span> lies in <br />
              making your daily moments feel{" "}
              <span className="italic">special</span>
            </h1>
          </div>
        </section>

        {/* Text Content Section */}
        {/* Styled Text Section */}
        <section className="about-text-section">
            <img
              src="https://i.ibb.co/Y71fcG8C/noun-diamond-4705189-1.png"
              alt="Philosophy Detail"
              className="top-left-icon"
            />
        
          <div className="about-text-content">
            <p>
              A well-styled space isn’t about trends. It’s about <br /> how it
              makes you feel. We’re here to help you build <br />a home that
              feels like home.
            </p>
          </div>
          <img
              src="https://i.ibb.co/JFcb1Fyk/noun-quality-6975416-2.png"
              alt="Philosophy Detail"
              className="bottom-right-icon"
            />
        </section>

        <section className="philosophy-section">
          <div className="philosophy-left">
            <h2>
              <span className="italic">Our</span>{" "}
              <strong>Our Philosophy</strong>
            </h2>
            <img
              src="https://i.ibb.co/dstH3HSs/image-10.png"
              alt="Philosophy Detail"
              className="philosophy-subimage"
            />
            <p>
              We believe true luxury isn’t loud, it’s felt in the details. It’s
              in the smooth glide of a soap dispenser, the plush comfort
              underfoot, or the way a table setting quietly transforms a meal
              into a memory.
            </p>
          </div>
          <div className="philosophy-right">
            <img
              src="https://i.ibb.co/5XwVsBTH/image-9.png"
              alt="Craftsman Weaving"
            />
          </div>
        </section>
      </div>

      <div className="tr_div">
        <img
          src="https://i.ibb.co/zWJZCQLL/Frame-1513.png"
          alt="Craftsman Weaving"
        />
      </div>

      <div className="tr_div2">
        <img
          src="https://i.ibb.co/YTkyjnmp/Frame-120.png"
          alt="Craftsman Weaving"
        />
      </div>

       <Footer/>
    </>
  );
};

export default AboutPage;
