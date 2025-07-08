import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jobsearch from "../../images/heroimage.jpg"; // Import the image

const HeroSection = () => {
  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <div className="row align-items-center">
          {/* Text Section - Left on Desktop, Bottom on Mobile */}
          <div className="col-lg-6 col-md-12 order-md-2 order-lg-1 mb-4 mb-lg-0">
            <div className="text-center text-lg-start">
              <h1 className="display-5 fw-bold mb-3" style={{ color: "#2c3e50" }}>
                Find Your Dream Job Today
              </h1>
              <h3 className="h4 fw-semibold mb-3" style={{ color: "#34495e" }}>
                Empowering Students, TPOs, and Employers
              </h3>
              <p className="lead mb-3" style={{ color: "#7f8c8d" }}>
                Explore endless career opportunities, connect with top employers, and take the first step toward your future. Our platform bridges the gap between students, training officers, and companies to streamline the hiring process.
              </p>
              <button
                className="btn btn-primary btn-lg d-none d-lg-inline-block"
                style={{ backgroundColor: "#3498db", borderColor: "#3498db" }}
              >
                Start Exploring
              </button>
              {/* Button for Mobile View */}
              <button
                className="btn btn-primary btn-lg d-lg-none mt-3"
                style={{ backgroundColor: "#3498db", borderColor: "#3498db", width: "100%" }}
              >
                Start Exploring
              </button>
            </div>
          </div>

          {/* Image Section - Right on Desktop, Top on Mobile */}
          <div className="col-lg-6 col-md-12 order-md-1 order-lg-2 mb-0 mb-md-0">
            <div className="d-flex justify-content-center justify-content-lg-end">
              <img
                src={jobsearch}
                className="img-fluid rounded"
                alt="Job Search Illustration"
                style={{ maxHeight: "350px", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;