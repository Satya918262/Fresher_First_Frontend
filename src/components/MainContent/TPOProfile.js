import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Image, ListGroup } from "react-bootstrap";
import axios from "axios";
import { FaBuilding, FaEnvelope, FaPhone, FaClock, FaUniversity, FaUserTie } from "react-icons/fa";

const TPOProfile = () => {
  const [tpo, setTpo] = useState(null);
  const [imageError, setImageError] = useState(false);
  const storedTpoId = localStorage.getItem("tpoId");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchTpo = async () => {
      if (!storedTpoId) {
        console.error("No TPO ID found in local storage");
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/api/tpo/${storedTpoId}`);
        setTpo(res.data);
      } catch (error) {
        console.error("Error fetching TPO details:", error);
      }
    };

    fetchTpo();
  }, [storedTpoId]);

  const handleImageError = () => {
    setImageError(true);
  };

  if (!tpo) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <h4>Loading Profile...</h4>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <Card className="shadow-lg border-0" style={{ borderRadius: "15px" }}>
            {/* Header Section (Matches StudentProfile) */}
            <Card.Body
              className="text-center py-4"
              style={{ background: "linear-gradient(135deg, #0b0e2c, #1e3a8a)" }}
            >
              {!imageError ? (
                <Image
                  src={`${API_BASE_URL}/${tpo.photo}`}
                  roundedCircle
                  fluid
                  style={{ width: "120px", height: "120px", objectFit: "cover", border: "4px solid #ffffff" }}
                  onError={handleImageError}
                />
              ) : (
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    color: "#3b82f6",
                    fontSize: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                    border: "4px solid #ffffff",
                  }}
                >
                  {tpo.fullName.charAt(0)}
                </div>
              )}
              <h2 className="mt-3 text-white">{tpo.fullName}</h2>
              <p className="text-white mb-0" style={{ fontSize: "1.1rem" }}>
                {tpo.designation} | {tpo.college}
              </p>
            </Card.Body>

            {/* Separator */}
            <hr className="my-0" style={{ borderColor: "#d1d5db" }} />

            {/* Details Section */}
            <Card.Body className="px-4 py-4">
              <h5 className="text-center mb-4" style={{ color: "#1f2937", fontWeight: "600" }}>
                Profile Details
              </h5>
              <ListGroup variant="flush">
                {/* Designation */}
                <ListGroup.Item className="py-3 border-bottom">
                  <Row className="ms-0 ms-md-5">
                    <Col xs={12} md={6} className="d-flex align-items-center mb-3 mb-md-0">
                      <FaUserTie className="me-3" style={{ color: "#28a745", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Designation</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {tpo.designation}
                        </p>
                      </div>
                    </Col>
                    {/* Department (only shown on desktop) */}
                    <Col xs={12} md={6} className="d-flex align-items-center d-none d-md-flex">
                      <FaBuilding className="me-3" style={{ color: "#28a745", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Department</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {tpo.department}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Department (shown on mobile) */}
                <ListGroup.Item className="py-3 border-bottom d-block d-md-none">
                  <Row className="ms-0">
                    <Col xs={12} className="d-flex align-items-center">
                      <FaBuilding className="me-3" style={{ color: "#28a745", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Department</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "0.8rem" }}>
                          {tpo.department}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Email */}
                <ListGroup.Item className="py-3 border-bottom">
                  <Row className="ms-0 ms-md-5">
                    <Col xs={12} md={6} className="d-flex align-items-center mb-3 mb-md-0">
                      <FaEnvelope className="me-3" style={{ color: "#0d6efd", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Email</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem", wordBreak: "break-word" }}>
                          {tpo.email}
                        </p>
                      </div>
                    </Col>
                    {/* Phone (only shown on desktop) */}
                    <Col xs={12} md={6} className="d-flex align-items-center d-none d-md-flex">
                      <FaPhone className="me-3" style={{ color: "#0d6efd", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Phone</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {tpo.phone}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Phone (shown on mobile) */}
                <ListGroup.Item className="py-3 border-bottom d-block d-md-none">
                  <Row className="ms-0">
                    <Col xs={12} className="d-flex align-items-center">
                      <FaPhone className="me-3" style={{ color: "#0d6efd", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Phone</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {tpo.phone}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* College */}
                <ListGroup.Item className="py-3 border-bottom">
                  <Row className="ms-0 ms-md-5">
                    <Col xs={12} md={6} className="d-flex align-items-center mb-3 mb-md-0">
                      <FaUniversity className="me-3" style={{ color: "#ffc107", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>College</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {tpo.college}
                        </p>
                      </div>
                    </Col>
                    {/* Experience (only shown on desktop) */}
                    <Col xs={12} md={6} className="d-flex align-items-center d-none d-md-flex">
                      <FaClock className="me-3" style={{ color: "#28a745", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Experience</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {tpo.experience} years
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Experience (shown on mobile) */}
                <ListGroup.Item className="py-3 border-bottom d-block d-md-none">
                  <Row className="ms-0">
                    <Col xs={12} className="d-flex align-items-center">
                      <FaClock className="me-3" style={{ color: "#28a745", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Experience</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {tpo.experience} years
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TPOProfile;