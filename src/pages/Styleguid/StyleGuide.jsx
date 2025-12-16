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
import { Link } from 'react-router-dom';



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
        <div className="styleguide-skeleton" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>

          {/* ---------- HERO SKELETON ---------- */}
          <div style={{ position: "relative", height: "471px", marginBottom: 50 }}>
            <Skeleton width="100%" height="100%" />
            <div style={{ position: "absolute", bottom: 50, left: 70, maxWidth: 600 }}>
              <Skeleton width="70%" height={40} style={{ marginBottom: 15 }} />
              <Skeleton width="90%" height={20} count={2} style={{ marginBottom: 10 }} />
            </div>
          </div>

          {/* ---------- CARPET GUIDE TABS ---------- */}
          <Skeleton width="40%" height={30} style={{ margin: "0 auto 20px" }} /> {/* Guide title */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 40 }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} width={80} height={30} />
            ))}
          </div>

          {/* ---------- CARPET GUIDE CONTENT ---------- */}
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap", marginBottom: 80 }}>
            <Skeleton width={600} height={500} /> {/* Image */}
            <div style={{ flex: 1, minWidth: 250 }}>
              <Skeleton width="60%" height={24} style={{ marginBottom: 12 }} /> {/* Name */}
              <Skeleton width="100%" height={16} count={3} style={{ marginBottom: 12 }} /> {/* Short desc */}
              <Skeleton width="100%" height={16} count={5} style={{ marginBottom: 20 }} /> {/* HTML content */}
              <Skeleton width={120} height={36} /> {/* Button */}
            </div>
          </div>

          {/* ---------- ROOM GUIDE ---------- */}
          <Skeleton width="35%" height={28} style={{ margin: "0 auto 20px" }} /> {/* Room guide title */}
          <div style={{ display: "flex", justifyContent: "center", gap: 15, flexWrap: "wrap", marginBottom: 30 }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} width={80} height={28} />
            ))}
          </div>

          {/* ---------- ROOM GUIDE CONTENT ---------- */}
          <div style={{ display: "flex", gap: 30, flexWrap: "wrap", marginBottom: 80 }}>
            <Skeleton width="50%" height={350} /> {/* Room image */}
            <div style={{ flex: 1, minWidth: 250 }}>
              <Skeleton width="60%" height={20} style={{ marginBottom: 10 }} /> {/* Name */}
              <Skeleton width="100%" height={14} count={3} style={{ marginBottom: 10 }} /> {/* Short desc */}
              <Skeleton width="100%" height={14} count={5} style={{ marginBottom: 12 }} /> {/* HTML content */}
              <Skeleton width={120} height={36} /> {/* Button */}
            </div>
          </div>

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
                {/* <div dangerouslySetInnerHTML={{ __html: shapeData?.description }} /> */}
                <div>
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
                      {shapeData?.size_guide_sizes.map((item) => (
                        <tr key={item.id}>
                          <td>{item.size_in_cm}</td>
                          <td>{item.size_in_feet}</td>
                          <td>{item.recommended || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link to={`/products${shapeData?.action_url}`}>
                  <button className="shop-btn">{shapeData.button_styles}</button>
                </Link>
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
                <h4 className="roomguide-subtitle">Recommendation</h4>
                <div className="roomguide-recommendations">
                  {roomData.size_guide_images.map((rec, i) => (
                    <>
                      <div className="roomguide-recommendation" key={i}>
                        <div style={{ display: "flex", gap: "72px" }}>
                          {rec.media_1 && <img src={rec.media_1} alt={rec.size} />}
                          {rec.media_2 && <img src={rec.media_2} alt={rec.size} />}
                        </div>
                      </div>
                      <div>
                        <h5 className="roomguide-size">{rec.name}</h5>
                        <p className="roomguide-text-desc">{rec.description}</p>
                      </div>
                    </>
                  ))}
                  <div dangerouslySetInnerHTML={{ __html: roomData?.description }} />
                </div>
                <Link to={`/products${roomData?.action_url}`}>
                  <button className="roomguide-btn">{roomData?.button_styles}</button>
                </Link>
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
