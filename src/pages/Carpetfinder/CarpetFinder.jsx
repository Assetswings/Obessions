import React, { useState } from "react";
import "./CarpetFinder.css";


const steps = [
    {
      title: "Where will your new floor covering be placed?",
      options: [
        { label: "Living Room", image: "https://i.ibb.co/C5DrsJrn/image-5.jpg" },
        { label: "Bedroom", image: "https://i.ibb.co/N2rMCqk4/image.jpg" },
        { label: "Kitchen", image: "https://i.ibb.co/fVQ8XzHJ/image-1.jpg" },
        { label: "Bathroom", image: "https://i.ibb.co/x8Y6dYDZ/image-2.jpg" },
        { label: "Hallway", image: "https://i.ibb.co/1fVJ2gD4/image-3.jpg" },
        { label: "Children's Room", image: "https://i.ibb.co/yc2KCBQZ/image-4.jpg" },
      ],
    },
    {
      title: "Which Size or Shape fits your Space?",
      options: [
        { label: "Small", image: "https://i.ibb.co/CKZ8Rbst/Objects-1.png" },
        { label: "Medium", image: "https://i.ibb.co/RpqvnbJW/Objects.png" },
        { label: "Large", image: "https://i.ibb.co/DgWQfJQc/Objects-2.png" }, 
        { label: "Runner", image: "https://i.ibb.co/yB6FjFVg/Objects-3.png" },
        { label: "Rounded", image: "https://i.ibb.co/zVBpGcnq/Objects-4.png" },
        { label: "All Options", image: "https://i.ibb.co/JRL7YzBJ/Objects-5.png" },
      ],
    },
    {
      title: "Which Colors complement your Space?",
      options: [
        { label: "Grays", image: "https://i.ibb.co/R49xX5BQ/1.jpg" },
        { label: "Neutrals", image: "https://i.ibb.co/yFQPkWPF/2.jpg"},
        { label: "Warm", image: "https://i.ibb.co/Zp6VbDPp/3.jpg" },
        { label: "Pastels", image: "https://i.ibb.co/Hfyk1Y0G/4.jpg" },
        { label: "Blues", image: "https://i.ibb.co/tpZzRmLp/5.jpg" },
        { label: "Bold", image: "https://i.ibb.co/6R51LCpG/6.jpg" },
      ],
    },
    {
      title: "What Style suits your Space best?",
      options: [
        { label: "Classical", image: "https://i.ibb.co/G4DbZryF/Rectangle-58.jpg" },
        { label: "Minimal", image: "https://i.ibb.co/QvtHZD6n/Rectangle-52.jpg" },
        { label: "Tropical", image: "https://i.ibb.co/jPjqZxRf/Rectangle-53.jpg" },
        { label: "Geometric", image: "https://i.ibb.co/rKK1H4S9/Rectangle-60.jpg" },
        { label: "Bohemian", image: "https://i.ibb.co/wZHtgjyT/Rectangle-59.jpg" },
        { label: "Modern Contemporary", image: "https://i.ibb.co/r2GxgQs4/Rectangle-54.jpg" },
      ],
    },
  ];
const CarpetFinder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});

   // toggle opptions 
    const toggleOption = (stepIndex, label) => {
    const current = selections[stepIndex] || [];
    const exists = current.includes(label);
    const updated = exists ? current.filter((l) => l !== label) : [...current, label];
    setSelections({ ...selections, [stepIndex]: updated });
  };

    // sector track
    const isSelected = (stepIndex, label) => {
    return selections[stepIndex]?.includes(label);
  };

  return (
    <div className="finder-wrapper">
      <div className="finder-main">
        <h2 className="finder-title">{steps[currentStep].title}</h2>
        <div className="finder-grid">
          {steps[currentStep].options.map(({ label, image }) => (
            <div
              key={label}
              className={`finder-card ${isSelected(currentStep, label) ? "selected" : ""}`}
              onClick={() => toggleOption(currentStep, label)}
            >
              <img src={image} alt={label} />
              <span className="card-label">{label}</span>
              {isSelected(currentStep, label) && <div className="checkmark">✔</div>}
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
            <button onClick={() => setCurrentStep((prev) => prev + 1)}>Next ↓</button>
          ) : (
            <button className="submit-btn">See Results</button>
          )}
        </div>
      </div>

      <div className="stepper-right">
        {steps.map((_, index) => (
          <div key={index} className="stepper-line-wrapper">
            <div
              className={`stepper-circle ${index === currentStep ? "active" : ""}`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && <div className="stepper-line"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarpetFinder;
