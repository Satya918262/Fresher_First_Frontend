import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    companyName: "",
    jobTitle: "",
    jobType: "",
    location: "",
    salary: "",
    jobDescription: "",
    deadline: "",
    applyLink: "",
    selectionProcess: "",
    eligibility: [],
    passedOutYears: [],
    companyLogo: "None",
    attachments: "None",
  });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [companyLogo, setCompanyLogo] = useState(null);
  const [attachments, setAttachments] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/jobs/${jobId}`);
        const fetchedData = res.data;

        // Format deadline correctly for the date input
        if (fetchedData.deadline) {
          fetchedData.deadline = new Date(fetchedData.deadline).toISOString().split("T")[0];
        }

        // Handle missing companyLogo and attachments
        fetchedData.companyLogo = fetchedData.companyLogo || "None";
        fetchedData.attachments = fetchedData.attachments || "None";

        setJobData(fetchedData);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    Object.keys(jobData).forEach((key) => {
      formData.append(key, Array.isArray(jobData[key]) ? JSON.stringify(jobData[key]) : jobData[key]);
    });

    if (companyLogo) formData.append("companyLogo", companyLogo);
    if (attachments) formData.append("attachments", attachments);

    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/jobs/${jobId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage("Job updated successfully!");
      setTimeout(() => navigate("/dashboard/JobList"), 2000);
    } catch (error) {
      setMessage("Error updating job.");
    }
  };

  return (
    <Container className="py-5 mt-5">
      <h2>Edit Job</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Company Name</Form.Label>
          <Form.Control type="text" name="companyName" value={jobData.companyName} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job Title</Form.Label>
          <Form.Control type="text" name="jobTitle" value={jobData.jobTitle} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job Type</Form.Label>
          <Form.Control type="text" name="jobType" value={jobData.jobType} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" name="location" value={jobData.location} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Salary</Form.Label>
          <Form.Control type="text" name="salary" value={jobData.salary} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job Description</Form.Label>
          <Form.Control as="textarea" rows={5} name="jobDescription" value={jobData.jobDescription} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Deadline</Form.Label>
          <Form.Control type="date" name="deadline" value={jobData.deadline} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Apply Link</Form.Label>
          <Form.Control type="url" name="applyLink" value={jobData.applyLink} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Selection Process</Form.Label>
          <Form.Control as="textarea" name="selectionProcess" value={jobData.selectionProcess} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Eligibility (Comma Separated)</Form.Label>
          <Form.Control
            type="text"
            name="eligibility"
            value={jobData.eligibility.join(",")}
            onChange={(e) => setJobData({ ...jobData, eligibility: e.target.value.split(",") })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Passed Out Years (Comma Separated)</Form.Label>
          <Form.Control
            type="text"
            name="passedOutYears"
            value={jobData.passedOutYears.join(",")}
            onChange={(e) => setJobData({ ...jobData, passedOutYears: e.target.value.split(",") })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Company Logo</Form.Label>
          <Form.Control type="file" onChange={(e) => setCompanyLogo(e.target.files[0])} />
          {jobData.companyLogo !== "None" && <p>Current Logo: {jobData.companyLogo}</p>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Attachments</Form.Label>
          <Form.Control type="file" onChange={(e) => setAttachments(e.target.files[0])} />
          {jobData.attachments !== "None" && <p>Current Attachments: {jobData.attachments}</p>}
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Job
        </Button>
      </Form>
    </Container>
  );
};

export default EditJob;
