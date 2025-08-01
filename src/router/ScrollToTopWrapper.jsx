// ScrollToTopWrapper.js
import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopWrapper = ({ children }) => {
  const location = useLocation();
  const [showChildren, setShowChildren] = useState(false);

  useLayoutEffect(() => {
    setShowChildren(false); // temporarily hide content
    window.scrollTo({ top: 0, behavior: "auto" });

    // delay rendering for one frame to avoid visible jump
    requestAnimationFrame(() => {
      setShowChildren(true);
    });
  }, [location.pathname]);

  return showChildren ? children : null;
};

export default ScrollToTopWrapper;
