import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function useNetworkStatus() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastRouteRef = useRef("/");

  // Save last valid route
  useEffect(() => {
    if (navigator.onLine && location.pathname !== "/NoInternet") {
      const currentRoute = location.pathname + location.search;
      lastRouteRef.current = currentRoute;
      sessionStorage.setItem("lastRoute", currentRoute);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const goOffline = () => {
      if (location.pathname !== "/NoInternet") {
        navigate("/NoInternet", { replace: true });
      }
    };

    const goOnline = () => {
      const lastRoute =
        sessionStorage.getItem("lastRoute") || "/";
      navigate(lastRoute, { replace: true });
    };

    // Event listeners
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    // 🔥 Mobile Safari fallback (polling)
    const interval = setInterval(() => {
      if (!navigator.onLine && location.pathname !== "/NoInternet") {
        goOffline();
      }

      if (navigator.onLine && location.pathname === "/NoInternet") {
        goOnline();
      }
    }, 1500);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      clearInterval(interval);
    };
  }, [navigate, location.pathname]);

}
