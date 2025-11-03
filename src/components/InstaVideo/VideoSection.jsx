import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./VideoSection.css";
import Arrowleft from "../../assets/icons/ArrowLeft.png";
import Arrowright from "../../assets/icons/ArrowRight.png";

const VideoSection = () => {
  const sliderRef = useRef(null);
  const videoRefs = useRef([]);
  const reelVideoRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [paused, setPaused] = useState(false);

  const galleries = useSelector((state) => state.home?.data?.galleries || []);
  console.log("video_data------>", galleries);

  // Horizontal slider scroll
  const scroll = (direction) => {
    const { current } = sliderRef;
    if (current) {
      const scrollAmount = 320;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Pause other videos but keep their thumbnails
  const handlePlay = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (i !== index && video) {
        video.pause();
        // ❌ Do NOT reset currentTime, this removes the poster
        // ✅ Just pause
      }
    });
  };

  // Open reel view for specific video
  const handleVideoClick = (index) => {
    videoRefs.current.forEach((v) => {
      if (v) {
        v.pause();
        v.currentTime = 0; // OK here since we're leaving the slider
      }
    });

    setActiveIndex(index);
    setPaused(false);
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      const reelContainer = document.querySelector(".reel-viewer");
      if (reelContainer) {
        reelContainer.scrollTo({
          top: window.innerHeight * index,
          behavior: "instant",
        });
      }
    }, 50);
  };

  // Close reel mode
  const closeReel = () => {
    setActiveIndex(null);
    setPaused(false);
    document.body.style.overflow = "auto";

    // Reset reel videos so next open starts from start
    reelVideoRefs.current.forEach((v) => {
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });
  };

  // Auto-play reel video
  useEffect(() => {
    if (activeIndex !== null && reelVideoRefs.current[activeIndex]) {
      reelVideoRefs.current[activeIndex].currentTime = 0;
      reelVideoRefs.current[activeIndex].play();
    }
  }, [activeIndex]);

  // Handle vertical scroll for reels
  const handleScroll = (e) => {
    const container = e.target;
    const newIndex = Math.round(container.scrollTop / window.innerHeight);
    if (newIndex !== activeIndex && galleries[newIndex]) {
      if (reelVideoRefs.current[activeIndex]) {
        reelVideoRefs.current[activeIndex].pause();
        reelVideoRefs.current[activeIndex].currentTime = 0;
      }
      setActiveIndex(newIndex);
      setPaused(false);
    }
  };

  // Toggle play/pause
  const togglePause = () => {
    if (!reelVideoRefs.current[activeIndex]) return;
    if (paused) {
      reelVideoRefs.current[activeIndex].play();
    } else {
      reelVideoRefs.current[activeIndex].pause();
    }
    setPaused(!paused);
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (!reelVideoRefs.current[activeIndex]) return;
    reelVideoRefs.current[activeIndex].muted =
      !reelVideoRefs.current[activeIndex].muted;
  };

  return (
    <section className="video-section">
      {/* Header */}
      <div className="video-header">
        <h2 className="video-heading">
          <span className="track_ost">Obsessions in</span> <em>Action</em>
        </h2>
        <p className="txt_sub_video_tag">
          See how our products blend into real homes, real moods, and real
          lifestyles.
        </p>
        <Link to={`/videogallery`}>
          <div className="track_btn_glr">
            <button className="matcher-btn">VIEW THE GALLERY</button>
          </div>
        </Link>
      </div>

      {/* Horizontal video slider */}
      <div className="video-slider-wrapper">
        <div className="video-slider" ref={sliderRef}>
          {galleries.map((video, index) => (
            <div
              className="video-card"
              key={video.id}
              onClick={() => handleVideoClick(index)}
            >
              <div className="video-wrapper">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={video.uploaded_media}
                  poster={video.poster_image} // ✅ Thumbnail always visible
                  muted
                  playsInline
                  controls={false}
                  onPlay={() => handlePlay(index)}
                  onMouseEnter={(e) =>
                    e.currentTarget.setAttribute("controls", true)
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget.removeAttribute("controls")
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="slider-controls">
          <div className="button_box" onClick={() => scroll("left")}>
            <img className="btn_left_arrow" src={Arrowleft} alt="left" />
          </div>
          <div className="button_box" onClick={() => scroll("right")}>
            <img className="btn_right_arrow" src={Arrowright} alt="right" />
          </div>
        </div>
      </div>

      {/* Reels viewer overlay */}
      {activeIndex !== null && (
        <div className="reel-viewer" onScroll={handleScroll}>
          <button className="close-reel" onClick={closeReel}>
            ✕
          </button>
          <div className="reel-container">
            {galleries.map((video, index) => (
              <div
                key={index}
                className={`reel-video ${
                  index === activeIndex ? "active" : ""
                }`}
              >
                <div className="reel-video-wrapper" onClick={togglePause}>
                  <video
                    ref={(el) => (reelVideoRefs.current[index] = el)}
                    src={video.uploaded_media}
                    poster={video.poster_image}
                    muted
                    playsInline
                    controls={true}
                    autoPlay={index === activeIndex}
                    onEnded={() => {
                      if (index < galleries.length - 1)
                        setActiveIndex(index + 1);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoSection;
