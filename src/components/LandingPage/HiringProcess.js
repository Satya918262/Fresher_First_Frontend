import React from "react";
import {
  FaFileAlt,
  FaCheck,
  FaLaptopCode,
  FaUserCheck,
  FaClipboardCheck,
  FaHandshake,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const HiringProcess = () => {
  const steps = [
    {
      title: "Apply",
      description: "Submit your application online.",
      icon: <FaFileAlt />,
    },
    {
      title: "Shortlist",
      description: "HR reviews applications and shortlists candidates.",
      icon: <FaCheck />,
    },
    {
      title: "Online Exam",
      description: "Take an online test to evaluate your skills.",
      icon: <FaLaptopCode />,
    },
    {
      title: "Interview",
      description: "Attend an interview with the hiring team.",
      icon: <FaUserCheck />,
    },
    {
      title: "Final Selection",
      description: "Receive the final offer and confirmation.",
      icon: <FaClipboardCheck />,
    },
    {
      title: "Offer Letter & Onboarding",
      description: "Sign the offer letter and begin onboarding.",
      icon: <FaHandshake />,
    },
  ];

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="container py-5">
        <h2 className="text-center mb-4 text-dark">Hiring Process</h2>
        <div className="row">
          {steps.map((step, index) => (
            <div key={index} className="col-md-4 col-sm-6 col-12 mb-3">
              <div
                className="card text-center p-4 shadow-lg border-0 h-100 d-flex flex-column justify-content-between"
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="display-4">{step.icon}</div>
                <h4 className="mt-2">{step.title}</h4>
                <p className="mb-0">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HiringProcess;
