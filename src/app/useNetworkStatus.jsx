import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function useNetworkStatus() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOffline = () => {
      if (!navigator.onLine) {
        localStorage.setItem("lastRoute", location.pathname + location.search);
        navigate("/NoInternet", { replace: true });
      }
    };

    const handleOnline = () => {
      if (navigator.onLine && location.pathname === "/NoInternet") {
        // navigate(-1);
        const lastRoute = localStorage.getItem("lastRoute") || "/";
        navigate(lastRoute, { replace: true });
        localStorage.removeItem('lastRoute');
      }
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [navigate, location.pathname]);
}
