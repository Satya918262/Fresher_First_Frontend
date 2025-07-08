import React from "react";
import amazon from "../../images/amazon.png";
import accenture from "../../images/accenture.png";
import wipro from "../../images/wipro.png";
import capgemini from "../../images/capgemini.png";
import cognizant from "../../images/cognizant.png";

function AboutUs() {
  // Array of image URLs (replace with your actual company logos)
  const companyLogos = [
    amazon,
    wipro,
    accenture,
    capgemini,
    cognizant
    // Add more image URLs here
  ];

  return (
    <>
      <div className="marquee-container">
        <h1 className="marquee-heading">Top Companies</h1>
        <div className="marquee">
          <div className="marquee-content">
            {companyLogos.concat(companyLogos).map((logo, index) => (
              <img key={index} src={logo} alt={`Company ${index + 1}`} className="company-logo" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
