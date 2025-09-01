import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import API from "../../app/api";

export default function Privacypolicy() {
  const [data, setData] = useState("");

  const handlePrivacy = async () => {
    try {
      const res = await API.get("policy/privacy-policy");
      if (res.data.status === 200) {
        setData(res.data?.data);
      }
    } catch (err) {
      //toast.error(err.response?.data?.message || "Failed to send OTP");
      console.log(err);
    }
  };

  useEffect(() => {
    handlePrivacy();
  }, []);

  return (
    <>
      <div className="terms-container">
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
      <Footer />
    </>
  );
}
