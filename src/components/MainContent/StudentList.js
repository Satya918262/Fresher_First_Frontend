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
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select"; // Ensure react-select is installed
import StudentEditForm from "./StudentEditForm";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState(null); // To track the selected search field
  const [groupFilter, setGroupFilter] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  // Search field options for the dropdown
  const searchFieldOptions = [
    { value: "fullName", label: "Name" },
    { value: "academicBranch", label: "Branch" },
    { value: "college", label: "College" },
    { value: "passedOutYear", label: "Year of Passed Out" },
  ];

  useEffect(() => {
    const role = localStorage.getItem("role");
    const tpoCollege = localStorage.getItem("tpoCollege");
    const tpoId = localStorage.getItem("tpoId");

    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/students`);
        let fetchedStudents = res.data;

        if (role === "tpo" && tpoCollege) {
          fetchedStudents = fetchedStudents.filter(
            (student) => student.college === tpoCollege
          );
        }

        setStudents(fetchedStudents);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching student details");
      }
    };

    const fetchTpoData = async () => {
      if (role === "tpo" && tpoId && !tpoCollege) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/tpos/${tpoId}`);
          localStorage.setItem("tpoCollege", res.data.college);
          fetchStudents();
        } catch (error) {
          console.error("Error fetching TPO data:", error);
          toast.error("Error fetching TPO details");
          fetchStudents();
        }
      } else {
        fetchStudents();
      }
    };

    const fetchSubgroups = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/academic`);
        const { subgroups } = res.data;
        const allSubgroups = Object.values(subgroups)
          .flat()
          .filter((value, index, self) => self.indexOf(value) === index)
          .map((subgroup) => ({
            value: subgroup,
            label: subgroup,
          }));
        setGroupOptions(allSubgroups);
      } catch (error) {
        console.error("Error fetching subgroups:", error);
        toast.error("Error fetching subgroup options");
      }
    };

    fetchTpoData();
    fetchSubgroups();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === filteredStudents.length
        ? []
        : filteredStudents.map((s) => s._id)
    );
  };

  const handleShowModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const handleSave = (updatedStudent) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === updatedStudent._id ? { ...student, ...updatedStudent } : student
      )
    );
    handleCloseModal();
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedRows.map((id) => axios.delete(`${API_BASE_URL}/api/students/${id}`))
      );
      setStudents((prev) => prev.filter((student) => !selectedRows.includes(student._id)));
      setSelectedRows([]);
      toast.success("Selected student(s) deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Error deleting student(s)");
    }
  };

  // Filter students based on the selected search field and term
  const filteredStudents = students.filter((student) => {
    const matchesGroup =
      groupFilter.length === 0 ||
      groupFilter.some((group) => group.value.toLowerCase() === student.group.toLowerCase());

    if (!searchField || !searchTerm) return matchesGroup;

    const fieldValue = student[searchField.value]?.toString().toLowerCase() || "";
    return fieldValue.includes(searchTerm.toLowerCase()) && matchesGroup;
  });

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  const disabledStyle = {
    backgroundColor: "#d3d3d3",
    borderColor: "#d3d3d3",
    color: "black",
    cursor: "not-allowed",
  };

  const headerStyle = {
    backgroundColor: "#003366",
    color: "#fff",
    fontSize: "1.5rem",
    padding: "0.7rem",
    textAlign: "center",
    fontFamily: "Times New Roman",
  };

  const tableStyle = { fontSize: "14px" };
  const theadStyle = { backgroundColor: "#343a40", color: "white", whiteSpace: "nowrap" };
  const profileImgStyle = {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "5px",
    transition: "transform 0.2s",
  };
  const actionBtnStyle = { padding: "6px 20px", transition: "all 0.3s" };
  const mobileBtnStyle = { width: "100%", marginBottom: "10px", padding: "6px 0" };
  const tbodyStyle = { whiteSpace: "nowrap", verticalAlign: "middle" };

  // Unified search field container style
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
        <Col xs={12} md={6} className="mb-2 mb-md-0">
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
              menuPortalTarget={document.body} // Render dropdown in body to avoid clipping
              menuPosition="fixed" // Use fixed positioning to prevent overflow issues
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
        <Col xs={12} md={6} className="text-md-end">
          {isMobile ? (
            <div style={{ width: "100%" }}>
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
                disabled={selectedRows.length === 0}
                className="rounded-0"
                style={{
                  ...actionBtnStyle,
                  ...mobileBtnStyle,
                  ...(selectedRows.length === 0 ? disabledStyle : {}),
                }}
              >
                Delete
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (selectedRows.length === 1) {
                    const studentToEdit = students.find(
                      (student) => student._id === selectedRows[0]
                    );
                    handleShowModal(studentToEdit);
                  } else {
                    toast.error("Please select exactly one student to edit");
                  }
                }}
                disabled={selectedRows.length !== 1}
                className="rounded-0"
                style={{
                  ...actionBtnStyle,
                  ...mobileBtnStyle,
                  ...(selectedRows.length !== 1 ? disabledStyle : {}),
                }}
              >
                Edit
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
                disabled={selectedRows.length === 0}
                className="rounded-0 me-2"
                style={{
                  ...actionBtnStyle,
                  ...(selectedRows.length === 0 ? disabledStyle : {}),
                }}
              >
                Delete
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (selectedRows.length === 1) {
                    const studentToEdit = students.find(
                      (student) => student._id === selectedRows[0]
                    );
                    handleShowModal(studentToEdit);
                  } else {
                    toast.error("Please select exactly one student to edit");
                  }
                }}
                disabled={selectedRows.length !== 1}
                className="rounded-0"
                style={{
                  ...actionBtnStyle,
                  ...(selectedRows.length !== 1 ? disabledStyle : {}),
                }}
              >
                Edit
              </Button>
            </>
          )}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <p style={{ fontSize: "14px", color: "#555" }}>
            Showing {filteredStudents.length} of {students.length} records
          </p>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header style={headerStyle}>Student Details</Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover style={tableStyle}>
              <thead style={theadStyle}>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedRows.length === filteredStudents.length && filteredStudents.length > 0}
                    />
                  </th>
                  <th className="text-center">Full Name</th>
                  <th className="text-center d-none d-md-table-cell">SUC Code</th>
                  <th className="text-center d-none d-md-table-cell">Hall Ticket</th>
                  <th className="text-center d-none d-md-table-cell">Email</th>
                  <th className="text-center d-none d-md-table-cell">Phone</th>
                  <th className="text-center d-none d-md-table-cell">Alternate Phone</th>
                  <th className="text-center d-none d-md-table-cell">College</th>
                  <th className="text-center d-none d-md-table-cell">Branch</th>
                  <th className="text-center d-none d-md-table-cell">Group</th>
                  <th className="text-center d-none d-md-table-cell">10th CGPA</th>
                  <th className="text-center d-none d-md-table-cell">Inter CGPA</th>
                  <th className="text-center d-none d-md-table-cell">Degree CGPA</th>
                  <th className="text-center d-none d-md-table-cell">MCA CGPA</th>
                  <th className="text-center d-none d-md-table-cell">Backlogs</th>
                  <th className="text-center d-none d-md-table-cell">Education Gap</th>
                  <th className="text-center d-none d-md-table-cell">Passed Out Year</th>
                  <th className="text-center d-none d-md-table-cell">Photo</th>
                  <th className="text-center d-md-none">Actions</th>
                </tr>
              </thead>
              <tbody style={tbodyStyle}>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(student._id)}
                          onChange={() => handleCheckboxChange(student._id)}
                        />
                      </td>
                      <td className="text-center">{student.fullName}</td>
                      <td className="text-center d-none d-md-table-cell">{student.sucCode}</td>
                      <td className="text-center d-none d-md-table-cell">{student.hallTicketNumber}</td>
                      <td className="text-center d-none d-md-table-cell">{student.email}</td>
                      <td className="text-center d-none d-md-table-cell">{student.phone}</td>
                      <td className="text-center d-none d-md-table-cell">{student.alternatePhone || "-"}</td>
                      <td className="text-center d-none d-md-table-cell">{student.college}</td>
                      <td className="text-center d-none d-md-table-cell">{student.academicBranch}</td>
                      <td className="text-center d-none d-md-table-cell">{student.group}</td>
                      <td className="text-center d-none d-md-table-cell">{student.tenthCgpa}</td>
                      <td className="text-center d-none d-md-table-cell">{student.interCgpa}</td>
                      <td className="text-center d-none d-md-table-cell">{student.degreeCgpa}</td>
                      <td className="text-center d-none d-md-table-cell">{student.mcaCgpa || "-"}</td>
                      <td className="text-center d-none d-md-table-cell">{student.backlogs}</td>
                      <td className="text-center d-none d-md-table-cell">{student.educationGap}</td>
                      <td className="text-center d-none d-md-table-cell">{student.passedOutYear}</td>
                      <td className="text-center d-none d-md-table-cell">
                        {student.photo ? (
                          <img
                            src={`${API_BASE_URL}/${student.photo}`}
                            alt="Profile"
                            style={profileImgStyle}
                            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                          />
                        ) : (
                          "No Photo"
                        )}
                      </td>
                      <td className="text-center d-md-none">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowModal(student)}
                        >
                          View/Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="19" className="text-center">
                      No students found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <StudentEditForm
        show={showModal}
        onHide={handleCloseModal}
        student={selectedStudent}
        onSave={handleSave}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete {selectedRows.length} student(s)?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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

export default StudentList;