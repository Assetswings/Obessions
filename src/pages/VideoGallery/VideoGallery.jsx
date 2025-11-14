import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../app/api";
import "./VideoGallery.css";
import { ChevronLeft } from "lucide-react";

export default function VideoGallery() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const scrollRef = useRef(null);
  const videoRefs = useRef([]);

  const COLUMNS = 4;

  // Fetch videos
  const fetchVideos = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await API.get(`/gallery?page=${pageNum}`);
      if (res.data?.status === 200 && Array.isArray(res.data.data)) {
        if (res.data.data.length === 0) {
          setHasMore(false);
        } else {
          // Pre-generate consistent heights for new videos
          const newVideos = res.data.data.map((v) => ({
            ...v,
            height: v.height || Math.floor(Math.random() * 80) + 320, // increase min height
          }));
          setVideos((prev) => [...prev, ...newVideos]);
        }
      }
    } catch (err) {
      console.error("Gallery fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  // Infinite scroll
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
      setPage((prev) => prev + 1);
    }
  };

  // Distribute videos into columns
  const columns = Array.from({ length: COLUMNS }, () => []);
  const heights = Array.from({ length: COLUMNS }, () => 0);

  videos.forEach((video) => {
    const minIndex = heights.indexOf(Math.min(...heights));
    columns[minIndex].push(video);
    heights[minIndex] += video.height + 14;
  });

  // Hover play logic
  const handleMouseEnter = (index) => {
    const video = videoRefs.current[index];
    if (video) video.play().catch(() => {});
  };

  const handleMouseLeave = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.load(); // reset to poster
    }
  };

  const handleVideoClick = (v) => setSelectedVideo(v);
  const closeModal = () => setSelectedVideo(null);

  if (!videos.length && !loading)
    return <div className="gallery-loading">Loading videos...</div>;

  return (
    <>
      <button className="back-btn_glr" onClick={() => navigate(-1)}>
        <ChevronLeft />
      </button>

      <div ref={scrollRef} className="gallery-wrapper" onScroll={handleScroll}>
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="gallery-column">
            {col.map((v) => {
              const videoIndex = videos.findIndex((vid) => vid.id === v.id);
              const isVideo =
                v.media &&
                (v.media.endsWith(".mp4") ||
                  v.media.endsWith(".webm") ||
                  v.media.endsWith(".mov"));

              return (
                <div
                  key={v.id}
                  className="gallery-item"
                  style={{ height: v.height }}
                  onMouseEnter={() => handleMouseEnter(videoIndex)}
                  onMouseLeave={() => handleMouseLeave(videoIndex)}
                  onClick={() => handleVideoClick(v)}
                >
                  {isVideo ? (
                    <video
                      ref={(el) => (videoRefs.current[videoIndex] = el)}
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
                      alt="Video thumbnail"
                      className="video-box"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
        {loading && <div className="gallery-loading">Loading more videos...</div>}
      </div>

      {/* Modal */}
      {selectedVideo && (
        <div className="video-modal" onClick={closeModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            {selectedVideo.media &&
            (selectedVideo.media.endsWith(".mp4") ||
              selectedVideo.media.endsWith(".webm") ||
              selectedVideo.media.endsWith(".mov")) ? (
              <video
                key={selectedVideo.media} // force reload on change
                src={selectedVideo.media}
                autoPlay
                muted={false}
                controls
                playsInline
                className="modal-video"
              />
            ) : (
              <img
                src={selectedVideo.poster_image || "/fallback.jpg"}
                alt="Video thumbnail"
                className="modal-video"
              />
            )}
            <button className="close-btn" onClick={closeModal}>
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
