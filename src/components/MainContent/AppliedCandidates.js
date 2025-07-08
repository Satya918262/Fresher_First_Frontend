import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Button, Tabs, Tab, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import * as XLSX from "xlsx";

const AppliedCandidates = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [appliedCandidates, setAppliedCandidates] = useState([]);
  const [notAppliedStudents, setNotAppliedStudents] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const role = localStorage.getItem("role");
  const tpoCollege = localStorage.getItem("tpoCollege");

  // Search field options for the dropdown
  const searchFieldOptions = [
    { value: "fullName", label: "Name" },
    { value: "sucCode", label: "SUC Code" },
    { value: "group", label: "Group" },
    { value: "college", label: "College" },
    { value: "academicBranch", label: "Branch" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/jobs`);
        const sortedJobs = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setJobs(sortedJobs);
        if (sortedJobs.length > 0) {
          setSelectedJobId(sortedJobs[0]._id);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err.response?.data || err.message);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;

    const fetchAppliedCandidates = async () => {
      try {
        const url =
          role === "tpo"
            ? `${API_BASE_URL}/api/jobApplications/applied-candidates/${selectedJobId}?role=tpo&college=${tpoCollege}`
            : `${API_BASE_URL}/api/jobApplications/applied-candidates/${selectedJobId}?role=admin`;
        const res = await axios.get(url);
        setAppliedCandidates(res.data || []);
      } catch (err) {
        console.error("Error fetching applied candidates:", err.response?.data || err.message);
        setAppliedCandidates([]);
      }
    };

    const fetchNotAppliedStudents = async () => {
      try {
        const url =
          role === "tpo"
            ? `${API_BASE_URL}/api/jobApplications/not-applied/${selectedJobId}?role=tpo&college=${tpoCollege}`
            : `${API_BASE_URL}/api/jobApplications/not-applied/${selectedJobId}?role=admin`;
        const res = await axios.get(url);
        setNotAppliedStudents(res.data || []);
      } catch (err) {
        console.error("Error fetching not applied students:", err.response?.data || err.message);
        setNotAppliedStudents([]);
      }
    };

    fetchAppliedCandidates();
    fetchNotAppliedStudents();
  }, [selectedJobId, role, tpoCollege]);

  const handleViewDetails = (jobId) => {
    navigate(`/dashboard/job-details/${jobId}`);
  };

  const getTimeLabel = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    if (diffTime < 0) return "Expired";
    if (diffTime === 0) return "Last Day";
    if (diffTime === 1) return "1 day left";
    return `${diffTime} days left`;
  };

  // Filter applied candidates
  const filteredAppliedCandidates = appliedCandidates.filter((app) => {
    if (!searchField || !searchTerm) return true;

    const fieldValue = (app.student?.[searchField.value] || "").toString().toLowerCase();
    return fieldValue.includes(searchTerm.toLowerCase());
  });

  // Filter not applied students
  const filteredNotAppliedStudents = notAppliedStudents.filter((student) => {
    if (!searchField || !searchTerm) return true;

    const fieldValue = (student[searchField.value] || "").toString().toLowerCase();
    return fieldValue.includes(searchTerm.toLowerCase());
  });

  const downloadExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleDownloadApplied = () => {
    const data = filteredAppliedCandidates.map((app) => ({
      Name: app.student?.fullName || "N/A",
      "SUC Code": app.student?.sucCode || "N/A",
      Group: app.student?.group || "N/A",
      College: app.student?.college || "N/A",
      Branch: app.student?.academicBranch || "N/A",
    }));
    const jobTitle = jobs.find((job) => job._id === selectedJobId)?.jobTitle || "Applied_Candidates";
    downloadExcel(data, `${jobTitle}_Applied_Candidates`);
  };

  const handleDownloadNotApplied = () => {
    const data = filteredNotAppliedStudents.map((student) => ({
      Name: student.fullName || "N/A",
      "SUC Code": student.sucCode || "N/A",
      Group: student.group || "N/A",
      College: student.college || "N/A",
      Branch: student.academicBranch || "N/A",
    }));
    const jobTitle = jobs.find((job) => job._id === selectedJobId)?.jobTitle || "Not_Applied_Students";
    downloadExcel(data, `${jobTitle}_Not_Applied_Students`);
  };

  const disabledStyle = {
    backgroundColor: "#d3d3d3",
    borderColor: "#d3d3d3",
    color: "black",
    cursor: "not-allowed",
  };

  const searchContainerStyle = {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ced4da",
    borderRadius: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    height: "38px",
    backgroundColor: "#fff",
    width: "100%",
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4 align-items-center">
        <Col xs={12} md={6}>
          <h2>Applied Candidates</h2>
        </Col>
        <Col xs={12} md={6}>
          <div style={searchContainerStyle}>
            <Select
              options={searchFieldOptions}
              value={searchField}
              onChange={(selected) => setSearchField(selected)}
              placeholder="Field"
              styles={{
                control: (base) => ({
                  ...base,
                  border: "none",
                  boxShadow: "none",
                  width: "150px",
                  height: "36px",
                  minHeight: "36px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "20px 0 0 20px",
                  padding: "0 8px",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                  width: "150px",
                  borderRadius: "0 0 4px 4px",
                }),
                container: (base) => ({
                  ...base,
                  height: "36px",
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: "0 4px",
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: "0 8px",
                }),
              }}
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            <input
              type="text"
              placeholder={`Search by ${searchField?.label || "field"}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={!searchField}
              style={{
                border: "none",
                outline: "none",
                flex: 1,
                padding: "0 10px",
                height: "100%",
                borderRadius: "0 20px 20px 0",
                ...(searchField ? {} : disabledStyle),
              }}
            />
          </div>
        </Col>
      </Row>
      <Row className="g-4">
        <Col xs={12} md={4}>
          <h4>Job List</h4>
          {jobs.length === 0 ? (
            <p>No jobs available</p>
          ) : (
            jobs.map((job) => (
              <Card
                key={job._id}
                className={`mb-3 ${selectedJobId === job._id ? "border-primary" : ""}`}
                onClick={() => setSelectedJobId(job._id)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: job.deadline < new Date() ? "#dc3545" : "#28a745",
                        color: "#fff",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "14px",
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
                          height: "150px",
                          width: "100%",
                          backgroundColor: "#e0e0e0",
                          padding: "15px",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "150px",
                          width: "100%",
                          backgroundColor: "#f0f0f0",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "#999",
                          fontSize: "30px",
                          fontWeight: "bold",
                        }}
                      >
                        {job.companyName}
                      </div>
                    )}
                  </div>
                  <Card.Title className="mt-3">{job.jobTitle}</Card.Title>
                  <Card.Text>
                    <strong>Location:</strong> {job.location}
                  </Card.Text>
                  <Card.Text>
                    <strong>Salary:</strong> {job.salary}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => handleViewDetails(job._id)}
                    className="w-100"
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
        <Col xs={12} md={8}>
          <Tabs defaultActiveKey="applied" id="job-tabs" className="mb-3">
            <Tab eventKey="applied" title="Applied Candidates">
              <Row className="mb-3">
                <Col className="text-end">
                  <Button
                    variant="success"
                    onClick={handleDownloadApplied}
                    disabled={filteredAppliedCandidates.length === 0}
                  >
                    Download Excel
                  </Button>
                </Col>
              </Row>
              {filteredAppliedCandidates.length === 0 ? (
                <p>No candidates have applied for this job.</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>SUC Code</th>
                      <th>Name</th>
                      <th>Group</th>
                      {!isMobile && (
                        <>
                          <th>College</th>
                          <th>Branch</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppliedCandidates.map((app) => (
                      <tr key={app.student?._id || app._id}>
                        <td>{app.student?.sucCode || "N/A"}</td>
                        <td>{app.student?.fullName || "N/A"}</td>
                        <td>{app.student?.group || "N/A"}</td>
                        {!isMobile && (
                          <>
                            <td>{app.student?.college || "N/A"}</td>
                            <td>{app.student?.academicBranch || "N/A"}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
            <Tab eventKey="notApplied" title="Not Applied Candidates">
              <Row className="mb-3">
                <Col className="text-end">
                  <Button
                    variant="success"
                    onClick={handleDownloadNotApplied}
                    disabled={filteredNotAppliedStudents.length === 0}
                  >
                    Download Excel
                  </Button>
                </Col>
              </Row>
              {filteredNotAppliedStudents.length === 0 ? (
                <p>No eligible students who haven't applied.</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>SUC Code</th>
                      <th>Name</th>
                      <th>Group</th>
                      {!isMobile && (
                        <>
                          <th>College</th>
                          <th>Branch</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotAppliedStudents.map((student) => (
                      <tr key={student._id}>
                        <td>{student.sucCode || "N/A"}</td>
                        <td>{student.fullName || "N/A"}</td>
                        <td>{student.group || "N/A"}</td>
                        {!isMobile && (
                          <>
                            <td>{student.college || "N/A"}</td>
                            <td>{student.academicBranch || "N/A"}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default AppliedCandidates;