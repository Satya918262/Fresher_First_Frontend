import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Image, ListGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaCode, FaTicketAlt, FaEnvelope, FaPhone, FaClock, FaUniversity, FaGraduationCap, FaBook } from "react-icons/fa";

const StudentProfile = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [imageError, setImageError] = useState(false);
  const storedStudentId = localStorage.getItem("studentId");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchStudent = async () => {
      if (!storedStudentId) {
        console.error("No student ID found in local storage");
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/api/students/${storedStudentId}`);
        setStudent(res.data);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudent();
  }, [storedStudentId]);

  const handleImageError = () => {
    setImageError(true);
  };

  if (!student) {
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
            {/* Header Section */}
            <Card.Body
              className="text-center py-4"
              style={{ background: "linear-gradient(135deg, #0b0e2c, #1e3a8a)" }}
            >
              {!imageError ? (
                <Image
                  src={`${API_BASE_URL}/${student.photo}`}
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
                  {student.fullName.charAt(0)}
                </div>
              )}
              <h2 className="mt-3 text-white">{student.fullName}</h2>
              <p className="text-white mb-0" style={{ fontSize: "1.1rem" }}>
                {student.group} | {student.college}
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
                {/* SUC Code */}
                <ListGroup.Item className="py-3 border-bottom">
                  <Row className="ms-0 ms-md-5">
                    <Col xs={12} md={6} className="d-flex align-items-center mb-3 mb-md-0">
                      <FaCode className="me-3" style={{ color: "#28a745", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>SUC Code</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.sucCode}
                        </p>
                      </div>
                    </Col>
                    {/* Hall Ticket (only shown on desktop) */}
                    <Col xs={12} md={6} className="d-flex align-items-center d-none d-md-flex">
                      <FaTicketAlt className="me-3" style={{ color: "#28a745", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Hall Ticket</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.hallTicketNumber}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Hall Ticket (shown on mobile) */}
                <ListGroup.Item className="py-3 border-bottom d-block d-md-none">
                  <Row className="ms-0">
                    <Col xs={12} className="d-flex align-items-center">
                      <FaTicketAlt className="me-3" style={{ color: "#28a745", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Hall Ticket</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.hallTicketNumber}
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
                          {student.email}
                        </p>
                      </div>
                    </Col>
                    {/* Phone (only shown on desktop) */}
                    <Col xs={12} md={6} className="d-flex align-items-center d-none d-md-flex">
                      <FaPhone className="me-3" style={{ color: "#0d6efd", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Phone</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.phone}
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
                          {student.phone}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Alternate Phone */}
                <ListGroup.Item className="py-3 border-bottom">
                  <Row className="ms-0 ms-md-5">
                    <Col xs={12} md={6} className="d-flex align-items-center mb-3 mb-md-0">
                      <FaPhone className="me-3" style={{ color: "#0d6efd", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Alternate Phone</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.alternatePhone || "N/A"}
                        </p>
                      </div>
                    </Col>
                    {/* College (only shown on desktop) */}
                    <Col xs={12} md={6} className="d-flex align-items-center d-none d-md-flex">
                      <FaUniversity className="me-3" style={{ color: "#ffc107", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>College</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.college}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* College (shown on mobile) */}
                <ListGroup.Item className="py-3 border-bottom d-block d-md-none">
                  <Row className="ms-0">
                    <Col xs={12} className="d-flex align-items-center">
                      <FaUniversity className="me-3" style={{ color: "#ffc107", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: " #1f2937" }}>College</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.college}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Academic Branch */}
                <ListGroup.Item className="py-3 border-bottom">
                  <Row className="ms-0 ms-md-5">
                    <Col xs={12} md={6} className="d-flex align-items-center mb-3 mb-md-0">
                      <FaGraduationCap className="me-3" style={{ color: "#ffc107", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Academic Branch</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.academicBranch}
                        </p>
                      </div>
                    </Col>
                    {/* Group (only shown on desktop) */}
                    <Col xs={12} md={6} className="d-flex align-items-center d-none d-md-flex">
                      <FaGraduationCap className="me-3" style={{ color: "#ffc107", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Group</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.group}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Group (shown on mobile) */}
                <ListGroup.Item className="py-3 border-bottom d-block d-md-none">
                  <Row className="ms-0">
                    <Col xs={12} className="d-flex align-items-center">
                      <FaGraduationCap className="me-3" style={{ color: "#ffc107", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Group</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.group}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Passed Out Year */}
                <ListGroup.Item className="py-3 border-bottom">
                  <Row className="ms-0 ms-md-5">
                    <Col xs={12} md={6} className="d-flex align-items-center mb-3 mb-md-0">
                      <FaClock className="me-3" style={{ color: "#28a745", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Passed Out Year</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.passedOutYear}
                        </p>
                      </div>
                    </Col>
                    {/* 10th CGPA (only shown on desktop) */}
                    <Col xs={12} md={6} className="d-flex align-items-center d-none d-md-flex">
                      <FaBook className="me-3" style={{ color: "#0d6efd", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>10th CGPA</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.tenthCgpa}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* 10th CGPA (shown on mobile) */}
                <ListGroup.Item className="py-3 border-bottom d-block d-md-none">
                  <Row className="ms-0">
                    <Col xs={12} className="d-flex align-items-center">
                      <FaBook className="me-3" style={{ color: "#0d6efd", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>10th CGPA</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.tenthCgpa}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Inter CGPA */}
                <ListGroup.Item className="py-3 border-bottom">
                  <Row className="ms-0 ms-md-5">
                    <Col xs={12} md={6} className="d-flex align-items-center mb-3 mb-md-0">
                      <FaBook className="me-3" style={{ color: "#0d6efd", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Inter CGPA</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.interCgpa}
                        </p>
                      </div>
                    </Col>
                    {/* Degree CGPA (only shown on desktop) */}
                    <Col xs={12} md={6} className="d-flex align-items-center d-none d-md-flex">
                      <FaBook className="me-3" style={{ color: "#0d6efd", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Degree CGPA</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.degreeCgpa}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Degree CGPA (shown on mobile) */}
                <ListGroup.Item className="py-3 border-bottom d-block d-md-none">
                  <Row className="ms-0">
                    <Col xs={12} className="d-flex align-items-center">
                      <FaBook className="me-3" style={{ color: "#0d6efd", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Degree CGPA</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.degreeCgpa}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* MCA CGPA */}
                <ListGroup.Item className="py-3 border-bottom">
                  <Row className="ms-0 ms-md-5">
                    <Col xs={12} md={6} className="d-flex align-items-center mb-3 mb-md-0">
                      <FaBook className="me-3" style={{ color: "#0d6efd", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>MCA CGPA</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.mcaCgpa || "N/A"}
                        </p>
                      </div>
                    </Col>
                    {/* Backlogs (only shown on desktop) */}
                    <Col xs={12} md={6} className="d-flex align-items-center d-none d-md-flex">
                      <FaBook className="me-3" style={{ color: "#0d6efd", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Backlogs</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.backlogs}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Backlogs (shown on mobile) */}
                <ListGroup.Item className="py-3 border-bottom d-block d-md-none">
                  <Row className="ms-0">
                    <Col xs={12} className="d-flex align-items-center">
                      <FaBook className="me-3" style={{ color: "#0d6efd", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Backlogs</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.backlogs}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Education Gap */}
                <ListGroup.Item className="py-3">
                  <Row className="ms-0 ms-md-5">
                    <Col xs={12} md={6} className="d-flex align-items-center">
                      <FaClock className="me-3" style={{ color: "#28a745", fontSize: "1.5rem" }} />
                      <div>
                        <strong style={{ color: "#1f2937" }}>Education Gap</strong>
                        <p className="mb-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "1.1rem" }}>
                          {student.educationGap}
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

export default StudentProfile;