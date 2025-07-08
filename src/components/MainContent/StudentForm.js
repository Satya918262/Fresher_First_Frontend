import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Card, Row, Col, Spinner } from "react-bootstrap"; // Added Spinner
import "./StudentForm.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const StudentForm = () => {
  const currentYear = new Date().getFullYear();
  const passedOutYears = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const [collegeOptions, setCollegeOptions] = useState([]);
  const [academicBranchOptions, setAcademicBranchOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for submission loading

  const passedOutYearOptions = passedOutYears.map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  const educationGapOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const [formData, setFormData] = useState({
    college: "",
    academicBranch: "",
    group: "",
    passedOutYear: "",
    sucCode: "",
    hallTicketNumber: "",
    fullName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    tenthCgpa: "",
    interCgpa: "",
    degreeCgpa: "",
    mcaCgpa: "",
    backlogs: "",
    educationGap: "",
    photo: null,
  });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "black",
      "&:hover": { borderColor: "black" },
      boxShadow: "none",
    }),
    menu: (provided) => ({
      ...provided,
      borderColor: "black",
    }),
  };

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/academic/colleges`);
        const colleges = res.data.colleges.map((college) => ({
          value: college,
          label: college,
        }));
        setCollegeOptions(colleges);
      } catch (error) {
        toast.error("Error fetching colleges");
        console.error("Error fetching colleges:", error);
      }
    };
    fetchColleges();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/academic/branches`);
        const branches = res.data.branches.map((branch) => ({
          value: branch,
          label: branch,
        }));
        setAcademicBranchOptions(branches);
      } catch (error) {
        toast.error("Error fetching academic branches");
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    if (formData.academicBranch) {
      const fetchSubgroups = async () => {
        try {
          const encodedBranch = encodeURIComponent(formData.academicBranch);
          const res = await axios.get(
            `${API_BASE_URL}/api/academic/subgroups/${encodedBranch}`
          );
          const subgroups = res.data.subgroups.map((subgroup) => ({
            value: subgroup,
            label: subgroup,
          }));
          setGroupOptions(subgroups);
        } catch (error) {
          toast.error("Error fetching groups");
          console.error("Error fetching subgroups:", error.response?.data || error.message);
        }
      };
      fetchSubgroups();
    } else {
      setGroupOptions([]);
    }
  }, [formData.academicBranch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : "",
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (photo) {
      data.append("studentProfile", photo);
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/students`, data);
      toast.success(res.data.message || "Student details saved successfully!");
      
      // Reset all form fields
      setFormData({
        college: "",
        academicBranch: "",
        group: "",
        passedOutYear: "",
        sucCode: "",
        hallTicketNumber: "",
        fullName: "",
        email: "",
        phone: "",
        alternatePhone: "",
        tenthCgpa: "",
        interCgpa: "",
        degreeCgpa: "",
        mcaCgpa: "",
        backlogs: "",
        educationGap: "",
        photo: null,
      });
      
      // Reset photo and preview
      setPhoto(null);
      setPhotoPreview(null);
      document.getElementById("photoInput").value = "";
      
      // Reset group options to clear the dropdown
      setGroupOptions([]);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Error saving student details";
      const validationErrors =
        error.response?.data?.errors && error.response.data.errors.join(", ");
      toast.error(validationErrors || errMsg);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <Container className="mt-5">
      <Card className="student-form-card">
        <Card.Header className="student-form-header">Student Registration</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>College</Form.Label>
                  <Select
                    name="college"
                    options={collegeOptions}
                    value={collegeOptions.find((option) => option.value === formData.college) || null}
                    onChange={handleSelectChange}
                    placeholder="Select College"
                    styles={customStyles}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Select
                    name="academicBranch"
                    options={academicBranchOptions}
                    value={academicBranchOptions.find(
                      (option) => option.value === formData.academicBranch
                    ) || null}
                    onChange={handleSelectChange}
                    placeholder="Select Department"
                    styles={customStyles}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Group</Form.Label>
                  <Select
                    name="group"
                    options={groupOptions}
                    value={groupOptions.find((option) => option.value === formData.group) || null}
                    onChange={handleSelectChange}
                    placeholder="Select Group"
                    styles={customStyles}
                    required
                    isDisabled={!formData.academicBranch}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Passed Out Year</Form.Label>
                  <Select
                    name="passedOutYear"
                    options={passedOutYearOptions}
                    value={passedOutYearOptions.find(
                      (option) => option.value === formData.passedOutYear
                    ) || null}
                    onChange={handleSelectChange}
                    placeholder="Select Year"
                    styles={customStyles}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SUC Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="sucCode"
                    value={formData.sucCode}
                    onChange={handleChange}
                    maxLength={10}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hall Ticket Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="hallTicketNumber"
                    value={formData.hallTicketNumber}
                    onChange={handleChange}
                    maxLength={10}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    pattern="^\d{10}$"
                    title="Enter a valid 10-digit phone number."
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Alternate Phone (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    pattern="^\d{10}$"
                    title="Enter a valid 10-digit phone number."
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>10th CGPA</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="tenthCgpa"
                    value={formData.tenthCgpa}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Inter CGPA</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="interCgpa"
                    value={formData.interCgpa}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Degree/BTech CGPA</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="degreeCgpa"
                    value={formData.degreeCgpa}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>MCA CGPA (Optional)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="mcaCgpa"
                    value={formData.mcaCgpa}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Backlogs</Form.Label>
                  <Form.Control
                    type="number"
                    name="backlogs"
                    value={formData.backlogs}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Education Gap</Form.Label>
                  <Select
                    name="educationGap"
                    options={educationGapOptions}
                    value={educationGapOptions.find(
                      (option) => option.value === formData.educationGap
                    ) || null}
                    onChange={handleSelectChange}
                    placeholder="Select Option"
                    styles={customStyles}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    name="studentProfile"
                    id="photoInput"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                  />
                  {photoPreview && (
                    <div className="mt-2 text-center">
                      <img
                        src={photoPreview}
                        alt="Profile Preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Button
              variant="primary"
              type="submit"
              className="submit-btn"
              disabled={isSubmitting} // Disable button while submitting
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default StudentForm;