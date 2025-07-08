import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";

const StudentEditForm = ({ show, onHide, student, onSave }) => {
  const [collegeOptions, setCollegeOptions] = useState(
    student?.college ? [{ value: student.college, label: student.college }] : []
  );
  const [academicBranchOptions, setAcademicBranchOptions] = useState(
    student?.academicBranch
      ? [{ value: student.academicBranch, label: student.academicBranch }]
      : []
  );
  const [groupOptions, setGroupOptions] = useState(
    student?.group ? [{ value: student.group, label: student.group }] : []
  );
  const currentYear = new Date().getFullYear();
  const passedOutYears = Array.from({ length: 5 }, (_, i) => currentYear + i);
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

  useEffect(() => {
    if (student) {
      console.log("Student data received:", student);
      const newFormData = {
        college: student.college || "",
        academicBranch: student.academicBranch || "",
        group: student.group || "",
        passedOutYear: student.passedOutYear ? student.passedOutYear.toString() : "",
        sucCode: student.sucCode || "",
        hallTicketNumber: student.hallTicketNumber || "",
        fullName: student.fullName || "",
        email: student.email || "",
        phone: student.phone || "",
        alternatePhone: student.alternatePhone || "",
        tenthCgpa: student.tenthCgpa ? student.tenthCgpa.toString() : "",
        interCgpa: student.interCgpa ? student.interCgpa.toString() : "",
        degreeCgpa: student.degreeCgpa ? student.degreeCgpa.toString() : "",
        mcaCgpa: student.mcaCgpa ? student.mcaCgpa.toString() : "",
        backlogs:
          student.backlogs !== undefined && student.backlogs !== null
            ? student.backlogs.toString()
            : "",
        educationGap: student.educationGap || "",
        photo: null,
      };
      console.log("Setting formData.backlogs:", newFormData.backlogs);
      setFormData(newFormData);
      setPhotoPreview(student.photo ? `${API_BASE_URL}/${student.photo}` : null);
    }
  }, [student]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/academic/colleges`);
        const colleges = res.data.colleges.map((college) => ({
          value: college,
          label: college,
        }));
        console.log("College options fetched:", colleges);
        if (student?.college && !colleges.some((c) => c.value === student.college)) {
          colleges.unshift({ value: student.college, label: student.college });
        }
        setCollegeOptions(colleges);
      } catch (error) {
        toast.error("Error fetching colleges");
      }
    };
    fetchColleges();
  }, [student]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/academic/branches`);
        const branches = res.data.branches.map((branch) => ({
          value: branch,
          label: branch,
        }));
        console.log("Branch options fetched:", branches);
        if (
          student?.academicBranch &&
          !branches.some((b) => b.value === student.academicBranch)
        ) {
          branches.unshift({
            value: student.academicBranch,
            label: student.academicBranch,
          });
        }
        setAcademicBranchOptions(branches);
      } catch (error) {
        toast.error("Error fetching academic branches");
      }
    };
    fetchBranches();
  }, [student]);

  useEffect(() => {
    if (formData.academicBranch) {
      const fetchSubgroups = async () => {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/api/academic/subgroups/${encodeURIComponent(formData.academicBranch)}`
          );
          const subgroups = res.data.subgroups.map((subgroup) => ({
            value: subgroup,
            label: subgroup,
          }));
          console.log("Group options fetched:", subgroups);
          if (student?.group && !subgroups.some((s) => s.value === student.group)) {
            subgroups.unshift({ value: student.group, label: student.group });
          }
          setGroupOptions(subgroups);
        } catch (error) {
          toast.error("Error fetching groups");
        }
      };
      fetchSubgroups();
    } else {
      setGroupOptions(
        student?.group ? [{ value: student.group, label: student.group }] : []
      );
    }
  }, [formData.academicBranch, student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    } else {
      setPhotoPreview(student?.photo ? `${API_BASE_URL}/${student.photo}` : null);
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (photo) {
      data.append("studentProfile", photo);
    }

    try {
      const res = await axios.put(`${API_BASE_URL}/api/students/${student._id}`, data);
      const updatedStudent = {
        ...formData,
        _id: student._id,
        photo: res.data.student.photo || student.photo,
        passedOutYear: parseInt(formData.passedOutYear) || student.passedOutYear,
        tenthCgpa: parseFloat(formData.tenthCgpa) || student.tenthCgpa,
        interCgpa: parseFloat(formData.interCgpa) || student.interCgpa,
        degreeCgpa: parseFloat(formData.degreeCgpa) || student.degreeCgpa,
        mcaCgpa: parseFloat(formData.mcaCgpa) || student.mcaCgpa,
        backlogs: parseInt(formData.backlogs) || student.backlogs,
      };
      onSave(updatedStudent);
      toast.success("Student updated successfully");
      onHide();
    } catch (error) {
      toast.error("Error updating student");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="student-form-header">
        <Modal.Title>Edit Student: {student?.fullName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form encType="multipart/form-data">
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
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Select
                  name="academicBranch"
                  options={academicBranchOptions}
                  value={
                    academicBranchOptions.find(
                      (option) => option.value === formData.academicBranch
                    ) || null
                  }
                  onChange={handleSelectChange}
                  placeholder="Select Department"
                  styles={customStyles}
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
                  value={
                    passedOutYearOptions.find(
                      (option) => option.value === formData.passedOutYear
                    ) || null
                  }
                  onChange={handleSelectChange}
                  placeholder="Select Year"
                  styles={customStyles}
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
                  onChange={handleInputChange}
                  maxLength={10}
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
                  onChange={handleInputChange}
                  maxLength={10}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Education Gap</Form.Label> {/* Fixed typo from Form_Label */}
                <Select
                  name="educationGap"
                  options={educationGapOptions}
                  value={
                    educationGapOptions.find(
                      (option) => option.value === formData.educationGap
                    ) || null
                  }
                  onChange={handleSelectChange}
                  placeholder="Select Option"
                  styles={customStyles}
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentEditForm;