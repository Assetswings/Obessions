import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../app/api";
import "./VideoGallery.css";
import { ChevronLeft } from "lucide-react";

export default function VideoGallery() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const scrollRef = useRef(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    document.title = "Obsession - Video Gallery";
    (async () => {
      try {
        const res = await API.get("/gallery");
        if (res.data?.status === 200 && Array.isArray(res.data.data)) {
          setVideos(res.data.data);
        } else {
          console.error("Invalid gallery data:", res.data);
        }
      } catch (err) {
        console.error("Gallery fetch error:", err);
      }
    })();
  }, []);

  const TILES = 3;
  const totalGrid = videos.length
    ? Array.from({ length: TILES * TILES }, () => videos).flat()
    : [];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || totalGrid.length === 0) return;
    const id = setTimeout(() => {
      el.scrollLeft = el.scrollWidth / 3;
      el.scrollTop = el.scrollHeight / 3;
    }, 50);
    return () => clearTimeout(id);
  }, [totalGrid.length]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const thirdX = el.scrollWidth / 3;
    const thirdY = el.scrollHeight / 3;
    const pad = 50;

    if (el.scrollLeft < pad) el.scrollLeft += thirdX;
    else if (el.scrollLeft > thirdX * 2 - pad) el.scrollLeft -= thirdX;

    if (el.scrollTop < pad) el.scrollTop += thirdY;
    else if (el.scrollTop > thirdY * 2 - pad) el.scrollTop -= thirdY;
  };

  const handleMouseEnter = (index) => {
    videoRefs.current.forEach((vid, i) => {
      if (vid && i !== index) {
        try {
          vid.pause();
          vid.load();
        } catch {}
      }
    });
    const video = videoRefs.current[index];
    if (video) {
      try {
        video.play().catch(() => {});
      } catch {}
    }
  };

  const handleMouseLeave = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      try {
        video.pause();
        video.load();
      } catch {}
    }
  };

  const handleVideoClick = (v) => setSelectedVideo(v);
  const closeModal = () => setSelectedVideo(null);

  if (!videos.length) {
    return <div className="gallery-loading">Loading videos...</div>;
  }

  return (
    <>
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ChevronLeft />
      </button>

      <div ref={scrollRef} className="gallery-wrapper" onScroll={handleScroll}>
        {totalGrid.map((v, i) => {
          const isValid =
            v.media &&
            (v.media.endsWith(".mp4") ||
              v.media.endsWith(".webm") ||
              v.media.endsWith(".mov"));

          return (
            <div
              className="gallery-item"
              key={`${i}-${v.id || i}`}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
              onClick={() => handleVideoClick(v)}
            >
              {isValid ? (
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  className="video-box"
                  src={v.media}
                  poster={v.poster_image}
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={v.poster_image || "/fallback.jpg"}
                  alt="Video thumbnail"
                  className="video-box"
                />
              )}
            </div>
          );
        })}
      </div>

      {selectedVideo && (
        <div className="video-modal" onClick={closeModal}>
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={selectedVideo.media}
              autoPlay
              controls
              playsInline
              className="modal-video"
            />
            <button className="close-btn" onClick={closeModal}>
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
