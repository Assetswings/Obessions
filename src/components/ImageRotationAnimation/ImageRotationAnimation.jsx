import React, { useRef, useLayoutEffect, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import "./ImageRotationAnimation.css";
// Image Rotation Animation Component - matches the HTML implementation
  const ImageRotationAnimation = ({ images, logoUrl }) => {
  const bannerRef = useRef(null);
  const behindLayerRef = useRef(null);
  const frontLayerRef = useRef(null);
  const wrapsRef = useRef([]);
  const cardsRef = useRef([]);
  const timelineRef = useRef(null);

  // Filter and prepare images
    const animationImages = useMemo(() => {
    if (!images || images.length < 4) return [];
    return images.slice(0, 4).map((img) => ({
    src: img.media,
    alt: img.name || "Animation image",
    }));
    }, [images]);

  // Slot positions based on container size
  const getSlots = useCallback(() => {
    if (!bannerRef.current) return [];
    const rect = bannerRef.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const isMobile = w <= 768;

    // Detect MacBook/high-DPI devices (Retina displays)
    const isHighDPI = window.devicePixelRatio >= 2;
    const isMacBookRange = w >= 1200 && w <= 1920; // Typical MacBook viewport widths
    const isMacBook = isHighDPI && isMacBookRange;

    // Responsive scaling factors
    const slot2Scale = isMobile ? 0.9 : 1.2; // Reduced scale for slot 2 on mobile
    const heightFactor = isMobile ? 0.2 : 0.25; // Reduced movement area height
    const bottomOffset = isMobile ? 0.22 : 0.28; // Reduced bottom position

    // Adjust left offset for MacBook devices to prevent leftward drift
    const leftOffset = isMacBook ? 0.33 : 0.38;
    const rightOffset = isMacBook ? 0.36 : 0.35;

    // Adjust positions to work with full-width text
    return [
      { x: 0, y: -h * heightFactor, s: 0.42, rot: -8 }, // top - closer to text
      { x: w * rightOffset, y: -h * 0.05, s: 0.62, rot: 10 }, // right (front) - further out
      { x: 0, y: h * bottomOffset, s: slot2Scale, rot: 2 }, // bottom (front big) - responsive scale
      { x: -w * leftOffset, y: 0, s: 0.62, rot: -12 }, // left (behind) - adjusted for MacBook
    ];
  }, []);

  // Check if slot is behind text
  const isBehindSlot = (slotIndex) => slotIndex !== 2 && slotIndex !== 1; // Slots 1 and 2 appear in front of text

  // Move wrap element between layers
  const setLayer = useCallback(
    (wrapEl, slotIndex, imageIndex, fromSlot) => {
      const parent = isBehindSlot(slotIndex)
        ? behindLayerRef.current
        : frontLayerRef.current;
      if (wrapEl && parent && wrapEl.parentNode !== parent) {
        parent.appendChild(wrapEl);
      }
    },
    [animationImages],
  );

  // Initial positioning
  const snapToStep = useCallback(
    (stepIndex) => {
      const slots = getSlots();
      if (slots.length === 0) return;

      wrapsRef.current.forEach((wrapEl, i) => {
        if (!wrapEl || !cardsRef.current[i]) return;

        const slotIndex = (i + stepIndex) % 4;
        const slot = slots[slotIndex];

        setLayer(wrapEl, slotIndex);

        gsap.set(cardsRef.current[i], {
          x: slot.x,
          y: slot.y,
          scale: slot.s,
          rotation: slot.rot,
          autoAlpha: 1,
        });

        gsap.set(wrapEl, { x: 0, y: 0 });
      });
    },
    [getSlots, setLayer],
  );

  // Layer swap timing
  const swapTime = (fromSlot, toSlot) => {
    const moveDur = 1.05;
    if (fromSlot === 2 && toSlot === 3) return moveDur * 0.15; // Early swap to avoid text collision
    if (fromSlot === 3 && toSlot !== 3) return moveDur * 0.26;
    return moveDur * 0.45;
  };

  // Initialize animation
  useLayoutEffect(() => {
    if (animationImages.length < 4 || !bannerRef.current) return;

    // Create timeline
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power3.inOut" },
      repeatRefresh: true,
    });

    timelineRef.current = tl;

    for (let step = 0; step < 4; step++) {
      const nextStep = (step + 1) % 4;
      const moveDur = 1.05;
      const holdDur = 2.5; // Increased hold duration for longer pause
      const fadeDur = 0.08;

      // Animate cards to next positions
      tl.to(cardsRef.current, {
        duration: moveDur,
        x: (i) => {
          const slots = getSlots();
          return slots.length > 0 ? slots[(i + nextStep) % 4].x : 0;
        },
        y: (i) => {
          const slots = getSlots();
          return slots.length > 0 ? slots[(i + nextStep) % 4].y : 0;
        },
        scale: (i) => {
          const slots = getSlots();
          return slots.length > 0 ? slots[(i + nextStep) % 4].s : 1;
        },
        rotation: (i) => {
          const slots = getSlots();
          return slots.length > 0 ? slots[(i + nextStep) % 4].rot : 0;
        },
      });

      // Handle layer swapping
      wrapsRef.current.forEach((wrapEl, i) => {
        if (!wrapEl || !cardsRef.current[i]) return;

        const fromSlot = (i + step) % 4;
        const toSlot = (i + nextStep) % 4;
        const layerChanges = isBehindSlot(fromSlot) !== isBehindSlot(toSlot);

        if (!layerChanges) return;

        const at = swapTime(fromSlot, toSlot);

        tl.to(
          cardsRef.current[i],
          {
            duration: fadeDur,
            autoAlpha: 0.001,
            ease: "power1.out",
          },
          `<+${at - fadeDur}`,
        );

        tl.call(
          () => {
            setLayer(wrapEl, toSlot, i, fromSlot);
          },
          null,
          `<`,
        );

        tl.to(
          cardsRef.current[i],
          {
            duration: fadeDur,
            autoAlpha: 1,
            ease: "power1.in",
          },
          `<`,
        );
      });

      tl.to({}, { duration: holdDur }); // Extended pause after movement
    }

    snapToStep(0);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [animationImages, snapToStep, getSlots, setLayer]);

  // Mouse parallax effect
  useLayoutEffect(() => {
    if (animationImages.length < 4 || !bannerRef.current) return;

    let mx = 0,
      my = 0,
      tx = 0,
      ty = 0;
    const strength = 80;

    const setX = wrapsRef.current
      .map((w) =>
        w ? gsap.quickTo(w, "x", { duration: 1.65, ease: "power3.out" }) : null,
      )
      .filter(Boolean);

    const setY = wrapsRef.current
      .map((w) =>
        w ? gsap.quickTo(w, "y", { duration: 1.65, ease: "power3.out" }) : null,
      )
      .filter(Boolean);

    const handleMouseMove = (e) => {
      const rect = bannerRef.current.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width - 0.5;
      my = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const handleMouseLeave = () => {
      mx = 0;
      my = 0;
    };

    const ticker = () => {
      tx += (mx - tx) * 0.52;
      ty += (my - ty) * 0.52;

      wrapsRef.current.forEach((wrapEl, i) => {
        if (!wrapEl || !cardsRef.current[i] || !setX[i] || !setY[i]) return;

        const s = gsap.getProperty(cardsRef.current[i], "scale") || 1;
        const depth = Math.max(0.25, Math.min(1.0, (s - 0.35) / (1.2 - 0.35)));

        setX[i](tx * strength * depth);
        setY[i](ty * strength * depth);
      });
    };

    bannerRef.current.addEventListener("mousemove", handleMouseMove);
    bannerRef.current.addEventListener("mouseleave", handleMouseLeave);
    gsap.ticker.add(ticker);

    return () => {
        if (bannerRef.current) {
        bannerRef.current.removeEventListener("mousemove", handleMouseMove);
        bannerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
      gsap.ticker.remove(ticker);
    };
    }, [animationImages]);

  // Y-axis parallax scroll effect bounded within container
    useLayoutEffect(() => {
    if (animationImages.length < 4 || !bannerRef.current) return;

    const parallaxSpeeds = [0.1, 0.15, 0.2, 0.12]; // Gentler speeds
    let ticking = false;

          const handleScroll = () => {
          if (!ticking) {
          requestAnimationFrame(() => {
          const rect = bannerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Check if container is in view
          const isInView = rect.bottom >= 0 && rect.top <= windowHeight;

            if (!isInView) {
            ticking = false;
            return;
          }

          // Simple scroll-based parallax - negative for upward movement when scrolling down
            const scrollY = window.scrollY;
            cardsRef.current.forEach((card, i) => {
            if (!card) return;

            const speed = parallaxSpeeds[i];
            const parallaxOffset = -scrollY * speed; // Negative for opposite direction

            // Apply parallax using transform instead of gsap.set for smoothness
              card.style.transform =
              card.style.transform.replace(/translateY\([^)]*\)/, "") +
              ` translateY(${parallaxOffset}px)`;
          });

        ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Reset transforms
      cardsRef.current.forEach((card) => {
        if (card) {
          card.style.transform = card.style.transform.replace(
            /translateY\([^)]*\)/,
            "",
          );
        }
      });
    };
  }, [animationImages]);

  // Handle resize
  useLayoutEffect(() => {
    if (animationImages.length < 4) return;

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (timelineRef.current) {
          const step = Math.round(timelineRef.current.progress() * 4) % 4;
          snapToStep(step);
        }
      }, 80);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [animationImages, snapToStep]);

  if (animationImages.length < 4) return null;

  return (
    <div
      ref={bannerRef}
      className="image-rotation-banner"
      style={{
        position: "relative",
        height: "clamp(400px, 70vh, 70vh)", // Responsive height
        minHeight: "clamp(350px, 50vh, 520px)", // Responsive min height
        overflow: "visible",
        margin: "0 5vw 2rem 5vw", // Side margins and bottom margin
        paddingTop: "2rem", // Top margin
      }}
    >
      {/* Behind Layer */}
      <div
        ref={behindLayerRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 4,
        }}
      />

      {/* Text with responsive CSS styling */}
      <h1 className="display-1 bold image-rotation-title">obsessions</h1>

      {/* Logo */}
      {logoUrl && (
        <img
          src={logoUrl}
          alt="Logo"
          style={{
            position: "absolute",
            top: "80px",
            left: "-60px",
            width: "3vw",

            zIndex: 7,
          }}
        />
      )}

      {/* Front Layer */}
      <div
        ref={frontLayerRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 8,
        }}
      >
        {animationImages.map((img, index) => (
          <div
            key={index}
            ref={(el) => (wrapsRef.current[index] = el)}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              willChange: "transform",
            }}
          >
            <div
              ref={(el) => (cardsRef.current[index] = el)}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: "translate(-50%, -50%)",
                width:
                  window.innerWidth <= 768
                    ? "150px"
                    : window.innerWidth <= 1024
                      ? "220px"
                      : window.innerWidth <= 1440
                        ? "280px"
                        : "340px",
                aspectRatio: "1 / 1",
                padding:
                  window.innerWidth <= 768
                    ? "6px"
                    : window.innerWidth <= 1024
                      ? "8px"
                      : "12px",
                boxSizing: "border-box",
                transformOrigin: "50% 50%",
                willChange: "transform, opacity",
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "contain",
                  objectPosition: "center",
                  transform: "translateZ(0)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageRotationAnimation;
