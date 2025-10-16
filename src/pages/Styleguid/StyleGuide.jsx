import React, { useState } from 'react';
import Footer from "../../components/Footer/Footer";
import heroImg from "../../assets/images/stylehero.png";
import "./StyleGuide.css";
import rectimage from "../../assets/images/rltimage.png";
import roomgd from "../../assets/images/roomguid.png";
import largeimg from "../../assets/icons/largee.png";
import medimum from "../../assets/icons/medimum.png";

const shapeData = [
  {
    id: "rectangular",
    title: "Rectangular Carpet",
    description:
      "These are the most commonly found rugs and are also called regular rugs. These rugs are available in standard sizes, making the selection process easy.",
    image: rectimage,
    chart: [
      { cm: "60 x 150", ft: "2 x 5", room: "" },
      { cm: "80 x 150", ft: "2.5 x 5", room: "Living Room" },
      { cm: "120 x 170", ft: "4 x 6", room: "Bedrooms" },
      { cm: "160 x 230", ft: "5 x 7", room: "Entryways" },
      { cm: "200 x 290", ft: "6 x 9", room: "Offices" },
      { cm: "240 x 340", ft: "8 x 11", room: "" },
    ],
    buttonText: "SHOP RECTANGULAR CARPET",
  },
  {
    id: "runners",
    title: "Runners",
    description:
      "Runners are long and narrow carpets designed for hallways or corridors. They add warmth and texture while protecting flooring in high-traffic areas.",
    image: heroImg,
    chart: [
      { cm: "60 x 180", ft: "2 x 6", room: "Hallways" },
      { cm: "80 x 240", ft: "2.5 x 8", room: "Kitchens" },
      { cm: "90 x 300", ft: "3 x 10", room: "Entryways" },
    ],
    buttonText: "SHOP RUNNERS",
  },
  {
    id: "oval",
    title: "Oval Carpets",
    description:
      "Oval rugs create a soft, flowing look and are perfect for adding elegance to bedrooms, dining rooms, or under round tables.",
    image: "https://via.placeholder.com/700x450",
    chart: [
      { cm: "120 x 180", ft: "4 x 6", room: "Bedrooms" },
      { cm: "160 x 230", ft: "5 x 7", room: "Dining Area" },
      { cm: "200 x 290", ft: "6 x 9", room: "Living Room" },
    ],
    buttonText: "SHOP OVAL CARPETS",
  },
  {
    id: "round",
    title: "Round Carpets",
    description:
      "Round rugs are great for creating focal points. Ideal under coffee tables, in kids’ rooms, or to soften angular furniture layouts.",
    image: "https://via.placeholder.com/700x450",
    chart: [
      { cm: "120", ft: "4 ft", room: "Kids Room" },
      { cm: "150", ft: "5 ft", room: "Living Room" },
      { cm: "180", ft: "6 ft", room: "Dining Area" },
    ],
    buttonText: "SHOP ROUND CARPETS",
  },
  {
    id: "shaped",
    title: "Shaped Rugs",
    description:
      "Shaped rugs break traditional boundaries. Available in abstract or themed designs, they bring creativity to playrooms or modern interiors.",
    image: "https://via.placeholder.com/700x450",
    chart: [
      { cm: "100 x 150", ft: "3 x 5", room: "Kids Room" },
      { cm: "120 x 180", ft: "4 x 6", room: "Study Room" },
    ],
    buttonText: "SHOP SHAPED RUGS",
  },
];
const roomData = {
  "Living Room": {
    title: "LIVING ROOM",
    description:
      "Your living room is where everything — and everyone — comes together. The right carpet doesn’t just lift the floor; it creates a zone for conversations, family time, and relaxation. It visually ties together the sofas, tables, and chairs, making the space feel warmer and more inviting.",
    image: roomgd,
    recommendations: [
      {
        size: "Medium",
        text: "In cozy living rooms, a medium-sized carpet works best. Place the front legs of your sofa and chairs on it to define the space without crowding.",
        img: medimum,
      },
      {
        size: "Large",
        text: "In spacious living rooms, choose a large carpet that fits the entire seating area. It grounds the space and adds a touch of luxury.",
        img: largeimg,
      },
    ],
  },
  Bedroom: {
    title: "BEDROOM",
    description:
      "A bedroom carpet softens the space and makes mornings cozier. Choose one that extends beyond the bed for balance and comfort.",
    image: "/images/bedroom.jpg",
    recommendations: [
      {
        size: "Medium",
        text: "A medium carpet under the lower two-thirds of the bed adds texture without overwhelming.",
        img: "/images/bed-medium.png",
      },
      {
        size: "Large",
        text: "For master bedrooms, use a large carpet covering the area beyond nightstands for a luxurious feel.",
        img: "/images/bed-large.png",
      },
    ],
  },
  "Dining Room": {
    title: "DINING ROOM",
    description:
      "A dining room rug anchors your table and chairs, protecting your floor and defining the dining zone.",
    image: "/images/dining-room.jpg",
    recommendations: [
      {
        size: "Medium",
        text: "Choose a rug that fits all chairs even when pulled out slightly.",
        img: "/images/dine-medium.png",
      },
      {
        size: "Large",
        text: "A large carpet that extends well beyond the table creates an elegant, balanced setting.",
        img: "/images/dine-large.png",
      },
    ],
  },
  Office: {
    title: "OFFICE",
    description:
      "In your home office, a carpet adds comfort and professionalism while reducing echo and enhancing focus.",
    image: "/images/office.jpg",
    recommendations: [
      {
        size: "Medium",
        text: "Place a medium rug beneath the desk and chair to define your workspace.",
        img: "/images/office-medium.png",
      },
      {
        size: "Large",
        text: "A large rug can cover most of the room to create a calm, cohesive feel.",
        img: "/images/office-large.png",
      },
    ],
  },
  "Kids Room": {
    title: "KIDS ROOM",
    description:
      "Add playfulness and warmth to your kids' room with a soft, durable carpet perfect for playtime.",
    image: "/images/kids-room.jpg",
    recommendations: [
      {
        size: "Medium",
        text: "A medium rug defines the play area and is easy to maintain.",
        img: "/images/kids-medium.png",
      },
      {
        size: "Large",
        text: "For bigger rooms, a large carpet covers the entire area for comfort and safety.",
        img: "/images/kids-large.png",
      },
    ],
  },
  "Reading Room": {
    title: "READING ROOM",
    description:
      "A cozy rug under your reading nook can make your space feel calm and grounded — perfect for unwinding with a book.",
    image: "/images/reading-room.jpg",
    recommendations: [
      {
        size: "Medium",
        text: "A medium rug under your chair and ottoman adds softness to your reading corner.",
        img: "/images/read-medium.png",
      },
      {
        size: "Large",
        text: "A larger rug defines the whole reading space and creates a sense of tranquility.",
        img: "/images/read-large.png",
      },
    ],
  },
};
const StyleGuide = () => {
  const [activeShape, setActiveShape] = useState("rectangular");
  const current = shapeData.find((s) => s.id === activeShape);
  const [activeRoom, setActiveRoom] = useState("Living Room");
  const room = roomData[activeRoom];
  return (
    <>
      <div className="styleguide-container">
        <section className="hero-section">
          <img src={heroImg} alt="Carpet Style" className="hero-image" />
          <div className="hero-text-sz">
            <h1>Carpet Size Guide</h1>
            <p>
              Choosing the right carpet size can transform a room.
              Use this guide to visualize proportions and find the perfect fit for your space.
            </p>
          </div>
        </section>

        <section className="carpet-guide-container">
          <h2 className="guide-title">Carpet Shapes Guide</h2>

          {/* Tabs */}
          <div className="tab-container">
            {shapeData.map((shape) => (
              <button
                key={shape.id}
                className={`tab-btn ${activeShape === shape.id ? "active" : ""
                  }`}
                onClick={() => setActiveShape(shape.id)}
              >
                {shape.title.split(" ")[0].toUpperCase()}
              </button>
            ))}
          </div>

          {/* Content Section */}
          <div className="guide-content">
            <div className="guide-image">
              <img src={current.image} alt={current.title} />
            </div>

            <div className="guide-info">
              <h3>{current.title}</h3>
              <p className="guide-desc">{current.description}</p>

              <table className="conversion-table">
                <thead>
                  <tr>
                    <th colSpan="3">Conversion Chart</th>
                  </tr>
                  <tr>
                    <th>Size in Cm</th>
                    <th>Size in Ft.</th>
                    <th>Recommended For</th>
                  </tr>
                </thead>
                <tbody>
                  {current.chart.map((row, i) => (
                    <tr key={i}>
                      <td>{row.cm}</td>
                      <td>{row.ft}</td>
                      <td>{row.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button className="shop-btn">{current.buttonText}</button>
            </div>
          </div>
        </section>
        <section className="roomguide-section">
          <h2 className="roomguide-title">Room to Room Guide</h2>

          <div className="roomguide-tabs">
            {Object.keys(roomData).map((key) => (
              <button
                key={key}
                className={`roomguide-tab ${activeRoom === key ? "active" : ""
                  }`}
                onClick={() => setActiveRoom(key)}>
                {key.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="roomguide-content">
            <div className="roomguide-image">
              <img src={room.image} alt={room.title} />
            </div>
            <div className="roomguide-text">
              <h3 className="roomguide-heading">{room.title}</h3>
              <p className="roomguide-description">{room.description}</p>
              <h4 className="roomguide-subtitle">Recommendation</h4>
              <div className="roomguide-recommendations">
                {room.recommendations.map((rec, i) => (
                  <div className="roomguide-recommendation" key={i}>
                    <img src={rec.img} alt={rec.size} />
                    <div>
                      <h5 className="roomguide-size">{rec.size}</h5>
                      <p className="roomguide-text-desc">{rec.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="roomguide-btn">SHOP NOW</button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default StyleGuide
