// VideoGallery.jsx
import React, { useEffect, useRef, useState } from "react";
import API from "../../app/api";
import "./VideoGallery.css";

const FRICTION = 0.92;
const SPEED = 1.2;
const MOMENTUM_MULT = 18;

export default function VideoGallery() {
  const [videos, setVideos] = useState([]);
  const scrollRef = useRef(null);
  const state = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    baseLeft: 0,
    baseTop: 0,
    vx: 0,
    vy: 0,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    rafId: 0,
  });

  useEffect(() => {
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

  const onPointerDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    el.setPointerCapture?.(e.pointerId);
    state.current.isDown = true;
    state.current.startX = e.clientX;
    state.current.startY = e.clientY;
    state.current.baseLeft = el.scrollLeft;
    state.current.baseTop = el.scrollTop;
    state.current.vx = 0;
    state.current.vy = 0;
    state.current.lastX = e.clientX;
    state.current.lastY = e.clientY;
    state.current.lastT = performance.now();
    cancelAnimationFrame(state.current.rafId);
  };

  const onPointerMove = (e) => {
    if (!state.current.isDown) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;

    const dx = (e.clientX - state.current.startX) * SPEED;
    const dy = (e.clientY - state.current.startY) * SPEED;

    el.scrollLeft = state.current.baseLeft - dx;
    el.scrollTop = state.current.baseTop - dy;

    const now = performance.now();
    const dt = Math.max(1, now - state.current.lastT);
    const instVX = (e.clientX - state.current.lastX) / dt;
    const instVY = (e.clientY - state.current.lastY) / dt;
    state.current.vx = state.current.vx * 0.8 + instVX * 0.2;
    state.current.vy = state.current.vy * 0.8 + instVY * 0.2;
    state.current.lastX = e.clientX;
    state.current.lastY = e.clientY;
    state.current.lastT = now;
  };

  const kickMomentum = () => {
    const el = scrollRef.current;
    if (!el) return;
    const step = () => {
      state.current.vx *= FRICTION;
      state.current.vy *= FRICTION;
      if (Math.abs(state.current.vx) < 0.005 && Math.abs(state.current.vy) < 0.005) return;
      el.scrollLeft -= state.current.vx * MOMENTUM_MULT;
      el.scrollTop -= state.current.vy * MOMENTUM_MULT;
      handleScroll();
      state.current.rafId = requestAnimationFrame(step);
    };
    state.current.rafId = requestAnimationFrame(step);
  };

  const onPointerUp = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    el.releasePointerCapture?.(e.pointerId);
    if (!state.current.isDown) return;
    state.current.isDown = false;
    kickMomentum();
  };

  const pattern = ["", "tall", "", "", "tall", "", "", "wide"];

  if (!videos.length) {
    return <div className="gallery-loading">Loading videos...</div>;
  }

  return (
    <div className="gallery-container">
      <div
        ref={scrollRef}
        className="gallery-wrapper"
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {totalGrid.map((v, i) => (
          <div
            className={`gallery-item ${pattern[i % pattern.length]}`}
            key={`${i}-${v.id || i}`}
          >
            <video
              className="video-box"
              src={v.media}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        ))}
      </div>
    </div>
  );
}
