import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import API from "../../app/api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./privacy.css";
import Breadcrumbs from "../../components/Breadcum/Breadcrumbs";

export default function Privacypolicy() {
  const [policy, setPolicy] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrivacyPolicy = async () => {
    try {
      const res = await API.get("policy/privacy-policy");
      if (res.data?.status === 200) {
        setPolicy(res.data?.data || []);
      }
    } catch (err) {
      console.error("Privacy policy error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Obsessions - Privacy Policy";
    fetchPrivacyPolicy();
  }, []);

  const policyData = policy?.[0];
  const sections = policyData?.sections || [];
  const breadcrumbPaths = [{ label: "Privacy Policy", to: "" }];

  return (
    <>

       <Breadcrumbs paths={breadcrumbPaths} />
      <div className="terms-page">
        <div className="terms-container">
          {loading ? (
            <>
              <Skeleton width="60%" height={40} style={{ marginBottom: 30 }} />
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <Skeleton width="40%" height={22} />
                  <Skeleton count={3} height={16} style={{ marginTop: 10 }} />
                </div>
              ))}
            </>
          ) : (
            <>
              {/* TITLE */}
              <h1 className="terms-title">
                {policyData?.title || "Privacy Policy"}
              </h1>

              {/* PREAMBLE (if exists) */}
              {policyData?.preamble?.map((text, index) => (
                <p
                  key={index}
                  className="terms-text"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              ))}

              {/* SECTIONS */}
              {sections.map((section, index) => (
                <div className="terms-section" key={index}>
                  {(section.section || section.title) && (
                    <h3>
                      {section.section && `${section.section}.`}{" "}
                      {section.title || ""}
                    </h3>
                  )}

                  {/* CLAUSES — SAME FORMAT AS CANCELLATION */}
                  {section.clauses?.map((clause, i) => {
                    const clauseKey = Object.keys(clause)[0];
                    const clauseValue = clause[clauseKey];

                    return (
                      <div className="terms-clause" key={i}>
                        <span className="clause-number">
                          {clauseKey}
                        </span>
                        <p className="clause-text">
                          <div dangerouslySetInnerHTML={{ __html: clauseValue }} />
                        </p>
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
