import React, { useRef, useState } from "react";
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
  const [playingIndex, setPlayingIndex] = useState(null);

  const galleries = useSelector((state) => state.home?.data?.galleries || []);

  // Horizontal scroll
  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = 320;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Play a video and pause all others
  const handlePlay = (index, isReel = false) => {
    setPlayingIndex(index);
    const refs = isReel ? reelVideoRefs.current : videoRefs.current;
    refs.forEach((v, i) => {
      if (i !== index && v) {
        v.pause();
        v.currentTime = 0; // reset to show poster
      }
    });
    if (refs[index]) refs[index].play();
  };

  // Open reel mode
  const handleVideoClick = (index) => {
    videoRefs.current.forEach((v) => v && v.pause());
    setActiveIndex(index);
    setPlayingIndex(index);
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      const reelContainer = document.querySelector(".reel-viewer");
      if (reelContainer) {
        reelContainer.scrollTo({
          top: window.innerHeight * index,
          behavior: "instant",
        });
      }
    }, 100);
  };

  // Close reel
  const closeReel = () => {
    setActiveIndex(null);
    setPlayingIndex(null);
    document.body.style.overflow = "auto";
    reelVideoRefs.current.forEach((v) => v && v.pause());
  };

  // Toggle play/pause
  const togglePause = (index, isReel = false) => {
    const refs = isReel ? reelVideoRefs.current : videoRefs.current;
    if (!refs[index]) return;
    const video = refs[index];
    if (video.paused) {
      video.play();
      setPlayingIndex(index);
    } else {
      video.pause();
      setPlayingIndex(null);
    }
    };

  return (
    <section className="video-section">
      {/* Header */}
      <div className="video-header">
        <h2 className="video-heading">
          <span className="track_ost">Obsessions in</span> <em>Action</em>
        </h2>
        <p className="txt_sub_video_tag">
          See how our products blend into real homes, real moods, and real lifestyles.
        </p>
        <Link to={`/videogallery`}>
          <div className="track_btn_glr">
            <button className="matcher-btn">VIEW THE GALLERY</button>
          </div>
        </Link>
      </div>

      {/* Horizontal Slider */}
      <div className="video-slider-wrapper">
        <div className="video-slider" ref={sliderRef}>
          {galleries.map((video, index) => (
            <div className="video-card" key={video.id || index}>
              <div className="video-wrapper">
                {video.uploaded_media ? (
                  <>
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={video.uploaded_media}
                      muted={false}
                      playsInline
                      controls={playingIndex === index}
                      poster={video.poster_image}
                      onClick={() => togglePause(index)}
                      onPlay={() => handlePlay(index)}
                    />
                    {/* Poster overlay if video is not playing */}
                    {playingIndex !== index && (
                      <img
                        src={video.poster_image}
                        className="video-poster"
                        alt="thumbnail"
                        onClick={() => handlePlay(index)}
                      />
                    )}
                  </>
                ) : (
                  <img src={video.poster_image} alt="thumbnail" className="video-poster" />
                )}
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

      {/* Fullscreen Reels */}
      {activeIndex !== null && (
        <div className="reel-viewer">
          <button className="close-reel" onClick={closeReel}>✕</button>
          <div className="reel-container">
            {galleries.map((video, index) => (
              <div className={`reel-video ${index === activeIndex ? "active" : ""}`} key={index}>
                <div className="reel-video-wrapper" onClick={() => togglePause(index, true)}>
                  {video.uploaded_media ? (
                    <>
                      <video
                        ref={(el) => (reelVideoRefs.current[index] = el)}
                        src={video.uploaded_media}
                        muted={false}
                        playsInline
                        controls
                        autoPlay={index === activeIndex}
                        poster={video.poster_image}
                        onPlay={() => handlePlay(index, true)}
                      />
                      {playingIndex !== index && (
                        <img
                          src={video.poster_image}
                          className="video-poster"
                          alt="thumbnail"
                          onClick={() => handlePlay(index, true)}
                        />
                      )}
                    </>
                  ) : (
                    <img src={video.poster_image} alt="thumbnail" className="video-poster" />
                  )}
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
