import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import API from "../../app/api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Breadcrumbs from "../../components/Breadcum/Breadcrumbs";

export default function FeesPaymentsPolicy() {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleFees = async () => {
    try {
      const res = await API.get("/policy/fees-payments-policy");
      if (res.data?.status === 200 && Array.isArray(res.data?.data)) {
        setPolicy(res.data.data[0]); // first element of the array
      }
    } catch (err) {
      console.error("Fees & Payments Policy error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Obsessions - Fees Payment Policy";
    handleFees();
  }, []);

      
  const breadcrumbPaths = [{ label: "Fees & Payments Polic", to: "" }];
  return (
    <>
        <Breadcrumbs paths={breadcrumbPaths} />
      <div className="terms-page">
        <div className="terms-container">
          {loading ? (
            <>
              <Skeleton width="70%" height={40} style={{ marginBottom: 24 }} />
              <Skeleton count={3} height={18} style={{ marginBottom: 10 }} />

              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ marginTop: 28 }}>
                  <Skeleton width="50%" height={22} />
                  <Skeleton count={4} height={16} style={{ marginTop: 10 }} />
                </div>
              ))}
            </>
        
          ) : (
            <>
              {/* TITLE */}
              <h1 className="terms-title">{policy?.title}</h1>

              {/* PREAMBLE */}
              {policy?.preamble?.map((text, index) => (
                <p
                  key={index}
                  className="terms-text"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              ))}

              {/* SECTIONS */}
              {policy?.sections?.map((section, index) => (
                <div className="terms-section" key={index}>
                  {(section.section || section.title) && (
                    <h3>
                      {section.section && `${section.section}.`}{" "}
                      {section.title || ""}
                    </h3>
                  )}

                  {/* CLAUSES */}
                  {section.clauses?.map((clause, i) => {
                    const clauseKey = Object.keys(clause)[0];
                    const clauseValue = clause[clauseKey];

                    return (
                      <div className="terms-clause" key={i}>
                        <span className="clause-number">{clauseKey}</span>
                        <p className="clause-text"><div dangerouslySetInnerHTML={{ __html: clauseValue }} /></p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
