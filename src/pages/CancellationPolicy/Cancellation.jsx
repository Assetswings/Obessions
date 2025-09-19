import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import API from "../../app/api";

export default function Cancellation() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);

  const handleCancel = async () => {
    try {
      const res = await API.get("/policy/cancellation-return-refund-policy");
      if (res.data.status === 200) {
        setTimeout(() => {
          setData(res.data?.data);
        }, 2000);
      }
    } catch (err) {
      // toast.error(err.response?.data?.message || "Failed to send OTP");
      console.log(err);
    } finally {
      setLoading(false); // stop loader whether success or fail
    }
  };

  useEffect(() => {
    handleCancel();
  }, []);

  return (
    <>
      <div className="terms-container">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: data?.content }} />
        )}
      </div>
      <Footer />
    </>
  );
}
