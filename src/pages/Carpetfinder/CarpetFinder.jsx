import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarpetFinder } from "./carpetFinderSlice";
import { useNavigate } from "react-router-dom";
import "./CarpetFinder.css";
import { Slide, ToastContainer, toast } from "react-toastify";
import { ArrowDown, ArrowUp, SquareCheck } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import arrowleft from "../../assets/icons/Vector_left.svg";
import arrowright from "../../assets/icons/Vector_right.svg";
import Breadcrumbs from "../../components/Breadcum/Breadcrumbs";

const CarpetFinder = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.carpetFinder);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [steps, setSteps] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const navigate = useNavigate();

  // Fetch data when mounted
  useEffect(() => {
    document.title = "Obsessions- Floor Matcher";
    dispatch(fetchCarpetFinder([]));
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
              image: "",
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
  // useEffect(() => {
  //   console.log("Updated selectedFilter:", selectedFilter);
  //   dispatch(fetchCarpetFinder(selectedFilter));
  // }, [selectedFilter, dispatch]);
  useEffect(() => {
    console.log("Updated selectedFilter:", selectedFilter, currentStep);
    if (currentStep === 4) {
      handelseeresult(selectedFilter);
    }else{
      dispatch(fetchCarpetFinder(selectedFilter));
    }
  }, [selectedFilter, currentStep]);

  const filterMap = {
    0: "room_filter",
    1: "size_filter",
    2: "color_filter",
    3: "pattern_filter",
  };

  const getNextSterData = (step) => {
    const keyName = filterMap[step];
    const values = selections?.[step]?.map((item) => item.key);

    if (!keyName || !values?.length) return;

    setSelectedFilter((prev) => {
      // remove existing filter for this step
      const filteredPrev = prev.filter(
        (item) => !item.hasOwnProperty(keyName)
      );

      // add updated filter
      return [
        ...filteredPrev,
        { [keyName]: values },
      ];
    });
  };


  // const toggleOption = (stepIndex, label, key) => {
  //   const current = selections[stepIndex] || [];
  //   const exists = current.some((item) => item.label === label);

  //   const updated = exists
  //     ? current.filter((item) => item.label !== label)
  //     : [...current, { label, key }];

  //   const newSelections = { ...selections, [stepIndex]: updated };
  //   setSelections(newSelections);

  //   console.log("Updated selections:", newSelections);
  // };

   const toggleOption = (stepIndex, label, key) => {

  // 👇 THIS PART IS THE CHANGE
  if (stepIndex === 0) {
    setSelections({
      ...selections,
      [stepIndex]: [{ label, key }], // only one item allowed
    });
    return;
  }

  // 👇 REST IS SAME AS BEFORE
  const current = selections[stepIndex] || [];
  const exists = current.some((item) => item.label === label);

  const updated = exists
    ? current.filter((item) => item.label !== label)
    : [...current, { label, key }];

  setSelections({ ...selections, [stepIndex]: updated });
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
    console.log(selectedFilter);
    console.log("====================================");

    navigate("/carpetfinderserch", {
      state: selectedFilter,
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
            <div className="main_file_tracker">
              <div className="finder-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="finder-card">
                    <Skeleton height={180} />
                    <div className="card-label">
                      <Skeleton width={100} height={15} />
                    </div>
                  </div>
                ))}
              </div>
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
  const breadcrumbPaths = [
    { label: "Floor Matcher", to: "" }, // last one (no link)
  ];
  return (
    <>
      <ToastContainer style={{ zIndex: 9999999999999 }} position="top-right" autoClose={3000} limit={1} hideProgressBar={true} transition={Slide} newestOnTop={true} />
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="finder-wrapper">
        <div className="finder-main">
          <h2 className="finder-title">{steps[currentStep]?.title}</h2>
          <div className="track-desk">
            {/* <div className="finder-grid"> */}
            <div
              className={`finder-grid ${steps[currentStep]?.title === "Which Size or Shape fits your Space?"
                ? "finder-grid-full"
                : ""
                }`}
            >
              {steps[currentStep]?.options.map(({ label, image, key }) => (
                <div
                  key={label}
                  className={`finder-card ${isSelected(currentStep, label) ? "selected" : ""} ${steps[currentStep]?.title === "Which Size or Shape fits your Space?"
                    ? "big-card"
                    : "small-card"
                    }`}
                  onClick={() => toggleOption(currentStep, label, key)}
                >
                  {image ? (
                    <img src={image} alt={label} />
                  ) : (
                    <></>
                  )}
                  <span className="card-label">{label}</span>
                {isSelected(currentStep, label) && currentStep !== 0 && (
  <div className="checkmark">
    <SquareCheck size={22} color="#657567" />
  </div>
)}
                </div>
              ))}
            </div>
          </div>

          <div className="finder-buttons">
            {currentStep != 0 &&
              <div
                className="arrow-stack"
                onClick={() => setCurrentStep((prev) => prev - 1)} >
                <div style={{ display: "flex" }}>
                  <div>
                    <img className="buttonarrawright" src={arrowleft} alt="arrowleft" />
                  </div>
                  <div>
                    <span> BACK </span>
                  </div>
                </div>
              </div>
            }
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
                  getNextSterData(currentStep);
                }}>
                <div style={{ display: "flex" }}>
                  <div>
                    <span> NEXT </span>
                  </div>
                  <div>
                    <img className="buttonarrawleft" src={arrowright} alt="arrowright" />
                  </div>
                </div>
              </div>
            ) : (
              <button className="submit-btn" onClick={() => { setCurrentStep((prev) => prev + 1); getNextSterData(currentStep); }}>
                See Results
              </button>
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
