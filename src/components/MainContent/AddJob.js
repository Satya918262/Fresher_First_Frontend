import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import "./StudentForm.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const AddJob = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobType: "",
    location: "",
    salary: "",
    jobDescription: "",
    deadline: "",
    applyLink: "",
    selectionProcess: "",
  });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [eligibility, setEligibility] = useState([]);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  const [attachments, setAttachments] = useState(null);
  const [passedOutYears, setPassedOutYears] = useState([]);
  const [academicData, setAcademicData] = useState({
    colleges: [],
    branches: [],
    subgroups: {},
  });

  const jobTypeOptions = [
    { value: "Full-Time", label: "Full-Time" },
    { value: "Part-Time", label: "Part-Time" },
    { value: "Internship", label: "Internship" },
    { value: "Internship + Job Offer", label: "Internship + Job Offer" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 6 },
    (_, i) => ({
      value: currentYear - 1 + i,
      label: String(currentYear - 1 + i),
    })
  );

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "black",
      "&:hover": {
        borderColor: "black",
      },
      boxShadow: "none",
    }),
    menu: (provided) => ({
      ...provided,
      borderColor: "black",
    }),
  };

  // Fetch academic data on component mount
  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/academic`);
        setAcademicData({
          colleges: res.data.colleges || [],
          branches: res.data.branches || [],
          subgroups: res.data.subgroups || {},
        });
      } catch (error) {
        toast.error("Error fetching academic data");
        console.error("Error fetching academic data:", error);
      }
    };
    fetchAcademicData();
  }, []);

  // Generate eligibility options for the dropdown
  const eligibilityOptions = () => {
    const options = [];
    academicData.branches.forEach((branch) => {
      options.push({ value: branch, label: `${branch} (All Subgroups)` });
      (academicData.subgroups[branch] || []).forEach((subgroup) => {
        options.push({ value: subgroup, label: `${branch} - ${subgroup}` });
      });
    });
    return options;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData({ ...formData, [name]: selectedOption ? selectedOption.value : "" });
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setPassedOutYears(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  const handleEligibilitySelectChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    
    // Build the new eligibility array based on selected options
    const newEligibility = [];
    
    // Iterate through all branches to check selections
    academicData.branches.forEach((branch) => {
      const branchSelected = selectedValues.includes(branch);
      const branchSubgroups = academicData.subgroups[branch] || [];
      
      if (branchSelected) {
        // If the branch "(All Subgroups)" is selected, add all its subgroups
        branchSubgroups.forEach((subgroup) => {
          if (!newEligibility.includes(subgroup)) {
            newEligibility.push(subgroup);
          }
        });
      } else {
        // If the branch isn't selected, check for individual subgroup selections
        branchSubgroups.forEach((subgroup) => {
          if (selectedValues.includes(subgroup) && !newEligibility.includes(subgroup)) {
            newEligibility.push(subgroup);
          }
        });
      }
    });

    setEligibility(newEligibility);
  };

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    setFile(file);
    if (file && setFile === setCompanyLogo) {
      const previewUrl = URL.createObjectURL(file);
      setCompanyLogoPreview(previewUrl);
    } else if (setFile === setCompanyLogo) {
      setCompanyLogoPreview(null);
    }
  };

  const handleRemoveLogo = () => {
    setCompanyLogo(null);
    setCompanyLogoPreview(null);
    document.getElementById("companylogo").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("eligibility", JSON.stringify(eligibility));
    data.append("passedOutYears", JSON.stringify(passedOutYears));
    if (companyLogo) data.append("companyLogo", companyLogo);
    if (attachments) data.append("attachments", attachments);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/jobs`, data);
      toast.success(res.data.message || "Job Posted Successfully!");
      setFormData({
        companyName: "",
        jobTitle: "",
        jobType: "",
        location: "",
        salary: "",
        jobDescription: "",
        deadline: "",
        applyLink: "",
        selectionProcess: "",
      });
      setEligibility([]);
      setPassedOutYears([]);
      setCompanyLogo(null);
      setCompanyLogoPreview(null);
      setAttachments(null);
      document.getElementById("companylogo").value = "";
      document.getElementById("attachments").value = "";
    } catch (error) {
      const errMsg = error.response?.data?.message || "Error saving Job";
      toast.error(errMsg);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="student-form-card">
        <Card.Header className="student-form-header">Post a Job</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Company Details */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Logo (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    id="companylogo"
                    name="companyLogo"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setCompanyLogo)}
                  />
                  {companyLogoPreview && (
                    <div className="mt-3 text-center position-relative" style={{ maxWidth: "100px", margin: "0 auto" }}>
                      <img
                        src={companyLogoPreview}
                        alt="Company Logo Preview"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          objectFit: "contain",
                        }}
                      />
                      <span
                        onClick={handleRemoveLogo}
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "-10px",
                          background: "red",
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "16px",
                          textAlign: "center",
                        }}
                        title="Remove Logo"
                      >
                        ×
                      </span>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* Job Details */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Type</Form.Label>
                  <Select
                    name="jobType"
                    options={jobTypeOptions}
                    value={jobTypeOptions.find(option => option.value === formData.jobType) || null}
                    onChange={handleSelectChange}
                    placeholder="Select Job Type"
                    styles={customStyles}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Location & Salary */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Salary</Form.Label>
                  <Form.Control
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Job Description */}
            <Form.Group className="mb-3">
              <Form.Label>Job Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Eligibility Section */}
            <Form.Group className="mb-3">
              <Form.Label>Eligibility</Form.Label>
              <Select
                isMulti
                name="eligibility"
                options={eligibilityOptions()}
                value={eligibilityOptions().filter(option => 
                  academicData.branches.includes(option.value) 
                    ? (academicData.subgroups[option.value] || []).every(subgroup => eligibility.includes(subgroup))
                    : eligibility.includes(option.value)
                )}
                onChange={handleEligibilitySelectChange}
                placeholder="Select Eligibility"
                styles={customStyles}
                closeMenuOnSelect={false}
              />
            </Form.Group>

            {/* Passed Out Year */}
            <Form.Group className="mb-3">
              <Form.Label>Year of Passed Out</Form.Label>
              <Select
                isMulti
                name="passedOutYears"
                options={yearOptions}
                value={yearOptions.filter(option => passedOutYears.includes(option.value))}
                onChange={handleMultiSelectChange}
                placeholder="Select Year(s)"
                styles={customStyles}
              />
            </Form.Group>

            {/* Selection Process */}
            <Form.Group className="mb-3">
              <Form.Label>Selection Process</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="selectionProcess"
                value={formData.selectionProcess}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Deadline & Apply Link */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Application Deadline</Form.Label>
                  <Form.Control
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apply Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="applyLink"
                    value={formData.applyLink}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Attachments */}
            <Form.Group className="mb-3">
              <Form.Label>Attachments (Optional - PDFs Only)</Form.Label>
              <Form.Control
                type="file"
                id="attachments"
                name="attachments"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, setAttachments)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="submit-btn">
              Submit Job
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default AddJob;