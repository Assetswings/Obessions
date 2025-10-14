import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import './VideoSection.css';
import { Link, useNavigate } from 'react-router-dom';
// arrow icons
import Arrowleft from "../../assets/icons/ArrowLeft.png";
import Arrowright from "../../assets/icons/ArrowRight.png";

const VideoSection = () => {
  const sliderRef = useRef(null);
  const videoRefs = useRef([]); // store refs for all videos
  const navigate = useNavigate();

  // 🔥 Access the galleries data from Redux
  const galleries = useSelector((state) => state.home?.data?.galleries || []);

  const scroll = (direction) => {
    const { current } = sliderRef;
    if (current) {
      const scrollAmount = 320;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // 👇 Pause + reset all other videos when one starts playing
  const handlePlay = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (i !== index && video) {
        video.pause();
        video.currentTime = 0; // reset to start
      }
    });
  };

  return (
    <section className="video-section">
      <div className="video-header">
        <h2 className="video-heading">
          Obsessions in <em>Action</em>
        </h2>
        <p className='txt_sub_video_tag'>
          See how our products blend into real homes, real moods, and real lifestyles.
        </p>
        <Link to={`/videogallery`}>
          <button
            className='matcher-btn'
          >
            VIEW THE GALLERY
          </button>
        </Link>
      </div>

      <div className="video-slider-wrapper">
        <div className="video-slider" ref={sliderRef}>
          {galleries.map((video, index) => (
            <div className="video-card" key={video.id}>
              <div className="video-wrapper">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={video.uploaded_media}
                  muted
                  playsInline
                  controls={false}
                  onPlay={() => handlePlay(index)}
                  onMouseEnter={(e) =>
                    e.currentTarget.setAttribute('controls', true)
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget.removeAttribute('controls')
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="slider-controls">
          <div className='button_box' onClick={() => scroll('left')}>
            <img className='btn_left_arrow' src={Arrowleft} alt="left" />
          </div>
          <div className='button_box' onClick={() => scroll('right')}>
            <img className='btn_right_arrow' src={Arrowright} alt="right" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
