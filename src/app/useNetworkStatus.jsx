import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function useNetworkStatus() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastRouteRef = useRef(null);

  // Save last valid route (per tab)
  useEffect(() => {
    if (navigator.onLine && location.pathname !== "/NoInternet") {
      const currentRoute = location.pathname + location.search;
      lastRouteRef.current = currentRoute;
      sessionStorage.setItem("lastRoute", currentRoute);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleOffline = () => {
      navigate("/NoInternet"); 
    };

    const handleOnline = () => {
      const lastRoute =
        sessionStorage.getItem("lastRoute") || "/";
      navigate(lastRoute); 
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [navigate]);
}
