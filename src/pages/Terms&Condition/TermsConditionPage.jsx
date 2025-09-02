import React, { useState, useEffect } from "react";
import "./Terms.css";
import Footer from "../../components/Footer/Footer";
import API from "../../app/api";

export default function TermsAndConditions() {
  const [data, setData] = useState("");

  const handleTerms = async () => {
    try {
      const res = await API.get("/policy/tc-of-sale");
 
      if (res.data.status === 200) {
        setData(res.data?.data);
      }
    } catch (err) {
      // toast.error(err.response?.data?.message || "Failed to send OTP");
      console.log(err);
    }
  };

    useEffect(() => {
    handleTerms();
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
