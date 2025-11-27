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
  console.log(data, 'about us data');
  useEffect(() => {
    document.title = "Obsession - About Us";
    dispatch(fetchAboutUs());
  }, [dispatch]);
  return (
    <>
      <div className="about-wrapper">
        {/* Hero Section */}
        <section
          className="about-hero"
          style={{
            backgroundImage: `url(${data?.bg_media})`,

            backgroundSize: "cover",       // makes image fully cover section
            backgroundPosition: "center",  // centers the image
            backgroundRepeat: "no-repeat", // prevents tiling
          }}
        >
          <div className="hero-overlay">
            <h1>
              <p
                className="track_set_hader"
                dangerouslySetInnerHTML={{
                  __html: data?.bg_short_desc?.replace(/\{\"\s*\"\}/g, " "),
                }}
              />
            </h1>
          </div>
        </section>

        <section>
          <div className="slogan_part">
            <span><img class="img_turner" src="https://i.ibb.co/qL71DQj5/icon.png" /> &nbsp;</span> Good design doesn’t ask for attention; it earns it. <span />
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


        <div className="philosophy-right-mlb">
          <img
            src={data.our_philosophy?.right}
            alt="Craftsman Weaving"
          />
        </div>


        <section className="philosophy-section">
          <div className="philosophy-left">
            <h2>
              <span style={{ color: 'black' }} className="italic">Our</span>{" "}
              <span className="ph_txt">Philosophy</span>
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

      <section className="thirty-years-section">
        <div className="container">
          <div className="row align-items-center">


            {/* Left Image Columns */}
            <div className="col-md-6 ">
              <div className="row">
                {/* Left Column */}
                <div className="col-lg-6 col-md-6">
                  <div className="photo-col">
                    {Object.values(data?.thirty_years?.left || {}).map((url, index) => (
                      <img key={index} src={url} alt="Thirty Years Left" />
                    ))}
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-lg-6 col-md-6">
                  <div className="photo-col">
                    {Object.values(data?.thirty_years?.right || {}).map((url, index) => (
                      <img key={index} src={url} alt="Thirty Years Right" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Text Section */}
            <div className="col-md-6">
              <div className="text-section">
                <p>{data?.thirty_years?.other?.description || ""}</p>
                <div className="divider-line"></div>
                <h1>{data?.thirty_years?.other?.transforms} <span className="sub_txt"> Years</span></h1>
                <h4>{data?.thirty_years?.other?.transforms_text}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="thirty-years-section-mlb ">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Image Columns */}
            <div className="col-md-6 ">
              <div className="row">
                {/* Left Column */}
                <div className="col-lg-6 col-md-6">
                  <div className="photo-col">
                    {Object.values(data?.thirty_years?.left || {}).map((url, index) => (
                      <img key={index} src={url} alt="Thirty Years Left" />
                    ))}
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-lg-6 col-md-6">
                  <div className="photo-col">
                    {Object.values(data?.thirty_years?.right || {}).map((url, index) => (
                      <img key={index} src={url} alt="Thirty Years Right" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Text Section */}
            <div className="col-md-6">
              <div className="text-section">
                <p>{data?.thirty_years?.other?.description || ""}</p>
                <div className="divider-line"></div>
                <h1>{data?.thirty_years?.other?.transforms} <span className="sub_txt"> Years</span></h1>
                <h4>{data?.thirty_years?.other?.transforms_text}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>


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
            <p>{data?.obsession_promise?.description}</p>
          </div>

          <div className="promise-features">
            <div className="feature-item">
              <Palette className="feature-icon" strokeWidth={1.2} />
              <h3>CRAFTSMANSHIP</h3>
              <p>{data?.obsession_promise?.craftsmanship}</p>
            </div>

            <div className="feature-item">
              <Lightbulb className="feature-icon" strokeWidth={1.2} />
              <h3>INNOVATION</h3>
              <p>{data?.obsession_promise?.innovation}</p>
            </div>

            <div className="feature-item">
              <Recycle className="feature-icon" strokeWidth={1.2} />
              <h3>SUSTAINABILITY</h3>
              <p>{data?.obsession_promise?.sustainability}</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
