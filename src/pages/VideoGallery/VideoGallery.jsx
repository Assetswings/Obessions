import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../app/api";
import "./VideoGallery.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function VideoGallery() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const videoRefs = useRef([]);
  const COLUMNS = 4;

  // ✅ Fetch ONLY what API gives (no infinite)
  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await API.get("/gallery");

      if (res.data?.status === 200 && Array.isArray(res.data.data)) {
        const mapped = res.data.data.map((v) => ({
          ...v,
          height: v.height || Math.floor(Math.random() * 80) + 320,
        }));
        setVideos(mapped);
      }
    } catch (err) {
      console.error("Gallery error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // 🧱 Masonry layout
  const columns = Array.from({ length: COLUMNS }, () => []);
  const heights = Array.from({ length: COLUMNS }, () => 0);

  videos.forEach((video) => {
    const minIndex = heights.indexOf(Math.min(...heights));
    columns[minIndex].push(video);
    heights[minIndex] += video.height + 14;
  });

  const handleMouseEnter = (i) => {
    const video = videoRefs.current[i];
    video?.play().catch(() => {});
  };

  const handleMouseLeave = (i) => {
    const video = videoRefs.current[i];
    if (video) {
      video.pause();
      video.load();
    }
  };

  const openModal = (index) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const showNext = () => {
    if (selectedIndex < videos.length - 1)
      setSelectedIndex((prev) => prev + 1);
  };

  const showPrevious = () => {
    if (selectedIndex > 0) setSelectedIndex((prev) => prev - 1);
  };

  const selectedVideo =
    selectedIndex !== null ? videos[selectedIndex] : null;

  if (loading) {
    return (
      <div className="gallery-full-loader">
        <div className="loader-ring"></div>
      </div>
    );
  }

  return (
    <>
      <button className="back-btn_glr" onClick={() => navigate(-1)}>
        <ChevronLeft />
      </button>

      <div className="gallery-wrapper">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="gallery-column">
            {col.map((v) => {
              const videoIndex = videos.findIndex(
                (vid) => vid.id === v.id
              );

              const isVideo =
                v.media &&
                (v.media.endsWith(".mp4") ||
                  v.media.endsWith(".mov") ||
                  v.media.endsWith(".webm"));

              return (
                <div
                  key={v.id}
                  className="gallery-item"
                  style={{ height: v.height }}
                  onMouseEnter={() => handleMouseEnter(videoIndex)}
                  onMouseLeave={() => handleMouseLeave(videoIndex)}
                  onClick={() => openModal(videoIndex)}
                >
                  {isVideo ? (
                    <video
                      ref={(el) =>
                        (videoRefs.current[videoIndex] = el)
                      }
                      className="video-box"
                      src={v.media}
                      poster={v.poster_image}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={v.poster_image || "/fallback.jpg"}
                      alt=""
                      className="video-box"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 🎬 Modal */}
      {selectedVideo && (
        <div className="video-modal" onClick={closeModal}>
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              key={selectedVideo.media}
              src={selectedVideo.media}
              autoPlay
              controls
              className="modal-video"
            />

            <button className="close-btn-vd" onClick={closeModal}>
              ✕
            </button>

            {selectedIndex > 0 && (
              <button className="prev-btn" onClick={showPrevious}>
                <ChevronLeft />
              </button>
            )}

            {selectedIndex < videos.length - 1 && (
              <button className="next-btn" onClick={showNext}>
                <ChevronRight />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
