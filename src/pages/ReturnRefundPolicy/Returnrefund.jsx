import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import API from "../../app/api";

export default function Returnrefund() {
  const [data, setData] = useState("");

  const Returnrefund = async () => {
    try {
      const res = await API.get("/policy/terms-of-use");
      if (res.data.status === 200) {
        setData(res.data?.data);
      }
    } catch (err) {
      // toast.error(err.response?.data?.message || "Failed to send OTP");
      console.log(err);
    }
  };

    useEffect(() => {
  Returnrefund();
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
