import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarpetFinder } from "./carpetFinderSlice";
import { useNavigate } from "react-router-dom";
import "./CarpetFinder.css";
import { ToastContainer, toast } from "react-toastify";

const CarpetFinder = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.carpetFinder);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [steps, setSteps] = useState([]);
  const navigate = useNavigate();

  console.log("filter_the_object-------->", selections);

  // Fetch data when mounted
  useEffect(() => {
    dispatch(fetchCarpetFinder());
  }, [dispatch]);

  // Build steps when data changes
  useEffect(() => {
    if (
      Array.isArray(data?.data?.carpet_finders) &&
      data.data.carpet_finders.length > 0
    ) {
      const carpet = data.data.carpet_finders[0];
      setSteps([
        {
          title: "Where will your new floor covering be placed?",
          options:
            carpet.room_list?.map((item) => ({
              label: item?.title || "Untitled Room",
              image: item?.media || "",
              key: item?.room_filter,
            })) || [],
        },
        {
          title: "Which Size or Shape fits your Space?",
          options:
            carpet.sizes?.map((item) => ({
              label: item?.size || "Unknown Size",
              image: item?.media || "",
              key: item?.size_filter,
            })) || [],
        },
        {
          title: "Which Colors complement your Space?",
          options:
            carpet.colors?.map((item) => ({
              label: item?.color || "Unknown Color",
              image: item?.media || "",
              key: item?.color_filter,
            })) || [],
        },
        {
          title: "What Style suits your Space best?",
          options:
            carpet.patterns?.map((item) => ({
              label: item?.pattern || "Unknown Pattern",
              image: item?.media || "",
              key: item?.pattern_filter,
            })) || [],
        },
      ]);
    }
  }, [data]);

  const toggleOption = (stepIndex, label, key) => {
    const current = selections[stepIndex] || [];
    const exists = current.some((item) => item.label === label);

    const updated = exists
      ? current.filter((item) => item.label !== label)
      : [...current, { label, key }];

    const newSelections = { ...selections, [stepIndex]: updated };
    setSelections(newSelections);

    console.log("Updated selections:", newSelections);
  };

  const handelseeresult = () => {
    // Validate all steps before proceeding
    if (steps.some((_, index) => !selections[index]?.length)) {
      toast.error("Please make a selection in all steps before continuing.");
      return;
    }

    let filterReq = {
      room_filter: selections[0][0].key,
      size_filter: selections[1][0].key,
      color_filter: selections[2][0].key,
      pattern_filter: selections[3][0].key,
    };

    console.log("====================================");
    console.log(filterReq);
    console.log("====================================");

    navigate("/carpetfinderserch", {
      state: filterReq,
    });
  };

  const isSelected = (stepIndex, label) =>
    selections[stepIndex]?.some((item) => item.label === label);

  // Loading state
  if (loading) {
    return (
      <div className="finder-wrapper">
        <p>Loading Carpet Finder...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="finder-wrapper">
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  // No data
  if (!steps.length) {
    return (
      <div className="finder-wrapper">
        <p>No carpet finder data available.</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="finder-wrapper">
        <div className="finder-main">
          <h2 className="finder-title">{steps[currentStep]?.title}</h2>
          <div className="finder-grid">
            {steps[currentStep]?.options.map(({ label, image, key }) => (
              <div
                key={label}
                className={`finder-card ${
                  isSelected(currentStep, label) ? "selected" : ""
                }`}
                onClick={() => toggleOption(currentStep, label, key)}
              >
                {image ? (
                  <img src={image} alt={label} />
                ) : (
                  <div className="img-placeholder">No Image</div>
                )}
                <span className="card-label">{label}</span>
                {isSelected(currentStep, label) && (
                  <div className="checkmark">✔</div>
                )}
              </div>
            ))}
          </div>
          <div className="finder-buttons">
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0}
            >
              Back ↑
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => {
                  if (!selections[currentStep]?.length) {
                    toast.error(
                      "Please select at least one option to proceed."
                    );
                    return;
                  }
                  setCurrentStep((prev) => prev + 1);
                }}
              >
                Next ↓
              </button>
            ) : (
              <button className="submit-btn" onClick={handelseeresult}>
                See Results
              </button>
            )}
          </div>
        </div>

        <div className="stepper-right">
          {steps.map((_, index) => (
            <div key={index} className="stepper-line-wrapper">
              <div
                className={`stepper-circle ${
                  index === currentStep ? "active" : ""
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && <div className="stepper-line"></div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CarpetFinder;
