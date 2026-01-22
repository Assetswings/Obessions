import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OfflineGuard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.onLine && location.pathname !== "/NoInternet") {
      navigate("/NoInternet", { replace: true });
    }
  }, [location.pathname, navigate]);

  // ❌ Block rendering any page except NoInternet
  if (!navigator.onLine && location.pathname !== "/NoInternet") {
    return null;
  }

  return children;
};

export default OfflineGuard;
