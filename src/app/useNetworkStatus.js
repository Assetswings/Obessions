import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function useNetworkStatus() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOffline = () => {
      if (!navigator.onLine) {
        navigate("/NoInternet", { replace: true });
      }
    };

    const handleOnline = () => {
      if (navigator.onLine && location.pathname === "/NoInternet") {
        navigate(-1);
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
