import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./BestsellersSlider.css";
// import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
import { Expand, Heart } from "lucide-react";
import arrowleft from "../../assets/icons/ArrowLeft.png";
import arrowright from "../../assets/icons/ArrowRight.png";

const BestsellersSlider = () => {
  const { data } = useSelector((state) => state.home);
  const bestsellers = data?.bestSellers || [];
  const [startIndex, setStartIndex] = useState(0);
  const handlePrev = () => {
  setStartIndex((prev) => Math.max(prev - 1, 0));
  };
  const handleNext = () => {
  setStartIndex((prev) => Math.min(prev + 1, bestsellers.length - 3));
  };

  return (
    <div className="bestseller-container">
      <div className="bestseller-slider">
        {/* Left Scrolling Card */}
        <div className="slider-strip">
          {bestsellers.slice(startIndex, startIndex + 1).map((item) => (
            <div className="bestseller-card" key={item.id}>
              <div className="image-wrapper">
                <img src={item.media} alt={item.name} />
                <span className="quick-view">Quick View &nbsp;<span><Expand color="#000000" size={15} strokeWidth={1.25} /></span></span>
                <span className="fav-icon">
                  {/* <FaHeart /> */}
                  <Heart color="#000000" size={20} strokeWidth={2} />
                </span>
              </div>
              <div className="product-info-card">
                <p className="title">{item.name}</p>
                <p className="price">₹{item.selling_price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Center Fixed Card */}
        <div className="bestseller-fixed-card">
          <h3>
            Get the <em>Bestsellers</em>
          </h3>
          <div className="arrow-controls">
            <button onClick={handlePrev}>
              <img className="btn_left_arrow" src={arrowleft} alt="prev" />
            </button>
            <button onClick={handleNext}>
              <img className="btn_right_arrow" src={arrowright} alt="next" />
            </button>
          </div>
        </div>

        {/* Right Scrolling Cards */}
        <div className="slider-strip">
          {bestsellers.slice(startIndex + 1, startIndex + 4).map((item) => (
            <div className="bestseller-card" key={item.id}>
              <div className="image-wrapper">
                <img src={item.media} alt={item.name} />
                <span className="quick-view">Quick View &nbsp;<span><Expand color="#000000" size={15} strokeWidth={1.25} /></span></span>
                <span className="fav-icon">
                  {/* <FaHeart /> */}
                  <Heart color="#000000" size={20} strokeWidth={2} />
                </span>
              </div>
              <div className="product-info">
                <p className="title">{item.name}</p>
                <p className="price">₹{item.selling_price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestsellersSlider;
