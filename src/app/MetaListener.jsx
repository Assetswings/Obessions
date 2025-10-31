// src/components/MetaListener.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useMeta from "./useMeta";

const MetaListener = () => {
    const location = useLocation();
    useMeta(location.pathname);
    return null; // It doesn’t render anything
};

export default MetaListener;
