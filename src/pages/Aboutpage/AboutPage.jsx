import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AboutPage.css";
import { FaGem } from "react-icons/fa";
import { FaAward } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";
import { fetchAboutUs } from "./aboutSlice";
import { Lightbulb, Palette, Recycle } from "lucide-react";
const AboutPage = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.about);
  console.log(data,'about us data');
  useEffect(() => {
    document.title = "Obsession - About Us";
    dispatch(fetchAboutUs());
  }, [dispatch]);
  return (
    <>
      <div className="about-wrapper">
        {/* Hero Section */}
        <section className="about-hero" style={{backgroundImage: `url(${data?.bg_media})`,}}>
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
              {data?.description}
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
              src={data.our_philosophy?.left}
              alt="Philosophy Detail"
              className="philosophy-subimage"
            />
            <p>
              {data.our_philosophy?.description}
            </p>
          </div>
          <div className="philosophy-right">
            <img
              src={data.our_philosophy?.right}
              alt="Craftsman Weaving"
            />
          </div>
        </section>
      </div>
{/* 
      <div className="tr_div">
        <img
          src="https://i.ibb.co/zWJZCQLL/Frame-1513.png"
          alt="Craftsman Weaving"
        />
      </div> */}

   

      {/* <div className="tr_div2">
        <img
          src="https://i.ibb.co/YTkyjnmp/Frame-120.png"
          alt="Craftsman Weaving"
        />
      </div> */}

      <div className="root_track_pr"> 
      <section className="promise-section">
      <div className="promise-header">
        <h2>
          The Obsession <span>Promise</span>
        </h2>
        <p>
          We design with you in mind; your lifestyle, your home, your needs. From sleek designs to clever functionality, every Obsessions product is made to make your everyday feel a little more beautiful and a lot more effortless.
        </p>
      </div>

      <div className="promise-features">
        <div className="feature-item">
          <Palette className="feature-icon" strokeWidth={1.2} />
          <h3>CRAFTSMANSHIP</h3>
          <p>
            Every detail matters; our products are carefully made to reflect precision, passion, and skill.
          </p>
        </div>

        <div className="feature-item">
          <Lightbulb className="feature-icon" strokeWidth={1.2} />
          <h3>INNOVATION</h3>
          <p>
            We believe innovation should feel effortless; and look good doing it.
          </p>
        </div>

        <div className="feature-item">
          <Recycle className="feature-icon" strokeWidth={1.2} />
          <h3>SUSTAINABILITY</h3>
          <p>
            From sustainable materials to minimal packaging, we’re committed to reducing waste.
          </p>
        </div>
      </div>
    </section>
    </div> 


       <Footer/>
    </>
  );
};

export default AboutPage;
