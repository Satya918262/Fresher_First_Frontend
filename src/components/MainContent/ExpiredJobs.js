import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExpiredJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchExpiredJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/jobs`);
        console.log("Jobs Data:", res.data);
        const expiredJobs = res.data
          .filter((job) => new Date(job.deadline) < new Date()) // Only expired jobs
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setJobs(expiredJobs);
      } catch (err) {
        console.error("Error fetching expired jobs:", err);
      }
    };
    fetchExpiredJobs();
  }, []);

  const handleViewDetails = (jobId) => {
    navigate(`/dashboard/job-details/${jobId}`);
  };

  const getTimeLabel = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    return diffTime < 0 ? "Expired" : "Error"; // Should always be "Expired" due to filter
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Expired Jobs</h2>
      <Row className="g-4">
        {jobs.length === 0 ? (
          <Col>
            <h4>No expired jobs found</h4>
          </Col>
        ) : (
          jobs.map((job) => (
            <Col md={4} key={job._id}>
              <Card className="mb-4 d-flex flex-column h-100">
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#dc3545", // Red for expired
                      color: "#fff",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {getTimeLabel(job.deadline)}
                  </span>
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
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ marginBottom: "15px" }}>{job.jobTitle}</Card.Title>
                  <Card.Text>
                    <strong>Eligibility:</strong> {job.eligibility.join(", ")}
                  </Card.Text>
                  <Card.Text>
                    <strong>PassedOut Years:</strong> {job.passedOutYears.join(", ")}
                  </Card.Text>
                  <Card.Text>
                    <strong>Location:</strong> {job.location}
                  </Card.Text>
                  <Card.Text>
                    <strong>Salary:</strong> {job.salary}
                  </Card.Text>
                  <Card.Text>
                    <strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
                  </Card.Text>
                  <div className="mt-auto">
                    <Button
                      variant="primary"
                      onClick={() => handleViewDetails(job._id)}
                      className="w-100"
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default ExpiredJobs;