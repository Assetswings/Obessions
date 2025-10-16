import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarpetFinder } from "./carpetFinderSlice";
import { useNavigate } from "react-router-dom";
import "./CarpetFinder.css";
import { ToastContainer, toast } from "react-toastify";
import { ArrowDown, ArrowUp } from "lucide-react";
import Skeleton from "react-loading-skeleton";

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
    document.title = "Obsession - Floor Matcher";
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
        <div className="finder-main">
          {/* Simulated title */}
          <h2 className="finder-title">
            <Skeleton width={400} height={25} />
          </h2>

          {/* Simulated grid */}
          <div className="track-desk">
            <div className="finder-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="finder-card">
                  <Skeleton height={140} />
                  <div className="card-label">
                    <Skeleton width={100} height={15} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="finder-buttons">
            <div className="arrow-stack">
              <Skeleton width={100} height={35} />
            </div>
            <div className="arrow-stack">
              <Skeleton width={100} height={35} />
            </div>
          </div>
        </div>

        {/* Stepper skeleton */}
        <div className="stepper-right">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stepper-line-wrapper">
              <Skeleton circle width={30} height={30} />
              {i < 3 && <div className="stepper-line"><Skeleton height={30} /></div>}
            </div>
          ))}
        </div>
      </div>
    );
  }
  // if (loading) {
  //   return (
  //     <div className="finder-wrapper">
  //       <p>Loading Carpet Finder...</p>
  //     </div>
  //   );
  // }

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
      <ToastContainer style={{ zIndex: 9999999999999 }} position="top-right" autoClose={3000} />
      <div className="finder-wrapper">
        <div className="finder-main">
          <h2 className="finder-title">{steps[currentStep]?.title}</h2>
          <div className="track-desk">
            <div className="finder-grid">
              {steps[currentStep]?.options.map(({ label, image, key }) => (
                <div
                  key={label}
                  className={`finder-card ${isSelected(currentStep, label) ? "selected" : ""
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
          </div>

          <div className="finder-buttons">
            <div
              className="arrow-stack"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0}>
              <span> Back </span>  <span> <ArrowUp size={15} /> </span>
            </div>
            {currentStep < steps.length - 1 ? (
              <div
                className="arrow-stack"
                onClick={() => {
                  if (!selections[currentStep]?.length) {
                    toast.error(
                      "Please select at least one option to proceed."
                    );
                    return;
                  }
                  setCurrentStep((prev) => prev + 1);
                }}>
                <span> Next </span>  <span>  <ArrowDown size={15} /></span>
              </div>
            ) : (
              <div className="submit-btn" onClick={handelseeresult}>
                See Results
              </div>
            )}
          </div>
        </div>

        <div className="stepper-right">
          {steps.map((_, index) => (
            <div key={index} className="stepper-line-wrapper">
              <div
                className={`stepper-circle ${index === currentStep ? "active" : ""
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
