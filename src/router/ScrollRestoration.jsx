import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Handles scroll behavior:
 * - When navigating normally → scroll to top
 * - When going back/forward → restore previous scroll position
 */
const ScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Restore or reset scroll depending on navigation type
    if (navigationType === "POP") {
      // User pressed back or forward
      const savedY = sessionStorage.getItem(location.key);
      if (savedY !== null) {
        window.scrollTo(0, parseInt(savedY));
      }
    } else {
      // Normal navigation (Link, navigate, etc.) → always scroll to top
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Save current scroll position while user scrolls
    const handleScroll = () => {
      sessionStorage.setItem(location.key, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location, navigationType]);

  return null;
};

export default ScrollRestoration;
