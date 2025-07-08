import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Card, Row, Col, Spinner } from "react-bootstrap"; // Added Spinner
import "./StudentForm.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const AddTPO = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    department: "",
    email: "",
    phone: "",
    college: "",
    experience: "",
  });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [loading, setLoading] = useState(true); // For fetching colleges
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission

  const experienceOptions = [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "moreThan2", label: "More than 2" },
  ];

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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching colleges:", error);
        toast.error("Failed to load college names");
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData({ ...formData, [name]: selectedOption ? selectedOption.value : "" });
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
      data.append("photo", photo);
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/tpo`, data);
      toast.success(res.data.message || "TPO details saved successfully!");
      setFormData({
        fullName: "",
        designation: "",
        department: "",
        email: "",
        phone: "",
        college: "",
        experience: "",
      });
      setPhoto(null);
      setPhotoPreview(null);
      document.getElementById("photoInput").value = "";
    } catch (error) {
      const errMsg = error.response?.data?.message || "Error saving TPO details";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <Container className="mt-5">
      <Card className="student-form-card">
        <Card.Header className="student-form-header">
          TPO Registration
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
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
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={formData.department}
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
                    onChange={handleChange}
                    pattern="^\d{10}$"
                    title="Enter a valid 10-digit phone number."
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>College Name</Form.Label>
                  <Select
                    name="college"
                    options={collegeOptions}
                    value={collegeOptions.find(
                      (option) => option.value === formData.college
                    )}
                    onChange={handleSelectChange}
                    placeholder={loading ? "Loading colleges..." : "Select College"}
                    styles={customStyles}
                    isDisabled={loading}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Experience (years)</Form.Label>
                  <Select
                    name="experience"
                    options={experienceOptions}
                    value={experienceOptions.find(
                      (option) => option.value === formData.experience
                    )}
                    onChange={handleSelectChange}
                    placeholder="Select Experience"
                    styles={customStyles}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    id="photoInput"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                  />
                  {photoPreview && (
                    <div className="mt-3 text-center">
                      <img
                        src={photoPreview}
                        alt="Profile Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100px",
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
                  Adding TPO...
                </>
              ) : (
                "Add TPO"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default AddTPO;