import React, { useState, useEffect } from "react";
import "./Terms.css";
import Footer from "../../components/Footer/Footer";
import API from "../../app/api";
import Skeleton from "react-loading-skeleton";

export default function TermsAndConditions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTerms = async () => {
    try {
      const res = await API.get("/policy/tc-of-sale");
      if (res.data?.status === 200) {
        setData(res.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Obsession - Terms & Condition of Sale";
    handleTerms();
  }, []);

  const terms = data?.[0];

  return (
    <>
      <div className="terms-page">
        <div className="terms-container">
          <h1 className="terms-title">Terms &amp; Condition</h1>
          <p className="terms-subtitle">Here’s how we keep things fair</p>

          {/* PREAMBLE */}
          {loading ? (
            <Skeleton count={3} />
          ) : (
            terms?.preamble?.map((text, index) => (
              <p key={index} className="terms-text">
                {text}
              </p>
            ))
          )}

          {/* SECTIONS */}
          {loading
            ? Array(5)
              .fill("")
              .map((_, i) => <Skeleton key={i} height={120} />)
            : terms?.sections?.map((section, sectionIndex) => (
              <div key={sectionIndex} className="terms-section">
                <h3>
                  {section.section}. {section.title}
                </h3>

                {section.clauses?.map((clauseObj, clauseIndex) => {
                  const clauseKey = Object.keys(clauseObj)[0];
                  const clauseValue = clauseObj[clauseKey];

                  return (
                    <div key={clauseIndex} className="terms-clause">
                      <span className="clause-number">{clauseKey}.</span>
                      <span className="clause-text"><div dangerouslySetInnerHTML={{ __html: clauseValue }} /></span>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
