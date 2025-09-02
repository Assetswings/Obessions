import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import API from "../../app/api";

export default function Cancellation() {
  const [data, setData] = useState("");

  const handleCancel = async () => {
    try {
      const res = await API.get("/policy/cancellation-return-refund-policy");
      if (res.data.status === 200) {
        setData(res.data?.data);
      }
    } catch (err) {
      // toast.error(err.response?.data?.message || "Failed to send OTP");
      console.log(err);
    }
  };

    useEffect(() => {
     handleCancel();
  }, []);

  console.log("====================================");
  console.log("the terms and condition data ----->", data);
  console.log("====================================");

  return (
    <>
      <div className="terms-container">
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
      <Footer />
    </>
  );
}
