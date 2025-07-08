import React, { useState, useEffect } from "react";
import { FaCodeBranch, FaLayerGroup, FaUniversity, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Ensure this is imported (can be in index.js instead)

function AdminAcademicManagement() {
  const [collegeNames, setCollegeNames] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subgroups, setSubgroups] = useState({});
  const [newCollegeName, setNewCollegeName] = useState("");
  const [branch, setBranch] = useState("");
  const [subgroup, setSubgroup] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/academic`);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
        }
        const data = await response.json();
        setCollegeNames(data.colleges || []);
        setBranches(data.branches || []);
        setSubgroups(data.subgroups || {});
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load data"); // Use toast instead of setError
      }
    };
    fetchData();
  }, []);

  const handleAddCollegeName = async (e) => {
    e.preventDefault();
    if (!newCollegeName) {
      toast.error("College name is required"); // Toast error
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/academic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeName: newCollegeName }),
      });
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }
      setCollegeNames([...collegeNames, newCollegeName]);
      setNewCollegeName("");
      toast.success("College added successfully"); // Toast success
    } catch (err) {
      console.error("Add college error:", err);
      toast.error(err.message || "Something went wrong"); // Toast error
    }
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (!branch) {
      toast.error("Branch name is required"); // Toast error
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/academic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch }),
      });
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }
      setBranches([...branches, branch]);
      setBranch("");
      toast.success("Branch added successfully"); // Toast success
    } catch (err) {
      console.error("Add branch error:", err);
      toast.error(err.message || "Something went wrong"); // Toast error
    }
  };

  const handleAddSubgroup = async (e) => {
    e.preventDefault();
    if (!selectedBranch || !subgroup) {
      toast.error("Please select a branch and enter a subgroup"); // Toast error
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/academic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch: selectedBranch, subgroup }),
      });
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }
      setSubgroups({
        ...subgroups,
        [selectedBranch]: [...(subgroups[selectedBranch] || []), subgroup],
      });
      setSubgroup("");
      toast.success("Subgroup added successfully"); // Toast success
    } catch (err) {
      console.error("Add subgroup error:", err);
      toast.error(err.message || "Something went wrong"); // Toast error
    }
  };

  const handleDeleteCollege = async (college) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${college}"?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/academic/college`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeName: college }),
      });
      const responseText = await response.text();
      console.log("Delete college response:", responseText);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }
      setCollegeNames(collegeNames.filter((c) => c !== college));
      toast.success("College deleted successfully"); // Toast success
    } catch (err) {
      console.error("Delete college error:", err);
      toast.error(err.message || "Failed to delete college"); // Toast error
    }
  };

  const handleDeleteBranch = async (branchName) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${branchName}"? This will also delete all its subgroups.`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/academic/branch`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch: branchName }),
      });
      const responseText = await response.text();
      console.log("Delete branch response:", responseText);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }
      setBranches(branches.filter((b) => b !== branchName));
      const updatedSubgroups = { ...subgroups };
      delete updatedSubgroups[branchName];
      setSubgroups(updatedSubgroups);
      toast.success("Branch deleted successfully"); // Toast success
    } catch (err) {
      console.error("Delete branch error:", err);
      toast.error(err.message || "Failed to delete branch"); // Toast error
    }
  };

  const handleDeleteSubgroup = async (branchName, subgroupName) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${subgroupName}" from "${branchName}"?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/academic/subgroup`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch: branchName, subgroup: subgroupName }),
      });
      const responseText = await response.text();
      console.log("Delete subgroup response:", responseText);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }
      setSubgroups({
        ...subgroups,
        [branchName]: subgroups[branchName].filter((s) => s !== subgroupName),
      });
      toast.success("Subgroup deleted successfully"); // Toast success
    } catch (err) {
      console.error("Delete subgroup error:", err);
      toast.error(err.message || "Failed to delete subgroup"); // Toast error
    }
  };

  return (
    <div className="container-fluid min-vh-100 py-5">
      <h1
        className="text-center mb-3 text-dark fw-bold fs-1 display-4"
        style={{ fontFamily: "Times New Roman", marginTop: "100px" }}
      >
        Dashboard
      </h1>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="accordion" id="academicAccordion">
            <div className="accordion-item border-0 shadow-sm mb-3 rounded">
              <h2 className="accordion-header" id="collegeHeading">
                <button
                  className="accordion-button text-white fw-bold py-3"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collegeCollapse"
                  aria-expanded="true"
                  aria-controls="collegeCollapse"
                  style={{ backgroundColor: "#F765A3" }}
                >
                  <FaUniversity className="me-2" /> Colleges
                </button>
              </h2>
              <div
                id="collegeCollapse"
                className="accordion-collapse collapse" 
                aria-labelledby="collegeHeading"
                data-bs-parent="#academicAccordion"
              >
                <div className="accordion-body bg-white p-4">
                  <div
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      marginBottom: "1rem",
                    }}
                  >
                    <ul className="list-group list-group-flush">
                      {collegeNames.map((college) => (
                        <li
                          key={college}
                          className="list-group-item border-0 py-2 text-dark d-flex justify-content-between align-items-center"
                        >
                          {college}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteCollege(college)}
                          >
                            <FaTrash />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <form onSubmit={handleAddCollegeName}>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted">
                        Add New College
                      </label>
                      <input
                        type="text"
                        className="form-control rounded shadow-sm"
                        placeholder="e.g., XYZ University"
                        value={newCollegeName}
                        onChange={(e) => setNewCollegeName(e.target.value)}
                        style={{ transition: "all 0.3s ease" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn w-100 text-white fw-bold"
                      style={{
                        backgroundColor: "#F765A3",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#e04e8b")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#F765A3")
                      }
                    >
                      Add College
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="accordion-item border-0 shadow-sm mb-3 rounded">
              <h2 className="accordion-header" id="branchesHeading">
                <button
                  className="accordion-button bg-success text-white fw-bold py-3"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#branchesCollapse"
                  aria-expanded="false"
                  aria-controls="branchesCollapse"
                >
                  <FaCodeBranch className="me-2" /> Branches
                </button>
              </h2>
              <div
                id="branchesCollapse"
                className="accordion-collapse collapse"
                aria-labelledby="branchesHeading"
                data-bs-parent="#academicAccordion"
              >
                <div className="accordion-body bg-white p-4">
                  <div
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      marginBottom: "1rem",
                    }}
                  >
                    <ul className="list-group list-group-flush">
                      {branches.map((b) => (
                        <li
                          key={b}
                          className="list-group-item border-0 py-2 text-dark d-flex justify-content-between align-items-center"
                        >
                          {b}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteBranch(b)}
                          >
                            <FaTrash />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <form onSubmit={handleAddBranch}>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted">
                        Add New Branch
                      </label>
                      <input
                        type="text"
                        className="form-control rounded shadow-sm"
                        placeholder="e.g., Engineering"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        style={{ transition: "all 0.3s ease" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-success w-100 text-white fw-bold"
                      style={{ transition: "all 0.3s ease" }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#218838")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#28a745")
                      }
                    >
                      Add Branch
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="accordion-item border-0 shadow-sm mb-3 rounded">
              <h2 className="accordion-header" id="subgroupsHeading">
                <button
                  className="accordion-button collapsed text-white fw-bold py-3"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#subgroupsCollapse"
                  aria-expanded="false"
                  aria-controls="subgroupsCollapse"
                  style={{ backgroundColor: "#165BAA" }}
                >
                  <FaLayerGroup className="me-2" /> Subgroups
                </button>
              </h2>
              <div
                id="subgroupsCollapse"
                className="accordion-collapse collapse"
                aria-labelledby="subgroupsHeading"
                data-bs-parent="#academicAccordion"
              >
                <div className="accordion-body bg-white p-4">
                  <div
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      marginBottom: "1rem",
                    }}
                  >
                    {Object.entries(subgroups).map(([branch, subs]) => (
                      <div key={branch} className="mb-3">
                        <h6 className="fw-bold text-muted">{branch}</h6>
                        <ul className="list-group list-group-flush">
                          {subs.map((s) => (
                            <li
                              key={`${branch}-${s}`}
                              className="list-group-item border-0 py-1 text-dark d-flex justify-content-between align-items-center"
                            >
                              {s}
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteSubgroup(branch, s)}
                              >
                                <FaTrash />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleAddSubgroup}>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted">
                        Select Branch
                      </label>
                      <select
                        className="form-select rounded shadow-sm"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        style={{ transition: "all 0.3s ease" }}
                      >
                        <option value="">Select Branch</option>
                        {branches.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted">
                        Add New Subgroup
                      </label>
                      <input
                        type="text"
                        className="form-control rounded shadow-sm"
                        placeholder="e.g., Computer Science"
                        value={subgroup}
                        onChange={(e) => setSubgroup(e.target.value)}
                        style={{ transition: "all 0.3s ease" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn w-100 text-white fw-bold"
                      style={{
                        backgroundColor: "#165BAA",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#124a8b")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#165BAA")
                      }
                    >
                      Add Subgroup
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add ToastContainer to display toast messages */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default AdminAcademicManagement;