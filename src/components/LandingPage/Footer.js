import React from "react";
import { Container, Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Social Media Icons

const Footer = () => {
  return (
    <footer className=" text-light py-1" style={{ backgroundColor: "#6c757d" }}>
      <Container>
        <Row className="justify-content-center m-0">
          {/* About Us Section */}
          <Col md={4} sm={12} className="text-center">
            <h5>About Us</h5>
            <p>
            Our vision is to bridge the gap between academic knowledge and
            professional expertise by creating a seamless platform for colleges
            and companies to connect. We strive to empower students by providing
            them with opportunities that match their skills, passions, and
            career aspirations.
           </p>
          </Col>


          {/* Contact Us Section */}
          <Col md={4} sm={12} className="text-center">
            <h5>Contact Us</h5>
            <p>
              <strong>Email:</strong> fresherfirst@gmail.com <br />
              <strong>Phone:</strong> +91 1234567890
            </p>
          </Col>
        </Row>
        <br />
        <hr />
        {/* Copyright Section */}
        <Row className="justify-content-center m-0 mt-0">
          <Col className="text-center">
            <p>&copy; 2025 FresherFirst. All Rights Reserved.</p>
          </Col>
        </Row>
        {/* Social Media Links */}
        <Row className="justify-content-center m-0 mt-1">
          {" "}
          {/* Adjusted margin */}
          <Col className="text-center">
            <div className="d-flex justify-content-center">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light mx-2"
              >
                <FaFacebook size={30} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light mx-2"
              >
                <FaTwitter size={30} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light mx-2"
              >
                <FaInstagram size={30} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light mx-2"
              >
                <FaLinkedin size={30} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
