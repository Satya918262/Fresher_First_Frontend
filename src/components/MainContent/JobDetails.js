import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Tabs, Tab, Image, Modal } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const studentId = localStorage.getItem("studentId");
  const userRole = localStorage.getItem("role");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/jobs/${jobId}`);
        setJob(res.data);

        // Only check application status for students
        if (userRole === "student" && studentId) {
          const applicationRes = await axios.get(`${API_BASE_URL}/api/jobApplications/${jobId}/${studentId}`);
          if (applicationRes.data && applicationRes.data.applied) {
            setIsApplied(true);
          }
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    fetchJobDetails();
  }, [jobId, studentId, userRole]);

  if (!job) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <h4>Loading job details...</h4>
          </Col>
        </Row>
      </Container>
    );
  }

  const handleBack = () => navigate("/dashboard/JobList");
  const handleEditJob = () => navigate(`/dashboard/edit-job/${jobId}`);
  const handleApplyClick = () => setShowModal(true);

  const handleConsent = async () => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/jobApplications`, {
        job: job._id,
        student: studentId,
        consent: true,
      });
      if (res.status === 201) setIsApplied(true);
      setShowModal(false);
    } catch (error) {
      setErrorMsg("Error submitting application. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <Container fluid className="py-5 mt-5">
      <Button
        variant="secondary"
        onClick={handleBack}
        className="mb-4 ms-md-5"
      >
        Back to Job List
      </Button>

      {userRole === "admin" && (
        <Button variant="warning" onClick={handleEditJob} className="mb-4 ms-3">
          Edit Job
        </Button>
      )}

      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <Row className="mb-4 align-items-center">
            <Col xs={12} md={4}>
              {job.companyLogo ? (
                <Image
                  src={`${API_BASE_URL}/${job.companyLogo}`}
                  alt={job.companyName}
                  fluid
                  style={{ objectFit: "contain", maxHeight: "200px", marginBottom: "15px" }}
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
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {job.companyName}
                </div>
              )}
            </Col>
            <Col xs={12} md={8}>
              <h2 className="fw-bold">{job.jobTitle}</h2>
              <div className="mb-2">
                <strong>Job Type:</strong> {job.jobType}
              </div>
              <div className="mb-2">
                <strong>Location:</strong> {job.location}
              </div>
              <div className="mb-2">
                <strong>Salary:</strong> {job.salary}
              </div>
              <div className="mb-2">
                <strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
              </div>
              {/* Conditional Button Logic */}
              {userRole === "student" ? (
                isApplied ? (
                  <Button variant="success" disabled className="mt-3 w-100 w-md-auto">
                    Applied
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleApplyClick}
                    className="mt-3 w-100 w-md-auto"
                  >
                    Apply Now
                  </Button>
                )
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {}}
                  className="mt-3 w-100 w-md-auto"
                >
                  View Details
                </Button>
              )}
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Tabs
                defaultActiveKey="description"
                id="job-details-tabs"
                className="mb-3 border-0"
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "10px 0",
                }}
              >
                <Tab
                  eventKey="description"
                  title="Description"
                  tabClassName="px-4 py-2 fw-bold text-dark"
                  style={{ borderBottom: "3px solid transparent" }}
                >
                  <div
                    className="mt-3 p-3 bg-white rounded shadow-sm"
                    dangerouslySetInnerHTML={{ __html: job.jobDescription }}
                  />
                </Tab>
                <Tab
                  eventKey="attachments"
                  title="Attachments"
                  tabClassName="px-4 py-2 fw-bold text-dark"
                  style={{ borderBottom: "3px solid transparent" }}
                >
                  <div className="mt-3 p-3 bg-white rounded shadow-sm">
                    {job.attachments ? (
                      <a
                        href={`${API_BASE_URL}/${job.attachments}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary"
                      >
                        Download Attachment
                      </a>
                    ) : (
                      <p>No attachments available.</p>
                    )}
                  </div>
                </Tab>
                <Tab
                  eventKey="process"
                  title="Selection Process"
                  tabClassName="px-4 py-2 fw-bold text-dark"
                  style={{ borderBottom: "3px solid transparent" }}
                >
                  <div className="mt-3 p-3 bg-white rounded shadow-sm">
                    <p>{job.selectionProcess}</p>
                  </div>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <strong>{job.companyName}</strong> - Application Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Please review the details and terms before proceeding. As a placement coordinator, we advise you to verify all information carefully before registering. By clicking "I applied for the job," you confirm that you have read the terms and will complete the registration via the provided link.
          </p>
          <p>
            <a
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              Click here to apply on the company website.
            </a>
          </p>
          {errorMsg && <p className="text-danger">{errorMsg}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConsent} disabled={isSubmitting}>
            I applied for the job
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default JobDetails;