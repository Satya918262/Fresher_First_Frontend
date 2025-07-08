import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/jobApplications/applied/${studentId}`);
        console.log("Applied jobs response:", res.data);
        setAppliedJobs(res.data);
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
      }
    };

    if (studentId) {
      fetchAppliedJobs();
    } else {
      console.error("Student not logged in.");
    }
  }, [studentId]);



  return (
    <Container className="mt-5">
      <h2 className="mb-4">Applied Jobs</h2>
      <Row className="g-4">
        {appliedJobs.length > 0 ? (
          appliedJobs.map((job) => (
            <Col md={4} key={job._id}>
              <Card className="mb-4 d-flex flex-column h-100">
                {job.companyLogo ? (
                  <Card.Img
                    variant="top"
                    src={`${API_BASE_URL}/${job.companyLogo}`}
                    alt={job.companyName}
                    style={{
                      objectFit: "contain",
                      height: "200px",
                      width: "100%",
                      marginBottom: "15px",
                      backgroundColor: "#e0e0e0",
                      padding: "25px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "200px",
                      width: "100%",
                      marginBottom: "15px",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#999",
                      fontSize: "40px",
                      fontWeight: "bold",
                    }}
                  >
                    {job.companyName}
                  </div>
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ marginBottom: "15px" }}>{job.jobTitle}</Card.Title>
                  <Card.Text>
                    <strong>Eligibility:</strong> {job.eligibility.join(", ")}
                  </Card.Text>
                  <Card.Text>
                    <strong>Location:</strong> {job.location}
                  </Card.Text>
                  <Card.Text>
                    <strong>Salary:</strong> {job.salary}
                  </Card.Text>
                  <Card.Text>
                    <strong>Deadline:</strong>{" "}
                    {new Date(job.deadline).toLocaleDateString()}
                  </Card.Text>
                  <div className="mt-auto">
                    <Button variant="success" className="w-100" disabled>
                      Applied
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No applied jobs found.</p>
        )}
      </Row>
    </Container>
  );
};

export default AppliedJobs;
