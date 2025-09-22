import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import API from "../../app/api";
import Skeleton from "react-loading-skeleton";

export default function Cancellation() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);

  const handleCancel = async () => {
    try {
      const res = await API.get("/policy/cancellation-return-refund-policy");
      if (res.data.status === 200) {
        // Simulate delay only if you really want it
        setTimeout(() => {
          setData(res.data?.data);
          setLoading(false); // stop loader when content is ready
        }, 1000); // reduce delay (10s is too long for UX)
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCancel();
  }, []);

  return (
    <>
      <div className="terms-container">
        {loading ? (
          <div className="loading-skeleton" style={{ textAlign: "center" }}>
            {/* Paragraph-style skeleton */}
            <Skeleton width="80%" height={30} style={{ marginBottom: 15 }} />
            <Skeleton count={6} height={18} style={{ marginBottom: 8 }} />
            <Skeleton width="90%" height={18} style={{ marginBottom: 8 }} />
            <Skeleton width="80%" height={18} style={{ marginBottom: 8 }} />
            {/* <Skeleton count={2} height={18} style={{ marginBottom: 8 }} /> */}
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: data?.content }} />
        )}
      </div>
      <Footer />
    </>
  );
}
