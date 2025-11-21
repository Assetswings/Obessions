import React, { useEffect, useState } from 'react';
import Footer from "../../components/Footer/Footer";
import heroImg from "../../assets/images/stylehero.png";
import "./StyleGuide.css";
import rectimage from "../../assets/images/rltimage.png";
import roomgd from "../../assets/images/roomguid.png";
import largeimg from "../../assets/icons/largee.png";
import medimum from "../../assets/icons/medimum.png";
import API from '../../app/api';
import Skeleton from 'react-loading-skeleton';



const StyleGuide = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeShape, setActiveShape] = useState();
  const [activeRoom, setActiveRoom] = useState();
  const [shapeData, setShapeData] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const handleTerms = async () => {
    try {
      const res = await API.get("/pages/size-guide");
      if (res.data.status === 200) {
        setTimeout(() => {
          const newData = res.data?.data;
          setData(newData);
          const carpetfirstId = newData?.content?.[0]?.size_guides?.[0]?.id;
          if (carpetfirstId) {
            setActiveShape(carpetfirstId);
            setShapeData(newData?.content?.[0]?.size_guides?.find((s) => s.id === carpetfirstId));
          }
          const roomfirstId = newData?.content?.[1]?.size_guides?.[0]?.id;
          if (roomfirstId) {
            setActiveRoom(roomfirstId);
            setRoomData(newData?.content?.[1]?.size_guides?.find((s) => s.id === roomfirstId));
          }
          setLoading(false);
        }, 1000);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const setGuidetabdata = (id) => {
    if (id) {
      setActiveShape(id);
      setShapeData(data?.content[0]?.size_guides.find((s) => s.id === id));
    }
  }

  const setRoomtabdata = (id) => {
    if (id) {
      setActiveRoom(id);
      setRoomData(data?.content[1]?.size_guides.find((s) => s.id === id));
    }
  }
  useEffect(() => {
    document.title = "Obsession - Size Guide";
    handleTerms();
  }, []);

  // const current = data?.content[0]?.size_guides.find((s) => s.id === activeShape);
  const room = roomData[activeRoom];
  return (
    <>
      {loading ? (
        <div className="loading-skeleton" style={{ textAlign: "center" }}>
          {/* Paragraph-style skeleton */}
          <Skeleton width="80%" height={30} style={{ marginBottom: 15 }} />
          <Skeleton count={6} height={18} style={{ marginBottom: 8 }} />
          <Skeleton width="90%" height={18} style={{ marginBottom: 8 }} />
          <Skeleton width="80%" height={18} style={{ marginBottom: 8 }} />
          {/* <Skeleton count={2} height={18} style={{ marginBottom: 8 }} /> */}
        </div>
      ) : (
        <div className="styleguide-container">
          <section className="hero-section">
            <img src={data?.size_guide_banners?.media} alt={data?.size_guide_banners?.title} className="hero-image" />
            <div className="hero-text-sz">
              <h1>{data?.size_guide_banners?.title}</h1>
              <p>{data?.size_guide_banners?.description}</p>
            </div>
          </section>

          <section className="carpet-guide-container">
            <h2 className="guide-title">{data?.content[0]?.title}</h2>

            {/* Tabs */}
            <div className="tab-scroll-wrapper">
              <div className="tab-container">
                {data?.content[0]?.size_guides.map((shape) => (
                  <button
                    key={shape.id}
                    className={`tab-btn ${activeShape === shape.id ? "active" : ""
                      }`}
                    onClick={() => setGuidetabdata(shape.id)}
                  >
                    {shape.name.split(" ")[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="guide-content">
              <div className="guide-image">
                <img src={shapeData.media} alt={shapeData.name} />
              </div>
              <div className="guide-info">
                <h3>{shapeData.name}</h3>
                <p className="guide-desc">{shapeData.short_description}</p>
                <div dangerouslySetInnerHTML={{ __html: shapeData?.description }} />
                <button className="shop-btn">{shapeData.button_styles}</button>
              </div>
            </div>
          </section>
          <section className="roomguide-section">
            <h2 className="roomguide-title">Room to Room Guide</h2>

            <div className="tab-scroll-wrapper">
              <div className="roomguide-tabs">
                {data?.content[1]?.size_guides.map((key) => (
                  <button
                    key={key.id}
                    className={`roomguide-tab ${activeRoom === key.id ? "active" : ""
                      }`}
                    onClick={() => setRoomtabdata(key.id)}>
                    {key?.name.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="roomguide-content">
              <div className="roomguide-image">
                <img src={roomData.media} alt={roomData.name} />
              </div>
              <div className="roomguide-text">
                <h3 className="roomguide-heading">{roomData.name}</h3>
                <p className="roomguide-description">{roomData.short_description}</p>
                {/* <h4 className="roomguide-subtitle">Recommendation</h4> */}
                <div className="roomguide-recommendations">
                  {/* {roomData.recommendations.map((rec, i) => (
                    <div className="roomguide-recommendation" key={i}>
                      <img src={rec.img} alt={rec.size} />
                      <div>
                        <h5 className="roomguide-size">{rec.size}</h5>
                        <p className="roomguide-text-desc">{rec.text}</p>
                      </div>
                    </div>
                  ))} */}
                  <div dangerouslySetInnerHTML={{ __html: roomData?.description }} />
                </div>
                <button className="roomguide-btn">{roomData?.button_styles}</button>
              </div>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </>
  )
}

export default StyleGuide
