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
  const [playingIndex, setPlayingIndex] = useState(null);

  const galleries = useSelector((state) => state.home?.data?.galleries || []);

  /** 🔥 Infinite loop list */
  const loopList = [...galleries, ...galleries];

  /** 🔥 Maintain the loop scroll */
  const handleInfiniteScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const halfWidth = slider.scrollWidth / 2;

    // If scrolled beyond the first clone → jump back
    if (slider.scrollLeft >= halfWidth) {
      slider.scrollTo({ left: 1, behavior: "instant" });
    }

    // If scrolled too back → jump to end clone
    if (slider.scrollLeft <= 0) {
      slider.scrollTo({ left: halfWidth - 1, behavior: "instant" });
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener("scroll", handleInfiniteScroll);
    return () => slider.removeEventListener("scroll", handleInfiniteScroll);
  }, []);

  /** Left/Right buttons */
  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = 320;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handlePlay = (index, isReel = false) => {
    setPlayingIndex(index);
    const refs = isReel ? reelVideoRefs.current : videoRefs.current;

    refs.forEach((v, i) => {
      if (i !== index && v) {
        v.pause();
        v.currentTime = 0;
      }
    });

    if (refs[index]) refs[index].play();
  };

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

  const closeReel = () => {
    setActiveIndex(null);
    setPlayingIndex(null);
    document.body.style.overflow = "auto";
    reelVideoRefs.current.forEach((v) => v && v.pause());
  };

  const togglePause = (index, isReel = false) => {
    const refs = isReel ? reelVideoRefs.current : videoRefs.current;
    const video = refs[index];
    if (!video) return;

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
      <div className="video-header">
        <h2 className="video-heading">
          <span className="track_ost">Obsessions in</span> <em>Action</em>
        </h2>
        <p className="txt_sub_video_tag">
          See how our products blend into real homes, real moods, and real lifestyles.
        </p>
        <Link to={`/videogallery`}>
          <div className="track_btn_glr">
            <button className="hero-button">VIEW THE GALLERY</button>
          </div>
        </Link>
      </div>

      {/* 🔥 Horizontal Infinite Loop Slider */}
      <div className="video-slider-wrapper">
        <div className="video-slider" ref={sliderRef}>
          {loopList.map((video, index) => (
            <div className="video-card" key={index}>
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
                  <img
                    src={video.poster_image}
                    alt="thumbnail"
                    className="video-poster"
                  />
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

      {/* Reel View */}
      {activeIndex !== null && (
        <div className="reel-viewer">
          <button className="close-reel" onClick={closeReel}>
            ✕
          </button>
          <div className="reel-container">
            {galleries.map((video, index) => (
              <div
                className={`reel-video ${
                  index === activeIndex ? "active" : ""
                }`}
                key={index}
              >
                <div
                  className="reel-video-wrapper"
                  onClick={() => togglePause(index, true)}
                >
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
                        />
                      )}
                    </>
                  ) : (
                    <img
                      src={video.poster_image}
                      alt="thumbnail"
                      className="video-poster"
                    />
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
