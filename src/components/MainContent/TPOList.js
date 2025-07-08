import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import "./TPOList.css";

const TPOList = () => {
  const [tpos, setTpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTPO, setSelectedTPO] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    department: "",
    email: "",
    phone: "",
    college: "",
    experience: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [collegeOptions, setCollegeOptions] = useState([]); // Dynamic college options
  const [collegeLoading, setCollegeLoading] = useState(true); // Loading state for college fetch
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
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
      "&:hover": {
        borderColor: "black",
      },
      boxShadow: "none",
    }),
  };

  // Fetch TPO data
  useEffect(() => {
    const fetchTpos = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/tpo`);
        setTpos(res.data.tpos);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching TPO details");
      }
    };
    fetchTpos();
  }, []);

  // Fetch college names from the backend
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/academic/colleges`);
        const colleges = res.data.colleges.map((college) => ({
          value: college,
          label: college,
        }));
        setCollegeOptions(colleges);
        setCollegeLoading(false);
      } catch (error) {
        console.error("Error fetching colleges:", error);
        toast.error("Failed to load college names");
        setCollegeLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((item) => item !== id)
        : [...prevSelectedRows, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === tpos.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tpos.map((tpo) => tpo._id));
    }
  };

  const handleShowModal = (tpo) => {
    setSelectedTPO(tpo);
    setFormData({
      fullName: tpo.fullName,
      designation: tpo.designation,
      department: tpo.department,
      email: tpo.email,
      phone: tpo.phone,
      college: tpo.college,
      experience: tpo.experience,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTPO(null);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/tpo/${selectedTPO._id}`,
        formData
      );
      setTpos((prevTpos) =>
        prevTpos.map((tpo) =>
          tpo._id === selectedTPO._id ? { ...tpo, ...formData } : tpo
        )
      );
      toast.success("TPO updated successfully");
      handleCloseModal();
    } catch (error) {
      toast.error("Error updating TPO");
    }
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      for (let id of selectedRows) {
        await axios.delete(`${API_BASE_URL}/api/tpo/${id}`);
      }
      setTpos((prevTpos) =>
        prevTpos.filter((tpo) => !selectedRows.includes(tpo._id))
      );
      setSelectedRows([]);
      toast.success("Selected TPO(s) deleted successfully");
      handleCloseDeleteModal();
    } catch (error) {
      toast.error("Error deleting TPO(s)");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const filteredTpos = tpos.filter((tpo) =>
    tpo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container fluid className="py-5" style={{ marginTop: "70px", minHeight: "100vh" }}>
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <h4>Loading...</h4>
          </Col>
        </Row>
      </Container>
    );
  }

  const disabledStyle = {
    backgroundColor: "#d3d3d3",
    borderColor: "#d3d3d3",
    color: "#fff",
    cursor: "not-allowed",
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4 align-items-center">
        <Col xs={12} md={6} className="mb-2 mb-md-0">
          <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </Col>
        <Col xs={12} md={6} className="text-md-end">
          <Button
            variant="danger"
            onClick={handleShowDeleteModal}
            disabled={selectedRows.length === 0}
            className="me-2 action-btn"
            style={selectedRows.length === 0 ? disabledStyle : {}}
          >
            Delete
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (selectedRows.length === 1) {
                const tpoToEdit = tpos.find(
                  (tpo) => tpo._id === selectedRows[0]
                );
                handleShowModal(tpoToEdit);
              } else {
                toast.error("Please select exactly one TPO to edit");
              }
            }}
            disabled={selectedRows.length !== 1}
            className="action-btn"
            style={selectedRows.length !== 1 ? disabledStyle : {}}
          >
            Edit
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header className="text-center text-white student-form-header">
          TPO Details
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover className="tpo-table">
              <thead className="thead-dark">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedRows.length === tpos.length && tpos.length > 0
                      }
                    />
                  </th>
                  <th className="text-center">Full Name</th>
                  <th className="text-center d-none d-md-table-cell">
                    Designation
                  </th>
                  <th className="text-center d-none d-md-table-cell">
                    Department
                  </th>
                  <th className="text-center d-none d-md-table-cell">Email</th>
                  <th className="text-center d-none d-md-table-cell">Phone</th>
                  <th className="text-center d-none d-md-table-cell">
                    College
                  </th>
                  <th className="text-center d-none d-md-table-cell">
                    Experience
                  </th>
                  <th className="text-center d-none d-md-table-cell">
                    Profile Picture
                  </th>
                  <th className="text-center d-md-none">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTpos.length > 0 ? (
                  filteredTpos.map((tpo) => (
                    <tr key={tpo._id} className="tpo-row">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(tpo._id)}
                          onChange={() => handleCheckboxChange(tpo._id)}
                        />
                      </td>
                      <td className="text-center">{tpo.fullName}</td>
                      <td className="d-none d-md-table-cell text-center">
                        {tpo.designation}
                      </td>
                      <td className="d-none d-md-table-cell text-center">
                        {tpo.department}
                      </td>
                      <td className="d-none d-md-table-cell text-center">
                        {tpo.email}
                      </td>
                      <td className="d-none d-md-table-cell text-center">
                        {tpo.phone}
                      </td>
                      <td className="d-none d-md-table-cell text-center">
                        {tpo.college}
                      </td>
                      <td className="d-none d-md-table-cell text-center">
                        {tpo.experience}
                      </td>
                      <td className="d-none d-md-table-cell text-center">
                        {tpo.photo ? (
                          <img
                            src={`${API_BASE_URL}/${tpo.photo}`}
                            alt="Profile"
                            className="profile-img"
                          />
                        ) : (
                          "No Photo"
                        )}
                      </td>
                      <td className="text-center d-md-none">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowModal(tpo)}
                        >
                          View/Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No TPOs found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {selectedTPO && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton className="text-dark">
            <Modal.Title>Edit {selectedTPO.fullName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>College</Form.Label>
                <Select
                  name="college"
                  options={collegeOptions}
                  value={
                    formData.college
                      ? collegeOptions.find((option) => option.value === formData.college)
                      : null
                  }
                  onChange={handleSelectChange}
                  placeholder={collegeLoading ? "Loading colleges..." : "Select College"}
                  styles={customStyles}
                  isDisabled={collegeLoading}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Experience (Years)</Form.Label>
                <Select
                  name="experience"
                  options={experienceOptions}
                  value={
                    formData.experience
                      ? experienceOptions.find((option) => option.value === formData.experience)
                      : null
                  }
                  onChange={handleSelectChange}
                  placeholder="Select Experience"
                  styles={customStyles}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedRows.length} TPO(s)?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default TPOList;